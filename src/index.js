import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import * as serviceWorker from './serviceWorker';

import './index.css';

import store from './game/store';
import "./assets/fonts/zombie.ttf";
import "./assets/fonts/Creepster-Regular.ttf";

import { logGameStart } from "./firebase-events";

// if (process.env.NODE_ENV !== 'production') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render');
//   whyDidYouRender(React, {
//     collapseGroups  : true,
//     include: [/.*/],
//     // exclude: [/^Link/, /^Route/, /^BrowserRouter/],
//   });
// }

logGameStart();

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
