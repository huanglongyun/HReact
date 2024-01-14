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

const performWorkOfUnit = (work) => {
  if (!work.dom) {
    // 1. 创建dom
    const dom =
      work.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(work.type);

    work.dom = dom;
    work.parent.dom.append(dom);
    // 2. 处理props
    Object.keys(work.props).forEach((key) => {
      if (key !== "children") {
        dom[key] = work.props[key];
      }
    });
  }
  // 3. 处理链表,设置指针
  const children = work.props.children;
  let prvChild = null;
  children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      child: null,
      parent: work,
      sibling: null,
      dom: null,
    };
    // 第一个元素，child就是自己
    if (index === 0) {
      work.child = newWork;
    } else {
      // 不是第一个，那就是上一个的兄弟
      prvChild.sibling = newWork;
    }
    prvChild = newWork;
  });

  // 4. 返回下一个对象
  if (work.child) {
    return work.child;
  }
  if (work.sibling) {
    return work.sibling;
  }
  return work.parent?.sibling;
};

const React = {
  render,
  createElement,
};
export default React;
