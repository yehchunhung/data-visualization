var svg_state_count = d3.select("#state-count"),
  margin = { top: 50, right: 20, bottom: 30, left: 40 },
  width = +svg_state_count.attr("width") - margin.left - margin.right,
  height = +svg_state_count.attr("height") - margin.top - margin.bottom;

var x_state_count = d3.scaleBand().rangeRound([0, width]).padding(0.1),
  y_state_count = d3.scaleLinear().rangeRound([height, 0]);

var g_state_count = svg_state_count.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tip_state_count = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function (d) {
    return "<strong>Count:</strong> <span style='color:red'>" + d.count + "</span>";
  });

svg_state_count.call(tip_state_count);

d3.csv("data/state-count.csv")
  .then((data) => {
    return data.map((d) => {
      d.count = +d.count;
      return d;
    })
  })
  .then((data) => {
    x_state_count.domain(data.map(function (d) { return d.state; }));
    y_state_count.domain([0, d3.max(data, function (d) { return d.count; })]);

    g_state_count.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x_state_count));

    g_state_count.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y_state_count))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

    g_state_count.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) { return x_state_count(d.state); })
      .attr("y", function (d) { return y_state_count(d.count); })
      .attr("width", x_state_count.bandwidth())
      .attr("height", function (d) { return height - y_state_count(d.count); })
      .on('mouseover', tip_state_count.show)
      .on('mouseout', tip_state_count.hide);
  }).catch((error) => {
    throw error;
  });
