import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger'

import { REDUX_NO_LOG_ACTIONS } from '../constants/constants';

import rootReducer from './reducers';

// if (process.env.NODE_ENV === "development") {
//     middlewares.push(createLogger());
// }
// const middleware = applyMiddleware(...middlewares);

function filterActions(getState, action) {
    return !REDUX_NO_LOG_ACTIONS.includes(action.type);
}

const logger = createLogger({
    predicate: filterActions
});

const store = createStore(
    rootReducer,
    applyMiddleware(logger)
);

export default store;
