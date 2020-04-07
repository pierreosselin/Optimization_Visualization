/** Abstract class Algorithm is only used to define the following API for implemented algorithmNames:
* @method one_step : Perform one step of the algorithm
* @method optimize : Perform optimization wth given criterion
* @method get_path : Get the path of the optimization
*/
class Algorithm {
  constructor(name, params){
    if (!algorithmsConfig[name].parameters.every(neededParam => Object.keys(params).includes(neededParam))) {
      throw new Error("Missing parameters");
    }

    this.params = params;
    this.name = name;
    this.path = [];
  }

  one_step(){}

  optimize(){}

  getPath = () => this.path;
  getName = () => this.name;
}

/** Mother class First Order algorithm must do the following task
* @method differentiate : Approximate the Gradient
* @method optimize : optimize the algorithm
* @method setObj : set objective
* @method setXini : set x_ini
* @method setStep : Set the step
*/
class AlgorithmFirstOrder extends Algorithm{
  constructor(name, params){
    super(name, params);
    this.objective = params[paramNames.objectiveFunction];
    this.x_ini = params[paramNames.x_ini];
    this.x = this.x_ini.map(x => x);
    this.h = params[paramNames.h];
    this.delta = params[paramNames.delta];
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

  optimize(){
    let norm = 0;
    let steps = 0;
    let domainFlag = true;
    do {
      this.path.push(this.x.map(x => x));
      norm = (this.one_step())**(1/2);
      steps = steps + 1;
      //domainFlag = this.x.map((e,i) => (e >= domain[i][0]) && (e <= domain[i][1])).reduce((a,b) => a && b, true);
    } while (norm > this.params[paramNames.normLim] && steps < this.params[paramNames.nlim] && domainFlag);
    return this.path;
  }
}

/** Simple Gradient Descent algorithm must do the following task
* @method one_step : One step towards the opposite of the gradient
*/
class GradientDescent extends AlgorithmFirstOrder{
  constructor(params) {
    super(algorithmNames.gradientDescent, params);
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
*/
class GradientDescentMomentum extends AlgorithmFirstOrder{
  constructor(params) {
    super(algorithmNames.gradientDescentWithMomentum, params);
    this.momentum = params[paramNames.momentum];
    this.currentgrad = this.x_ini.map(() => 0);
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
}

/** Gradient Descent with nesterov momentum must do the following task
* @method one_step : One step towards the opposite of the gradient with nesterov momentum.
*/
class GradientDescentMomentumNesterov extends AlgorithmFirstOrder{
  constructor(params) {
    super(algorithmNames.gradientDescentMomentumNesterov, params);
    this.momentum = params[paramNames.momentum];
    this.currentgrad = this.x_ini.map(() => 0);
  }

  one_step() {
    let x_next = this.x.map((e,i) => e - this.momentum * this.currentgrad[i]);
    const gradient = this.differentiate(x_next);
    this.currentgrad = this.currentgrad.map((e,i) => this.momentum * e + this.delta * gradient[i]);
    let norm = 0;
    for (let i = 0, len = gradient.length; i < len; i++) {
      this.x[i] = this.x[i] - this.currentgrad[i];
      norm = norm + this.currentgrad[i] ** 2
    }
    return norm
  }
}

/** Gradient Descent with nesterov momentum must do the following task
* @method one_step : One step towards the opposite of the gradient with nesterov momentum.
*/
class RMSProp extends AlgorithmFirstOrder{
  constructor(params) {
    super(algorithmNames.RMSProp, params);
    this.rho = params[paramNames.rho];
    this.epsilon = params[paramNames.epsilon];
    this.currentSquareGradientAverage = this.x_ini.map(() => 0);
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
}

/** Gradient Descent with nesterov momentum must do the following task
* @method one_step : One step towards the opposite of the gradient with nesterov momentum.
*/
class Adam extends AlgorithmFirstOrder{
  constructor(params) {
    super(algorithmNames.adam, params);
    this.beta1 = params[paramNames.beta1];
    this.beta2 = params[paramNames.beta2];
    this.epsilon = params[paramNames.epsilon];
    this.currentGradientAverage = this.x_ini.map(() => 0);
    this.currentSquareGradientAverage = this.x_ini.map(() => 0);
    this.nStep = 0;
  }

  one_step() {
    let gradient = this.differentiate(this.x);
    this.currentGradientAverage = this.currentGradientAverage.map((e,i) => this.beta1 * e + (1 - this.beta1) * gradient[i]);
    this.currentSquareGradientAverage = this.currentSquareGradientAverage.map((e,i) => this.beta2 * e + (1-this.beta2) * (gradient[i] ** 2));

    let firstCorrectionTerm = 1 - this.beta1 ** this.nStep;
    let secondCorrectionTerm = 1 - this.beta2 ** this.nStep;
    let currentFirstMoment = this.currentGradientAverage.map(e => e/firstCorrectionTerm);
    let currentSecondMoment = this.currentSquareGradientAverage.map(e => e/firstCorrectionTerm);

    gradient = this.currentGradientAverage.map((e,i) => (this.delta * e) / (Math.sqrt(this.currentSquareGradientAverage[i]) + this.epsilon));
    let norm = 0;
    for (let i = 0, len = gradient.length; i < len; i++) {
      this.x[i] = this.x[i] - gradient[i];
      norm = norm + gradient[i] ** 2
    }
    return norm
  }
}
