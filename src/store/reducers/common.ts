import { Action } from 'redux';
import { TypeKeys } from '../actions';

interface State {
    loading: boolean;
    sidebarOpen: boolean;
}

const initialState: State = {
    loading: false,
    sidebarOpen: true
};

export default function commonReducers(state = initialState, action: Action & { payload: any }) {
    const payload = action.payload;
    switch(action.type) {
        case TypeKeys.loading:
            return {...state, loading: payload};

        case TypeKeys.toggleSidebar:
            return {...state, sidebarOpen: !state.sidebarOpen};

        default:
            return state;
    }
}