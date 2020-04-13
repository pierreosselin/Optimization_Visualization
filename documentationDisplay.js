function documentationFactory(objFunction, algName) {
  let div = d3.select("#documentation").html("");
  div.append("p").text(objFunction);
  let formulaP = div.append("p");
  let text = formulaP.append("foreignObject").attr("width",100).attr("height",100)
  text.text("$$ x = \\sum_{i \\in A} i^{2} $$")
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}
