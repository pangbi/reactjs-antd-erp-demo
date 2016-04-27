/**
 * Created by liuyang on 2016/3/28.
 */
import fetch from 'isomorphic-fetch'
import * as Constants from '../constants/constants'
import fetchUtil from '../utils/fetchUtil'
export const SEARCH_PROCODELISTVIEW = 'SEARCH_PROCODELISTVIEW';
export const SEARCH_DETAILLIST='SEARCH_DETAILLIST';
export const LOADING_PROCODE = "LOADING_PROCODE";
export const LOADED_PROCODE = "LOADED_PROCODE";

export function searchProCodeListView(searchForm){
    return dispatch => {
        dispatch(Constants.LOADING)
        fetch( Constants.URL_+"/product/listPgProductCodeUpload",
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(searchForm)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                dispatch(fetchUtil.receivePosts(SEARCH_PROCODELISTVIEW, data));
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            fetchUtil.showError(error.message);
        })
    }
}
export function listPgProductUploadDetail(searchForm){

    return dispatch => {
        dispatch(Constants.LOADING)
        fetch( Constants.URL_+"/product/listPgProductUploadDetail",
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body:  JSON.stringify(searchForm)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                dispatch(fetchUtil.receivePosts(SEARCH_DETAILLIST, data));
                dispatch(fetchUtil.receivePosts(LOADING_PROCODE))
            }).catch(function (error) {
            //dispatch(fetchUtil.receivePosts(Constants.ACTION_SEARCH_CUSTOMER, {total:0,resultList:[],current:1}));
            fetchUtil.showMsg({result:0,errMsg:error.message});
        })
    }
}
export function exportProductCodeUploadDetail(searchForm){
    return dispatch => {
        dispatch(Constants.LOADING)
        fetch( Constants.URL_+"/product/exportProductCodeUploadDetail",
            {
                method: 'get',
                headers: fetchUtil.getHeader(),
                //body:  JSON.stringify(searchForm)
            })
            //.then(fetchUtil.checkStatus)
            //.then(function (data) {
            //    console.log('====================>',data);
            //}).catch(function (error) {
            ////dispatch(fetchUtil.receivePosts(Constants.ACTION_SEARCH_CUSTOMER, {total:0,resultList:[],current:1}));
            //     fetchUtil.showMsg({result: 0, errMsg: error.message});
            //})
    }
}
export function updLoadingStatus(){
    return {type:LOADED_PROCODE}
}
