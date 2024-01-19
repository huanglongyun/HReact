# mini-react
## 实现最简mini-react
### 实现最简mini-react
### 使用jsx
## 任务调度器&fiber架构
### 实现任务调度器
上节说到当dom树非常大时，渲染会出现卡顿，原因是浏览器中js是单线程，当任务很多时会阻塞页面渲染。
解决方案是将一个大任务拆分成多个小任务，分批次进行解析。

1. 在什么时候执行任务
 Window.requestIdleCallback()可以插入一个回调函数，这个回调函数在浏览器空闲时期被调用，这样就不会影响延迟事件。
回调函数会接收到一个名为 IdleDeadline 的参数，
其中的IdleDeadline.timeRemaining() 返回当前闲置周期的预估剩余毫秒数。可以判断目前是否有足够的时间来执行更多的任务。

这样在足够的时间内操作dom，当时间不够时，就跳出操作，在此使用requestIdleCallback，再下一个空闲时期继续执行。

给这个过程取名 任务调度器。

### 实现fiber架构
2. 如何控制dom树渲染
如何控制在第一空闲渲染a，下一个空闲期渲染b。如何依次渲染呢

开启上帝视角，可以选择链表(知其名，不甚了解)
规则是：依次顺序
1. 孩子
2. 兄弟
3. 叔叔(父亲的兄弟)

实现过程：边处理链表 边渲染任务。

写一个方法处理：创建dom，处理props，处理链表，返回下一个任务。


现在实现的是在浏览器空闲时间渲染的，如果渲染了部分内容，后续一段时间没有空闲时间，等到有空闲时间才会继续渲染。这样用户就会要花费一定的时间才能考到全部内容，要怎么解决？
超过一定时间没有空闲时间的话就强制渲染？

### 统一提交
中途有可能没有剩余时间，用户会看到渲染到一半的dom,需要怎么处理？

可以等处理好全部任务后再统一添加到页面，需要注意两点：
1.在什么时候处理添加任务=> 当所有节点都处理完后
2.根节点是哪个 => 第一处理的节点

### 实现 function component
把function当做一个箱子，做一个开箱的过程，把箱子内的东西拿出来

要处理事function时的情况，
判断是funtion，不用创建dom
function没有dom，需要向上寻找dom

嵌套function
需要一直循环向上寻找dom,

现在可以把App.jsx换成function component ,在main.jsx中可以使用render(<App />),真正和react对齐。
在这里需要引入React.js

props
需要处理props中number的值

多个组件传值
需要找父级的兄弟节点

重构很高级

### diff更新children
将旧的删除，新的添加上
将要删除的收集起来，统一提交时删除
处理删除的是一个function的情况，往上找父亲

### 删除多余的老节点
1. 一个多余节点
链表遍历的新的节点，旧的后边的节点就没有对比到，最后一个旧节点就是多余的节点，将其添加到删除集合删除。

2. 多个多余节点
通过while循环一直获取多余节点，将其添加到删除集合，把并且将旧节点赋值成其兄弟节点

### edge case
1. {show && bar} 在最后
调试发现child是false，调整一下只有child的true时才添加 newFiber
2. {show && bar} 在前面
当节点是false，不要赋值给prevchild

### 只更新修改的节点
找到更新节点的开始和结束点
开始点：当前更新的节点
结束点：下一个任务为其兄弟节点，将下一个任务赋值undefined，结束任务


### 实现useState
实现 const [count,setCount]=useState(10)
1. 存储值
2. 函数
更新

将值存储在节点上，等更新时对比，有值就使用该值，没有，就是初始化的值
多个
将其收集在一个集合中，通过下标获取是哪一个 并操作它
为什么在function compont中重置？


老的值存在哪里

批量执行action
react不为了频繁渲染，将action收集起来，在合适的时期渲染
将action收集起来，遍历渲染，完成后要清空集合

将action中传入的字符串处理成函数形式，