function test_square(h, eps, nlim) {

  //(Pre)defined functions
  const square = (x) => x ** 2;
  const pow3 = (x) => x ** 3;
  const allGroup = ["square", "pow3"]

  // Create basic constituent of the Visualization (Contour Windows and button)
  const contourPlot = new ContourPlot(
    d3.select('#svg1'),
    [-2, 2],
    600,
    600,
  );
  var dropdownButton = d3.select("#dataviz_builtWithD3")
    .append('select')

  // add the options to the button
  dropdownButton // Add a button
    .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
   	.data(allGroup)
    .enter()
  	.append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  // Definition of all the default variables
  var x_ini = [1.5]
  var alg = new GradientDescent(([x]) => square([x]), h, x_ini, 0.8);
  alg.optimize(eps, nlim);

  // Plot Initial Presentation
  contourPlot
    .draw(square, 4)
    .addAxis()
    .addLine(alg.getPath().map(index => [index[0], square(index)]));

  // When the button for selecting functions is changed, update the visualization
  function updateChart(myfunction) {
    if (myfunction == "square") {
      d3.select("#svg1").selectAll("*").remove();
      x_ini = [1.5]
      alg = new GradientDescent(([x]) => square([x]), h, x_ini, 0.8);
      alg.optimize(eps, nlim);
      contourPlot
        .draw(square, 4)
        .addAxis()
        .addLine(alg.getPath().map(index => [index[0], square(index)]));
    } else if (myfunction == "pow3") {
      d3.select("#svg1").selectAll("*").remove();
      x_ini = [1.5]
      alg = new GradientDescent(([x]) => pow3([x]), h, x_ini, 0.1);
      alg.optimize(eps, nlim);
      contourPlot
        .draw(pow3, 4)
        .addAxis()
        .addLine(alg.getPath().map(index => [index[0], pow3(index)]));
      }
    }

  dropdownButton.on("change", function(d) {
      var selectedOption = d3.select(this).property("value");
      updateChart(selectedOption);

  })
}


test_square(0.01, 0.1, 20);
// test_rosenbrock(0.01, 0.1, 100);
