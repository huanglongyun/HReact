import React from "./core/React.js";

// const App = React.createElement("h1", { id: "title" }, "hello world!");
// const AppTest=()=>{
// 	return <h1>hello world!</h1>
// }
// console.log('AppTest',AppTest);

function Counter({ num }) {
  return <div>counter: {num}</div>;
}
function Show() {
  return <Counter></Counter>;
}

let showBar = false;
function UpadteChildren() {
  const bar = <div>bar</div>;

  function toggle() {
    showBar = !showBar;
    React.update();
  }

  return (
    <div>
      <h1>show foo or bar</h1>
      {showBar && bar}
      <button onClick={toggle}>toggle</button>
    </div>
  );
}

let countFoo = 1;
function Foo() {
  console.log("foo");
  const update = React.update();
  function click() {
    countFoo++;
    update();
  }
  return (
    <div>
      <h1>Foo</h1>
      {countFoo}
      <button onClick={click}>click</button>
    </div>
  );
}

let countBar = 1;
function Bar() {
  console.log("bar");
  const update = React.update();
  function click() {
    countBar++;
    update();
  }
  return (
    <div>
      <h1>Bar</h1>
      {countBar}
      <button onClick={click}>click</button>
    </div>
  );
}

let countRoot = 1;
function App() {
  console.log("root");
  const update = React.update();
  function click() {
    countRoot++;
    update();
  }
  return (
    <div>
      <h1>root</h1>
      {countRoot}
      <button onClick={click}>click</button>
      <Foo />
      <Bar />
    </div>
  );
}
export default App;
