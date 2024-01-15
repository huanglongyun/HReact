console.log("使用了React");
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
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
  // // 1. 创建元素
  // const dom =
  //   el.type === "TEXT_ELEMENT"
  //     ? document.createTextNode("")
  //     : document.createElement(el.type);

  // //   2. 添加出children的props
  // Object.keys(el.props).forEach((key) => {
  //   if (key !== "children") {
  //     dom[key] = el.props[key];
  //   }
  // });

  // //   4.添加children节点
  // el.props.children.forEach((child) => {
  //   render(child, dom);
  // });

  // //   3. 添加到父节点
  // container.appendChild(dom);
};

let nextWorkOfUnit = null;
// 任务调度器
const workLoop = (IdleDeadline) => {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    // run task
    // 在这里处理dom
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    // 终止条件 当剩余时间<1，跳出循环 执行下一个requestIdleCallback
    shouldYield = IdleDeadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
};
requestIdleCallback(workLoop);

const createDom = (type) => {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
};

const updateProps = (props, dom) => {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
};

const handleChildren = (fiber) => {
  const children = fiber.props.children;
  let prvChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };
    // 第一个元素，child就是自己
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      // 不是第一个，那就是上一个的兄弟
      prvChild.sibling = newFiber;
    }
    prvChild = newFiber;
  });
};

const performWorkOfUnit = (fiber) => {
  if (!fiber.dom) {
    // 1. 创建dom
    const dom = (fiber.dom = createDom(fiber.type));
    fiber.parent.dom.append(dom);

    // 2. 处理props
    updateProps(fiber.props, dom);
  }
  // 3. 处理链表,设置指针
  handleChildren(fiber);

  // 4. 返回下一个对象
  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }
  return fiber.parent?.sibling;
};

const React = {
  render,
  createElement,
};
export default React;
