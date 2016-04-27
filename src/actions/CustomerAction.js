/**
 * Created by zhangqiang on 2016/3/9.
 */
import fetch from 'isomorphic-fetch'
import * as Constants from '../constants/constants'
import fetchUtil from '../utils/fetchUtil'

export function searchCustomer(searchForm){
    return dispatch => {
        fetch(Constants.URL_+"searchCustomer",
            {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(searchForm)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(fetchUtil.receivePosts(Constants.ACTION_SEARCH_CUSTOMER, data));
            }).catch(function (error) {
                //dispatch(fetchUtil.receivePosts(Constants.ACTION_SEARCH_CUSTOMER, {total:0,resultList:[],current:1}));
                fetchUtil.showMsg({result:0,errMsg:error.message});
        })
    }
}

export function deleteCustomer(ids,searchForm){
    return dispatch => {
        fetch(Constants.URL_+"deleteCustomer",
            {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ids)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                fetchUtil.showMsg(data);
                //删除成功，reload 表单
                if(data.result == 1){
                    dispatch(searchCustomer(searchForm));
                    dispatch({type:Constants.ACTION_INIT_SELECTED_ROW_KEYS});
                }
            }).catch(function (error) {
                fetchUtil.showMsg({result:0,errMsg:error.message});
        })
    }
}

export function addCustomer(customer,searchForm){
    return dispatch => {
        fetch(Constants.URL_+"addCustomer",
            {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customer)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                fetchUtil.showMsg(data);
                if(data.result == 1){
                    dispatch(searchCustomer(searchForm));
                    dispatch({type:Constants.ACTION_HIDE_MODAL,index:0});
                    dispatch({type:Constants.ACTION_INIT_ADD_CUSTOMER_FORM});
                }
            }).catch(function (error) {
                fetchUtil.showMsg({result:0,errMsg:error.message});
        })
    }
}