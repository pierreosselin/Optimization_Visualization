class GradientDescent {
  constructor(h, objective, x_ini) {
    this.h = h;
    this.objective = objective;
    this.x = x_ini;
    this.delta = 0.1;
    this.path = [];
  }

  differentiate(arr) {
    const x_h = arr.map(el => el);
    var gradient = 0;
    return arr.map((el, i) => {
      x_h[i] = el + this.h;
      gradient = ((this.objective(x_h) - this.objective(arr)) / this.h);
      x_h[i] = el;
      return gradient;
    })
  }

  one_step() {
    const gradient = this.differentiate(this.x);
    var norm = 0;
    for (var i = 0, len = gradient.length; i < len; i++) {
      this.x[i] = this.x[i] - this.delta * gradient[i];
      norm = norm + gradient[i] ** 2
    }
    return norm
  }

  optimize(eps) {
    let norm = 0;
    do {
      this.path.push(this.x.map(x => x));
      norm = (this.one_step()) ** (1 / 2);
      console.log("Norm:", norm, " State:", this.x);
    } while (norm > eps);
  }

  getPath = () => this.path;
}

const h = 0.01;
const x = [-30, 175];
const eps = 0.1;

const thresholds = d3.range(1, 20).map(i => Math.pow(2, i));
const square = (x, y) => x ** 2 + y ** 2 + (x + y) ** 2;

alg = new GradientDescent(h, ([x, y]) => square(x, y), x);
alg.optimize(eps);

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
