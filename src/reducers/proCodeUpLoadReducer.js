/**
 * Created by liuyang on 2016/3/30.
 */
import fetch from 'isomorphic-fetch';
import * as ProCodeUploadAction from '../actions/proCodeUploadAction';
import * as Constants from '../constants/constants';
import { combineReducers } from 'redux';
import fetchUtil from '../utils/fetchUtil';



/**
 * 分页记录
 * @param state
 * @param action
 * @returns {*}
 */
//const dataModels =[{operator:'nihaoa',createTime:'2016-01-01',status:1,uploadId:1}];
function pgProCodeList(state = {resultList:[],total:1,pageNo:1}, action){

    switch (action.type){
        case ProCodeUploadAction.SEARCH_PROCODELISTVIEW:
           // return action.data;
            return action.data;
        default :
            return state;
    }
}
function pgDetailCodeList(state = {resultList:[],total:1,pageNo:1}, action){

    switch (action.type){
        case ProCodeUploadAction.SEARCH_DETAILLIST:
            // return action.data;
            return action.data;
        default :
            return state;
    }
}

function loading_proCode(state=false,action){
    switch (action.type){
        case ProCodeUploadAction.LOADING_PROCODE:
            return true;
        case ProCodeUploadAction.LOADED_PROCODE:
            return false;
        default :
            return false;
    }
}
export  default combineReducers({
    pgProCodeList,
    pgDetailCodeList,
    loading_proCode,
});