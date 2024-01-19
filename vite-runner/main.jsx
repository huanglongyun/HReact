import React from './core/React.js';
import ReactDOM from './core/ReactDom.js';
import App from './App.jsx';

// ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
// 还不能向上面使用 App /> 的形式
// 因还未支持function component
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
