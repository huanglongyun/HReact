// v0
// document.querySelector("#root").innerHTML="<h1>hello world!</h1>";

// v1
// const h1dom=document.createElement("h1");
// h1dom.id="title";
// const rootdom=document.querySelector("#root");
// rootdom.appendChild(h1dom);

// const textNode=document.createTextNode("")
// textNode.textContent="hello world!";
// h1dom.appendChild(textNode);

// v2
// react ：vdom渲染，一个js对象 type props children
const textEl = {
  type: "TEXT_ELEMENT",
  props: {
    nodeValue: "hello world!",
    children: [],
  },
};
const el = {
  type: "h1",
  props: {
    id: "title",
    children: [textEl],
  },
};

const h1dom = document.createElement(el.type);
h1dom.id = el.props.id;
const rootdom = document.querySelector("#root");
rootdom.appendChild(h1dom);

const textNode = document.createTextNode("");
textNode.textContent = textEl.props.nodeValue;
h1dom.appendChild(textNode);




