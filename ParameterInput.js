class ParameterInput {
  constructor(label, domain, onValueChanged, containerId) {
    this.domain = domain;
    this.onValueChanged = onValueChanged;

    this.container = d3.select(containerId)
      .append('div')
      .attr("class", "buttonContainer");

    this.label = this.container
      .append('label');
    this.label.node().innerHTML = label;
  }
}

class DropdownParameterInput extends ParameterInput {
  constructor(label, initialValue, domain, onValueChanged, containerId) {
    super(label, domain, onValueChanged, containerId);
    this.dropdown = this.container.append('select');

    this.options = this.dropdown.selectAll("option")
      .data(domain)
      .enter()
      .append("option")
      .text(function ({ name }) { return name; })
      .attr("value", function ({ name }) { return name; });

    this.options.property("selected", function({name}){return name === initialValue.name});

    this.dropdown.on("change", () => {
      const selectedOption = this.dropdown.property("value");
      this.onValueChanged(domain.find(({ name }) => name === selectedOption));
    });
  }
}

class TextParameterInput extends ParameterInput {
  constructor(label, initialValue, domain, onValueChanged, containerId) {
    super(label, domain, onValueChanged, containerId);
    this.input = this.container
      .append('input')
      .attr("type", "number")
      .attr("value", initialValue)
      .attr("step", 0.1);

    this.input.on("change", () => {
      const value = this.input.property("value");
      this.onValueChanged(value);
    });
  }
}

class ClickParameterInput extends ParameterInput {
  constructor(label, initialValue, domain, onValueChanged, containerId) {
    super(label, domain, onValueChanged, containerId);
  }
}

function parameterInputFactory(label, inputType, initialValue, domain, onValueChanged, containerId) {
  if (!Object.values(inputTypes).includes(inputType)) {
    throw new Error(`Invalid input type "${inputType}" supplied to input factory.`)
  }

  if (inputType === inputTypes.dropdown) {
    return new DropdownParameterInput(label, initialValue, domain, onValueChanged, containerId);
  }

  if (inputType === inputTypes.text) {
    return new TextParameterInput(label, initialValue, domain, onValueChanged, containerId);
  }

  // TODO, implement class ClickParameterInput and delete test_graph_plot.js and test_contour_plot.js
  return;
}
