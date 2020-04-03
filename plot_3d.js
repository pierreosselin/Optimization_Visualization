const value = (x, y) =>
  (1 + (x + y + 1) ** 2 * (19 - 14 * x + 3 * x ** 2 - 14 * y + 6 * x * y + 3 * y ** 2))
  * (30 + (2 * x - 3 * y) ** 2 * (18 - 32 * x + 12 * x * x + 48 * y - 36 * x * y + 27 * y ** 2));
const height = 600; // pixels
const width = 600; // pixels

const thresholds = d3.range(1, 20).map(i => Math.pow(2, i));

const square = (x, y) => x ** 2 + y ** 2;
const inverse = (x, y) => (1 / x ** 2) + (1 / y ** 2);

/**
 * Display a contour plot of a function over a domain.
 * @param svg - d3 svg object where to insert the plot.
 * @param f - 2 variables function with real values to plot.
 * @param xDomain - 2 elements list, domain of the first variable of f for the plot.
 * @param yDomain - 2 elements list, domain of the second variable of f for the plot.
 * @param width - pixels width of the plot.
 * @param height - pixels height of the plot.
 * @param precision - sample every <precision> pixels in xDomain and yDomain.
 * @param thresholds - list containing threshold values for the colors.
 */
function contourPlot(svg, f, xDomain, yDomain, width, height, precision, thresholds) {
  /**
   * Compute grid with values to plot.
   */
  const x = d3.scaleLinear(xDomain, [0, width]);
  const y = d3.scaleLinear(yDomain, [height, 0]);

  const gridWidth = Math.ceil(width / precision);
  const gridHeight = Math.ceil(height / precision);
  const grid = new Array(gridWidth * gridHeight);
  for (let j = 0; j < gridHeight; ++j) {
    for (let i = 0; i < gridWidth; ++i) {
      grid[j * gridWidth + i] = f(x.invert(i * precision), y.invert(j * precision));
    }
  }


  /**
   * Map grid values to pixel coordinates and define color map.
   */
  const gridCoordsToPixelCoords = ({type, value, coordinates}) => {
    return {
      type,
      value,
      coordinates: coordinates.map(rings => {
        return rings.map(points => {
          return points.map(([x, y]) => ([
            precision * x,
            precision * y
          ]));
        });
      })
    };
  };

  const color = d3.scaleSequentialLog(d3.extent(thresholds), d3.interpolateMagma);
  const contours = d3.contours()
    .size([gridWidth, gridHeight])
    .thresholds(thresholds)
    (grid)
    .map(gridCoordsToPixelCoords);

  /**
   * Display plot in svg
   */
  svg
    .attr("viewBox", [0, 0, width, height])
    .style("display", "block")
    .style("margin", "0 -14px")
    .style("width", "calc(100%)")
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-opacity", 0.5)
    .selectAll("path")
    .data(contours)
    .join("path")
    .attr("fill", d => color(d.value))
    .attr("d", d3.geoPath());

  /**
   * Add axis.
   */
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

  svg.append("g")
    .call(xAxis);

  svg.append("g")
    .call(yAxis);

}

contourPlot(d3.select('#svg1'), inverse, [-2, 2], [-2, 2], width, height, 4, thresholds);
