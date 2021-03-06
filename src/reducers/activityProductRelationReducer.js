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

import * as ActivityProductRelationAction from '../actions/ActivityProductRelationAction'
import { combineReducers } from 'redux';

/**
* 单条记录
* @param state
* @param action
* @returns {*}
*/
function singleResult(state = {}, action){
    switch (action.type){
        case ActivityProductRelationAction.ACTIVITY_PRODUCT_RELATION_GET_BY_PK:
            return action.data;
        default :
            return state;
    }
}

/**
* 分页记录
* @param state
* @param action
* @returns {*}
*/
function pgList(state = {resultList:[],total:0,pageNo:1}, action){
    switch (action.type){
        case ActivityProductRelationAction.ACTIVITY_PRODUCT_RELATION_LIST_PG:
            return action.data;
        default :
            return state;
    }
}

/**
* 表单初始化
* @param state
* @param action
* @returns {{}}
*/
function initForm(state={},action){
    switch (action.type){
        case ActivityProductRelationAction.ACTIVITY_PRODUCT_RELATION_INIT_FROM:
            return {
                activityNumber:{},
                productId:{},
                leastUserBuy:{},
                mostUserBuy:{},
                productQuantity:{},
                activitySellInfo:{},
            };
        default :
            return state;
    }
}

/**
* 聚合reducer
*/
export default combineReducers({
    singleResult,
    pgList,
    initForm,
});
