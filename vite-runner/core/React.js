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
        // console.log("child", child);
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
};

// work inprogress
let wipRoot = null;
let currentRoot = null;
// v4 动态创建节点
const render = (el, container) => {
  wipRoot = {
    dom: container,
    props: {
      children: [el],
    },
  };
  nextWorkOfUnit = wipRoot;
};

const update = () => {
  wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot,
  };
  nextWorkOfUnit = wipRoot;
};

let nextWorkOfUnit = null;
// 任务调度器
const workLoop = (IdleDeadline) => {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    // 在这里处理dom
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    // 终止条件 当剩余时间<1，跳出循环 执行下一个requestIdleCallback
    shouldYield = IdleDeadline.timeRemaining() < 1;
  }

  if (!nextWorkOfUnit && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
};

const commitRoot = () => {
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
};

const commitWork = (fiber) => {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom);
    }
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

const updateProps = (dom, nextProps, prevProps) => {
  // 1. 旧的有，新的没有 删除
  Object.keys(prevProps).forEach((key) => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  });
  // 2. 旧的有，新的有   更新
  // 3. 旧的没有，新的有 添加
  Object.keys(nextProps).forEach((key) => {
    if (key !== "children") {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith("on")) {
          const eventType = key.slice(2).toLowerCase();
          dom.removeEventListener(eventType, prevProps[key]);
          dom.addEventListener(eventType, nextProps[key]);
        } else {
          dom[key] = nextProps[key];
        }
      }
    }
  });
};

const reconcileChildren = (fiber, children) => {
  let prvChild = null;
  let oldFiber = fiber.alternate?.child;
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type;
    let newFiber;
    if (isSameType) {
      // update
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: "update",
        alternate: oldFiber,
      };
    } else {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: null,
        effectTag: "placement",
      };
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

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
  reconcileChildren(fiber, children);
};
const updateMainComponent = (fiber) => {
  const children = fiber.props.children;
  reconcileChildren(fiber, children);
};

const performWorkOfUnit = (fiber) => {
  const isFunctionComponent = typeof fiber.type === "function";

  if (!isFunctionComponent) {
    if (!fiber.dom) {
      // 1. 创建dom
      const dom = (fiber.dom = createDom(fiber.type));

      // 2. 处理props
      updateProps(dom, fiber.props, {});
    }
  }

  // 3. 处理链表,设置指针
  if (isFunctionComponent) {
    updateFuncionComponent(fiber);
  } else {
    updateMainComponent(fiber);
  }

  // 4. 返回下一个对象
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
};

const React = {
  render,
  update,
  createElement,
};
export default React;
