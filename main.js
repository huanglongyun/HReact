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

// const textEl = createTextNode("hello world!");
// const App = createElement("h1", { id: "title" }, textEl);
// console.log("app", App);

// const h1dom = document.createElement(App.type);
// h1dom.id = App.props.id;
// const rootdom = document.querySelector("#root");
// rootdom.appendChild(h1dom);

// const textNode = document.createTextNode("");
// textNode.textContent = textEl.props.nodeValue;
// h1dom.appendChild(textNode);

// v4 动态创建节点
const render = (el, container) => {
  // 1. 创建元素
  const dom =
    el.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(el.type);

  //   2. 添加出children的props
  Object.keys(el.props).forEach((key) => {
    if (key !== "children") {
      dom[key] = el.props[key];
    }
  });

  //   4.添加children节点
  el.props.children.forEach((child) => {
    render(child, dom);
  });

  //   3. 添加到父节点
  container.appendChild(dom);
};

// 测试
const textEl = createTextNode("hello world!");
const App = createElement("h1", { id: "title" }, textEl);
render(App, document.querySelector("#root"));
