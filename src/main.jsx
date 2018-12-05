import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

ReactDOM.render(<App/>, document.getElementById('root'));

if (module.hot) { // 开启热替换
    // accept方法中写文件路径 热替换没反应
    module.hot.accept(App); // App 下的组件都会被监听到
}
