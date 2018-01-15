import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { persistStore, persistCombineReducers } from 'redux-persist';
import { PersistGate } from 'redux-persist/lib/integration/react'
import storage from 'redux-persist/lib/storage';

import reducers from './store/reducers';
import { createStore } from 'redux';
import { Provider, Store } from 'react-redux';
import AppContainer from './containers/app-container';
import { WebMidiWrapper } from './api/midi';
import { isElectron } from './util/util';
import './styles/main.scss';
import 'font-awesome/css/font-awesome.min.css';

const config = {
    key: 'axeFxMidi',
    storage: storage
}

const storeReducer = persistCombineReducers(config, {app: reducers});

const store: Store<any> = createStore(
    storeReducer,
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const persistor = persistStore(store);

WebMidiWrapper.init(() => {
    ReactDOM.render(
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <Router>
                    <AppContainer></AppContainer>
                </Router>
            </PersistGate>
        </Provider>,
        document.getElementById('app-container')
    );
});
