import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router } from 'react-router-dom';

import { reducers } from "./store/reducers";
import { createStore } from "redux";
import { Provider, Store } from 'react-redux';
import AppContainer from './containers/app-container';
import { WebMidiWrapper } from "./api/midi";
import './styles/main.scss';

const store: Store<any> = createStore(
    reducers,
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // t
);
WebMidiWrapper.init(() => {
    ReactDOM.render(
        <Provider store={store}>
            <Router>
                <AppContainer></AppContainer>
            </Router>
        </Provider>,
        document.getElementById('app-container')
    );
});



// if (module.hot) {
//     module.hot.accept('./app', () => {
//         console.log('doing a app hot accept')
//         const NextApp = require('./app').default
//         ReactDOM.render(
//             <AppContainer>
//                 <NextApp />
//             </AppContainer>,
//             document.getElementById('root')
//         );
//     });
// }