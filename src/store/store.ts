
import { createStore } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from './reducers';

const config = {
    key: 'axeFxVirtualPedalboard',
    storage: storage
}

const storeReducer = persistCombineReducers(config, {app: reducers});

const store = createStore(
    storeReducer,
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
const persistor = persistStore(store);

export function getStoreState() {
    store.getState().app;
}

export function getStoreStateSlice(section: string, slice: string) {
    return store.getState().app[section][slice];
}

export {
    store,
    persistor
};