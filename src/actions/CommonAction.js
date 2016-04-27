/**
 * Created by zhangqiang on 2016/3/14.
 */
import * as Constants from '../constants/constants'

export const COMMON_INIT_UPLOAD_FILE = 'COMMON_INIT_UPLOAD_FILE';
export const COMMON_SET_UPLOAD_FILE = 'COMMON_SET_UPLOAD_FILE';
export function setSelectedRowKeys(selectedRowKeys){
    return {type:Constants.ACTION_SELECTED_ROW_KEYS,selectedRowKeys:selectedRowKeys};
}

export function addOrDeleteSelectedRowKeys(selectedRowKeys){
    return {type:Constants.ACTION_ADD_OR_DELETE_SELECTED_ROW_KEYS,selectedRowKeys:selectedRowKeys};
}
export function  initSelectedKeys(){
    return {type:Constants.ACTION_INIT_SELECTED_ROW_KEYS}
}

export function initModal(){
    return {type:Constants.ACTION_INIT_MODAL}
}

export function showModal(index){
    return {type:Constants.ACTION_SHOW_MODAL,index:index}
}

export function hideModal(index){
    return {type:Constants.ACTION_HIDE_MODAL,index:index}
}

export function initAddCustomerForm(){
    return {type:Constants.ACTION_INIT_ADD_CUSTOMER_FORM}
}

/**
 * 初始化上传组件
 */
export function initUploadFile(){
    return {type:COMMON_INIT_UPLOAD_FILE}
}

/**
 * 给上传组件赋值file
 * @param file
 */
export function  setUploadFile(file){
    return {type:COMMON_SET_UPLOAD_FILE,file:file};
}


