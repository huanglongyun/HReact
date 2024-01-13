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
      children: children.map((child) =>
        typeof child === "string" ? createTextNode(child) : child
      ),
    },
  };
};

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

const React = {
  render,
  createElement,
};
export default React