class MapPlot {

	constructor(svg_element_id) {
		this.svg = d3.select('#' + svg_element_id);

		const map_promise = d3.json("data/states-10m.json").then((data) => {
			return data;
		});

		const ufo_promise = d3.csv("data/ufo.csv").then((data) => {
			// keep every 10th element
			data = data.filter((_, i) => i % 10 == 0);
			// Remove sightings from puerto rico
			data = data.filter(el => el.state != 'pr');
			return data;
		});

		Promise.all([map_promise, ufo_promise]).then((results) => {
			const map_data = results[0];
			const ufo_data = results[1];
			const year_data = new Array(105).fill(0);
			ufo_data.forEach(el => {
				year_data[parseInt(el.sight_year) - 1910] += 1;
			});

			// console.log('Data loaded');
			// console.log(topojson.feature(map_data, map_data.objects.states).features);
			// console.log(ufo_data);
			// console.log(year_data);

			// Draw the states
			const projection = d3.geoAlbersUsa()
				.scale(750)
				.translate([450, 300]);

			const path = d3.geoPath().projection(projection);

			const map = this.svg.append('g')
				.attr('class', 'map')
				.attr('x', 0)
				.attr('y', 0);

			map.append('path')
				.datum(topojson.mesh(map_data, map_data.objects.states, (a, b) => a !== b))
				.attr('stroke-width', 0.5)
				.attr('d', path);

			map.append('path')
				.datum(topojson.feature(map_data, map_data.objects.nation))
				.attr('d', path);

			// Handle zooming
			// todo: add constraint
			const zoom = d3.zoom()
				.scaleExtent([1, 6])
				.on('zoom', () => {
					map.attr('transform', d3.event.transform);
				});

			this.svg.call(zoom);

			// X and Y scale for the bottom bar chart
			const x_scale = d3.scaleBand()
				.domain(d3.range(year_data.length))
				.range([0, 600]);
			const y_scale = d3.scaleLinear()
				.domain(d3.extent(year_data))
				.range([40, 0]);

			const brush = d3.brushX().extent([[0, 0], [600, 40]]);
			brush.on('end', () => {
				// Get selected time range
				const selected_range = d3.event.selection;
				const start_year = Math.round(selected_range[0] / x_scale.step()) + 1909;
				const end_year = Math.round(selected_range[1] / x_scale.step()) + 1909;

				// New sightings data
				const sightings = ufo_data.filter(d => d.sight_year >= start_year && d.sight_year <= end_year);
				// console.log(sightings);

				const t = d3.transition().duration(750);

				// Remove points
				map.selectAll('circle')
					.data(sightings)
					.exit()
					.transition(t)
					.style('opacity', 0)
					.remove();

				// Draw points
				map.selectAll('circle')
					.data(sightings)
					.enter().append('circle')
					.attr('class', 'point')
					.attr('cx', d => projection([parseFloat(d['longitude ']), parseFloat(d.latitude)])[0])
					.attr('cy', d => projection([parseFloat(d['longitude ']), parseFloat(d.latitude)])[1])
					.attr('r', 1.5)
					.style('opacity', 0)
					.transition(t)
					.style('opacity', 0.25);
			});

			// Draw the bottom bar chart
			const time_range = this.svg.append('g')
				.attr("transform", `translate(125, 500)`);

			time_range.selectAll('rect')
				.data(year_data)
				.enter().append('rect')
				.attr('x', (_, i) => x_scale(i))
				.attr('y', d => y_scale(d))
				.attr('height', d => y_scale(0) - y_scale(d))
				.attr('width', x_scale.bandwidth());

			time_range.append('g')
				.attr('class', 'brush')
				.call(brush)
				.call(brush.move, [500, 600]);
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
	plot_object = new MapPlot('map-plot');
	// plot object is global, you can inspect it in the dev-console
});
