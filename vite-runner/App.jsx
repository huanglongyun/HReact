import React from "./core/React.js";

function Counter({ num }) {
  return <div>counter: {num}</div>;
}

function App() {
  const [count, setCount] = React.useState(10);
  const [bar, setBar] = React.useState("bar");
  function add() {
    setCount((c) => c + 1);
  }
  function addStr() {
    setBar((s) => s + "bar");
  }

  React.useEffect(() => {
    console.log("init effect");
    return ()=>{
      console.log('cleanup 0');
    }
  }, []);

  React.useEffect(() => {
    console.log("update effect", count);
    // console.log("update effect", bar);
    return ()=>{
      console.log('cleanup 1');
    }
  }, [count]);

  React.useEffect(()=>{
        console.log("update effect", count);
    return ()=>{
      console.log('cleanup 2');
    }
  },[count])
  return (
    <div>
      <h1>hello world!</h1>
      <div>count:{count}</div>
      <div>bar:{bar}</div>
      <button onClick={add}>add</button>
      <button onClick={addStr}>addStr</button>
    </div>
  );
}
export default App;
