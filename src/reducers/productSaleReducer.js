/**
 * Created by zhangqiang on 2016/3/23.
 */
import * as ProductSaleAction from '../actions/ProductSaleAction'
import { combineReducers } from 'redux';
/**
 * 单条记录
 * @param state
 * @param action
 * @returns {*}
 */
function singleResult(state = {}, action) {
    switch (action.type) {
        case ProductSaleAction.SYSTEM_RESOURCE_GET_BY_PK:
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
function pgList(state = {resultList: [], total: 0, pageNo: 1}, action) {
    switch (action.type) {
        case ProductSaleAction.PRODUCT_SALE_LIST_PG:
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
function initForm(state = {}, action) {
    switch (action.type) {
        case ProductSaleAction.SYSTEM_RESOURCE_INIT_FROM:
            return {
                resCode: {},
                resName: {},
                resUrl: {},
                remarks: {},
                creator: {},
                createTime: {},
                updateUser: {},
                updateTime: {},
                showIndex: {},
            };
        default :
            return state;
    }
}


/**
 * 批量上传
 * @param state
 * @returns {*}
 */
function batchUpload(state = {areas: [], file: {}}, action) {
    switch (action.type) {
        case ProductSaleAction.PRDOUCT_SALE_INIT_BATCH_UPLOAD:
            return {areas: [], file: {}};
        case ProductSaleAction.PRDOUCT_SALE_SET_AREAS:
        {
            let result = [];
            let _state = state;
            let {areaCode} = action.data;
            let flag = false;
            _state.areas.map(function (item) {
                if (item.areaCode == areaCode)
                    flag = true;
                else
                    result.push(item)
            })

            if (flag)
                return Object.assign({}, state, {areas: [...result]});
            else
                return Object.assign({}, state, {areas: [...result, action.data]});
        }
        case ProductSaleAction.PRDOUCT_SALE_SET_FILE_PATH:
            return Object.assign(state, {file: action.data});
        default:
            return state;
    }
}


/**
 * 地域价格列表
 * @param state
 * @param action
 * @returns {*}
 */
function areaPriceList(state = [], action) {
    switch (action.type) {
        case ProductSaleAction.PRDOUCT_SALE_INTI_AREA_PRICE_EDIT:
            return [];
        case ProductSaleAction.PRDOUCT_SALE_SET_AREA_PRICE_CODE:
        {
            let result = [];
            let _state = state;
            let {areaCode} = action.data;
            let flag = false;
            _state.map(function (item) {
                if (item.areaCode == areaCode)
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
            return [...data];
        }
        case ProductSaleAction.PRDOUCT_SALE_SET_AREA_PRICE_VALUE:
        {
            let result = [];
            let _state = state;
            let {areaCode,price} = action.data;
            _state.map(function (item) {
                if (item.areaCode == areaCode)
                    result.push(Object.assign({}, item, {price: price}))
                else
                    result.push(item)
            })

            return [...result]
        }
        case ProductSaleAction.PRODUCT_SALE_RE_EIDT_AREA_PRICE_DETAIL:
        {
            let result = [];
            if (action.data && action.data.length > 0) {
                action.data.map(item => {
                    let areaCode = '';
                    let areaName = '';
                    if (item.areaCode) {
                        areaName = item.areaName
                        areaCode = item.areaCode;
                    }else if(item.cityCode){
                        areaName = item.cityName;
                        areaCode = item.cityCode;
                    }else if(item.province){
                        if(item.province == '-1')
                            areaName = '全国';
                        else
                            areaName = item.provinceName;
                        areaCode = item.province;
                    }
                    result.push({
                        areaCode: areaCode,
                        areaName: areaName,
                        price: item.policyPrice ? item.policyPrice : '',
                        provinceCode: item.province ? item.province : '',
                        provinceName: item.provinceName ? item.provinceName : '',
                        cityCode: item.cityCode ? item.cityCode : '',
                        cityName: item.cityName ? item.cityName : '',
                        area: item.areaCode ? item.areaCode : '',
                        showTitle: item.address ? item.address : ''
                    });
                })
            }
            result = sort(result);
            return [...result];
        }
        default:
            return state;
    }
}

function sort(records) {
    let temp;
    for (let i = 0; i < records.length; i++) {
        let areaCode1 = records[i].areaCode;
        for (let j = i + 1; j < records.length; j++) {
            let areaCode2 = records[j].areaCode;
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
 * productId
 * @param state
 * @param action
 * @returns {*}
 */
function productId(state = '', action) {
    switch (action.type) {
        case ProductSaleAction.PRDOUCT_SALE_SET_PRODUCT_ID:
            return action.productId;
        default:
            return state;
    }
}

/**
 * 处于编辑模式的row
 * @param state
 * @param action
 * @returns {*}
 */
function editRecord(state = {}, action) {
    switch (action.type) {
        case ProductSaleAction.PRODUCT_SALE_INIT_EDIT_RECORD:
            return {};
        case ProductSaleAction.PRODUCT_SALE_SET_EDIT_RECORD:
            return action.record;
        case ProductSaleAction.PRODUCT_SALE_SET_EDITING_RECORD:
            return Object.assign({}, state, action.record)
        default:
            return state;
    }
}

/**
 * 查看销售区域及价格列表
 * @param state
 * @param action
 */
function areaPriceDetailList(state = [], action) {
    switch (action.type) {
        case ProductSaleAction.PRODUCT_SALE_LIST_AREA_PRICE_DETAIL:
            return action.data;
        default:
            return state;
    }
}

/**
 * 聚合reducer
 */
export  default combineReducers({
    singleResult,
    pgList,
    initForm,
    batchUpload,
    areaPriceList,
    productId,
    editRecord,
    areaPriceDetailList,
});

