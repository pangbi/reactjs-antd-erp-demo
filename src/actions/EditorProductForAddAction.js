/**
 * Created by liuyang on 2016/3/28.
 */
import fetch from 'isomorphic-fetch'
import * as Constants from '../constants/constants'
import fetchUtil from '../utils/fetchUtil'

export const SEARCH_PRODUCTFORADD_LIST = "SEARCH_PRODUCTFORADD_LIST";
export const PRODUCTFORADD_INIT_EDIT_RECORD = 'PRODUCTFORADD_INIT_EDIT_RECORD';
export const PRODUCTFORADD_SET_EDIT_RECORD = 'PRODUCTFORADD_SET_EDIT_RECORD';
export const PRODUCTFORADD_SET_EDITING_RECORD = 'PRODUCTFORADD_SET_EDITING_RECORD';
export const PRODUCTFORADD_AREA_PRICE_DETAIL = 'PRODUCTFORADD_AREA_PRICE_DETAIL';
export const PRODUCTFORADD_SET_EDITLIST = 'PRODUCTFORADD_SET_EDITLIST';


export function listPg(searchForm){
    return dispatch => {
        dispatch(Constants.LOADING);
        fetch( Constants.URL_+"/activityProductRelation/listProductForActivity",
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
                dispatch(fetchUtil.receivePosts(SEARCH_PRODUCTFORADD_LIST, data));
                dispatch({type: Constants.ACTION_INIT_SELECTED_ROW_KEYS});
            }).catch(function (error) {
            dispatch(Constants.LOADED);
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
        dispatch({type: PRODUCTFORADD_AREA_PRICE_DETAIL, data: []});
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
                dispatch({type: PRODUCTFORADD_AREA_PRICE_DETAIL, data: data});
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
        fetch(Constants.URL_ + '/activityProductRelation/add',
            {
                method: 'post',
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
/**
 * 设置要编辑的row
 * @param record
 * @returns {{type: string, record: *}}
 */
export function setEditRecord(record) {

    return {type: PRODUCTFORADD_SET_EDIT_RECORD, record: record};
}

export function setEditingRecord(index,record) {
    return {type: PRODUCTFORADD_SET_EDITING_RECORD,data:{index,record}}
}