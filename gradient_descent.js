class GradientDescent {
  constructor(objective, h = 0.01, x_ini = [1,2], delta = 0.1) {
    this.h = h;
    this.objective = objective;
    this.x_ini = x_ini;
    this.x = this.x_ini.map(x => x);
    this.delta = delta;
    this.path = [];
  }

  differentiate(arr) {
    const x_hP = arr.map(el => el);
    const x_hM = arr.map(el => el);
    var gradient = 0;
    return arr.map((el, i) => {
      x_hP[i] = el + this.h;
      x_hM[i] = el - this.h;
      gradient = ((this.objective(x_hP) - this.objective(x_hM)) / (2*this.h));
      x_hP[i] = el;
      x_hM[i] = el;
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

  optimize(eps, nlim){
    var norm = 0;
    var steps = 0;
    do {
      this.path.push(this.x.map(x => x));
      norm = (this.one_step())**(1/2);
      steps = steps + 1;
    } while (norm > eps && steps < nlim);
    return this.path;
  }

  setXini([new_var]){
    this.x_ini = [parseFloat(new_var)];
    this.x = this.x_ini.map(x => x);
    this.path = [];
  }

  setStep(new_var){
    this.delta = new_var;
    this.x = this.x_ini.map(x => x);
    this.path = [];
  }

  getPath = () => this.path;
}
