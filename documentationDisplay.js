function documentationFactory() {
  let div = d3.select("#documentation").html("");
  div.insert("p").text("First paragraph");
  div.insert("div").attr("lang", "latex").text("x_{k+1} = x_{k} - \\alpha_{k} \\nabla_{x}f(x_{k})");
}
