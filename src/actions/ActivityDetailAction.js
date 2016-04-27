/**
 * COPYRIGHT (C) 2016 Fky. ALL RIGHTS RESERVED.
 *
 * No part of this publication may be reproduced, stored in a retrieval system,
 * or transmitted, on any form or by any means, electronic, mechanical, photocopying,
 * recording, or otherwise, without the prior written permission of Fky.
 *
 * Created By: Liuzh
 * Created On: 2016-4-12 10:06:27
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

export const ACTIVITY_DETAIL_GET_BY_PK = 'ACTIVITY_DETAIL_GET_BY_PK';
export const ACTIVITY_DETAIL_PRODUCT_LIST_PG = 'ACTIVITY_DETAIL_PRODUCT_LIST_PG';
export const ACTIVITY_DETAIL_LOG = 'ACTIVITY_DETAIL_LOG';

/**
* 根据主键获取单条
* @param key 主键id
* @returns {Function}
*/
export function getByPK(key){
    return dispatch => {
        //使页面处于loading状态
        dispatch(Constants.LOADING)
        fetch(Constants.URL_+'/activity/getActivityInfo?activityId='+key,
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
            dispatch(fetchUtil.receivePosts(ACTIVITY_DETAIL_GET_BY_PK,data));
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
        fetch(Constants.URL_+'/activityProductRelation/listPgActivityProductDetail',
        {
            method: 'PUT',
            headers: fetchUtil.getHeader(),
            body:JSON.stringify(pagination)
        })
        .then(fetchUtil.checkStatus)
        .then(fetchUtil.parseJSON)
        .then(function (data) {
            //取消页面loading状态
            dispatch(Constants.LOADED)
            //获取数据
            dispatch(fetchUtil.receivePosts(ACTIVITY_DETAIL_PRODUCT_LIST_PG,data));
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
 * 显示列表数据
 * @param pagination 查询条件
 * @returns {Function}
 */
export function logList(pk){
    return dispatch => {
        //使页面处于loading状态
        dispatch(Constants.LOADING)
        fetch(Constants.URL_+'/activity/listActivityLog',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body:JSON.stringify({activityId:pk})
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                //取消页面loading状态
                dispatch(Constants.LOADED)
                //获取数据
                dispatch(fetchUtil.receivePosts(ACTIVITY_DETAIL_LOG,data));
                //初始化勾选状态
            }).catch(function (error) {
            //取消页面loading状态
            dispatch(Constants.LOADED)
            fetchUtil.showError(error.message);
        })
    }
}




/**
* 初始化form
* @returns {{type: string}}
*/
export function initForm(){
    return {type:ACTIVITY_DETAIL_INIT_FROM}
}
