import React from 'react';
import {Link} from 'react-router-dom';

export default function () {
    return (
        <div>
            <div>
                这里是B
            </div>
            <div>
                <Link to="/b/c">to C</Link>
            </div>
        </div>
    );
}
