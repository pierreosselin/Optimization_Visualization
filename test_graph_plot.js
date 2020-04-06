function test_sgd(h, eps, nlim) {

  //(Pre)defined functions
  const square = (x) => x ** 2;
  const pow3 = (x) => x ** 3;
  const sin3 = (x) => -(1.4 -3*x)*Math.sin(18*x)
  const algorithms = ["gd", "gdM", "gdNM", "RMSProp"];
  const objectives = {"square": {obj: square, x_ini: 1.5, delta: {value: 0.8, step : 0.05}, xDomain: [-2,2]},
                      "pow3": {obj: pow3, x_ini: 0.7, delta: {value: 0.1, step : 0.01}, xDomain: [-1,1]},
                      "sin3": {obj: sin3, x_ini: 1, delta: {value: 0.01, step : 0.001}, xDomain: [0,1.2]}};

  // Create basic constituent of the Visualization (Contour Windows and button)
  // Window for contour
  let graphPlot = new GraphPlot(
    d3.select('#svg1'),
    [-2, 2],
    600,
    600,
  );
  // Define action when moving mouse
  graphPlot.svg
    .on("mousemove", mouseAction)

  // Circle shape for x_ini location
  let circle_xini = graphPlot.svg
    .append("circle")
    .attr('r', 4)
    .style("fill", "black")

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
  let x_ini = [1.5];
  let step = 0.8;
  let objective = square;
  let alg = new GradientDescent(objective,x_ini, h, 0.8);
  alg.optimize(eps, nlim);

  // Plot Initial Presentation
  graphPlot
    .draw(objective, 4)
    .addAxis()
    .addLine(alg.getPath().map(index => [index[0], objective(index)]));

  // When a button is changed, update the visualization
  function onFunctionChanged(myfunction) {
    //Get new data and remove svg elements
    objective = objectives[myfunction].obj;
    d3.select("#svg1").selectAll("*").remove();
    x_ini = [objectives[myfunction].x_ini];
    step = objectives[myfunction].delta.value

    // Change default values of the buttons
    document.getElementById("step").value = step;
    document.getElementById("step").step = objectives[myfunction].delta.step;
    document.getElementById("xini").value = x_ini[0];

    // Change Alg and make optimizization
    alg = new GradientDescent(objective, x_ini, h, step);
    alg.optimize(eps, nlim);
    graphPlot = new GraphPlot(
      d3.select('#svg1'),
      objectives[myfunction].xDomain,
      600,
      600,
    );
    graphPlot
      .draw(objective, 4)
      .addAxis()
      .addLine(alg.getPath().map(index => [index[0], objective(index)]))

    // Redefine Mouse Action
    graphPlot.svg
      .on("mousemove", mouseAction)
    // Circle shape for x_ini location
    circle_xini =  graphPlot.svg
      .append("circle")
      .attr('r', 4)
      .style("fill", "black")
  }

  function onAlgorithmChanged(myalgorithm) {
    d3.select("#path").remove();
    d3.select("#dot").remove();
    if (myalgorithm == "gd") {
      alg = new GradientDescent(objective,x_ini, h,step)
    } else if (myalgorithm == "gdM"){
      alg = new GradientDescentMomentum(objective,x_ini, h,step)
    } else if (myalgorithm == "gdNM"){
      alg = new GradientDescentMomentumNesterov(objective,x_ini, h,step);
    } else if (myalgorithm == "RMSProp"){
      alg = new RMSProp(objective,x_ini, h,step);
    }
    alg.optimize(eps, nlim);
    graphPlot
      .addLine(alg.getPath().map(index => [index[0], objective(index)]));
  }

  function changeXini(val) {
    x_ini = [val];
    d3.select("#path").remove();
    d3.select("#dot").remove();
    alg.setXini(x_ini);
    alg.optimize(eps, nlim);
    graphPlot
      .addLine(alg.getPath().map(index => [index[0], objective(index)]));
  }

  function onStepChanged() {
    step = this.value
    d3.select("#path").remove();
    d3.select("#dot").remove();
    alg.setStep(step);
    alg.optimize(eps, nlim);
    graphPlot
      .addLine(alg.getPath().map(index => [index[0], objective(index)]));
  }

  // Action when moving the mouse
  function mouseAction() {
    const mousex = d3.mouse(d3.event.target)[0];
    circle_xini
      .attr('cx', mousex)
      .attr('cy', graphPlot.yScale(objective([graphPlot.xScale.invert(mousex)])))
  };

  // Activation of the buttons
  //Update the function
  selectFunctionDropdownButton .on("change", function(d) {
      let selectedOption = d3.select(this).property("value");
      onFunctionChanged(selectedOption);
  })
  //Update the algorithm
  selectAlgorithmDropdownButton .on("change", function(d) {
      let selectedOption = d3.select(this).property("value");
      onAlgorithmChanged(selectedOption);
  })
  //Update the initial point
  d3.select("#xini").on("input", function() {
    changeXini(this.value)
  })
  //Update the step
  d3.select("#step").on("input", onStepChanged);
  // On Click, update the initial point
  d3.select("#svg1").on("click", function() {
    const next_x = graphPlot.xScale.invert(d3.mouse(this)[0]);
    document.getElementById("xini").value = next_x;
    changeXini(next_x)
  })

}

test_sgd(0.01, 0.0001, 60);
