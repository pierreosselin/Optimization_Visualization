const data = [...Array(100).keys()].map(index => ({ abs: index, ord: index }));
const width = 500;
const height = 500;
const margin = {top: 20, right: 30, bottom: 30, left: 40};

const x = d3.scaleLinear()
    .domain([0, Math.max(...data.map(({abs}) => abs))]).nice()
    .range([margin.left, width - margin.right]);

const y = d3.scaleLinear()
    .domain([0, Math.max(...data.map(({ord}) => ord))]).nice()
    .range([height - margin.bottom, margin.top]);

const line = d3.line()
    .defined(_ => true)
    .x(({ abs }) => x(abs))
    .y(({ ord }) => y(ord));

const svg = d3.select('#svg1')
    .attr("viewBox", [0, 0, width, height]);

svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);

const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data.y));

svg.append("g")
    .call(xAxis);

svg.append("g")
    .call(yAxis);
