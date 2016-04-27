/**
 * Created by liuyang on 2016/3/30.
 */
import fetch from 'isomorphic-fetch';
import * as EditorProductForAddAction from '../actions/EditorProductForAddAction';
import * as Constants from '../constants/constants';
import { combineReducers } from 'redux';
import fetchUtil from '../utils/fetchUtil';


/**
 * 分页记录
 * @param state
 * @param action
 * @returns {*}
 */
function pgList(state = {resultList: [], total: 0, pageNo: 1}, action) {
    switch (action.type) {
        case EditorProductForAddAction.SEARCH_PRODUCTFORADD_LIST:
            return action.data;
        default :
            return state;
    }
}
/**
 * 处于编辑模式的row
 * @param state
 * @param action
 * @returns {*}
 */
function editRecord(state = {}, action) {
    switch (action.type) {
        case EditorProductForAddAction.PRODUCTFORADD_INIT_EDIT_RECORD:
            return {};
        case EditorProductForAddAction.PRODUCTFORADD_SET_EDIT_RECORD:
            return action.record;
        default:
            return state;
    }
}
function editRecordList(state = [] ,action){
    switch (action.type) {
        case EditorProductForAddAction.SEARCH_PRODUCTFORADD_LIST:
            return !action.data.resultList?[]:action.data.resultList;
        case EditorProductForAddAction.PRODUCTFORADD_SET_EDITING_RECORD:
            let rec = state[action.data.index];
            let newRec = Object.assign({}, rec, action.data.record);
            return [...state.slice(0,action.data.index),newRec,...state.slice(action.data.index+1)];
        default:
            return state;
    }
}
/**
 * 查看销售区域及价格列表
 * @param state
 * @param action
 */
function areaPriceDetailList(state = [], action) {
    switch (action.type) {
        case EditorProductForAddAction.PRODUCTFORADD_AREA_PRICE_DETAIL:
            return action.data;
        default:
            return state;
    }
}
/**
 * 聚合reducer
 */
export  default combineReducers({
    pgList,
    editRecord,
    areaPriceDetailList,
    editRecordList,
});

