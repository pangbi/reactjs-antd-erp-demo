/**
 * Created by zhangqiang on 2016/2/23.
 */
import { createStore,applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';
import createLogger from 'redux-logger';

const createStoreWithMiddleware = (process.env.NODE_ENV == 'dev')?
    applyMiddleware(
        thunkMiddleware,createLogger()
    )(createStore)
:
    applyMiddleware(
        thunkMiddleware
    )(createStore)

export default function create(){
    return createStoreWithMiddleware(rootReducer);
}