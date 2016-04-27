/**
 * Created by zhangqiang on 2016/2/19.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import create from './store/createStore';
import { connect } from 'react-redux';
import routers from './router/routes'
import { browserHistory, Router, Route, Link, Redirect } from 'react-router'
//创建store
let store = create();


let rootElement = document.getElementById('root');

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory} routes={routers}/>
    </Provider>,
    rootElement
);
