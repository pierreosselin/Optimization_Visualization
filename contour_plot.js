class ContourPlot {
  /**
   * @param svg - svg object on which to draw the plot.
   * @param xDomain - 2 elements list, domain of the first variable of f for the plot.
   * @param yDomain - 2 elements list, domain of the second variable of f for the plot.
   * @param width - pixels width of the plot.
   * @param height - pixels height of the plot.
   */
  constructor(svg, xDomain, yDomain, width, height) {
    this.svg = svg;
    this.xScale = d3.scaleLinear(xDomain, [0, width]);
    this.yScale = d3.scaleLinear(yDomain, [height, 0]);
    this.width = width;
    this.height = height;
  }

  /**
   * Display a contour plot of a function over a domain.
   * @param f - 2 variables function with real values to plot.
   * @param precision - sample every <precision> pixels in xDomain and yDomain.
   * @param thresholds - list containing threshold values for the colors.
   * @param interpolation - d3 interpolation to use.
   */
  draw(f, precision, thresholds, interpolation=d3.interpolateMagma) {
    /**
     * Compute grid with values to plot.
     */
    const gridWidth = Math.ceil(this.width / precision);
    const gridHeight = Math.ceil(this.height / precision);
    const grid = new Array(gridWidth * gridHeight);
    for (let j = 0; j < gridHeight; ++j) {
      for (let i = 0; i < gridWidth; ++i) {
        grid[j * gridWidth + i] = f(this.xScale.invert(i * precision), this.yScale.invert(j * precision));
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

    const color = d3.scaleSequentialLog(d3.extent(thresholds), interpolation);
    const contours = d3.contours()
      .size([gridWidth, gridHeight])
      .thresholds(thresholds)
      (grid)
      .map(gridCoordsToPixelCoords);

    /**
     * Display plot in svg
     */
    this.svg
      .attr("viewBox", [0, 0, this.width, this.height])
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

    return this;
  }

  /**
   * Add axis on the plot based on xDomain and yDomain.
   * @returns {ContourPlot}
   */
  addAxis() {
    const xAxis = g => g
      .attr("transform", `translate(0,${this.height})`)
      .call(d3.axisTop(this.xScale).ticks(this.width / this.height * 10))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick").filter(d => this.xScale.domain().includes(d)).remove());

    const yAxis = g => g
      .attr("transform", "translate(-1,0)")
      .call(d3.axisRight(this.yScale))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick").filter(d => this.yScale.domain().includes(d)).remove());

    this.svg.append("g")
      .call(xAxis);

    this.svg.append("g")
      .call(yAxis);

    return this;
  }

  /**
   * Draw line from points coordinates.
   * @param points - list of points.
   *  Point: [x, y] where x and y are coordinates in xDomain and yDomain.
   */
  addLine(points) {
    const coords = points.map(([x, y]) => [this.xScale(x), this.yScale(y)]);

    const transitionDuration = index => Math.round(2000 / index);
    const previousTransitionsDuration = index => [...Array(index - 1).keys()]
      .reduce((acc, current) => acc + transitionDuration(current + 1), 0);

    for (let i = 1 ; i < coords.length ; i++) {
      const transition = d3.transition()
        .ease(d3.easeLinear)
        .delay(previousTransitionsDuration(i))
        .duration(transitionDuration(i));

      this.svg.append("circle")
        .attr('r', 0)
        .style("fill", "green")
        .attr("transform", `translate(${coords[i - 1][0]}, ${coords[i - 1][1]})`)
        .transition(transition)
        .attr('r', 3);

      this.svg.append("line")
        .attr("x1", coords[i - 1][0])
        .attr("y1", coords[i - 1][1])
        .attr("x2", coords[i - 1][0])
        .attr("y2", coords[i - 1][1])
        .attr("stroke", "green")
        .style("fill","none")
        .transition(transition)
        .attr("x2", coords[i][0])
        .attr("y2", coords[i][1]);
    }

    this.svg.append("circle")
      .attr('r', 0)
      .style("fill", "green")
      .attr("transform", `translate(${coords[coords.length - 1][0]}, ${coords[coords.length - 1][1]})`)
      .transition(d3.transition().delay(previousTransitionsDuration(coords.length)))
      .attr('r', 3);

    return this;
  }
}
