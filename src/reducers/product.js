/**
 * Created by zhangqiang on 2016/3/21.
 */

import * as ProductAction from '../actions/ProductAction'
import { combineReducers } from 'redux';

  function productList(state = {resultList:[],total:0,pageNo:1}, action) {
    switch (action.type) {
        case ProductAction.PRODUCT_INFO_LIST:
            return action.data;
        default:
            return state;
    }
}

  function initProductForm(state={},action){
    let form = {
        supplyName:{},
    };
    switch (action.type){
        case ProductAction.PRODUCT_INFO_INIT_FORM:
//            console.info(form);
            return form;
        default:
            return state;

    }
}


const editFalse = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]
const editTrue =  [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]
 function codeEdit(state=editFalse,action){
    switch (action.type) {
        case ProductAction.PRODUCT_CODE_NOT_EDIT:
            state = editFalse;
            return state;
        case  ProductAction.PRODUCT_CODE_CAN_EDIT:
            state = editTrue;
            return state;
        case ProductAction.PRODUCT_CODE_NOT_EDIT_INDEX:
            state = [...state.slice(0,action.index),false,...state.slice(action.index+1)]
            return state;
        case ProductAction.PRODUCT_CODE_CAN_EDIT_INDEX:
            return state;
        default :
            return state;
    }
}


function initProductCodeList(state=[],action){
    switch (action.type){
        case ProductAction.PRODUCT_CODE_INIT_LIST:
            return action.data;
        case ProductAction.PRODUCT_CODE_EDIT_LIST:
//            console.info(state);
            state = [...state.slice(0,action.data.index),action.data.value,...state.slice(action.data.index+1)];
//            console.info(state);
            return state;
        default:
            return state;
    }
}

function isEdit(state=false,action){
    switch (action.type) {
        case ProductAction.PRODUCT_CODE_NOT_EDIT:
            return false;
        case  ProductAction.PRODUCT_CODE_CAN_EDIT:
            return true;
        default :
            return state;
    }
}

export default  combineReducers({
    initProductForm,
    productList,
    codeEdit,
    initProductCodeList,
    isEdit,
});

