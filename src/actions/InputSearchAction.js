/**
 * Created by zhangqiang on 2016/3/28.
 */
import fetch from 'isomorphic-fetch'
import * as Constants from '../constants/constants'
import fetchUtil from '../utils/fetchUtil'

export const SHOW_INPUT_SEARCH = 'SHOW_INPUT_SEARCH';
export const HIDE_INPUT_SEARCH = 'HIDE_INPUT_SEARCH';
export const INPUT_SEARCH_LIST_SUPPLY = 'INPUT_SEARCH_LIST_SUPPLY';
export function show(){
    return {type:SHOW_INPUT_SEARCH}
}

export function hide(){
    return {type:HIDE_INPUT_SEARCH}
}


/**
 * 初始化供应商状态
 * @param supply
 * @returns {{type: string, data: *[]}}
 */
export function initSupply() {
    return {type: INPUT_SEARCH_LIST_SUPPLY, data: []};
}


/**
 * 查询供应商状态
 * @param supply
 * @returns {{type: string, data: *[]}}
 */
export function listSupply(supply) {
    return dispatch => {
        fetch(Constants.URL_ + '/product/supplyList',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(supply)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch({type: INPUT_SEARCH_LIST_SUPPLY, data: data});
            }).catch(function (error) {
            //显示异常
            fetchUtil.showError(error.message);
        })
    }
}