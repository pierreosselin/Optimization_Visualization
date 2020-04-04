class GraphPlot {
  /**
   * @param svg - svg object on which to draw the plot.
   * @param xDomain - 2 elements list, domain of the variable of f for the plot.
   * @param width - pixels width of the plot.
   * @param height - pixels height of the plot.
   */
  constructor(svg, xDomain, width, height) {
    this.svg = svg;
    this.xScale = d3.scaleLinear(xDomain, [0, width]);
    this.width = width;
    this.height = height;
  }

  /**
   * Display a plot of a function over a domain.
   * @param f - 2 variables function with real values to plot.
   * @param precision - sample every <precision> pixels in xDomain.
   * @param interpolation - d3 interpolation to use.
   */
  draw(f, precision) {
    /**
     * Compute graph of the function on the number of points defined by precision
     * Data contains the value of f at relevant points
     */

    const gridWidth = Math.ceil(this.width / precision);
    const data = [...Array(gridWidth).keys()].map(index => ({x: this.xScale.invert(index * precision), y: f([this.xScale.invert(index * precision)])}));


    // Define the y domain
    this.yScale = d3.scaleLinear()
        .domain([Math.min(...data.map(({y}) => y)), Math.max(...data.map(({y}) => y))]).nice()
        .range([this.height, 0]);


    // prepare a helper function
    var curveFunc = d3.line()
      .curve(d3.curveBasis)              // This is where you define the type of curve. Try curveStep for instance.
      .x(({ x }) => this.xScale(x))
      .y(({ y }) => this.yScale(y));

    /**
     * Display plot in svg
     */
     this.svg
       .attr("viewBox", [0, 0, this.width, this.height])
       .style("display", "block")
       .style("margin", "0 -14px")
       .style("width", "calc(100%)")
       .append('path')
       .attr('d', curveFunc(data))
       .attr('stroke', 'black')
       .attr('fill', 'none');

    return this;
  }

  /**
   * Add axis on the plot based on xDomain and yDomain.
   * @returns {GraphPlot}
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
    const line = d3.line()(points.map(([x, y]) => [this.xScale(x), this.yScale(y)]));
    this.svg
      .append('defs')
      .append('marker')
      .attr('id', 'dot')
      .attr('viewBox', [0, 0, 20, 20])
      .attr('refX', 10)
      .attr('refY', 10)
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .append('circle')
      .attr('cx', 10)
      .attr('cy', 10)
      .attr('r', 5)
      .style('fill', 'green');

    this.svg.append("path")
      .attr("stroke", "green")
      .attr('id', 'path')
      .attr("d", line)
      .style("fill","none")
      .attr('marker-start', 'url(#dot)')
      .attr('marker-mid', 'url(#dot)')
      .attr('marker-end', 'url(#dot)');

    return this;
  }
}
