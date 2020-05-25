var svg_found_duration = d3.select("#found-duration"),
  margin = { top: 50, right: 20, bottom: 30, left: 40 },
  width = +svg_found_duration.attr("width") - margin.left - margin.right,
  height = +svg_found_duration.attr("height") - margin.top - margin.bottom;

var x_found_duration = d3.scaleBand().rangeRound([0, width]).padding(0.1),
  y_found_duration = d3.scaleLinear().rangeRound([height, 0]);

var g_found_duration = svg_found_duration.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tip_found_duration = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function (d) {
    return "<strong>Count:</strong> <span style='color:red'>" + d.count + "</span>";
  });

svg_found_duration.call(tip_found_duration);

d3.csv("data/found-duration.csv")
  .then((data) => {
    return data.map((d) => {
      d.count = +d.count;
      return d;
    })
  })
  .then((data) => {
    x_found_duration.domain(data.map(function (d) { return d.time; }));
    y_found_duration.domain([0, d3.max(data, function (d) { return d.count; })]);

    g_found_duration.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x_found_duration));

    g_found_duration.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y_found_duration))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

    g_found_duration.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) { return x_found_duration(d.time); })
      .attr("y", function (d) { return y_found_duration(d.count); })
      .attr("width", x_found_duration.bandwidth())
      .attr("height", function (d) { return height - y_found_duration(d.count); })
      .on('mouseover', tip_found_duration.show)
      .on('mouseout', tip_found_duration.hide);
  }).catch((error) => {
    throw error;
  });
