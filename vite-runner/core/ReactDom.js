import React from './React.js';

// v6 写出形如下面的形式
// ReactDOM.createRoot(document.getElementById('root')!).render(<App />)

const ReactDOM = {
  createRoot(container) {
    return {
      render(App) {
        React.render(App, container);
      },
    };
  },
};

// 导出
export default ReactDOM