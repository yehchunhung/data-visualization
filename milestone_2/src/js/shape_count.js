var svg_shape_count = d3.select("#shape-count"),
  margin = { top: 50, right: 20, bottom: 30, left: 40 },
  width = +svg_shape_count.attr("width") - margin.left - margin.right,
  height = +svg_shape_count.attr("height") - margin.top - margin.bottom;

var x_shape_count = d3.scaleBand().rangeRound([0, width]).padding(0.1),
  y_shape_count = d3.scaleLinear().rangeRound([height, 0]);

var g_shape_count = svg_shape_count.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tip_shape_count = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function (d) {
    return "<strong>Count:</strong> <span style='color:red'>" + d.count + "</span>";
  });

svg_shape_count.call(tip_shape_count);

d3.csv("data/shape-count.csv")
  .then((data) => {
    return data.map((d) => {
      d.count = +d.count;
      return d;
    })
  })
  .then((data) => {
    x_shape_count.domain(data.map(function (d) { return d.shape; }));
    y_shape_count.domain([0, d3.max(data, function (d) { return d.count; })]);

    g_shape_count.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x_shape_count));

    g_shape_count.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y_shape_count))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

    g_shape_count.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) { return x_shape_count(d.shape); })
      .attr("y", function (d) { return y_shape_count(d.count); })
      .attr("width", x_shape_count.bandwidth())
      .attr("height", function (d) { return height - y_shape_count(d.count); })
      .on('mouseover', tip_shape_count.show)
      .on('mouseout', tip_shape_count.hide);
  }).catch((error) => {
    throw error;
  });
