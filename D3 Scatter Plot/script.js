const req = new XMLHttpRequest();
req.open(
  "GET",
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
  true
);
req.send();
req.onload = function () {
  const json = JSON.parse(req.responseText);
  const allData = json.map((i, index) => {
    return i;
  });

  const time = json.map((i, index) => {
    let parsedTime = i["Time"].split(":");
    return new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
  });

  const year = json.map((i, index) => {
    return Number(i["Year"]);
  });

  const doping = json.map((i) => {
    if (i["Doping"] !== "") return true;
    else return false;
  });

  const url = json.map((i) => {
    return i["URL"];
  });

  const name = json.map((i) => {
    return i["Name"];
  });

  const nationality = json.map((i) => {
    return i["Nationality"];
  });

  var dataset = [];
  time.forEach((i, index) => {
    let subArr = [];
    subArr.push(time[index], year[index]);
    dataset.push(subArr);
  });

  var margin = {
    top: 100,
    right: 60,
    bottom: 30,
    left: 80,
  };

  let width = 880 - margin.left - margin.right;
  let height = 600 - margin.top - margin.bottom;
  let padding = 40;

  const svg = d3
    .select(".continer")
    .select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.top} , ${margin.left})`);

  let x = d3.scaleLinear().range([0, width]);
  let y = d3.scaleTime().range([0, height]);

  x.domain([d3.min(year) - 1, d3.max(year) + 1]);
  y.domain(
    d3.extent(dataset, function (d) {
      return d[0];
    })
  );

  let tooltip = d3.select("#tooltip");

  svg
    .selectAll(".dot")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d[1]))
    .attr("cy", (d) => y(d[0]))
    .attr("data-xvalue", (d) => d[1])
    .attr("data-yvalue", (d) => d[0].toISOString())
    .attr("r", 7)
    .attr("class", "dot")
    .style("fill", (d, i) => {
      if (doping[i] === false) return "#161b33";
    })
    .style("stroke", (d, i) => {
      if (doping[i] === false) return "#f1dac4";
    });

  svg
    .selectAll(".dot")
    .data(allData)
    .on("mouseover", (event, d) => {
      console.log(d["Year"]);
      tooltip.style("opacity", 1);
      tooltip.attr("data-year", d["Year"]);
      tooltip
        .html(
          `${d["Name"]}: ${d["Nationality"]}
    <br/> Year:${d["Year"]}, Time: ${d["Time"]}
    ${d["Doping"] ? "</br></br>" : ""}
    ${d["Doping"]}`
        )
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", (d) => {
      tooltip.style("opacity", 0);
    });

  const xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .attr("transform", `translate( 0 , ${height})`)
    .attr("id", "x-axis")
    .call(xAxis);

  svg.append("g").attr("id", "y-axis").call(yAxis);

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -padding)
    .attr("id", "title")
    .text("Doping in Professional Bicycle Racing");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -padding + 30)
    .attr("id", "subtitle")
    .text("35 Fastest times up Alpe d'Huez");

  svg
    .append("text")
    .attr("x", -150)
    .attr("y", -50)
    .attr("class", "y-label")
    .text("Times in Minutes");

  svg
    .append("text")
    .attr("x", width - 20 - 50)
    .attr("y", height / 2 + padding)
    .attr("id", "legend")
    .style("text-anchor", "end")
    .text("No doping allegations");

  svg
    .append("text")
    .attr("x", width - 20 - 50)
    .attr("y", height / 2 + padding * 2)
    .attr("id", "legend")
    .style("text-anchor", "end")
    .text("Riders with doping allegations");

  svg
    .append("rect")
    .attr("x", width - 20 - 40)
    .attr("y", height / 2 + padding - 10)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "#161b33");
  svg
    .append("rect")
    .attr("x", width - 20 - 40)
    .attr("y", height / 2 + padding + 25)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "#f1dac4");
};
