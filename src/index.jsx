import React from 'react';
import ReactDOM from 'react-dom';

class Index extends React.Component {

    render() {
        console.log(1);
        return (
            <div>

                <h1>
                    Hello React!
                    <span>
                    你好
                    </span>
                </h1>
            </div>
        );
    }

}

ReactDOM.render(<Index/>, document.getElementById('root'));
