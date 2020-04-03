function test_square(h, eps, nlim) {
  const x = [1];

  const square = (x) => x ** 2;

  const alg = new GradientDescent(([x]) => square([x]), h, x, 0.1);
  alg.optimize(eps, nlim);

  const contourPlot = new ContourPlot(
    d3.select('#svg1'),
    [-2, 2],
    600,
    600,
  );

  contourPlot
    .draw(square, 4)
    .addAxis()
    .addLine(alg.getPath().map(index => [index[0], square(index)]));
}
/*
function test_rosenbrock(h, eps, nlim) {
  const rosenbrock = (x,y) =>
    (1-x)**2  + 100*(y - x**2)**2 + 1;

  const x = [2.5, -1.5];

  const thresholds = d3.range(1, 20).map(i => Math.pow(2, i));

  const alg = new GradientDescent(([x, y]) => rosenbrock(x, y), h, x, 0.0001);
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
*/

test_square(0.01, 0.1, 20);
// test_rosenbrock(0.01, 0.1, 100);
