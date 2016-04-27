/**
 * Created by zhangqiang on 2016/3/23.
 */
import fetch from 'isomorphic-fetch'
import * as Constants from '../constants/constants'
import fetchUtil from '../utils/fetchUtil'
import auth from '../utils/auth'
export const SYSTEM_RESOURCE_GET_BY_PK = 'SYSTEM_RESOURCE_GET_BY_PK';
export const PRODUCT_SALE_LIST_PG = 'PRODUCT_SALE_LIST_PG';
export const SYSTEM_RESOURCE_ADD = 'SYSTEM_RESOURCE_ADD';
export const SYSTEM_RESOURCE_DELETE = 'SYSTEM_RESOURCE_DELETE';
export const SYSTEM_RESOURCE_UPDATE = 'SYSTEM_RESOURCE_UPDATE';
export const SYSTEM_RESOURCE_INIT_FROM = 'SYSTEM_RESOURCE_INIT_FROM';
export const PRODUCT_SALE_LIST_SUPPLY = 'PRODUCT_SALE_LIST_SUPPLY';
export const PRDOUCT_SALE_INIT_BATCH_UPLOAD = 'PRDOUCT_SALE_INIT_BATCH_UPLOAD';
export const PRDOUCT_SALE_SET_AREAS = 'PRDOUCT_SALE_SET_AREAS';
export const PRDOUCT_SALE_SET_FILE_PATH = 'PRDOUCT_SALE_SET_FILE_PATH';
export const PRDOUCT_SALE_INTI_AREA_PRICE_EDIT = 'PRDOUCT_SALE_INTI_AREA_PRICE_EDIT';
export const PRDOUCT_SALE_SET_AREA_PRICE_CODE = 'PRDOUCT_SALE_SET_AREA_PRICE_CODE';
export const PRDOUCT_SALE_SET_AREA_PRICE_VALUE = 'PRDOUCT_SALE_SET_AREA_PRICE_VALUE';
export const PRDOUCT_SALE_SET_PRODUCT_ID = 'PRDOUCT_SALE_SET_PRODUCT_ID';
export const PRODUCT_SALE_INIT_EDIT_RECORD = 'PRODUCT_SALE_INIT_EDIT_RECORD';
export const PRODUCT_SALE_SET_EDIT_RECORD = 'PRODUCT_SALE_SET_EDIT_RECORD';
export const PRODUCT_SALE_SET_EDITING_RECORD = 'PRODUCT_SALE_SET_EDITING_RECORD';
export const PRODUCT_SALE_LIST_AREA_PRICE_DETAIL = 'PRODUCT_SALE_LIST_AREA_PRICE_DETAIL';
export const PRODUCT_SALE_RE_EIDT_AREA_PRICE_DETAIL = 'PRODUCT_SALE_RE_EIDT_AREA_PRICE_DETAIL';
/**
 * 显示列表数据
 * @param pagination 查询条件
 * @returns {Function}
 */
export function listPg(pagination) {
    return dispatch => {
        dispatch(Constants.LOADING)
        fetch(Constants.URL_ + '/product/listPgProductSales',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(pagination)
            })
            .then(fetchUtil.checkStatus.bind(dispatch))
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                //获取数据
                dispatch(fetchUtil.receivePosts(PRODUCT_SALE_LIST_PG, data));
                //初始化勾选状态
                dispatch({type: Constants.ACTION_INIT_SELECTED_ROW_KEYS});
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            fetchUtil.showError(error.message);
        })
    }
}




/**
 * 初始化批量上传
 * @returns {{type: string, data}}
 */
export function initBatchUpload() {
    return {type: PRDOUCT_SALE_INIT_BATCH_UPLOAD}
}

/**
 * 设置批量上传地域集合
 * @param areas
 * @returns {{type: string, data: *}}
 */
export function setBatchUploadAreas(areas) {
    return {type: PRDOUCT_SALE_SET_AREAS, data: areas};
}

/**
 * 设置批量上传文件路径
 * @param path
 * @returns {{type: string, data: *}}
 */
export function setBatchUploadFilePath(path) {
    return {type: PRDOUCT_SALE_SET_FILE_PATH, data: path};
}

/**
 * 保存批量上传
 * @param batchUpload
 * @returns {Function}
 */
export function saveBatchUpload(batchUpload) {
    return dispatch => {
        dispatch(Constants.LOADING)
        fetch(Constants.URL_ + '/productPolicy/upload',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(batchUpload)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                //显示成功
                //fetchUtil.showSuccess();
                //关闭弹窗
                dispatch({type: Constants.ACTION_HIDE_MODAL, index: 2});
                //弹出成功
                dispatch({type: Constants.ACTION_SHOW_MODAL, index: 3});
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            fetchUtil.showError(error.message);
        })
    }
}

/**
 * 初始化地域价格编辑
 * @returns {{type: string}}
 */
export function initAreaPriceEdit() {
    return {type: PRDOUCT_SALE_INTI_AREA_PRICE_EDIT}
}


/**
 * 设置区域价格
 * @param areaPrice
 * @returns {{type: string, data: Array}}
 */
export function setAreaPriceCode(areaPrice) {
    return {type: PRDOUCT_SALE_SET_AREA_PRICE_CODE, data: areaPrice}
}

/**
 * 设置区域价格
 * @param areaPrice
 * @returns {{type: string, data: Array}}
 */
export function setAreaPriceValue(areaPrice) {
    return {type: PRDOUCT_SALE_SET_AREA_PRICE_VALUE, data: areaPrice}
}

/**
 * 保存价格地域
 * @param areaPrice
 * @returns {Function}
 */
