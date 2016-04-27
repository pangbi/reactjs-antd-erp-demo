/**
 * Created by zhourongjing on 2016/3/30.
 */
import fetch from 'isomorphic-fetch'
import * as Constants from '../constants/constants'
import fetchUtil from '../utils/fetchUtil'
export const UPLOAD_LIST_PG = 'UPLOAD_LIST_PG';
export const UPLOAD_DETAIL_PG = 'UPLOAD_DETAIL_PG';
export const LOADING = "LOADING";
export const EPORT_DETAIL = 'EPORT_DETAIL';


export function uploadList (pagination){
    return dispatch => {
        dispatch(Constants.LOADING)
        fetch(Constants.URL_+'/product/listPgProductUpload',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body:JSON.stringify(pagination)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                //console.log("data::",data)
                //获取数据
                dispatch(fetchUtil.receivePosts(UPLOAD_LIST_PG,data));
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            fetchUtil.showError(error.message);
        })
    }
}

export function uploadDetail (pagination, nextTr){
    return dispatch => {
        dispatch(Constants.LOADING)
        fetch(Constants.URL_+'/product/listPgProductUploadDetail',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body:JSON.stringify(pagination)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                //console.log("data::",data)
                //获取数据
                dispatch(fetchUtil.receivePosts(UPLOAD_DETAIL_PG,data));
                nextTr.hasReturn = true;

                //dispatch(fetchUtil.receivePosts(LOADING))
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            fetchUtil.showError(error.message);
        })
    }
}


export function exportDetail(uploadObj){
    return dispatch => {
        dispatch(Constants.LOADING)
        fetch(Constants.URL_+'/product/exportProductUploadDetail',
            {
                method: 'get',
                headers: fetchUtil.getHeader(),
                body:JSON.stringify()
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                //console.log("接收的数据data::",data)
                //获取数据

                dispatch(fetchUtil.receivePosts(EPORT_DETAIL,data));
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            //alert('出错！');
            fetchUtil.showError(error.message);
        })
    }
}
/**
 * 初始化form
 * @returns {{type: string}}
 */
export function initForm(){
    return {type:SYSTEM_RESOURCE_INIT_FROM}
}