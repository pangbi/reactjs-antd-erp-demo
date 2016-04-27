/**
 * Created by zhangqiang on 2016/3/9.
 */

import * as Constants from '../constants/constants'
import * as CommonTypeAction from   '../actions/CommonTypeAction'

export  function businessType(state = [], action) {
    switch (action.type) {
        case Constants.ACTION_LIST_BUSINESS_TYPE:
            return action.data;
        default:
            return state;
    }
}

export  function operationType(state = [], action) {
    switch (action.type) {
        case Constants.ACTION_LIST_OPERATION_TYPE:
            return action.data;
        default:
            return state;
    }
}

export  function auditingType(state = [], action) {
    switch (action.type) {
        case Constants.ACTION_LIST_AUDITING_TYPE:
            return action.data;
        default:
            return state;
    }
}


export  function provinceList(state = [], action) {
    switch (action.type) {
        case Constants.ACTION_LIST_PROVINCE:
            return action.data;
        default:
            return state;
    }
}

export  function cityList(state = [], action) {
    switch (action.type) {
        case Constants.ACTION_LIST_CITY:
            return action.data;
        case Constants.ACTION_RESET_CITY:
            return [];
        default:
            return state;
    }
}

export  function countyList(state = [], action) {
    switch (action.type) {
        case Constants.ACTION_LIST_COUNTY:
            return action.data;
        case Constants.ACTION_RESET_COUNTY:
            return [];
        default:
            return state;
    }
}


export  function catalogFirst(state=[],action){
    switch (action.type){
        case CommonTypeAction.CATALOG_LIST_FIRST:
            return action.data;
        default:
            return state;

    }
}

export  function catalogSecond(state=[],action){
    switch (action.type){
        case CommonTypeAction.CATALOG_LIST_SECOND:
            return action.data;
        case CommonTypeAction.RESET_CATALOG_LIST_SECOND:
            return [];
        default:
            return state;
    }
}

export  function catalogThird(state=[],action){
    switch (action.type){
        case CommonTypeAction.CATALOG_LIST_THIRD:
            return action.data;
        case CommonTypeAction.RESET_CATALOG_RESET_LIST_THIRD:
            return [];
        default:
            return state;
    }
}



/**
 * 地域列表  父子结构
 * @param state
 * @param action
 * @returns {*}
 */
export function areaList(state=[],action){
    switch (action.type) {
        case CommonTypeAction.COMMON_TYPE_AREA_LIST:
            return action.data;
        default:
            return state;
    }
}

/**
 * 地域列表  父子结构
 * @param state
 * @param action
 * @returns {*}
 */
export function provList(state=[],action){
    switch (action.type) {
        case CommonTypeAction.COMMON_TYPE_PROV_LIST:
            return action.data;
        default:
            return state;
    }
}