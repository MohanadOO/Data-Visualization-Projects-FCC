const mapData =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

const data =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

const reqMapData = new XMLHttpRequest()
reqMapData.open('GET', mapData, true)
reqMapData.send()
reqMapData.onload = () => {
  const json = JSON.parse(reqMapData.responseText)

  const counties = json['objects']['counties']['geometries']
  const nation = json['objects']['nation']['geometries']
  const states = json['objects']['states']['geometries']

  console.log(counties)
  console.log(nation)
  console.log(states)

  let id = counties.map((element) => {
    return element['id']
  })

  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 960 - margin.left - margin.right,
    height = 640 - margin.top - margin.bottom

  var svg = d3
    .select('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  const x = d3
    .scaleLinear()
    .domain([d3.min(id), d3.max(id)])
    .range([0, width])

  const y = d3.scaleLinear().domain([d3.min(), d3.max()]).range([0, height])

  svg
    .selectAll('path')
    .data(nation)
    .append('path')
    .attr('width', (d) => d[0][0])
    .attr('height', 5)
    .attr('x', x(d))
    .attr('y', y(d))
    .attr('fill', 'blue')

  svg
    .append(g)
    .attr('class', 'counties')
    .selectAll('path')
    .data(counties)
    .append('path')
    .attr('d')

  const reqData = new XMLHttpRequest()
  reqData.open('GET', data, true)
  reqData.send()
  reqData.onload = () => {
    const json = JSON.parse(reqData.responseText)
    const state = json.map((i) => i['state'])
    const county = json.map((i) => i['area_name'])
    const bachelor = json.map((i) => i['bachelorsOrHigher'])

    console.log(state)
  }
}
