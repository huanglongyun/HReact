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
  // const foo = <div>foo</div>;
  // function Foo(){
  //   return (<div>foo</div>)
  // }
  const foo=(<div>
    foo 
    <div>child1</div>
    <div>child2</div>
  </div>)
  const bar = <div>bar</div>;

  function toggle() {
    showBar = !showBar;
    React.update();
  }

  return (
    <div>
      <h1>show foo or bar</h1>
      <button onClick={toggle}>toggle</button>
      <div> {showBar ? bar : foo}</div>
    </div>
  );
}
function App() {
  function click() {
    React.update();
  }
  return (
    <div>
      {/* <h1>hello world!</h1> */}
      <UpadteChildren />
    </div>
  );
}
export default App;
