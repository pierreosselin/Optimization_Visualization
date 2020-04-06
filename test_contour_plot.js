function test_sgd(h, eps, nlim) {
  //(Pre)defined functions
  const square = ([x, y]) => x ** 2 + y ** 2 + (x + y) ** 2;
  const rosenbrock = ([x,y]) => (1-x)**2  + 100*(y - x**2)**2 + 1;
  const algorithms = ["gd", "gdM", "gdNM", "RMSProp", "Adam"];
  const objectives = {"square": {obj: square, x_ini: [-30, 175], delta: {value: 0.1, step : 0.01}, xDomain : [-200,200], yDomain : [-200,200], interpolation :d3.interpolateMagma},
                      "rosenbrock": {obj: rosenbrock, x_ini: [2.5, -1.5], delta:  {value: 0.0001, step : 0.0001}, xDomain : [-2,3], yDomain : [-2,3], interpolation: d3.interpolateYlGnBu}
                    };

  // Create basic constituent of the Visualization (Contour Windows and button)
  // Window for contour
  let contourPlot = new ContourPlot(
    d3.select('#svg1'),
    objectives["square"].xDomain,
    objectives["square"].yDomain,
    600,
    600,
  );
  const thresholds = d3.range(1, 20).map(i => Math.pow(2, i));
  // Button for function selection
  let selectFunctionDropdownButton  = d3.select("#buttonSpace")
    .append('select')
  // add the options to the button
  selectFunctionDropdownButton  // Add a button
    .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
   	.data(Object.keys(objectives))
    .enter()
  	.append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  // Button for algorithm selection
  let selectAlgorithmDropdownButton  = d3.select("#buttonSpace")
    .append('select')
  // add the options to the button
  selectAlgorithmDropdownButton  // Add a button
    .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
   	.data(algorithms)
    .enter()
  	.append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  // Definition of all the default variables
  let x_ini = [-30, 175];
  let step = 0.1;
  let objective = square;
  let alg = new GradientDescent(square, x_ini, h, step);
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
    step = objectives[myfunction].delta.value;
    // Change default values of the buttons
    document.getElementById("step").value = step;
    document.getElementById("step").step = objectives[myfunction].delta.step;

    // Change Alg and make optimizization
    alg.setObj(objective);
    alg.setStep(step);
    alg.setXini(x_ini);
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

  // Update Algorithm
  function onAlgorithmChanged(myalgorithm) {
    d3.select("#path").remove();
    d3.select("#dot").remove();
    if (myalgorithm == "gd") {
      alg = new GradientDescent(objective,x_ini, h,step);
    } else if (myalgorithm == "gdM"){
      alg = new GradientDescentMomentum(objective,x_ini, h,step);
    } else if (myalgorithm == "gdNM"){
      alg = new GradientDescentMomentumNesterov(objective,x_ini, h,step);
    } else if (myalgorithm == "RMSProp"){
      alg = new RMSProp(objective,x_ini, h,step);
    } else if (myalgorithm == "Adam"){
      alg = new Adam(objective,x_ini, h,step);
    }
    alg.optimize(eps, nlim);
    contourPlot
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
    step = this.value
    alg.setStep(step);
    alg.optimize(eps, nlim);
    contourPlot
      .addLine(alg.getPath());
  }

  // Activation of the buttons
  //Update the function
  selectFunctionDropdownButton.on("change", function(d) {
      let selectedOption = d3.select(this).property("value");
      onFunctionChanged(selectedOption);
  })
  //Update the algorithm
  selectAlgorithmDropdownButton.on("change", function(d) {
      let selectedOption = d3.select(this).property("value");
      onAlgorithmChanged(selectedOption);
  })
  //Update the step
  d3.select("#step").on("input", onStepChanged)
  // On Click, update the initial point
  d3.select("#svg1").on("click", function() {
    changeXini([contourPlot.xScale.invert(d3.mouse(this)[0]), contourPlot.yScale.invert(d3.mouse(this)[1])])
  })
}
//test_sgdM(0.01, 0.1, 20);
test_sgd(0.01, 0.01, 60);
