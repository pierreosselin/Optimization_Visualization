function documentationFactory(objFunction, algName) {
  let div = d3.select("#documentation").html("");
  div.insert("p").text(objFunction);
  div.insert("p").text("$$x_{k} = x_{k} - \alpha_{k} \nabla_{x} f(x_{k})$$");
}
