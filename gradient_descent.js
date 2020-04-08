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
    this.reinitialize();
  }

  setXini(new_var){
    this.x_ini = new_var.map(val => parseFloat(val));
    this.reinitialize();
  }

  setStep(new_var){
    this.delta = new_var;
    this.reinitialize();
  }

  reinitialize() {
    this.x = this.x_ini.map(x => x);
    this.path = [];
  }
}

/** Class AlgorithmSecondOrder implements the following interface
* @method hessian : Approximate the Hessian our implementation only works for 1 element and 2 element arrays
*/
class AlgorithmSecondOrder extends AlgorithmFirstOrder{
  constructor(objective, x_ini, h = 0.001, delta = 0.1){
    super(objective, x_ini, h = 0.001, delta = 0.1);
  }

  hessian(arr) {
    let n = arr.length;
    if (n == 1){
      return [[(- 1 * this.objective([arr[0] + 2*this.h]) + 16 * this.objective([arr[0] + this.h]) - 30 * this.objective(arr) + 16 * this.objective([arr[0] - this.h]) - this.objective([arr[0] - 2*this.h]))/(12 * this.h ** 2)]];
      }
      let hess = 0;
      const x_hPP = arr.map(el => el);
      const x_hP = arr.map(el => el);
      const x_hM = arr.map(el => el);
      const x_hMM = arr.map(el => el);

      let diag = arr.map((el,i) => {
        x_hPP[i] = el + 2*this.h;
        x_hP[i] = el + this.h;
        x_hM[i] = el - this.h;
        x_hMM[i] = el - 2*this.h;
        hess = (-this.objective(x_hPP) + 16 * this.objective(x_hP) - 30 * this.objective(arr) + 16 * this.objective(x_hM) - this.objective(x_hMM)) / (12 * this.h ** 2);
        x_hPP[i] = el;
        x_hP[i] = el;
        x_hM[i] = el;
        x_hMM[i] = el;
        return hess
      });

      x_hPP[0] = arr[0] + this.h;
      x_hPP[1] = arr[1] + this.h;

      x_hP[0] = arr[0] + this.h;
      x_hP[1] = arr[1] - this.h;

      x_hM[0] = arr[0] - this.h;
      x_hM[1] = arr[1] + this.h;

      x_hMM[0] = arr[0] - this.h;
      x_hMM[1] = arr[1] - this.h;

      let corner = (this.objective(x_hPP) - this.objective(x_hP) - this.objective(x_hM) + this.objective(x_hMM)) / (4 * this.h ** 2)

      return [[diag[0], corner], [corner, diag[1]]]
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
    this.currentgrad = this.x_ini.map(x => 0);
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
    this.path = [];
    this.x = this.x_ini.map(x => x);
    this.currentgrad = this.x_ini.map(x => 0);
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
    this.currentgrad = this.x_ini.map(x => 0);
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
    this.path = [];
    this.x = this.x_ini.map(x => x);
    this.currentgrad = this.x_ini.map(x => 0);
  }
}

/** Gradient Descent with nesterov momentum must do the following task
* @method one_step : One step towards the opposite of the gradient with nesterov momentum.
* @method reinitialize : reinitialize path and gradient momentum
*/
class RMSProp extends AlgorithmFirstOrder{
  constructor(objective, x_ini, h = 0.001, delta = 0.1, rho = 0.9, epsilon = 0.00000001) {
    super(objective, x_ini, h, delta);
    this.rho = rho;
    this.epsilon = epsilon;
    this.currentSquareGradientAverage = this.x_ini.map(x => 0);
  }

  one_step() {
    let gradient = this.differentiate(this.x);
    this.currentSquareGradientAverage = this.currentSquareGradientAverage.map((e,i) => this.rho * e + (1-this.rho) * (gradient[i] ** 2));
    gradient = gradient.map((e,i) => (this.delta * e) / (Math.sqrt(this.currentSquareGradientAverage[i]) + this.epsilon));
    let norm = 0;
    for (let i = 0, len = gradient.length; i < len; i++) {
      this.x[i] = this.x[i] - gradient[i];
      norm = norm + gradient[i] ** 2
    }
    return norm
  }

  reinitialize() {
    this.path = [];
    this.x = this.x_ini.map(x => x);
    this.currentSquareGradientAverage = this.x_ini.map(x => 0);
  }
}

