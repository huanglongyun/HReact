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
// const textEl = {
//   type: "TEXT_ELEMENT",
//   props: {
//     nodeValue: "hello world!",
//     children: [],
//   },
// };
// const el = {
//   type: "h1",
//   props: {
//     id: "title",
//     children: [textEl],
//   },
// };

// const h1dom = document.createElement(el.type);
// h1dom.id = el.props.id;
// const rootdom = document.querySelector("#root");
// rootdom.appendChild(h1dom);

// const textNode = document.createTextNode("");
// textNode.textContent = textEl.props.nodeValue;
// h1dom.appendChild(textNode);

// v3 动态创建vdom
const createTextNode = (text) => {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
};

const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
};

const textEl = createTextNode("hello world!");
const App = createElement("h1", { id: "title" }, textEl);
console.log("app", App);

const h1dom = document.createElement(App.type);
h1dom.id = App.props.id;
const rootdom = document.querySelector("#root");
rootdom.appendChild(h1dom);

const textNode = document.createTextNode("");
textNode.textContent = textEl.props.nodeValue;
h1dom.appendChild(textNode);
