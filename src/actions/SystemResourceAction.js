/**
 * Created by zhangqiang on 2016/3/23.
 */
import fetch from 'isomorphic-fetch'
import * as Constants from '../constants/constants'
import fetchUtil from '../utils/fetchUtil'
import auth from '../utils/auth'

export const SYSTEM_RESOURCE_GET_BY_PK = 'SYSTEM_RESOURCE_GET_BY_PK';
export const SYSTEM_RESOURCE_LIST_PG = 'SYSTEM_RESOURCE_LIST_PG';
export const SYSTEM_RESOURCE_ADD = 'SYSTEM_RESOURCE_ADD';
export const SYSTEM_RESOURCE_DELETE = 'SYSTEM_RESOURCE_DELETE';
export const SYSTEM_RESOURCE_UPDATE = 'SYSTEM_RESOURCE_UPDATE';
export const SYSTEM_RESOURCE_INIT_FROM = 'SYSTEM_RESOURCE_INIT_FROM';

/**
 * 根据主键获取单条
 * @param key 主键id
 * @returns {Function}
 */
export function getByPK(key){
    return dispatch => {
        fetch(Constants.URL_+'/systemResource/getByPK?key='+key,
            {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization':auth.loggedIn()? auth.loggedIn().token:''
                }
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                //获取数据
                dispatch(fetchUtil.receivePosts(SYSTEM_RESOURCE_GET_BY_PK,data));
            }).catch(function (error) {
                //显示异常
                fetchUtil.showError(error.message);
        })
    }
}

/**
 * 显示列表数据
 * @param pagination 查询条件
 * @returns {Function}
 */
export function listPg(pagination){
    return dispatch => {
        fetch(Constants.URL_+'/systemResource/listPg',
            {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization':auth.loggedIn()? auth.loggedIn().token:''
                },
                body:JSON.stringify(pagination)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                //获取数据
                dispatch(fetchUtil.receivePosts(SYSTEM_RESOURCE_LIST_PG,data));
                //初始化勾选状态
                dispatch({type:Constants.ACTION_INIT_SELECTED_ROW_KEYS});
            }).catch(function (error) {
                fetchUtil.showError(error.message);
        })
    }
}
/**
 * 添加记录
 * @param systemResource 添加内容
 * @param pagination     重新加载数据所需查询条件
 * @returns {Function}
 */
export function add(systemResource,pagination){
    return dispatch => {
        fetch(Constants.URL_+'/systemResource/add',
            {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization':auth.loggedIn()? auth.loggedIn().token:''
                },
                body:JSON.stringify(systemResource)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                //显示成功
                fetchUtil.showSuccess();
                //重新加载数据
                dispatch(listPg(pagination));
                //重置选中的key
                //关闭弹窗
                dispatch({type:Constants.ACTION_HIDE_MODAL,index:0});
                //初始化新增表单
                dispatch({type:SYSTEM_RESOURCE_INIT_FROM});
            }).catch(function (error) {
                //显示异常
                fetchUtil.showError(error.message);
        })
    }
}

/**
* 更新记录
* @param systemResource 跟新内容
* @param pagination     重新加载数据所需查询条件
* @returns {Function}
*/
export function update(systemResource,pagination){
    return dispatch => {
        fetch(Constants.URL_+'/systemResource/update',
            {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization':auth.loggedIn()? auth.loggedIn().token:''
                },
                body:JSON.stringify(systemResource)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                //显示成功
                fetchUtil.showSuccess();
                //重新加载数据
                dispatch(listPg(pagination));
                //关闭弹窗
                dispatch({type:Constants.ACTION_HIDE_MODAL,index:1});
                //初始化新增表单
                dispatch(fetchUtil.receivePosts(SYSTEM_RESOURCE_INIT_FROM));
            }).catch(function (error) {
                //显示异常
                fetchUtil.showError(error.message);
        })
    }
}

/**
 * 根据主键集合删除数据
 * @param primaryKeys 主键数组
 * @param pagination     重新加载数据所需查询条件
 * @returns {Function}
 */
export function deleteByPks(primaryKeys,pagination){
    return dispatch => {
        fetch(Constants.URL_+'/systemResource/delete',
            {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization':auth.loggedIn()? auth.loggedIn().token:''
                },
                body:JSON.stringify(primaryKeys)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                //重新加载数据
                dispatch(listPg(pagination));
                //显示成功
                fetchUtil.showSuccess();
            }).catch(function (error) {
                //显示异常
                fetchUtil.showError(error.message);
        })
    }
}

/**
 * 初始化form
 * @returns {{type: string}}
 */
export function initForm(){
    return {type:SYSTEM_RESOURCE_INIT_FROM}
}