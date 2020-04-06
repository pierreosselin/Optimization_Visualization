/** Abstract class Algorithm is only used to define the following API for implemented algorithms:
* @method one_step : Perform one step of the algorithm
* @method optimize : Perform optimization wth given criterion
* @method get_path : Get the path of the optimization
*/
class Algorithm {
  constructor(objective){
    this.objective = objective;
    this.path = [];
  }

  one_step(){}

  optimize(){}

  getPath = () => this.path;
}

/** Mother class First Order algorithm must do the following task
* @method differentiate : Approximate the Gradient
* @method optimize : optimize the algorithm
* @method setObj : set objective
* @method setXini : set x_ini
* @method setStep : Set the step
* @method reinitialize : Reinitialize Algorithm parameters
*/
class AlgorithmFirstOrder extends Algorithm{
  constructor(objective, x_ini, h = 0.001, delta = 0.1){
    super(objective);
    this.x_ini = x_ini;
    this.x = this.x_ini.map(x => x);
    this.h = h;
    this.delta = delta;
  }

  differentiate(arr) {
    const x_hP = arr.map(el => el);
    const x_hM = arr.map(el => el);
    let gradient = 0;
    return arr.map((el, i) => {
      x_hP[i] = el + this.h;
      x_hM[i] = el - this.h;
      gradient = ((this.objective(x_hP) - this.objective(x_hM)) / (2*this.h));
      x_hP[i] = el;
      x_hM[i] = el;
      return gradient;
    })
  }

  optimize(eps, nlim){
    let norm = 0;
    let steps = 0;
    let domainFlag = true;
    do {
      this.path.push(this.x.map(x => x));
      norm = (this.one_step())**(1/2);
      steps = steps + 1;
      //domainFlag = this.x.map((e,i) => (e >= domain[i][0]) && (e <= domain[i][1])).reduce((a,b) => a && b, true);
    } while (norm > eps && steps < nlim && domainFlag);
    return this.path;
  }

  setObj(new_var){
    this.objective = new_var
    this.x = this.x_ini.map(x => x);
    this.reinitialize();
  }

  setXini(new_var){
    this.x_ini = new_var.map(val => parseFloat(val));
    this.x = this.x_ini.map(x => x);
    this.reinitialize();
  }

  setStep(new_var){
    this.delta = new_var;
    this.x = this.x_ini.map(x => x);
    this.reinitialize();
  }

  reinitialize() {
    this.path = [];
  }
}

/** Simple Gradient Descent algorithm must do the following task
* @method one_step : One step towards the opposite of the gradient
*/
class GradientDescent extends AlgorithmFirstOrder{
  constructor(objective, x_ini, h = 0.001, delta = 0.1) {
    super(objective, x_ini, h, delta);
  }

  one_step() {
    const gradient = this.differentiate(this.x);
    let norm = 0;
    for (let i = 0, len = gradient.length; i < len; i++) {
      this.x[i] = this.x[i] - this.delta * gradient[i];
      norm = norm + gradient[i] ** 2
    }
    return norm
  }
}

/** Gradient Descent with momentum must do the following task
* @method one_step : One step towards the opposite of the gradient with momentum.
* @method reinitialize : reinitialize path and gradient momentum
*/
class GradientDescentMomentum extends AlgorithmFirstOrder{
  constructor(objective, x_ini, h = 0.001, delta = 0.1, momentum = 0.9) {
    super(objective, x_ini, h, delta);
    this.momentum = momentum;
    this.currentgrad = x_ini.map(x => 0);
  }

  one_step() {
    const gradient = this.differentiate(this.x);
    this.currentgrad = this.currentgrad.map((e,i) => this.momentum * e + this.delta * gradient[i])
    let norm = 0;
    for (let i = 0, len = gradient.length; i < len; i++) {
      this.x[i] = this.x[i] - this.currentgrad[i];
      norm = norm + this.currentgrad[i] ** 2
    }
    return norm
  }

  reinitialize() {
    this.path = []
    this.currentgrad = this.x_ini.map(x => 0)
  }
}

/** Gradient Descent with nesterov momentum must do the following task
* @method one_step : One step towards the opposite of the gradient with nesterov momentum.
* @method reinitialize : reinitialize path and gradient momentum
*/
class GradientDescentMomentumNesterov extends AlgorithmFirstOrder{
  constructor(objective, x_ini, h = 0.001, delta = 0.1, momentum = 0.9) {
    super(objective, x_ini, h, delta);
    this.momentum = momentum;
    this.currentgrad = x_ini.map(x => 0);
  }

  one_step() {
    let x_next = this.x.map((e,i) => e - this.momentum * this.currentgrad[i])
    const gradient = this.differentiate(x_next);
    this.currentgrad = this.currentgrad.map((e,i) => this.momentum * e + this.delta * gradient[i])
    let norm = 0;
    for (let i = 0, len = gradient.length; i < len; i++) {
      this.x[i] = this.x[i] - this.currentgrad[i];
      norm = norm + this.currentgrad[i] ** 2
    }
    return norm
  }

  reinitialize() {
    this.path = []
    this.currentgrad = this.x_ini.map(x => 0)
  }
}
