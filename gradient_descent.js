console.log("Gradient Descent Algorithm");
const h = 0.01;
const x = [1,2];
const eps = 0.1;

function objective(arr) {
    ret= 0;
    for (var i = 0, len = arr.length; i < len; i++) {
        ret = ret + arr[i] * arr[i];
    }
    return ret;
}

class gradient_descent {
  constructor(h, objective, x_ini){
    this.h = h;
    this.objective = objective;
    this.x = x_ini;
    this.delta = 0.1;
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
    var gradient = this.differentiate(this.x);
    var norm = 0;
    for (var i = 0, len = gradient.length; i < len; i++) {
        this.x[i] = this.x[i] - this.delta * gradient[i];
        norm = norm + gradient[i]**2
    }
    return norm
  }

  optimize(eps){
    var norm = 0;
    do {
      norm = (this.one_step())**(1/2)
      console.log("Norm:", norm, " State:", this.x);
    } while (norm > eps);
  }
}

alg = new gradient_descent(h,objective,x)
alg.optimize(eps)
