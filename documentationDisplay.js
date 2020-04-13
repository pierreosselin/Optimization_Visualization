function documentationFactory() {
  let div = getElementById("#documentation");
  while(div.firstChild){
    div.removeChild(div.firstChild);
  }
}
