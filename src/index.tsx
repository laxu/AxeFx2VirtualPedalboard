import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from './store/store';
import { Provider } from 'react-redux';
import AppContainer from './containers/app-container';
import { WebMidiWrapper } from './api/midi';
import { isElectron } from './util/util';
import MIDIErrorComponent from './components/midi-error/midi-error';
import './styles/main.scss';
import 'font-awesome/css/font-awesome.min.css';

WebMidiWrapper.init((err: any) => {
    const containerEl = document.getElementById('app-container');
    if (err) {
        ReactDOM.render(<MIDIErrorComponent error={err}></MIDIErrorComponent>, containerEl);
        return;
    }
    ReactDOM.render(
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <Router>
                    <Route path="/" component={AppContainer}></Route>
                </Router>
            </PersistGate>
        </Provider>,
        containerEl
    );
});
