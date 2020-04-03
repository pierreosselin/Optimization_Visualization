console.log("Gradient Descent Algorithm");
const h = 0.01;
const x = [1, 2];
const eps = 0.1;

const objective = x => x.reduce((acc, value) => (acc + value ** 2), 0);

class GradientDescent {
  constructor(h, objective, x_ini) {
    this.h = h;
    this.objective = objective;
    this.x = x_ini;
    this.delta = 0.1;
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
    var norm = 0;
    do {
      norm = (this.one_step()) ** (1 / 2)
      console.log("Norm:", norm, " State:", this.x);
    } while (norm > eps);
  }
}

alg = new GradientDescent(h, objective, x)
alg.optimize(eps)
