/**
 * COPYRIGHT (C) 2016 Fky. ALL RIGHTS RESERVED.
 *
 * No part of this publication may be reproduced, stored in a retrieval system,
 * or transmitted, on any form or by any means, electronic, mechanical, photocopying,
 * recording, or otherwise, without the prior written permission of Fky.
 *
 * Created By: Liuzh
 * Created On: 2016-4-12 10:06:29
 *
 * Amendment History:
 *
 * Amended By       Amended On      Amendment Description
 * ------------     -----------     ---------------------------------------------
 *
 **/

import fetch from 'isomorphic-fetch'
import * as Constants from '../constants/constants'
import fetchUtil from '../utils/fetchUtil'

export const RECOMMEND_GET_BY_PK = 'RECOMMEND_GET_BY_PK';
export const RECOMMEND_LIST_PG = 'RECOMMEND_LIST_PG';
export const RECOMMEND_ADD = 'RECOMMEND_ADD';
export const RECOMMEND_DELETE = 'RECOMMEND_DELETE';
export const RECOMMEND_UPDATE = 'RECOMMEND_UPDATE';
export const RECOMMEND_INIT_FROM = 'RECOMMEND_INIT_FROM';
export const RECOMMEND_RESET_RECOMMEND = 'RECOMMEND_RESET_RECOMMEND';
export const RECOMMEND_SET_RECOMMEND = 'RECOMMEND_SET_RECOMMEND';
export const RECOMMEND_SET_AREA_LIST = 'RECOMMEND_SET_AREA_LIST';
/**
* 根据主键获取单条
* @param key 主键id
* @returns {Function}
*/
export function getByPK(key){
    return dispatch => {
        //使页面处于loading状态
        dispatch(Constants.LOADING)
        fetch(Constants.URL_+'/recommend/getDtoByPK?key='+key,
        {
            method: 'get',
            headers: fetchUtil.getHeader(),
        })
        .then(fetchUtil.checkStatus)
        .then(fetchUtil.parseJSON)
        .then(function (data) {
            //取消页面loading状态
            dispatch(Constants.LOADED)
            //获取数据
            dispatch({type:RECOMMEND_SET_RECOMMEND,recommend:data});
        }).catch(function (error) {
            //取消页面loading状态
            dispatch(Constants.LOADED)
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
export function listPg(recommendNumber){
    return dispatch => {
        //使页面处于loading状态
        dispatch(Constants.LOADING)
        fetch(Constants.URL_+'/recommend/listPg',
        {
            method: 'post',
            headers: fetchUtil.getHeader(),
            body:JSON.stringify({recommendNumber:recommendNumber})
        })
        .then(fetchUtil.checkStatus)
        .then(fetchUtil.parseJSON)
        .then(function (data) {
            //取消页面loading状态
            dispatch(Constants.LOADED)
            //获取数据
            dispatch(fetchUtil.receivePosts(RECOMMEND_LIST_PG,data));
            //初始化勾选状态
            dispatch({type:Constants.ACTION_INIT_SELECTED_ROW_KEYS});
        }).catch(function (error) {
            //取消页面loading状态
            dispatch(Constants.LOADED)
            fetchUtil.showError(error.message);
        })
    }
}

/**
* 添加记录
* @param recommend 添加记录
* @param pagination     重新加载数据所需查询条件
* @returns {Function}
*/
export function add(recommend,pagination){
    return dispatch => {
        //使页面处于loading状态
        dispatch(Constants.LOADING)
        fetch(Constants.URL_+'/recommend/addRecommendInfo',
        {
            method: 'post',
            headers: fetchUtil.getHeader(),
            body:JSON.stringify(recommend)
        })
        .then(fetchUtil.checkStatus)
        .then(fetchUtil.parseJSON)
        .then(function (data) {
            //取消页面loading状态
            dispatch(Constants.LOADED)
            //显示成功
            fetchUtil.showSuccess();
            //重新加载数据
            dispatch(listPg(pagination));
            //重置选中的key
            //关闭弹窗
            dispatch({type:Constants.ACTION_HIDE_MODAL,index:0});
            //初始化新增表单
            dispatch({type:RECOMMEND_RESET_RECOMMEND});
        }).catch(function (error) {
            //取消页面loading状态
            dispatch(Constants.LOADED)
            //显示异常
            fetchUtil.showError(error.message);
        })
    }
}

/**
* 更新记录
* @param recommend 更新记录
* @param pagination     重新加载数据所需查询条件
* @returns {Function}
*/
export function update(recommend,pagination){
    return dispatch => {
        //使页面处于loading状态
        dispatch(Constants.LOADING)
        fetch(Constants.URL_+'/recommend/updateRecommendInfo',
        {
            method: 'put',
            headers: fetchUtil.getHeader(),
            body:JSON.stringify(recommend)
        })
        .then(fetchUtil.checkStatus)
        .then(fetchUtil.parseJSON)
        .then(function (data) {
            //取消页面loading状态
            dispatch(Constants.LOADED)
            //显示成功
            fetchUtil.showSuccess();
            //重新加载数据
            dispatch(listPg(pagination));
            //关闭弹窗
            dispatch({type:Constants.ACTION_HIDE_MODAL,index:1});
            //初始化新增表单
            dispatch(fetchUtil.receivePosts(RECOMMEND_INIT_FROM));
        }).catch(function (error) {
            //取消页面loading状态
            dispatch(Constants.LOADED)
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
        //使页面处于loading状态
        dispatch(Constants.LOADING)
        fetch(Constants.URL_+'/recommend/delete',
        {
            method: 'post',
            headers: fetchUtil.getHeader(),
            body:JSON.stringify(primaryKeys)
        })
        .then(fetchUtil.checkStatus)
        .then(fetchUtil.parseJSON)
        .then(function (data) {
            //取消页面loading状态
            dispatch(Constants.LOADED)
            //重新加载数据
            dispatch(listPg(pagination));
            //显示成功
            fetchUtil.showSuccess();
        }).catch(function (error) {
            //取消页面loading状态
            dispatch(Constants.LOADED)
            //显示异常
            fetchUtil.showError(error.message);
        })
    }
}

export function setRecomend(recommend){
    return {type:RECOMMEND_SET_RECOMMEND,recommend:recommend};
}

export function setAreaList(data){
    return {type:RECOMMEND_SET_AREA_LIST,data:data};
}

export function resetRecommend(){
    return {type:RECOMMEND_RESET_RECOMMEND};
}

/**
* 初始化form
* @returns {{type: string}}
*/
export function initForm(){
    return {type:RECOMMEND_INIT_FROM}
}
