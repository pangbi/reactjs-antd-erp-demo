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

export const ACTIVITY_PRODUCT_RELATION_GET_BY_PK = 'ACTIVITY_PRODUCT_RELATION_GET_BY_PK';
export const ACTIVITY_PRODUCT_RELATION_LIST_PG = 'ACTIVITY_PRODUCT_RELATION_LIST_PG';
export const ACTIVITY_PRODUCT_RELATION_ADD = 'ACTIVITY_PRODUCT_RELATION_ADD';
export const ACTIVITY_PRODUCT_RELATION_DELETE = 'ACTIVITY_PRODUCT_RELATION_DELETE';
export const ACTIVITY_PRODUCT_RELATION_UPDATE = 'ACTIVITY_PRODUCT_RELATION_UPDATE';
export const ACTIVITY_PRODUCT_RELATION_INIT_FROM = 'ACTIVITY_PRODUCT_RELATION_INIT_FROM';

/**
* 根据主键获取单条
* @param key 主键id
* @returns {Function}
*/
export function getByPK(key){
    return dispatch => {
        //使页面处于loading状态
        dispatch(Constants.LOADING)
        fetch(Constants.URL_+'/activityProductRelation/getByPK?key='+key,
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
            dispatch(fetchUtil.receivePosts(ACTIVITY_PRODUCT_RELATION_GET_BY_PK,data));
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
export function listPg(pagination){
    return dispatch => {
        //使页面处于loading状态
        dispatch(Constants.LOADING)
        fetch(Constants.URL_+'/activityProductRelation/listPg',
        {
            method: 'post',
            headers: fetchUtil.getHeader(),
            body:JSON.stringify(pagination)
        })
        .then(fetchUtil.checkStatus)
        .then(fetchUtil.parseJSON)
        .then(function (data) {
            //取消页面loading状态
            dispatch(Constants.LOADED)
            //获取数据
            dispatch(fetchUtil.receivePosts(ACTIVITY_PRODUCT_RELATION_LIST_PG,data));
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
* @param activityProductRelation 添加记录
* @param pagination     重新加载数据所需查询条件
* @returns {Function}
*/
export function add(activityProductRelation,pagination){
    return dispatch => {
        //使页面处于loading状态
        dispatch(Constants.LOADING)
        fetch(Constants.URL_+'/activityProductRelation/add',
        {
            method: 'post',
            headers: fetchUtil.getHeader(),
            body:JSON.stringify(activityProductRelation)
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
            dispatch({type:ACTIVITY_PRODUCT_RELATION_INIT_FROM});
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
* @param activityProductRelation 更新记录
* @param pagination     重新加载数据所需查询条件
* @returns {Function}
*/
export function update(activityProductRelation,pagination){
    return dispatch => {
        //使页面处于loading状态
        dispatch(Constants.LOADING)
        fetch(Constants.URL_+'/activityProductRelation/update',
        {
            method: 'put',
            headers: fetchUtil.getHeader(),
            body:JSON.stringify(activityProductRelation)
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
            dispatch(fetchUtil.receivePosts(ACTIVITY_PRODUCT_RELATION_INIT_FROM));
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
        fetch(Constants.URL_+'/activityProductRelation/delete',
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

/**
* 初始化form
* @returns {{type: string}}
*/
export function initForm(){
    return {type:ACTIVITY_PRODUCT_RELATION_INIT_FROM}
}
