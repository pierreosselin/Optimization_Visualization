function test_square(h, eps, nlim) {

  //(Pre)defined functions
  const square = ([x, y]) => x ** 2 + y ** 2 + (x + y) ** 2;
  const rosenbrock = ([x,y]) => (1-x)**2  + 100*(y - x**2)**2 + 1;
  const allGroup = ["square", "rosenbrock"];
  const objectives = {"square": {obj: square, x_ini: [-30, 175], delta: {value: 0.1, step : 0.01}, xDomain : [-200,200], yDomain : [-200,200], interpolation :d3.interpolateMagma}, "rosenbrock": {obj: rosenbrock, x_ini: [2.5, -1.5], delta:  {value: 0.0001, step : 0.0001}, xDomain : [-2,3], yDomain : [-2,3], interpolation: d3.interpolateYlGnBu}};

  // Create basic constituent of the Visualization (Contour Windows and button)
  // Window for contour
  var contourPlot = new ContourPlot(
    d3.select('#svg1'),
    objectives["square"].xDomain,
    objectives["square"].yDomain,
    600,
    600,
  );
  const thresholds = d3.range(1, 20).map(i => Math.pow(2, i));
  // Button for function selection
  var selectFunctionDropdownButton  = d3.select("#buttonSpace")
    .append('select')
  // add the options to the button
  selectFunctionDropdownButton  // Add a button
    .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
   	.data(allGroup)
    .enter()
  	.append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  // Definition of all the default variables
  var x_ini = [-30, 175];
  var objective = square;
  var alg = new GradientDescent(square, h, x_ini, 0.1);
  alg.optimize(eps, nlim);

  // Plot Initial Presentation
  contourPlot
    .draw(objective, 4, thresholds)
    .addAxis()
    .addLine(alg.getPath());

  // When a button is changed, update the visualization
  function onFunctionChanged(myfunction) {
    //Get new data and remove svg elements
    objective = objectives[myfunction].obj;
    d3.select("#svg1").selectAll("*").remove();
    x_ini = objectives[myfunction].x_ini;

    // Change default values of the buttons
    document.getElementById("step").value = objectives[myfunction].delta.value;
    document.getElementById("step").step = objectives[myfunction].delta.step;

    // Change Alg and make optimizization
    alg = new GradientDescent(objective, h, x_ini, objectives[myfunction].delta.value);
    alg.optimize(eps, nlim);
    contourPlot = new ContourPlot(
      d3.select('#svg1'),
      objectives[myfunction].xDomain,
      objectives[myfunction].yDomain,
      600,
      600,
    );
    contourPlot
      .draw(objective, 4, thresholds, objectives[myfunction].interpolation)
      .addAxis()
      .addLine(alg.getPath());
  }

  // Update Xini
  function changeXini([valx, valy]) {
    x_ini = [valx, valy];
    d3.select("#path").remove();
    d3.select("#dot").remove();
    alg.setXini(x_ini);
    alg.optimize(eps, nlim);
    contourPlot
      .addLine(alg.getPath());
  }

  // Function updating the step
  function onStepChanged() {
    d3.select("#path").remove();
    d3.select("#dot").remove();
    alg.setStep(this.value);
    alg.optimize(eps, nlim);
    contourPlot
      .addLine(alg.getPath());
  }

  // Activation of the buttons
  //Update the function
  selectFunctionDropdownButton.on("change", function(d) {
      var selectedOption = d3.select(this).property("value");
      onFunctionChanged(selectedOption);
  })
  //Update the step
  d3.select("#step").on("input", onStepChanged)
  // On Click, update the initial point
  d3.select("#svg1").on("click", function() {
    changeXini([contourPlot.xScale.invert(d3.mouse(this)[0]), contourPlot.yScale.invert(d3.mouse(this)[1])])
  })
}


function test_rosenbrock(h, eps, nlim) {
  const rosenbrock = ([x,y]) =>
    (1-x)**2  + 100*(y - x**2)**2 + 1;

  const x = [2.5, -1.5];

  const thresholds = d3.range(1, 20).map(i => Math.pow(2, i));

  const alg = new GradientDescent(rosenbrock, h, x, 0.0001);
  alg.optimize(eps, nlim);

  const contourPlot = new ContourPlot(
    d3.select('#svg1'),
    [-2, 3],
    [-2, 3],
    600,
    600,
  );

  contourPlot
    .draw(rosenbrock, 4, thresholds, d3.interpolateYlGnBu)
    .addAxis()
    .addLine(alg.getPath());
}

test_square(0.01, 0.1, 20);
//test_rosenbrock(0.01, 0.1, 100);
