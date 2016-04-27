/**
 * Created by zhangqiang on 2016/2/25.
 */
import fetch from 'isomorphic-fetch'
import * as Constants from '../constants/constants'
import fetchUtil from '../utils/fetchUtil'
import auth from '../utils/auth'
export function login(user, router) {
    return dispatch => {
//        console.log(JSON.stringify(user))
        fetch(Constants.URL_+'/auth/login',
            {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(fetchUtil.checkStatus)
            .then(fetchUtil.parseJSON)
            .then(function (data) {
                    auth.login({token: data.token, data: data.data})
                    router.push("/adminIndex");
            }).catch(function (error) {
                    dispatch(fetchUtil.receivePosts(Constants.ACTION_LOGIN, {errMsg: error.message}));
                    //fetchUtil.showError(error.message);
        })
    }
}



