// v0
// document.querySelector("#root").innerHTML="<h1>hello world!</h1>";

// v1
const h1dom=document.createElement("h1");
h1dom.id="title";
const rootdom=document.querySelector("#root");
rootdom.appendChild(h1dom);

const textNode=document.createTextNode("")
textNode.textContent="hello world!";
h1dom.appendChild(textNode);


