import * as React from "react";
import * as ReactDOM from "react-dom";
import { reducers } from "./store/reducers";
import { createStore } from "redux";
import { Provider, Store } from 'react-redux';
import AppContainer from './containers/app-container';
import { WebMidiWrapper } from "./api/midi";

const store: Store<any> = createStore(reducers);
WebMidiWrapper.init(() => {
    ReactDOM.render(
        <Provider store={store}>
            <AppContainer></AppContainer>
        </Provider>,
        document.getElementById('app')
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