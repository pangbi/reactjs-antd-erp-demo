/**
 * Created by zhangqiang on 2016/3/23.
 */
import * as SystemResourceAction from '../actions/SystemResourceAction'
import { combineReducers } from 'redux';
/**
 * 单条记录
 * @param state
 * @param action
 * @returns {*}
 */
function singleResult(state = {}, action){
    switch (action.type){
        case SystemResourceAction.SYSTEM_RESOURCE_GET_BY_PK:
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
        case SystemResourceAction.SYSTEM_RESOURCE_LIST_PG:
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
        case SystemResourceAction.SYSTEM_RESOURCE_INIT_FROM:
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
});

