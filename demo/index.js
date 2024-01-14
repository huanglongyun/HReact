console.log("index");
let taskId = 1;
const workLoop = (IdleDeadline) => {
  taskId++;
  let shouldYield = false;
  while (!shouldYield) {
    // run task
	// 在这里处理dom，
    console.log(taskId);
    // 终止条件 当剩余时间<1，跳出循环 执行下一个requestIdleCallback
    shouldYield = IdleDeadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
};
requestIdleCallback(workLoop);