export function saveAreaPrice(areaPrice,pagination) {
    return dispatch => {
        dispatch(Constants.LOADING)
        fetch(Constants.URL_ + '/productPolicy/add',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(areaPrice)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED);
                //reload table
                dispatch(listPg(pagination));
                //显示成功
                fetchUtil.showSuccess();
                //关闭弹窗
                dispatch({type: Constants.ACTION_HIDE_MODAL, index: 1});
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            fetchUtil.showError(error.message);
        })
    }
}

/**
 * 设置productId
 * @param productId
 * @returns {{type: string, productId: *}}
 */
export function setProductId(productId) {
    return {type: PRDOUCT_SALE_SET_PRODUCT_ID, productId: productId}
}

/**
 * 设置要编辑的row
 * @param record
 * @returns {{type: string, record: *}}
 */
export function setEditRecord(record) {

    return {type: PRODUCT_SALE_SET_EDIT_RECORD, record: record};
}

/**
 * 编辑记录
 * @param record
 * @returns {{type: string, record: *}}
 */
export function setEditingRecord(record) {
    return {type: PRODUCT_SALE_SET_EDITING_RECORD, record: record}
}

/**
 * 保存编辑的row
 * @param record
 * @returns {{type: string, record: *}}
 */
export function saveRecord(record, pagination) {
    return dispatch => {
        dispatch(Constants.LOADING)
        fetch(Constants.URL_ + '/product/updateProductInfo',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(record)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                //显示成功
                fetchUtil.showSuccess();
                //重置编辑数据
                dispatch({type: PRODUCT_SALE_INIT_EDIT_RECORD});
                //重新加载数据
                dispatch(listPg(pagination));
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            fetchUtil.showError(error.message);
        })
    }
}

/**
 * 查看销售区域价格列表
 * @param productId
 */
export function listAreaPriceDetail(productId) {
    return dispatch => {
        dispatch({type: PRODUCT_SALE_LIST_AREA_PRICE_DETAIL, data: []});
        dispatch(Constants.LOADING)
        fetch(Constants.URL_ + '/productPolicy/list?key=' + productId,
            {
                method: 'get',
                headers: fetchUtil.getHeader(),
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                //关闭弹窗
                dispatch({type: PRODUCT_SALE_LIST_AREA_PRICE_DETAIL, data: data});
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            fetchUtil.showError(error.message);
        })
    }
}

/**
 * 查看销售区域价格列表
 * @param productId
 */
export function reEditAreaPriceDetail(productId) {
    return dispatch => {
        dispatch({type: PRODUCT_SALE_RE_EIDT_AREA_PRICE_DETAIL, data: []});
        dispatch(Constants.LOADING)
        fetch(Constants.URL_ + '/productPolicy/list?key=' + productId,
            {
                method: 'get',
                headers: fetchUtil.getHeader(),
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                dispatch({type: PRODUCT_SALE_RE_EIDT_AREA_PRICE_DETAIL, data: data});
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            fetchUtil.showError(error.message);
        })
    }
}


/**
 * 上架
 * @param selectedRowKeys
 * @param params
 * @returns {Function}
 */
export function up(selectedRowKeys, pagination) {
    return dispatch => {
        dispatch(Constants.LOADING)
        fetch(Constants.URL_ + '/product/up',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(selectedRowKeys)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                let msg = `共上架${data.allCount}个商品！成功${data.successCount}个，失败${data.failCount}个！`;
                //显示成功
                fetchUtil.success({title: '提示', content: msg});
                //重新加载数据
                dispatch(listPg(pagination));
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            //显示异常
            fetchUtil.showError(error.message);
        })
    }
}

/**
 * 下架
 * @param selectedRowKeys
 * @param params
 * @returns {Function}
 */
export function down(selectedRowKeys, pagination) {
    return dispatch => {
        dispatch(Constants.LOADING)
        fetch(Constants.URL_ + '/product/down',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(selectedRowKeys)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                let msg = `共下架${data.allCount}个商品！成功${data.successCount}个，失败${data.failCount}个！`;
                //显示成功
                fetchUtil.success({title: '提示', content: msg});
                //重新加载数据
                dispatch(listPg(pagination));
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            //显示异常
            fetchUtil.showError(error.message);
        })
    }
}

/**
 * 启用
 * @param selectedRowKeys
 * @param params
 * @returns {Function}
 */
export function startUse(selectedRowKeys, pagination) {
    return dispatch => {
        dispatch(Constants.LOADING)
        fetch(Constants.URL_ + '/product/startUse',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(selectedRowKeys)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                let msg = `共启用${data.allCount}个商品！成功${data.successCount}个，失败${data.failCount}个！`;
                //显示成功
                fetchUtil.success({title: '提示', content: msg});
                //重新加载数据
                dispatch(listPg(pagination));
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            //显示异常
            fetchUtil.showError(error.message);
        })
    }
}

/**
 * 停用
 * @param selectedRowKeys
 * @param params
 * @returns {Function}
 */
export function stopUse(selectedRowKeys, pagination) {
    return dispatch => {
        dispatch(Constants.LOADING)
        fetch(Constants.URL_ + '/product/stopUse',
            {
                method: 'post',
                headers: fetchUtil.getHeader(),
                body: JSON.stringify(selectedRowKeys)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                dispatch(Constants.LOADED)
                let msg = `共停用${data.allCount}个商品！成功${data.successCount}个，失败${data.failCount}个！`;
                //显示成功
                fetchUtil.success({title: '提示', content: msg});
                //重新加载数据
                dispatch(listPg(pagination));
            }).catch(function (error) {
            dispatch(Constants.LOADED)
            //显示异常
            fetchUtil.showError(error.message);
        })
    }
}