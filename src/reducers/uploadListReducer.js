/**
 * Created by zhourongjing on 2016/3/29.
 */
import * as UploadListAction from '../actions/UploadListAction'
import { combineReducers } from 'redux';
/**
 * 单条记录
 * @param state
 * @param action
 * @returns {*}
 */
function singleResult(state = {}, action){
    switch (action.type){
        case UploadListAction.UPLOAD_LIST_PG:
            return action.data;
        default :
            return state;
    }
}

/**
 * 分页记录
 * @param state
 * @param action
 * @returns {*}
 */
function pgList(state = {resultList:[],total:0,pageNo:1}, action){
    switch (action.type){
        case UploadListAction.UPLOAD_LIST_PG:
            return action.data;
        default :
            return state;
    }
}

function detailList(state = {resultList:[],total:0,pageNo:1}, action){
    switch(action.type){
        case UploadListAction.UPLOAD_DETAIL_PG:
            return action.data;
        default :
            return state;
    }

}

function loading(state = false,action){
    switch (action.type){
        case UploadListAction.LOADING:
            return true;
        default :
            return state;
    }
}

function detailExcel(state={uploadId:0}, action){
    switch (action.type){
        case UploadListAction.EPORT_DETAIL:
            return action.data;
        default :
            return state;
    }
}


/**
 * 表单初始化
 * @param state
 * @param action
 * @returns {{}}
 */
function initForm(state={},action){
    switch (action.type){
        case UploadListAction.UPLOAD_LIST_PG:
            return {
                resCode:{},
                resName:{},
                resUrl:{},
                remarks:{},
                creator:{},
                createTime:{},
                updateUser:{},
                updateTime:{},
                showIndex:{},
            };
        default :
            return state;
    }
}

/**
 * 聚合reducer
 */
export  default combineReducers({
    singleResult,
    pgList,
    initForm,
    detailList,
    loading,
    detailExcel,
});

