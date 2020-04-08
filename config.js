const inputTypes = {
  // The variable domain is given as a list of names and associated values
  dropdown: "dropdown",

  // The variable domain is given as a function (value) => isValid.
  click: "click",

  // The variable domain is given as a function (value) => isValid.
  text: "text",
};

const paramNames = {
  // algorithm
  algorithmName: "Algorithm",

  // objective
  objectiveFunction: "Objective function",

  // algorithm params
  x_ini: "Initial coordinates",
  delta: "Learning rate",
  h: "Derivatives h param",
  momentum: "Descent momentum",
  rho: "Rho",
  epsilon: "Epsilon",
  beta1: "Beta1",
  beta2: "Beta2",
  nlim: "Maximum number of iterations",
  normLim: "Norm value stopping criterion",

  // graph params
  xDomain: "Domain for first variable",
  yDomain: "Domain for second variable",
  interpolation: "Interpolation method",
  threshold: "Contour thresholds",
};

const algorithmNames = {
  gradientDescent: "Gradient Descent",
  gradientDescentWithMomentum: "Gradient Descent With Momentum",
  gradientDescentMomentumNesterov: "Gradient Descent With Momentum Nesterov",
  RMSProp: "RMSProp",
  adam: "Adam",
  bfgs: "BFGS",
  newton: "Newton",
};

const plotTypes = {
  plot_1D: "plot_1D",
  contour_plot: "contour_plot",
};

// TODO add algo specific parameters
const algorithmsConfig = {
  [algorithmNames.gradientDescent]: {
    class: GradientDescent,
    parameters: [
      paramNames.objectiveFunction,
      paramNames.x_ini,
      paramNames.delta,
      paramNames.h,
      paramNames.nlim,
      paramNames.normLim,
    ]
  },
  [algorithmNames.gradientDescentWithMomentum]: {
    class: GradientDescentMomentum,
    parameters: [
      paramNames.objectiveFunction,
      paramNames.x_ini,
      paramNames.delta,
      paramNames.h,
      paramNames.momentum,
      paramNames.nlim,
      paramNames.normLim,
    ]
  },
  [algorithmNames.gradientDescentMomentumNesterov]: {
    class: GradientDescentMomentumNesterov,
    parameters: [
      paramNames.objectiveFunction,
      paramNames.x_ini,
      paramNames.delta,
      paramNames.h,
      paramNames.momentum,
      paramNames.nlim,
      paramNames.normLim,
    ]
  },
  [algorithmNames.RMSProp]: {
    class: RMSProp,
    parameters: [
      paramNames.objectiveFunction,
      paramNames.x_ini,
      paramNames.delta,
      paramNames.h,
      paramNames.rho,
      paramNames.epsilon,
      paramNames.nlim,
      paramNames.normLim,
    ]
  },
  [algorithmNames.adam]: {
    class: Adam,
    parameters: [
      paramNames.objectiveFunction,
      paramNames.x_ini,
      paramNames.delta,
      paramNames.h,
      paramNames.beta1,
      paramNames.beta2,
      paramNames.epsilon,
      paramNames.nlim,
      paramNames.normLim,
    ]
  },
  [algorithmNames.bfgs]: {
    class: BFGS,
    parameters: [
      paramNames.objectiveFunction,
      paramNames.x_ini,
      paramNames.delta,
      paramNames.h,
      paramNames.nlim,
      paramNames.normLim,
    ]
  },
  [algorithmNames.newton]: {
    class: DampedNewton,
    parameters: [
      paramNames.objectiveFunction,
      paramNames.x_ini,
      paramNames.delta,
      paramNames.h,
      paramNames.epsilon,
      paramNames.nlim,
      paramNames.normLim,
    ]
  },
};

