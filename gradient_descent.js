console.log("Gradient Descent Algorithm");
const h = 0.01;
const x = [1,2];

function objective(arr) {
    ret= 0;
    for (var i = 0, len = arr.length; i < len; i++) {
        ret = ret + arr[i] * arr[i];
    }
    return ret;
}

function differentiate(objective, x, h){
  gradient = [];
  x_h = x.map(x => x);
  for (var i = 0, len = x.length; i < len; i++) {
      x_h[i] = x[i] + h;
      gradient.push((objective(x_h) - objective(x))/h);
      x_h[i] = x[i];
  }
  return gradient;
}


class gradient_descent {
  constructor(h, objective, x_ini){
    this.h = h;
    this.objective = objective;
    this.x = x_ini;
  }

  differentiate(arr){
    var gradient = [];
    const x_h = arr.map(el => el);
    for (var i = 0, len = arr.length; i < len; i++) {
        x_h[i] = arr[i] + this.h;
        gradient.push((this.objective(x_h) - this.objective(arr))/this.h);
        x_h[i] = arr[i];
    }
    return gradient;
  }

  one_step(){
    var gradient = differentiate(this.x)
    return gradient
  }

}