/** Gradient Descent with nesterov momentum must do the following task
* @method one_step : One step towards the opposite of the gradient with nesterov momentum.
* @method reinitialize : reinitialize path and gradient momentum
*/
class Adam extends AlgorithmFirstOrder{
  constructor(objective, x_ini, h = 0.001, delta = 0.1, beta1 = 0.9, beta2 = 0.999, epsilon = 0.00000001) {
    super(objective, x_ini, h, delta);
    this.beta1 = beta1;
    this.beta2 = beta2;
    this.epsilon = epsilon;
    this.currentGradientAverage = this.x_ini.map(x => 0);
    this.currentSquareGradientAverage = this.x_ini.map(x => 0);
    this.nStep = 0;
  }

  one_step() {
    this.nStep = this.nStep + 1;
    let gradient = this.differentiate(this.x);
    this.currentGradientAverage = this.currentGradientAverage.map((e,i) => this.beta1 * e + (1 - this.beta1) * gradient[i]);
    this.currentSquareGradientAverage = this.currentSquareGradientAverage.map((e,i) => this.beta2 * e + (1-this.beta2) * (gradient[i] ** 2));

    let firstCorrectionTerm = 1 - (this.beta1 ** this.nStep);
    let secondCorrectionTerm = 1 - (this.beta2 ** this.nStep);
    let currentFirstMoment = this.currentGradientAverage.map(e => e/firstCorrectionTerm);
    let currentSecondMoment = this.currentSquareGradientAverage.map(e => e/secondCorrectionTerm);

    gradient = currentFirstMoment.map((e,i) => (this.delta * e) / (Math.sqrt(currentSecondMoment[i]) + this.epsilon));
    let norm = 0;
    for (let i = 0, len = gradient.length; i < len; i++) {
      this.x[i] = this.x[i] - gradient[i];
      norm = norm + gradient[i] ** 2
    }
    return norm
  }

  reinitialize() {
    this.path = [];
    this.x = this.x_ini.map(x => x);
    this.currentGradientAverage = this.x_ini.map(x => 0);
    this.currentSquareGradientAverage = this.x_ini.map(x => 0);
    this.nStep = 0;
  }
}

/** BFGS implements the following interface
* @method one_step : One step towards the bfgs direction.
* @method reinitialize : Reinitialize quantity that are proper the the algorithm.
*/
class BFGS extends AlgorithmFirstOrder{
  constructor(objective, x_ini, h = 0.00001, delta = 0.1) {
    super(objective, x_ini, h, delta);
    this.x_ini = array2vec(this.x_ini);
    this.x = array2vec(this.x);
    this.currentGradient = this.differentiate(this.x);
    this.currentHessian = eye(x_ini.length);
  }

  one_step() {
    let direction = solve(this.currentHessian, this.currentGradient.map(el => -1 * this.delta * el ));
    this.x = add(this.x, direction);
    let next_gradient = this.differentiate(this.x);
    let y_k = sub(next_gradient, this.currentGradient);
    let firstQuantity = mul(direction, y_k);
    let secondQuantity = mul(this.currentHessian, direction);
    let thirdQuantity = mul(direction, secondQuantity);
    this.currentHessian = add(this.currentHessian, sub(mul(y_k, transpose(y_k.map(el => el/firstQuantity))), mul(secondQuantity, transpose(secondQuantity.map(el => el / thirdQuantity)))));
    let normGrad = norm(this.currentGradient);
    this.currentGradient = next_gradient.map(el => el);
    return normGrad
  }

  reinitialize() {
    this.path = [];
    this.x = this.x_ini.map(x => x);
    this.currentGradient = this.differentiate(this.x);
    this.currentHessian = eye(this.x_ini.length);
  }
}

/** Newton Descent
* @method one_step : Perform Newton Step.
*/
class DampedNewton extends AlgorithmSecondOrder{
  constructor(objective, x_ini, h = 0.00001, delta = 0.1, epsilon = 0.000001) {
    super(objective, x_ini, h, delta);
    this.x_ini = array2vec(this.x_ini);
    this.x = array2vec(this.x);
    this.epsilon = epsilon;
  }
  one_step() {
    let hess = array2mat(this.hessian(this.x));
    let eigdec = eigs(hess, this.x_ini.length);
    let eigval = eigdec.V;
    let eigvec = eigdec.U;
    eigval = eigval.map(el => Math.max(Math.abs(el), this.epsilon));
    hess = mul(eigvec, mul(diag(eigval), transpose(eigvec)));
    let gradient = this.differentiate(this.x);
    let direction = solve(hess, mul(-1, gradient));
    this.x = add(this.x, direction.map(el => el * this.delta));
    return norm(gradient);
  }
}
