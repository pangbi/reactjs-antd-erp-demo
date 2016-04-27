/**
 * COPYRIGHT (C) 2016 Fky. ALL RIGHTS RESERVED.
 *
 * No part of this publication may be reproduced, stored in a retrieval system,
 * or transmitted, on any form or by any means, electronic, mechanical, photocopying,
 * recording, or otherwise, without the prior written permission of Fky.
 *
 * Created By: Liuzh
 * Created On: 2016-4-12 10:06:30
 *
 * Amendment History:
 *
 * Amended By       Amended On      Amendment Description
 * ------------     -----------     ---------------------------------------------
 *
 **/

import * as RecommendAction from '../actions/RecommendAction'
import { combineReducers } from 'redux';

/**
* 单条记录
* @param state
* @param action
* @returns {*}
*/
function singleResult(state = {}, action){
    switch (action.type){
        case RecommendAction.RECOMMEND_GET_BY_PK:
            return action.data;
        default :
            return state;
    }
}

/**ss
* 分页记录
* @param state
* @param action
* @returns {*}
*/
function pgList(state =[], action){
    switch (action.type){
        case RecommendAction.RECOMMEND_LIST_PG:
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
        case RecommendAction.RECOMMEND_INIT_FROM:
            return {
                recommendNumber:{},
                recommendPositionName:{},
                recommendPositionCode:{},
                recommendProvinceName:{},
                recommendProvinceCode:{},
                recommendSequence:{},
                recommendDataType:{},
            };
        default :
            return state;
    }
}


function editRecommend(state={},action){
    switch (action.type){
        case RecommendAction.RECOMMEND_RESET_RECOMMEND:
            return {};
        case RecommendAction.RECOMMEND_SET_RECOMMEND:
            return Object.assign({},state,action.recommend);
        case RecommendAction.RECOMMEND_SET_AREA_LIST:
            let result = [];
            let areaList = state.areaList || [];
            let {infoCode} = action.data;
            let flag = false;
            areaList.map(function (item) {
                if (item.infoCode == infoCode)
                    flag = true;
                else
                    result.push(item)
            })

            let data = [];
            if (flag)
                data = [...result];
            else
                data = [...result, action.data]
            data = sort(data);
            return Object.assign({},state,{areaList:data});
        default :
            return state;
    }
}

function sort(records) {
    let temp;
    for (let i = 0; i < records.length; i++) {
        let areaCode1 = records[i].infoCode;
        for (let j = i + 1; j < records.length; j++) {
            let areaCode2 = records[j].infoCode;
            if (parseInt(areaCode1) > parseInt(areaCode2)) {
                temp = records[i]
                records[i] = records[j];
                records[j] = temp;
            }
        }
    }
    return records;
}

/**
* 聚合reducer
*/
export default combineReducers({
    singleResult,
    pgList,
    initForm,
    editRecommend,
});
