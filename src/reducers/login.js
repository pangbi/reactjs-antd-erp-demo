/**
 * Created by zhangqiang on 2016/2/25.
 */

import * as Constants from '../constants/constants'

export  function login(state = {errMsg: ""}, action) {
    switch (action.type) {
        case Constants.ACTION_LOGIN:
            return action.data;
        default:
            return state;
    }
}

