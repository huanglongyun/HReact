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
  function Foo(){
    return (<div>foo</div>)
  }
  const bar = <p>bar</p>;

  function toggle() {
    showBar = !showBar;
    React.update();
  }

  return (
    <div>
      <h1>show foo or bar</h1>
      <div> {showBar ? bar : <Foo/>}</div>
      <button onClick={toggle}>toggle</button>
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
