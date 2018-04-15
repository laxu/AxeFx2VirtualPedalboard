import { Action } from 'redux';
import { TypeKeys } from '../actions';

interface State {
    loading: boolean;
}

const initialState: State = {
    loading: false
};

export default function commonReducers(state = initialState, action: Action & { payload: any }) {
    const payload = action.payload;
    switch(action.type) {
        case TypeKeys.loading:
            return {...state, loading: payload};

        default:
            return state;
    }
}