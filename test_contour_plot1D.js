function test_square(h, eps, nlim) {

  //(Pre)defined functions
  const square = (x) => x ** 2;
  const pow3 = (x) => x ** 3;
  const allGroup = ["square", "pow3"];
  const objectives = {"square": {obj: square, x_ini: 1.5, delta: 0.8}, "pow3": {obj: pow3, x_ini: 1.5, delta: 0.1}};

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
  var x_ini = [1.5];
  var objective = square;
  var alg = new GradientDescent(([x]) => objective([x]), h, x_ini, 0.8);
  alg.optimize(eps, nlim);

  // Plot Initial Presentation
  contourPlot
    .draw(objective, 4)
    .addAxis()
    .addLine(alg.getPath().map(index => [index[0], objective(index)]));

  // When a button is changed, update the visualization
  function updateFunction(myfunction) {
    objective = objectives[myfunction].obj;
    d3.select("#svg1").selectAll("*").remove();
    x_ini = [objectives[myfunction].x_ini]
    alg = new GradientDescent(objective, h, x_ini, objectives[myfunction].delta);
    alg.optimize(eps, nlim);
    contourPlot
      .draw(objective, 4)
      .addAxis()
      .addLine(alg.getPath().map(index => [index[0], objective(index)]));
  }

  function changeXini() {
    x_ini = [this.value];
    d3.select("#path").remove();
    d3.select("#dot").remove();
    alg.setXini(x_ini);
    alg.optimize(eps, nlim);
    contourPlot
      .addLine(alg.getPath().map(index => [index[0], objective(index)]));
  }


  // Activation of the buttons
  dropdownButton.on("change", function(d) {
      var selectedOption = d3.select(this).property("value");
      updateFunction(selectedOption);
  })
  d3.select("#xini").on("input", changeXini)

}


test_square(0.01, 0.1, 20);
// test_rosenbrock(0.01, 0.1, 100);
