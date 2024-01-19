import React from "./core/React.js";

function Counter({ num }) {
  return <div>counter: {num}</div>;
}

function App() {
  const [count, setCount] = React.useState(10);
  const [bar, setBar] = React.useState("bar");
  function add() {
    setCount((c) => c + 1);
    setBar((s) => s + "bar");
  }
  return (
    <div>
      <h1>hello world!</h1>
      <div>count:{count}</div>
      <div>bar:{bar}</div>
      <button onClick={add}>add</button>
    </div>
  );
}
export default App;
