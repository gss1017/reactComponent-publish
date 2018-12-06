import React from 'react';
import Test from './components/Test';
import style from './index.css';

class App extends React.Component {

    componentDidMount() {
        document.onclick = () => {
            import('./a.js');
        };
    }

    render() {
        return (
            <div className={style.bg}>
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