const paramsConfig = {
  [paramNames.objectiveFunction]: {
    input_type: inputTypes.dropdown,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => ({ name: "square", value: x => x**2 }),
        domain: [
          { name: "square", value: x => x**2 },
          { name: "pow3", value: x => x**3 },
          { name: "sin3", value: x => -(1.4 -3 * x)*Math.sin(18 * x) }
        ],
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => ({ name: "square", value: ([x, y]) => x ** 2 + y ** 2 + (x + y) ** 2 }),
        domain: [
          { name: "square", value: ([x, y]) => x ** 2 + y ** 2 + (x + y) ** 2 },
          { name: "rosenbrock", value: ([x,y]) => (1-x)**2  + 100*(y - x**2)**2 + 1 },
        ],
      }
    },
  },
  [paramNames.algorithmName]: {
    input_type: inputTypes.dropdown,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => ({ name: algorithmNames.gradientDescent, value: algorithmsConfig[algorithmNames.gradientDescent].class }),
        domain: Object.values(algorithmNames).map(name => ({ name, value: algorithmsConfig[name].class })),
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => ({ name: algorithmNames.gradientDescent, value: algorithmsConfig[algorithmNames.gradientDescent].class }),
        domain: Object.values(algorithmNames).map(name => ({ name, value: algorithmsConfig[name].class })),
      }
    },
  },
  [paramNames.x_ini]: {
    input_type: inputTypes.click,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: (algorithm, objective) => ({ square: [1.5], pow3: [0.7], sin3: [1] }[objective]),
        // TODO implement domain validation
        domain: value => true,
      },
      [plotTypes.contour_plot]: {
        get_init_value: (algorithm, objective) => ({ square: [-30, 175], rosenbrock: [2.5, -1.5] }[objective]),
        domain: value => true,
      }
    },
  },
  [paramNames.h]: {
    input_type: inputTypes.text,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => 0.001,
        domain: value => value > 0,
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => 0.001,
        domain: value => value > 0,
      }
    },
  },
  [paramNames.delta]: {
    input_type: inputTypes.text,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: (algorithm, objective) => ({ square: 0.8, pow3: 0.1, sin3: 0.01 }[objective]),
        domain: value => value > 0,
      },
      [plotTypes.contour_plot]: {
        get_init_value: (algorithm, objective) => ({ square: 0.1, rosenbrock: 0.0001 }[objective]),
        domain: value => value > 0,
      }
    }
  },
  [paramNames.momentum]: {
    input_type: inputTypes.text,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => 0.9,
        domain: value => value > 0,
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => 0.9,
        domain: value => value > 0,
      }
    }
  },
  [paramNames.rho]: {
    input_type: inputTypes.text,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => 0.9,
        domain: value => value > 0,
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => 0.9,
        domain: value => value > 0,
      }
    }
  },
  [paramNames.epsilon]: {
    input_type: inputTypes.text,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => 0.0000001,
        domain: value => value > 0,
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => 0.0000001,
        domain: value => value > 0,
      }
    }
  },
  [paramNames.beta1]: {
    input_type: inputTypes.text,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => 0.9,
        domain: value => value > 0,
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => 0.9,
        domain: value => value > 0,
      }
    }
  },
  [paramNames.beta2]: {
    input_type: inputTypes.text,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => 0.999,
        domain: value => value > 0,
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => 0.999,
        domain: value => value > 0,
      }
    }
  },
  [paramNames.nlim]: {
    input_type: inputTypes.text,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => 60,
        domain: value => value > 0,
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => 60,
        domain: value => value > 0,
      }
    }
  },
  [paramNames.normLim]: {
    input_type: inputTypes.text,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => 0.1,
        domain: value => value > 0,
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => 0.1,
        domain: value => value > 0,
      }
    }
  },
  [paramNames.xDomain]: {
    input_type: null, // not implemented yet
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: (algorithm, objective) => ({ square: [-2,2], pow3: [-1,1], sin3: [0,1.2] }[objective]),
        domain: () => true,
      },
      [plotTypes.contour_plot]: {
        get_init_value: (algorithm, objective) => ({ square: [-200,200], rosenbrock: [-2,3] }[objective]),
        domain: () => true,
      }
    }
  },
  [paramNames.yDomain]: {
    input_type: null, // not implemented yet
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => null, // no-op in 1 dimension
        domain: () => false,
      },
      [plotTypes.contour_plot]: {
        get_init_value: (algorithm, objective) => ({ square: [-200,200], rosenbrock: [-2,3] }[objective]),
        domain: () => true,
      }
    }
  },
  [paramNames.threshold]: {
    input_type: null, // not implemented yet
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => null, // no-op in 1 dimension
        domain: () => false,
      },
      [plotTypes.contour_plot]: {
        get_init_value: () => [...Array(19).keys()].map(i => Math.pow(2, i + 1)),
        domain: () => true,
      }
    }
  },
  [paramNames.interpolation]: {
    input_type: inputTypes.dropdown,
    values: {
      [plotTypes.plot_1D]: {
        get_init_value: () => null, // no-op in 1 dimension
        domain: [],
      },
      [plotTypes.contour_plot]: {
        get_init_value: (algorithm, objective) => {
          const value = objective === "square" ? "interpolateMagma" : "interpolateYlGnBu";
          return ({ name: value, value });
        },
        domain: ["interpolateMagma", "interpolateYlGnBu"].map(value => ({ name: value, value })),
      }
    },
  },
};
