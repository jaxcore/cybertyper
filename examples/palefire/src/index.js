import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import PaleFireApp from './PaleFireApp';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<PaleFireApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
