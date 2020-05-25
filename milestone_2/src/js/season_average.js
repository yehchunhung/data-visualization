var svg_season_avg = d3.select("#season-avg"),
  margin = { top: 50, right: 20, bottom: 30, left: 40 },
  width = +svg_season_avg.attr("width") - margin.left - margin.right,
  height = +svg_season_avg.attr("height") - margin.top - margin.bottom;

var x_season_avg = d3.scaleBand().rangeRound([0, width]).padding(0.1),
  y_season_avg = d3.scaleLinear().rangeRound([height, 0]);

var g_season_avg = svg_season_avg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tip_season_avg = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function (d) {
    return "<strong>Average:</strong> <span style='color:red'>" + (d.average * 100).toFixed(2) + "%</span>";
  });

svg_season_avg.call(tip_season_avg);

d3.csv("data/season-avg.csv")
  .then((data) => {
    return data.map((d) => {
      d.average = +d.average;
      return d;
    })
  })
  .then((data) => {
    x_season_avg.domain(data.map(function (d) { return d.season; }));
    y_season_avg.domain([0, d3.max(data, function (d) { return d.average; })]);

    g_season_avg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x_season_avg));

    g_season_avg.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y_season_avg).ticks(10, "%"))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

    g_season_avg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) { return x_season_avg(d.season); })
      .attr("y", function (d) { return y_season_avg(d.average); })
      .attr("width", x_season_avg.bandwidth())
      .attr("height", function (d) { return height - y_season_avg(d.average); })
      .on('mouseover', tip_season_avg.show)
      .on('mouseout', tip_season_avg.hide);
  }).catch((error) => {
    throw error;
  });
