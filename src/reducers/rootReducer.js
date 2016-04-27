/**
 * Created by zhangqiang on 2016/2/23.
 */
import { combineReducers } from 'redux';
import  {login} from './login';
import * as commonType from './commonType'
import * as customer from './customer'
import * as common from './common'
import * as systemMenu from './systemMenu'
import systemResourceReducer from './systemResourceReducer'
import productSaleReducer from './productSaleReducer'
import inputSearchReducer from './inputSearchReducer'
import uploadListReducer from './uploadListReducer'
import proCodeUpLoadReducer from './proCodeUpLoadReducer'
import productReducer from  './product'
import activityProductRelationReducer from './activityProductRelationReducer'
import activityReducer from './activityReducer'
import recommendReducer from './recommendReducer'
import editorProductForAddReducer from './EditorProductForAddReducer'
import editorProductForActivityReducer from './EditorProductForActivityReducer'
import activityDetailReducer from './activityDetailReducer'
const commonTypeReducer = combineReducers({
    businessType : commonType.businessType,
    operationType : commonType.operationType,
    auditingType : commonType.auditingType,
    provinceList : commonType.provinceList,
    cityList : commonType.cityList,
    countyList : commonType.countyList,
    catalogFirst:commonType.catalogFirst,
    catalogSecond:commonType.catalogSecond,
    catalogThird:commonType.catalogThird,
    areaList:commonType.areaList,
    provList:commonType.provList,
});



const customerReducer = combineReducers({
    customerList : customer.customerList,
});

const commonReducer = combineReducers({
    selectedRowKeys : common.selectedRowKeys,
    modalVisiable : common.modalVisiable,
    initAddCustomerForm : common.initAddCustomerForm,
    loading : common.loading,
    uploadFile : common.uploadFile,
});

const systemMenuReducer = combineReducers({
    leftMenu : systemMenu.leftMenu,
    systemMenuList : systemMenu.systemMenuList,
    systemMenu : systemMenu.systemMenu,
    initSystemMenuForm : systemMenu.initSystemMenuForm,
    menuMode:systemMenu.menuMode,
});

const rootReducer = combineReducers({
    login : login,
    commonType:commonTypeReducer,
    customer : customerReducer,
    common : commonReducer,
    systemMenu:systemMenuReducer,
    systemResourceReducer,
    productSaleReducer,
    inputSearchReducer,
    proCodeUpLoadReducer,
    productReducer,
    uploadListReducer,
    activityProductRelationReducer,
    activityReducer,
    recommendReducer,
    editorProductForAddReducer,
    editorProductForActivityReducer,
    activityDetailReducer,
});

export default rootReducer;