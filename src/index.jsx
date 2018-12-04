import React from 'react';
import ReactDOM from 'react-dom';
import style from './index.css';

class Index extends React.Component {

    render() {
        console.log(1);
        return (
            <div className={style.bg}>
                <h1>
                    Hello React!
                    <span className={style.color}>
                        你好
                    </span>
                </h1>
            </div>
        );
    }

}

ReactDOM.render(<Index/>, document.getElementById('root'));
