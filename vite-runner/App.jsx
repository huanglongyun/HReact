import React from "./core/React.js";

// const App = React.createElement("h1", { id: "title" }, "hello world!");
// const AppTest=()=>{
// 	return <h1>hello world!</h1>
// }
// console.log('AppTest',AppTest);

function Counter({num}){
	return (<div>counter: {num}</div>)
}
function Show(){
	return <Counter></Counter>
}

function App(){
	return (<div>
		<h1>hello world!</h1>
		<Counter num={11}></Counter>
		<Counter num={12}></Counter>
	</div>)
}
// const App=<div>
// 	<h1>hello world!</h1>
// 	<Show />
// </div>
 //why?
export default App;

// 思考dom非常强大 render会出现什么情况
// 浏览器会卡顿
