
const objective2 = x => x**2;
const nPoints = 100;
const intervalB = -1;
const intervalU = 1;
// create data
//const data = [{x: 0, y: 20}, {x: 150, y: 150}, {x: 300, y: 100}, {x: 450, y: 20}, {x: 600, y: 130}]

const data = [...Array(nPoints).keys()].map(index => ({x: (index/(nPoints-1))*(intervalU - intervalB) + intervalB, y: objective2((index/(nPoints-1))*(intervalU - intervalB) + intervalB)}));

// Perform Optimization
const alg = new GradientDescent(objective, 0.01, [1], 0.9)
const result = alg.optimize(eps, nlim)
const dataOpti = result.map(index => ({x: index[0], y: objective(index)}));
console.log(result);
console.log(dataOpti);


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

var lineFunc = d3.line()
  .x(({ x }) => xScale(x))
  .y(({ y }) => yScale(y));

// Add the path using this helper function
svg.append('path')
  .attr('d', curveFunc(data))
  .attr('stroke', 'black')
  .attr('fill', 'none');

var path = svg.append('path')
  .attr('d', lineFunc(dataOpti))
  .attr('stroke', 'red')
  .attr('fill', 'none');

  // Variable to Hold Total Length
var totalLength = path.node().getTotalLength();

// Set Properties of Dash Array and Dash Offset and initiate Transition
path
	.attr("stroke-dasharray", totalLength + " " + totalLength)
	.attr("stroke-dashoffset", totalLength)
  .transition() // Call Transition Method
	.duration(4000) // Set Duration timing (ms)
	.ease(d3.easeLinear) // Set Easing option
	.attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition

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
