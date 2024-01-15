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
      children: children.map((child) => {
        console.log("child", child);
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
};

let root = null;
// v4 动态创建节点
const render = (el, container) => {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
  root = nextWorkOfUnit;
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

  if (!nextWorkOfUnit && root) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
};

const commitRoot = () => {
  commitWork(root.child);
  root = null;
};

const commitWork = (fiber) => {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
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

const handleChildren = (fiber, children) => {
  // const children = fiber.props.children;
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

const updateFuncionComponent = (fiber) => {
  const children = [fiber.type(fiber.props)];
  handleChildren(fiber, children);
};
const updateMainComponent = (fiber) => {
  const children = fiber.props.children;
  handleChildren(fiber, children);
};

const performWorkOfUnit = (fiber) => {
  const isFunctionComponent = typeof fiber.type === "function";
  if (!isFunctionComponent) {
    // console.log(fiber.type());
    if (!fiber.dom) {
      // 1. 创建dom
      const dom = (fiber.dom = createDom(fiber.type));

      // 2. 处理props
      updateProps(fiber.props, dom);
    }
  }

  // 3. 处理链表,设置指针
  if(isFunctionComponent){
    updateFuncionComponent(fiber)
  }else{
    updateMainComponent(fiber)
  }
  // const children = isFunctionComponent
  //   ? [fiber.type(fiber.props)]
  //   : fiber.props.children;
  // handleChildren(fiber, children);

  // 4. 返回下一个对象
  if (fiber.child) {
    return fiber.child;
  }
  // if (fiber.sibling) {
  //   return fiber.sibling;
  // }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
  // return fiber.parent?.sibling;
};

const React = {
  render,
  createElement,
};
export default React;
