class MapPlot {

  constructor() {
    const ufo = d3.csv("data/ufo_1940.csv");

    Promise.all([ufo]).then((results) => {
      const ufo_data = results[0];
      const year_data = new Array(74).fill(0);
      ufo_data.forEach(el => {
        year_data[parseInt(el.sight_year) - 1941] += 1;
      });

      // Define streetmap and darkmap layers
      var mapboxToken = "pk.eyJ1IjoibWNnZWVjOTEiLCJhIjoiY2pyM202cXZpMTd5MzRibzl2NzVnczM1byJ9.9zFkyrqEAZ-z-qWG2UwDjw";
      var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: mapboxToken
      });

      var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: mapboxToken
      });

      // Define a baseMaps object to hold our base layers
      var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
      };
      var ufoIcon = L.icon({ iconUrl: 'figures/ufo.png', iconRetinaUrl: 'figures/ufo.png', iconSize: [28, 14], iconAnchor: [5, 5], popupAnchor: [0, -5] });



      // Create our map, giving it the darkmap and earthquakes layers to display on load
      var myMap = L.map("map", { zoomControl: false, minZoom: 1.0 })
        .setView([35.0, -100.0], 3.5);

      // Initialize with openstreetmap
      darkmap.addTo(myMap);

      // Add baseLayers to map as control layers
      L.control.layers(null, baseMaps, { position: 'topright' }).addTo(myMap);
      L.control.zoom({
        position: 'topright'
      }).addTo(myMap);

      var southWest = L.latLng(-89.98155760646617, -280),
        northEast = L.latLng(89.99346179538875, 80);
      var bounds = L.latLngBounds(southWest, northEast);

      myMap.setMaxBounds(bounds);
      myMap.on('drag', function () {
        myMap.panInsideBounds(bounds, { animate: false });
      });

      // X and Y scale for the bottom bar chart
      const x_scale = d3.scaleBand()
        .domain(d3.range(year_data.length))
        .range([0, 400]);
      const y_scale = d3.scaleLinear()
        .domain(d3.extent(year_data))
        .range([60, 0]);


      var info = L.control({ position: 'topleft' });
      info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
      };
      // method that we will use to update the control based on feature properties passed
      info.update = function (sy, ey, ct) {
        this._div.innerHTML = "<b>Year range:</b>" + "<br>" + sy + " - " + ey + "<br>" + "<b>Num sightings:</b>" + "<br>" + ct;
      };
      info.addTo(myMap);

      const brush = d3.brushX().extent([[0, 0], [400, 60]]);
      brush.on('end', () => {
        // Get selected time range
        const selected_range = d3.event.selection;
        const start_year = Math.round(selected_range[0] / x_scale.step()) + 1940;
        const end_year = Math.round(selected_range[1] / x_scale.step()) + 1940;

        // New sightings data
        const sightings = ufo_data.filter(d => d.sight_year >= start_year && d.sight_year <= end_year);
        var n = 0;
        myMap.eachLayer(function (layer) {
          // do something with the layer
          n += 1;
          if (n > 2) {
            myMap.removeLayer(layer);
          }
        });
        info.update(start_year, end_year, sightings.length);
        //Custom radius and icon create function
        var markers = L.markerClusterGroup({
          maxClusterRadius: 120,
          iconCreateFunction: function (cluster) {
            var markers = cluster.getAllChildMarkers();
            var n = markers.length;
            let size = 'LargeXL';
            let radius = 60;

            if (n < 100) {
              size = 'Small';
              radius = 20;
            }
            else if (n >= 100 && n < 1000) {
              size = 'Medium';
              radius = 30;
            }
            else if (n >= 1000 && n < 10000) {
              size = 'Large';
              radius = 40;
            }
            const options = {
              cluster: `markerCluster${size}`,
            };
            return L.divIcon({ html: n, className: `${options.cluster}`, iconSize: L.point(radius, radius) });
          },
          //Disable all of the defaults:
          // spiderfyOnMaxZoom: False, showCoverageOnHover: false, zoomToBoundsOnClick: false
        });

        // var new_markers = L.markerClusterGroup();
        for (let i = 0; i < sightings.length; i++) {
          var d = sightings[i];
          var marker = L.marker([parseFloat(d.latitude), parseFloat(d.longitude)], { icon: ufoIcon });
          var datetime = d.datetime;
          var state = d.state;
          var city = d.city;
          var shape = d.shape;
          var duration = d.duration;
          var comments = d.comments;
          var wiki = d.wiki;
          var fp = d.false_positive;
          var message = "<b>DateTime:</b>" + "&nbsp;" + datetime + "<br />"
            + "<b>State:</b>" + "&nbsp;" + state.toUpperCase() + "<br />"
            + "<b>City:</b>" + "&nbsp;" + city.charAt(0).toUpperCase() + city.slice(1) + "<br />"
            + "<b>Shape:</b>" + "&nbsp;" + shape.charAt(0).toUpperCase() + shape.slice(1) + "<br />"
            + "<b>Duration:</b>" + "&nbsp;" + duration + "<br />"
            + "<b>Comments:</b>" + "&nbsp;" + comments + "..." + "<br />"
          if (wiki !== 'NA') {
            + "<b>Source: </b>" + "&nbsp;" + wiki + "<br />"
          }
          if (fp == 1) {
            + "<b>Note:</b> It was turned out not to be an UFO by later survey."
          }
          ;
          var customOptions =
          {
            'className': 'message'
          }
          marker.bindPopup(message, customOptions);
          markers.addLayer(marker);
        }
        myMap.addLayer(markers);

        const t = d3.transition().duration(750);
      });


      // // Add a svg layer to the map
      var layer = L.svg();
      layer.addTo(myMap)


      // // Select the svg area and add barchart:
      var svg = d3.select('#map')
        .select("svg")
        .append('g');

      svg.append("rect")
        .attr("width", 420)
        .attr("height", 120)
        .style("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill-opacity", .6);

      svg.append("text")
        .text("Yearly UFO Sighting Counts in US (1940 - 2014)")
        .attr("font-size", "16px")
        .attr("font-family", "VT323")
        .attr("fill", "white")
        .attr("fill-opacity", .6)
        .attr("transform", "translate(5, 15)");

      var rects = svg.selectAll('.bar')
        .data(year_data)
        .enter()
        .append('rect')
        .attr('x', (_, i) => x_scale(i))
        .attr('y', d => y_scale(d))
        .attr('height', d => y_scale(0) - y_scale(d))
        .attr('width', x_scale.bandwidth())
        .style("fill", "red")
        .attr("stroke", "red")
        .attr("stroke-width", 1)
        .attr("fill-opacity", .8)
        .attr("transform", "translate(10, 40)");

      var brushes = svg.append('g')
        .attr('class', 'brush')
        .attr("transform", "translate(10, 40)")
        .call(brush)
        .call(brush.move, [350, 400]);

      // If the user change the map (zoom or drag), I update circle position:
      myMap.on("move", update_position);
      // myMap.on("zoom", update_position);

      // Function that update circle position if something change
      var init_ll = myMap.getCenter();
      var init_lp = myMap.latLngToLayerPoint(init_ll);
      // console.log(position);
      function update_position() {
        var ll = myMap.getCenter();
        var lp = myMap.latLngToLayerPoint(ll);
        svg.attr("transform", "translate(" + -(init_lp.x + 205 - lp.x) + "," + -(init_lp.y - 105 - lp.y) + ")");
      }
      svg.on('mouseover', function () {
        myMap.dragging.disable();
      });
      // Re-enable dragging when user's cursor leaves the element
      svg.on('mouseout', function () {
        myMap.dragging.enable();
      });
      L.easyButton('<span class="target">&target;</span>', function () {
        myMap.setView([35.0, -100.0], 3.5);
      }, { position: 'topright' }).addTo(myMap);
      var lat = 35.0 + (Math.random() - 0.5) * 2 * 1.0;
      var lng = -100.0 + (Math.random() - 0.5) * 2 * 1.0;
      var ufoMarker = L.marker([lat, lng], { icon: ufoIcon }).on('click', onClick);;
      var t;
      function onClick(e) {
        alert('The invasion was repelled. Well done!! (Score: ' + t + ' sec.)');
        ufoMarker.remove();
      }

      var alert_message = 'Alert!!: Aliens suddenly appears to invade our globe. Please save us by capturing it with a mouse click';
      L.easyButton('<span>&quest;</span>', function (btn, map) {
        // add a marker in the given location
        alert(alert_message);
        ufoMarker.addTo(myMap);
        t = 0;
        setInterval(function () {
          lat = lat + (Math.random() - 0.5) * 10.0;
          lng = lng + (Math.random() - 0.5) * 30.0;
          ufoMarker.setLatLng([lat, lng]).update();
        }, 100);
        setInterval(function () {
          t = t + 1;
          console.log(t);
        }, 1000);

      }, { position: 'topright' }).addTo(myMap);
    });
  }
}

function whenDocumentLoaded(action) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", action);
  } else {
    // `DOMContentLoaded` already fired
    action();
  }
}

whenDocumentLoaded(() => {
  plot_object = new MapPlot();
});
