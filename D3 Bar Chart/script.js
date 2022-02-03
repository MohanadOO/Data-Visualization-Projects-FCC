const req = new XMLHttpRequest();
req.open(
  "GET",
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
  true
);
req.send();
req.onload = function () {
  const json = JSON.parse(req.responseText);
  const xData = json["data"].map((x, i) => {
    return Number(x[0].split("-")[0].split(","));
  });
  const yData = json["data"].map((x, i) => {
    return x[1];
  });

  let year = [...xData];

  for (let i = 0; i < xData.length; i++) {
    if (xData[i] === xData[i + 1]) {
      let index = 0;
      let decimal = 0.2;
      for (let j = 0; j <= 3; j++) {
        xData[i + index] = xData[i + index] + decimal;
        index++;
        decimal = decimal + 0.2;
      }
    }
  }

  var dataset = [];
  xData.forEach((d, index) => {
    let subArray = [];
    subArray.push(d, yData[index]);
    dataset.push(subArray);
  });

  var margin = { top: 30, right: 50, bottom: 20, left: 50 },
    width = 950 - margin.left - margin.right,
    height = 440 - margin.top - margin.bottom;

  var svg = d3
    .select(".container")
    .select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(xData), d3.max(xData)])
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(yData)])
    .range([height, 0]);

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("width", 5)
    .attr("height", (d, i) => height - yScale(d[1]))
    .attr("x", (d, i) => xScale(d[0]))
    .attr("y", (d, i) => yScale(d[1]))
    .attr("data-date", (d, index) => year[index])
    .attr("data-gdp", (d, index) => yData[index])
    .attr("class", "tick bar");

  const xAxis = d3.axisBottom(xScale).tickFormat((d) => d);
  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("transform", `translate( 0 , ${height})`)
    .attr("id", "x-axis")
    .call(xAxis);

  svg.append("g").attr("id", "y-axis").call(yAxis);

  let tooltip = d3.select(".tooltip");
  var i = 1;
  svg
    .selectAll(".tick")
    .data(dataset)
    .on("mouseover", (event, d) => {
      tooltip
        .html(
          `${Math.floor(d[0])} Q${i <= 3 ? (i = i + 1) : (i = 1)}
        </br>
        $ ${d[1]} Billion`
        )
        .style("opacity", 1)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 25 + "px");
    });
  svg.on("mouseout", (event, d) => {
    tooltip.style("opacity", 0);
  });
};
