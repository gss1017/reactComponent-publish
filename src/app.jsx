import React from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import Loadable from 'react-loadable';
import Test from './components/Test';
import style from './index.css';

const Loading = () => <div>Loading...</div>;
const A = Loadable({
    loader: () => import('./pages/a'),
    loading: Loading
});
const B = Loadable({
    loader: () => import('./pages/b'),
    loading: Loading
});
const C = Loadable({
    loader: () => import('./pages/c'),
    loading: Loading
});

class App extends React.Component {

    componentDidMount() {
        // document.onclick = () => {
        //     // 按需加载
        //     import(/* webpackChunkName: "a" */'./pages/a');
        // };
    }

    render() {
        return (
            <div className={style.bg}>
                <Router>
                    <div>
                        <Route path="/a" component={A}/>
                        <Route path="/b" component={B}/>
                        <Route path="/b/c" component={C}/>
                        <Link to="/a">to A</Link>
                        <br/>
                        <Link to="/b">to B</Link>
                    </div>
                </Router>
                <h1 className={style.test}>
                    Hello React!
                    <span className={style.color}>
                        你好
                    </span>
                    <Test/>
                </h1>
            </div>
        );
    }

}

export default App;
