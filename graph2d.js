
const objective = x => x**2;
const nPoints = 100;
const intervalB = -1;
const intervalU = 1;
// create data
//const data = [{x: 0, y: 20}, {x: 150, y: 150}, {x: 300, y: 100}, {x: 450, y: 20}, {x: 600, y: 130}]
const data = [...Array(nPoints).keys()].map(index => ({x: (index/(nPoints-1))*(intervalU - intervalB) + intervalB, y: objective((index/(nPoints-1))*(intervalU - intervalB) + intervalB)}));
const width = 700;
const height = 500;
const margin = {top: 10, right: 10, bottom: 30, left: 10};

const xScale = d3.scaleLinear()
    .domain([Math.min(...data.map(({x}) => x)), Math.max(...data.map(({x}) => x))]).nice()
    .range([margin.left, width - margin.right]);

const yScale = d3.scaleLinear()
    .domain([Math.min(...data.map(({y}) => y)), Math.max(...data.map(({y}) => y))]).nice()
    .range([height - margin.bottom, margin.top]);


// create svg element:
var svg = d3.select("#svg1").append("svg")
  .attr("viewBox", [0, 0, width, height]);

// prepare a helper function
var curveFunc = d3.line()
  .curve(d3.curveBasis)              // This is where you define the type of curve. Try curveStep for instance.
  .x(({ x }) => xScale(x))
  .y(({ y }) => yScale(y));



// Add the path using this helper function
svg.append('path')
  .attr('d', curveFunc(data))
  .attr('stroke', 'black')
  .attr('fill', 'none');


const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale));

const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale));

svg.append("g")
    .call(xAxis);

svg.append("g")
    .call(yAxis);
