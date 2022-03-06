const req = new XMLHttpRequest()
req.open(
  'GET',
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json',
  true
)
req.send()
req.onload = () => {
  const json = JSON.parse(req.responseText)

  const baseTemp = json['baseTemperature']
  const dataset = json['monthlyVariance'].map((x) => {
    return x
  })

  const year = dataset.map((x) => x['year'])
  const month = dataset.map((x) => x['month'])
  const temp = dataset.map((x) => x['variance'])

  let total = temp.map((x) => x + baseTemp)

  var months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  function monthString(monthNum) {
    return months[monthNum - 1]
  }

  var margin = { top: 30, right: 30, bottom: 30, left: 70 },
    width = 1160 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom

  const xScale = d3.scaleLinear().domain([d3.min(year), d3.max(year)])
  const yScale = d3.scaleLinear().domain([d3.min(month) - 1, d3.max(month) + 1])

  xScale.range([0, width])
  yScale.range([0, height])

  var svg = d3
    .select('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  svg
    .selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('width', 5)
    .attr('height', 30)
    .attr('x', (d) => xScale(d['year']))
    .attr('y', (d) => yScale(d['month']))
    .attr('transform', 'translate(' + 0 + ',' + -15 + ')')
    .attr('class', 'cell')
    .attr('data-month', (d) => d['month'] - 1)
    .attr('data-year', (d) => d['year'])
    .attr('data-temp', (d, index) => total[index])
    .attr('fill', (d, index) =>
      total[index] < 3.9
        ? '#4575B4'
        : total[index] < 5
        ? '#74ADD1'
        : total[index] < 6.1
        ? '#ABD9E9'
        : total[index] < 7.2
        ? '#E0F3F8'
        : total[index] < 8.3
        ? '#FFFFBF'
        : total[index] < 9.5
        ? '#FEE090'
        : total[index] < 10.6
        ? '#FDAE61'
        : total[index] < 11.7
        ? '#F46D43'
        : '#D73027'
    )

  const xAxis = d3
    .axisBottom(xScale)
    .ticks(20)
    .tickFormat((d) => d)
  const yAxis = d3.axisLeft(yScale).tickFormat((d) => monthString(d))

  svg
    .append('g')
    .attr('transform', `translate(0 , ${height - 15})`)
    .attr('id', 'x-axis')
    .call(xAxis)

  svg.append('g').attr('id', 'y-axis').call(yAxis)

  let tooltip = d3.select('.tooltip')

  svg
    .selectAll('.cell')
    .data(dataset)
    .on('mouseover', (event, d) => {
      tooltip
        .html(
          `${d['year']} - ${monthString(d['month'])}
      <br>
      ${Math.round((baseTemp + d['variance'] + Number.EPSILON) * 10) / 10}°C
      <br>
      ${Math.round((d['variance'] + Number.EPSILON) * 10) / 10}°C`
        )
        .style('opacity', '1')
        .style('left', event.pageX + -40 + 'px')
        .style('top', event.pageY - 100 + 'px')
    })
    .on('mouseout', (event, d) => {
      tooltip.style('opacity', '0')
    })

  var margin1 = { top: 10, right: 30, bottom: 30, left: 30 },
    legendWidth = 460 - margin1.left - margin1.right,
    legendHeight = 100 - margin1.top - margin1.bottom

  let legendArr = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8]

  let legendX = d3
    .scaleLinear()
    .domain([d3.min(legendArr), d3.max(legendArr)])
    .range([0, legendWidth])

  let legend = d3
    .select('#legend')
    .append('svg')
    .attr('width', legendWidth + margin1.left + margin1.right)
    .attr('height', legendHeight + margin1.top + margin1.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin1.left + ',' + margin1.top + ')')

  legend
    .selectAll('rect')
    .data(legendArr.filter((d) => d < 12.8))
    .enter()
    .append('rect')
    .attr('width', 40)
    .attr('height', 30)
    .attr('x', (d) => legendX(d <= 3.9 ? Math.round(d) : Math.floor(d)))
    .attr('y', legendHeight - 15)
    .attr('transform', 'translate(' + 0 + ',' + -15 + ')')
    .attr('class', 'cell')
    .attr('stroke', 'black')
    .attr('fill', (d) =>
      d < 3.9
        ? '#4575B4'
        : d < 5
        ? '#74ADD1'
        : d < 6.1
        ? '#ABD9E9'
        : d < 7.2
        ? '#E0F3F8'
        : d < 8.3
        ? '#FFFFBF'
        : d < 9.5
        ? '#FEE090'
        : d < 10.6
        ? '#FDAE61'
        : d < 11.7
        ? '#F46D43'
        : '#D73027'
    )

  const legend_xAxis = d3
    .axisBottom(legendX)
    .tickFormat((d, index) => legendArr[index])

  legend
    .append('g')
    .attr('transform', `translate(0 , ${legendHeight})`)
    .attr('id', 'x-axis')
    .call(legend_xAxis)
}
