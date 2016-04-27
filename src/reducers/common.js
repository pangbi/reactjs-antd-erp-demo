/**
 * Created by zhangqiang on 2016/3/10.
 */

import * as Constants from '../constants/constants'
import * as CommonAction from '../actions/CommonAction'
export  function selectedRowKeys(state = [], action) {
    switch (action.type) {
        case Constants.ACTION_INIT_SELECTED_ROW_KEYS:
            return [];
        case Constants.ACTION_SELECTED_ROW_KEYS:
            return action.selectedRowKeys;
        case Constants.ACTION_ADD_OR_DELETE_SELECTED_ROW_KEYS:
            let isExist = false;
            let selectedRowKeys = state;
            //console.info("select keys :"+selectedRowKeys+"  action.selectedRowKeys:"+action.selectedRowKeys);
            let newSeletedRowKeys = [];
            state.map(selectedRowKey => {
                if(selectedRowKey == action.selectedRowKeys)
                    isExist = true;
                else
                    newSeletedRowKeys.push(selectedRowKey);
            });
            //console.info("newSeleteRowKeys:"+newSeletedRowKeys);
            if (!isExist)
                return [...selectedRowKeys, action.selectedRowKeys];
            else
                return [...newSeletedRowKeys];
        default:
            return state;
    }
}
const initModal = [false,false,false,false,false,false,false,false,false,false]
export function modalVisiable(state=initModal,action){
    switch (action.type) {
        case Constants.ACTION_INIT_MODAL:
            return initModal;
        case Constants.ACTION_SHOW_MODAL:
            return [...state.slice(0,action.index),true,...state.slice(action.index+1)];
        case Constants.ACTION_HIDE_MODAL:
            return [...state.slice(0,action.index),false,...state.slice(action.index+1)];
        default :
            return state;
    }
}

export function initAddCustomerForm(state={},action){
    switch (action.type) {
        case Constants.ACTION_INIT_ADD_CUSTOMER_FORM:
            return {
                companyName :{},
                customerType :{},
                businessType :{},
                contact :{},
                tel :{},
                address :{},
                remark :{},
                addDate :{},
                isVip :{value:false},
            };
        default :
            return state;
    }
}

export function loading(state = false,action){
    switch (action.type) {
        case Constants._LOADING:
            return  true;
        case Constants._LOADED:
            return  false;
        default :
            return state;
    }
}

export function uploadFile(state={},action){
    switch (action.type) {
        case CommonAction.COMMON_INIT_UPLOAD_FILE:
            return  {};
        case CommonAction.COMMON_SET_UPLOAD_FILE:
            return  {file:action.file};
        default :
            return state;
    }
}