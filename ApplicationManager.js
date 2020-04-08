/**
 * Manages application state and updates parameter buttons and plot as needed.
 */
class ApplicationManager {
  constructor(plot) {
    this.plot = plot;

    const plotType = plot.getType();
    const { name: initialAlgoName } =
      paramsConfig[paramNames.algorithmName]
        .values[plotType]
        .get_init_value();
    const { name: initialObjectiveName, value: initialObjective } =
      paramsConfig[paramNames.objectiveFunction]
        .values[plotType]
        .get_init_value();
    this.objectiveFunction = {
      name: initialObjectiveName,
      value: initialObjective
    };

    this.algoParams = this.get_Initialized_Params(initialAlgoName);
    this.resetAlgo(algoName);

    this.algoDropdown = parameterInputFactory(
      paramNames.algorithmName,
      inputTypes.dropdown,
      paramsConfig[paramNames.algorithmName].values[this.plot.getType()].get_init_value(),
      paramsConfig[paramNames.algorithmName].values[this.plot.getType()].domain,
      algo => this.setParam(paramNames.algorithmName, algo),
      "#algoButtonSpace"
    );

    this.paramButtons = {};
    this.resetParametersButtons();

    this.plotFunctionAndAxis();
    this.plotAlgoResults();
  }



  get_Initialized_Params(algoName) {
    let initializedParam = algorithmsConfig[algoName].parameters.reduce(
      (params, paramName) => {
        if (paramName === paramNames.objectiveFunction) {
          return {
            ...params,
            [paramName]: this.objectiveFunction.value,
          }
        }

        const config = paramsConfig[paramName];
        let initialValue = config.values[this.plot.getType()].get_init_value(algoName, this.objectiveFunction.name);
        if (config.input_type === inputTypes.dropdown) {
          initialValue = initialValue.value;
        }

        return {
          ...params,
          [paramName]: initialValue,
        }
      },
      {}
    );
    return {...initializedParam}
  }

  changeParamsAlgorithms(algoName) {
    let new_algoParams = this.get_Initialized_Params(algoName);
    for (let key in new_algoParams) {
      if (key in this.algoParams){
        if (!(key === paramNames.objectiveFunction || key === paramNames.algorithmName)){
          new_algoParams[key] = this.algoParams[key]
        }
      }
    };
    this.algoParams = {...new_algoParams};
    this.resetAlgo(algoName);
  }

  resetAlgo(algoName) {
    this.algo = new (algorithmsConfig[algoName].class)(this.algoParams);
    this.algo.optimize();
  }

  plotFunctionAndAxis() {
    this.plot.clearAll();

    if (this.plot.getType() === plotTypes.plot_1D) {
      this.plot.draw(this.algoParams[paramNames.objectiveFunction], 4);
    }

    if (this.plot.getType() === plotTypes.contour_plot) {
      const thresholds = paramsConfig[paramNames.threshold].values[this.plot.getType()].get_init_value();
      const interpolation = paramsConfig[paramNames.interpolation].values[this.plot.getType()]
        .get_init_value(null, this.objectiveFunction.name).value;
      this.plot.draw(this.algoParams[paramNames.objectiveFunction], 4, thresholds, d3[interpolation])
    }

    this.plot.addAxis();
  }

  plotAlgoResults() {
    this.plot.clearLines();

    if (this.plot.getType() === plotTypes.plot_1D) {
      this.plot.addLine(this.algo.getPath().map(index => [index[0], this.algoParams[paramNames.objectiveFunction](index)]));
    }

    if (this.plot.getType() === plotTypes.contour_plot) {
      this.plot.addLine(this.algo.getPath());
    }
  }

  setParam(paramName, value) {
    if (!Object.values(paramNames).includes(paramName)) {
      throw new Error("Invalid parameter name");
    }

    if (paramName === paramNames.algorithmName) {
      this.changeParamsAlgorithms(value.name, this.objectiveFunction.name, this.objectiveFunction.value);
      this.resetParametersButtons();

      this.plotAlgoResults();

      return;
    }

    if (paramName === paramNames.objectiveFunction) {
      this.algoParams[paramNames.objectiveFunction] = value;
      this.objectiveFunction = value;
      this.algoParams = this.get_Initialized_Params(this.algo.getName());
      this.resetAlgo(this.algo.getName());

      const xDomain = paramsConfig[paramNames.xDomain].values[this.plot.getType()]
        .get_init_value(null, this.objectiveFunction.name);
      const yDomain = paramsConfig[paramNames.yDomain].values[this.plot.getType()]
        .get_init_value(null, this.objectiveFunction.name);
      this.plot.setXDomain(xDomain);
      this.plot.setYDomain(yDomain);

      this.plotFunctionAndAxis();
      this.plotAlgoResults();
      this.resetParametersButtons();
      return;
    }

    if (paramsConfig[paramName].input_type === inputTypes.dropdown) {
      this.algoParams[paramName] = value.value;
    } else {
      this.algoParams[paramName] = value;
    }
    this.resetAlgo(this.algo.getName());
    this.plotAlgoResults();
  }

  resetParametersButtons() {
    d3.select("#algoParamsButtonSpace").selectAll("*").remove();
    algorithmsConfig[this.algo.getName()].parameters.forEach(param => {
      const { input_type: inputType } = paramsConfig[param];
      const { domain, get_init_value: getInitValue } = paramsConfig[param].values[this.plot.getType()];
      let initValue;
      if (param === paramNames.objectiveFunction) {
        initValue = this.objectiveFunction;
      } else {
        initValue = this.algoParams[param];
      }
      const onValueChanged = value => this.setParam(param, value);
      this.paramButtons[param] = parameterInputFactory(param, inputType, initValue, domain, onValueChanged, "#algoParamsButtonSpace")
    })
  }
}
