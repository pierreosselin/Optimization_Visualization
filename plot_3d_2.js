const value = (x, y) =>
    (1 + (x + y + 1) ** 2 * (19 - 14 * x + 3 * x ** 2 - 14 * y + 6 * x * y + 3 * y ** 2))
    * (30 + (2 * x - 3 * y) ** 2 * (18 - 32 * x + 12 * x * x + 48 * y - 36 * x * y + 27 * y ** 2));
const height = 600; // pixels
const width = 600; // pixels

// scale linear takes domain (original x and y unit) and range (mapped pixel range)
const x = d3.scaleLinear([-2, 2], [0, width]);
const y = d3.scaleLinear([-2, 1], [height, 0]);

const xAxis = g => g
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisTop(x).ticks(width / height * 10))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick").filter(d => x.domain().includes(d)).remove());

const yAxis = g => g
    .attr("transform", "translate(-1,0)")
    .call(d3.axisRight(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick").filter(d => y.domain().includes(d)).remove());

const svg = d3.select('#svg1').attr("viewBox", [0, 0, width, height])
    .style("display", "block")
    .style("margin", "0 -14px")
    .style("width", "calc(100%)");


const thresholds = d3.range(1, 20).map(i => Math.pow(2, i));
const color = d3.scaleSequentialLog(d3.extent(thresholds), d3.interpolateMagma);

function _makeGrid() {
    const precision = 4; // The level of detail, e.g., sample every 4 pixels in x and y.
    const gridWidth = Math.ceil(width / precision);
    const gridHeight = Math.ceil(height / precision);
    const grid = new Array(gridWidth * gridHeight);

    for (let j = 0; j < gridHeight; ++j) {
        for (let i = 0; i < gridWidth; ++i) {
            grid[j * gridWidth + i] = value(x.invert(i * precision), y.invert(j * precision));
        }
    }
    grid.xOrigin = 0;
    grid.yOrigin = 0;
    grid.precision = precision;
    grid.width = gridWidth;
    grid.heigth = gridHeight;
    return grid;
}

const grid = _makeGrid();
const gridCoordsToPixelCoords = ({type, value, coordinates}) => {
    return {type, value, coordinates: coordinates.map(rings => {
            return rings.map(points => {
                return points.map(([x, y]) => ([
                    grid.xOrigin + grid.precision * x,
                    grid.yOrigin + grid.precision * y
                ]));
            });
        })};
};

const contours = d3.contours()
    .size([grid.width, grid.heigth])
    .thresholds(thresholds)
    (grid)
    .map(gridCoordsToPixelCoords);

svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-opacity", 0.5)
    .selectAll("path")
    .data(contours)
    .join("path")
    .attr("fill", d => color(d.value))
    .attr("d", d3.geoPath());

svg.append("g")
    .call(xAxis);

svg.append("g")
    .call(yAxis);