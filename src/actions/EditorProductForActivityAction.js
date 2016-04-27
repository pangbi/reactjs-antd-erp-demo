/**
 * Created by liuyang on 2016/3/28.
 */
import fetch from 'isomorphic-fetch'
import * as Constants from '../constants/constants'
import fetchUtil from '../utils/fetchUtil'

export const SEARCH_PRODUCTFORACTIVITY_LIST = "SEARCH_PRODUCTFORACTIVITY_LIST";
export const PRODUCTFORACTIVITY_INIT_EDIT_RECORD = 'PRODUCTFORACTIVITY_INIT_EDIT_RECORD';
export const PRODUCTFORACTIVITY_SET_EDIT_RECORD = 'PRODUCTFORACTIVITY_SET_EDIT_RECORD';
export const PRODUCTFORACTIVITY_SET_EDITING_RECORD = 'PRODUCTFORACTIVITY_SET_EDITING_RECORD';
export const PRODUCTFORACTIVITY_AREA_PRICE_DETAIL = 'PRODUCTFORACTIVITY_AREA_PRICE_DETAIL';
export const PRODUCTFORACTIVITY_SET_EDITLIST = 'PRODUCTFORACTIVITY_SET_EDITLIST';


export function listPg(searchForm){
    return dispatch => {
        dispatch(Constants.LOADING);
        fetch( Constants.URL_+"/activityProductRelation/listPg",
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(searchForm)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                console.info('------------------------------')
                dispatch(Constants.LOADED);
                //dispatch(fetchUtil.receivePosts(PRODUCTFORADD_SET_EDITLIST, data));
                dispatch(fetchUtil.receivePosts(SEARCH_PRODUCTFORACTIVITY_LIST, data));
                dispatch({type: Constants.ACTION_INIT_SELECTED_ROW_KEYS});
            }).catch(function (error) {
            dispatch(Constants.LOADED);
            fetchUtil.showError(error.message);
        })
    }
}
export function changeShowIndex(record,params){
    return dispatch => {
        dispatch(Constants.LOADING)
        fetch(Constants.URL_+'/activityProductRelation/update',
            {
                method: 'put',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(record),
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED);
                dispatch(listPg(params));
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            fetchUtil.showError(error.message);
        })
    }
}
/**
 * 查看销售区域价格列表
 * @param productId
 */
export function listAreaPriceDetail(productId) {
    return dispatch => {
        dispatch({type: PRODUCTFORACTIVITY_AREA_PRICE_DETAIL, data: []});
        dispatch(Constants.LOADING)
        fetch(Constants.URL_ + '/productPolicy/list?key=' + productId,
            {
                method: 'get',
                headers: fetchUtil.getHeader(),
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                //关闭弹窗
                dispatch({type: PRODUCTFORACTIVITY_AREA_PRICE_DETAIL, data: data});
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            fetchUtil.showError(error.message);
        })
    }
}
/**
 * 保存编辑的row
 * @param record
 * @returns {{type: string, record: *}}
 */
export function saveRecord(record, pagination) {
    return dispatch => {
        dispatch(Constants.LOADING)
        fetch(Constants.URL_ + '/activityProductRelation/update',
            {
                method: 'put',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(record)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                //显示成功
                fetchUtil.showSuccess();
                //重新加载数据
                dispatch(listPg(pagination));
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            fetchUtil.showError(error.message);
        })
    }
}
export function deleteRecord(arr, pagination) {
    return dispatch => {
        dispatch(Constants.LOADING)
        fetch(Constants.URL_ + '/activityProductRelation/delete',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(arr)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                //显示成功
                fetchUtil.showSuccess();
                //重新加载数据
                dispatch(listPg(pagination));
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            fetchUtil.showError(error.message);
        })
    }
}
/**
 * 设置要编辑的row
 * @param record
 * @returns {{type: string, record: *}}
 */
export function setEditRecord(record) {

    return {type: PRODUCTFORACTIVITY_SET_EDIT_RECORD, record: record};
}

export function setEditingRecord(index,record) {
    return {type: PRODUCTFORACTIVITY_SET_EDITING_RECORD,data:{index,record}}
}