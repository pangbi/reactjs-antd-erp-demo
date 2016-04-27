/**
 * Created by zhangqiang on 2016/3/28.
 */
import * as InputSearchAction from '../actions/InputSearchAction'
import { combineReducers } from 'redux';
function display(state={display:false},action){
    switch (action.type){
        case InputSearchAction.SHOW_INPUT_SEARCH:
            return {display:true};
        case InputSearchAction.HIDE_INPUT_SEARCH:
            return {display:false};
        default:
            return state;
    }
}

/**
 * 供应商列表
 * @param state
 * @param action
 * @returns {*}
 */
function supplyList(state = [], action) {
    switch (action.type) {
        case InputSearchAction.INPUT_SEARCH_LIST_SUPPLY:
            return action.data;
        default:
            return state;
    }
}



/**
 * 聚合reducer
 */
export  default combineReducers({
    display,
    supplyList,
});
