import React from 'react';
import Loadable from 'react-loadable';

const Loading = props => <div>loading ...</div>;
const LazyLoad = loader => Loadable({
    loader,
    loading: Loading
});

export default LazyLoad;
