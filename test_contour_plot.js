function test() {
  const nlim = 20;
  const h = 0.01;
  const x = [-30, 175];
  const eps = 0.1;

  const thresholds = d3.range(1, 20).map(i => Math.pow(2, i));
  const square = (x, y) => x ** 2 + y ** 2 + (x + y) ** 2;

  const alg = new GradientDescent(([x, y]) => square(x, y), h, x, 0.1);
  alg.optimize(eps, nlim);

  const contourPlot = new ContourPlot(
    d3.select('#svg1'),
    [-200, 200],
    [-200, 200],
    600,
    600,
  );

  contourPlot
    .draw(square, 4, thresholds)
    .addAxis()
    .addLine(alg.getPath());
}

test();