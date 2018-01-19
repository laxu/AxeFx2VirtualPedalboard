
import { createStore } from 'redux';
import { Store } from 'react-redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from './reducers';

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

export {
    store,
    persistor
};