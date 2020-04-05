/** Mother class algorithm must do the following task
* @method differentiate : Approximate the Gradient
* @method hessian : Approximate the Hessian
* @method one_step : Perform one step of the algorithm
* @method optimization : Perform optimization wth given criterion
* @method get_path : Get the path of the optimization
*/
class Algorithm {
  constructor(objective){
    this.objective = objective;
  }

  one_step(){}

  optimize(){}

  setXini(){}

  setStep(){}

  getPath(){}
}




class GradientDescent extends Algorithm{
  constructor(objective, x_ini = [1,2], h = 0.01, delta = 0.1) {
    super(objective);
    this.h = h;
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

  setXini(new_var){
    this.x_ini = new_var.map(val => parseFloat(val));
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
