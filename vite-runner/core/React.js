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
        // console.log("child", child);
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
};

let root = null;
let currentRoot = null;
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

const update = () => {
  nextWorkOfUnit = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot,
  };
  // console.log("nextWorkOfUnit", nextWorkOfUnit);
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
  currentRoot = root;
  root = null;
};

const commitWork = (fiber) => {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.effectTag === "update") {
    // console.log('update',fiber);
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === "placement") {
    // console.log('placement',fiber);
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
  // Object.keys(props).forEach((key) => {
  //   if (key !== "children") {
  //     if (key.startsWith("on")) {
  //       const eventType = key.slice(2).toLowerCase();
  //       dom.addEventListener(eventType, props[key]);
  //     } else {
  //       dom[key] = props[key];
  //     }
  //   }
  // });
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
          dom.removeEventListener(eventType, prevProps[key])
          dom.addEventListener(eventType, nextProps[key]);
        } else {
          dom[key] = nextProps[key];
        }
      }
    }
  });
};

const handleChildren = (fiber, children) => {
  // console.log("fiber", fiber);
  // const children = fiber.props.children;
  let prvChild = null;
  let oldFiber = fiber.alternate?.child;
  // console.log('oldFiber',oldFiber);
  children.forEach((child, index) => {
    // console.log('child==>',child);
    const isSameType = oldFiber && oldFiber.type === child.type;
    // console.log("isSameType", isSameType,oldFiber);
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
    // console.log("newFiber", newFiber);
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
    // console.log('index',index,oldFiber);


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
  // console.log('com',fiber);
  const children = [fiber.type(fiber.props)];
  handleChildren(fiber, children);
};
const updateMainComponent = (fiber) => {
  const children = fiber.props.children;
    // console.log('main',fiber,children);
  handleChildren(fiber, children);
};

const performWorkOfUnit = (fiber) => {
  const isFunctionComponent = typeof fiber.type === "function";
  if(isFunctionComponent){
        console.log(fiber);
  }
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
  update,
  createElement,
};
export default React;
