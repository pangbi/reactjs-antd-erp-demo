/**
 * Created by zhangqiang on 2016/3/21.
 */

import * as Constants from '../constants/constants'
import * as SystemMenuAction from '../actions/SystemMenuAction'

export  function systemMenuList(state = {data:[],openKeys:[]}, action) {
    switch (action.type) {
        case Constants.ACTION_LIST_SYSTEM_MENU:
            return action.data;
        default:
            return state;
    }
}

export  function leftMenu(state = [], action) {
    switch (action.type) {
        case Constants.ACTION_LIST_TREE:
            return action.data;
        default:
            return state;
    }
}

export  function systemMenu(state={}, action){
    switch (action.type) {
        case Constants.ACTION_GET_SYSTEM_MENU_BY_PK:
            return action.data;
        default:
            return state;
    }
}

export  function initSystemMenuForm(state={},action){
    let form = {
        menuCode:{},
        menuName:{},
        menuOrder:{},
        parentMenuId:{},
        pageUrl:{},
        remarks:{},
    };
    switch (action.type){
        case Constants.ACTION_INIT_SYSTEM_MENU_FORM:
            return form;
        default:
            return state;

    }
}

export function menuMode(state={mode:'vertical'},action){
    switch (action.type) {
        case SystemMenuAction.SYSTEM_MENU_INLINE_MODE:
            return {mode:'inline'};
        case SystemMenuAction.SYSTEM_MENU_VERTICAL_MODE:
            return {mode:'vertical'};
        default:
            return state;
    }
}


