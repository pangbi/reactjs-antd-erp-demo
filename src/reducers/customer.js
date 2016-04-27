/**
 * Created by zhangqiang on 2016/3/10.
 */

import * as Constants from '../constants/constants'

export  function customerList(state = {total:0,resultList:[],current:1}, action) {
    switch (action.type) {
        case Constants.ACTION_SEARCH_CUSTOMER:
            return action.data;
        default:
            return state;
    }
}