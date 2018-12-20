import React from 'react';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import Loadable from 'react-loadable';
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
const D = Loadable({
    loader: () => import('./pages/d'),
    loading: Loading
});
const P404 = Loadable({
    loader: () => import('./pages/404'),
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
                    <div className={style.pageContainer}>
                        <div style={{float: 'left'}}>
                            <Link to="/">to A</Link>
                            <br/>
                            <Link to="/b">to B</Link>
                        </div>
                        <div style={{float: 'left', marginLeft: '200px'}}>
                            <h1 className={style.test}>
                                Hello React!
                                <span className={style.color}>
                                    你好
                                </span>
                            </h1>
                            <div>
                                <Route path="/" component={D}/>
                                <Switch>
                                    <Route path="/" exact={true} component={A}/>
                                    <Route path="/b/c" component={C}/>
                                    <Route path="/b" exact={true} component={B}/>
                                    <Route path="/not fount" component={P404}/>
                                </Switch>
                            </div>
                        </div>
                    </div>
                </Router>
            </div>
        );
    }

}

export default App;
