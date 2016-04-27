/**
 * Created by zhangqiang on 2016/3/21.
 */
import fetch from 'isomorphic-fetch'
import * as Constants from '../constants/constants'
import fetchUtil from '../utils/fetchUtil'
import auth from '../utils/auth'
export const SYSTEM_MENU_VERTICAL_MODE = 'SYSTEM_MENU_VERTICAL_MODE'
export const SYSTEM_MENU_INLINE_MODE = 'SYSTEM_MENU_INLINE_MODE'
export function listSystemMenu(menu) {
    return dispatch => {
        fetch(Constants.URL_+'/right/getMenuTreeList',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(menu)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                if(data&&data.length>0){
                    let  openKeys = [];
                    for (let m of data) {
                        openKeys.push(m.id);
                    }
                    let jsonData = {data:data,openKeys:openKeys}
                    dispatch(fetchUtil.receivePosts(Constants.ACTION_LIST_SYSTEM_MENU,jsonData));
                }
            }).catch(function (error) {
//            console.info(error)
                fetchUtil.showMsg({result:0,errMsg:error.message});
        })
    }
}

export function listLeftMenu() {
    return dispatch => {
        //console.log(user)
        fetch(Constants.URL_+'/right/getUserMenuTree?&parentMenuId=-2',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                //console.info(data);
                /*if (data.result == 1)
                    dispatch(fetchUtil.receivePosts(Constants.ACTION_LIST_TREE, data.data));
                else
                    dispatch(fetchUtil.receivePosts(Constants.ACTION_LIST_TREE, []));*/

                dispatch(fetchUtil.receivePosts(Constants.ACTION_LIST_TREE, data));

            }).catch(function (error) {
            dispatch(fetchUtil.receivePosts(Constants.ACTION_LIST_TREE, []));
            fetchUtil.showError(error.message);
        })
    }
}

export function deleteSystemMenu(ids,searchForm){
    return dispatch => {
        fetch(Constants.URL_+'/right/deleteRoleMenu',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(ids)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                if(data.result == 1){
                    fetchUtil.showSuccess();
                    dispatch(listSystemMenu(searchForm));
                    dispatch({type:Constants.ACTION_INIT_SELECTED_ROW_KEYS});
                }else{
                    fetchUtil.showError(data.message);
                }
            }).catch(function (error) {
                fetchUtil.showError(error.message);
        })
    }
}

export function addSystemMenu(systemMenu,searchForm){
    return dispatch => {
        fetch(Constants.URL_+'/right/addRoleMenu',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(systemMenu)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                if(data.result == 1){
                    fetchUtil.showSuccess();
                    dispatch(listSystemMenu(searchForm));
                    dispatch({type:Constants.ACTION_INIT_SELECTED_ROW_KEYS});
                    dispatch({type:Constants.ACTION_HIDE_MODAL,index:0});
                }else{
                    fetchUtil.showError(data.message);
                }
            }).catch(function (error) {
            fetchUtil.showError(error.message);
        })
    }
}

export function updateSystemMenu(systemMenu,searchForm){
    return dispatch => {
        fetch(Constants.URL_+'/right/updateRoleMenu',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(systemMenu)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                if(data.result == 1){
                    fetchUtil.showSuccess();
                    dispatch(listSystemMenu(searchForm));
                    dispatch({type:Constants.ACTION_INIT_SELECTED_ROW_KEYS});
                    dispatch({type:Constants.ACTION_HIDE_MODAL,index:1});
                }else{
                    fetchUtil.showError(data.message);
                }
            }).catch(function (error) {
            fetchUtil.showError(error.message);
        })
    }
}

export function getSystemMenuByPk(pk){
    return dispatch => {
        fetch(Constants.URL_+'/right/getMenuInfo?menuId='+pk[0],
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                if(data.result == 1){
                    dispatch({type:Constants.ACTION_GET_SYSTEM_MENU_BY_PK,data:data.data});
                }else{
                    fetchUtil.showError(data.message);
                }
            }).catch(function (error) {
                fetchUtil.showError(error.message);
        })
    }
}

export function initSystemMenuForm(){
    return {type:Constants.ACTION_INIT_SYSTEM_MENU_FORM}
}

export function showVertical(){
    return {type:SYSTEM_MENU_VERTICAL_MODE}
}

export function showInline(){
    return {type:SYSTEM_MENU_INLINE_MODE}
}




