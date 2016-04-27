/**
 * Created by zhangqiang on 2016/3/21.
 */
import fetch from 'isomorphic-fetch'
import * as Constants from '../constants/constants'
import fetchUtil from '../utils/fetchUtil'
import auth from '../utils/auth'
export const  PRODUCT_INFO_INIT_FORM = 'PRODUCT_INIT_FORM';
export  const PRODUCT_INFO_LIST = 'PRODUCT_INFO_LIST';
export  const PRODUCT_CODE_NOT_EDIT ='PRODUCT_CODE_NO_EDIT';
export  const PRODUCT_CODE_CAN_EDIT ='PRODUCT_CODE_CAN_EDIT';
export const PRODUCT_CODE_CAN_EDIT_INDEX = 'PRODUCT_CODE_CAN_EDIT_INDEX';
export  const PRODUCT_CODE_NOT_EDIT_INDEX ='PRODUCT_CODE_NOT_EDIT_INDEX';
export  const PRODUCT_CODE_INIT_LIST ='PRODUCT_CODE_INIT_LIST';
export  const PRODUCT_CODE_EDIT_LIST ='PRODUCT_CODE_EDIT_LIST';


export function listProduct(pagination) {
    return dispatch => {
        dispatch(Constants.LOADING)
        fetch(Constants.URL_+'/product/listPgProductInfo',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(pagination)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                dispatch(fetchUtil.receivePosts(PRODUCT_INFO_LIST,data));
                //初始化勾选状态
                dispatch({type: Constants.ACTION_INIT_SELECTED_ROW_KEYS});
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            fetchUtil.showError(error.message);
        })
    }
}


export function saveProductCode(product,index,params) {
    return dispatch => {
        dispatch(Constants.LOADING)
        fetch(Constants.URL_+'/product/update',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(product),
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                dispatch({type:PRODUCT_CODE_NOT_EDIT_INDEX,index:index})
                //reload table
                dispatch(listProduct(params))
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            fetchUtil.showError(error.message);
        })
    }
}

export function saveUploadCode(filePath,fileName,showModelId,hideModelId,params) {
    return dispatch => {
        dispatch(Constants.LOADING)
        fetch(Constants.URL_+'/product/upload',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify({path:filePath,fileName:fileName}),
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                dispatch({type:Constants.ACTION_HIDE_MODAL,index:hideModelId});
                dispatch({type:Constants.ACTION_SHOW_MODAL,index:showModelId});
                dispatch(fetchUtil.receivePosts(PRODUCT_INFO_LIST,data));
                //reload table
                dispatch(listProduct(params))
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            fetchUtil.showError(error.message);
        })
    }
}

export function exportData(type,selKeys) {
    return dispatch => {
        dispatch(Constants.LOADING);
        fetch(Constants.URL_+'/product/update',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                //dispatch(fetchUtil.receivePosts(PRODUCT_INFO_LIST,data));
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            fetchUtil.showError(error.message);
        })
    }
}

export function  initProductCodeList(productList,productCodeList){
    let data =[];
    if(productList&&productList.length>0){
        for(let p of productList) {
//            console.info(p.productCode);
            data.push(p.productCode);
        }
    }
    return {type:PRODUCT_CODE_INIT_LIST,data:data}
}

export function changeProductResult(value,i){
    let data = {
        index:i,
        value:value
    }
//    console.info(data)
    return {type:PRODUCT_CODE_EDIT_LIST,data:data}
}

export function initProductForm(){
    return {type:PRODUCT_INFO_INIT_FORM}
}

export function openEdtiMode(){
    return {type:PRODUCT_CODE_CAN_EDIT}
}
export function closeEdtiMode(){
    return {type:PRODUCT_CODE_NOT_EDIT}
}

export function openEdtiModeIndex(index){
    return {type:PRODUCT_CODE_CAN_EDIT_INDEX,index:index}
}
export function closeEdtiModeIndex(index){
    return {type:PRODUCT_CODE_NOT_EDIT_INDEX,index:index}
}