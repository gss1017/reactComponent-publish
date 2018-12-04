import React from 'react';
import ReactDOM from 'react-dom';
import Test from './components/Test';
import style from './index.css';

class Index extends React.Component {

    render() {
        console.log(1);
        return (
            <div className={style.bg}>
                <h1 className={style.test}>
                    Hello React!
                    <span className={style.color}>
                        你好 dd
                    </span>
                    <Test/>
                </h1>
            </div>
        );
    }

}

ReactDOM.render(<Index/>, document.getElementById('root'));
