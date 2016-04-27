/**
 * Created by zhangqiang on 2016/3/9.
 */
import fetch from 'isomorphic-fetch'
import * as Constants from '../constants/constants'
import fetchUtil from '../utils/fetchUtil'

export const CATALOG_LIST_FIRST = 'CATALOG_LIST_FIRST';
export const CATALOG_LIST_SECOND = 'CATALOG_LIST_SECOND';
export const CATALOG_LIST_THIRD = 'CATALOG_LIST_THIRD';
export const RESET_CATALOG_LIST_SECOND = 'RESET_CATALOG_LIST_SECOND';
export const RESET_CATALOG_RESET_LIST_THIRD = 'RESET_CATALOG_RESET_LIST_THIRD';
export const COMMON_TYPE_AREA_LIST = 'COMMON_TYPE_AREA_LIST'
export const COMMON_TYPE_PROV_LIST = 'COMMON_TYPE_PROV_LIST'

export function listProvince() {
    return dispatch => {
        //console.log(user)
        fetch(Constants.URL_+'/commonType/listCommonType',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify({infoType:'AREA_CODE',parentInfo:-1})
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(fetchUtil.receivePosts(Constants.ACTION_LIST_PROVINCE, data));
            }).catch(function (error) {
            fetchUtil.showError(error.message);
        })
    }
}

export function listCity(parentInfo) {
    return dispatch => {
        fetch(Constants.URL_+'/commonType/listCommonType',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify({infoType:'AREA_CODE',parentInfo:parentInfo})
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(fetchUtil.receivePosts(Constants.ACTION_LIST_CITY, data));
            }).catch(function (error) {
            fetchUtil.showError(error.message);
        })
    }
}

export function resetCity(){
    return {type:Constants.ACTION_RESET_CITY}
}

export function listCounty(parentInfo) {
    return dispatch => {
        fetch(Constants.URL_+'/commonType/listCommonType',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify({infoType:'AREA_CODE',parentInfo:parentInfo})
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(fetchUtil.receivePosts(Constants.ACTION_LIST_COUNTY, data));
            }).catch(function (error) {
            fetchUtil.showError(error.message);
        })
    }
}

export function resetCounty(){
    return {type:Constants.ACTION_RESET_COUNTY}
}


export function listCatalogFirst(){
    return dispatch => {
        fetch(Constants.URL_+'/commonType/listCommonType',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify({infoType:'PRODUCT_CATALOG',parentInfo:-1})
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
               // console.info(data);
                dispatch(fetchUtil.receivePosts(CATALOG_LIST_FIRST,data));
            }).catch(function (error) {
           // console.info(error)
            fetchUtil.showError(error.message);
        })
    }
}


export function listCatalogSecond(parentInfo){
    return dispatch => {
        fetch(Constants.URL_+'/commonType/listCommonType',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify({infoType:'PRODUCT_CATALOG',parentInfo:parentInfo})
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(fetchUtil.receivePosts(CATALOG_LIST_SECOND,data));
            }).catch(function (error) {
            fetchUtil.showError(error.message);
        })
    }
}

export function  resetCataLogSecond(){
    return {type:RESET_CATALOG_LIST_SECOND};
}


export function listCatalogThird(parentInfo){
    return dispatch => {
        fetch(Constants.URL_+'/commonType/listCommonType',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify({infoType:'PRODUCT_CATALOG',parentInfo:parentInfo})
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(fetchUtil.receivePosts(CATALOG_LIST_THIRD,data));
            }).catch(function (error) {
            fetchUtil.showError(error.message);
        })
    }
}

export function  resetCataLogThird(){
    return {type:RESET_CATALOG_RESET_LIST_THIRD};
}

export function initProductForm(){
    return {type:PRODUCT_INFO_INIT_FORM}
}


/**
 * 获取地域列表
 */
export function getAreaList(){
    return dispatch => {
        fetch(Constants.URL_+'/commonType/listAreaForTree',
            {
                method: 'get',
                headers: fetchUtil.getHeader(),
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                //获取数据
                dispatch(fetchUtil.receivePosts(COMMON_TYPE_AREA_LIST,data));
            }).catch(function (error) {
                fetchUtil.showError(error.message);
        })
    }
}

/**
 * 获取地域列表
 */
export function getProvList(){
    return dispatch => {
        fetch(Constants.URL_+'/commonType/listProvincesForTree',
            {
                method: 'get',
                headers: fetchUtil.getHeader(),
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                //获取数据
                dispatch(fetchUtil.receivePosts(COMMON_TYPE_PROV_LIST,data));
            }).catch(function (error) {
            fetchUtil.showError(error.message);
        })
    }
}