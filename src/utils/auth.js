/**
 * Created by zhangqiang on 2016/2/29.
 */
import cookie from 'react-cookie'
import * as Constants from '../constants/constants'
import { browserHistory } from 'react-router'
module.exports = {
    loggedIn: function () {
        //console.info("cookie:"+cookie.load(Constants.COOKIE_KEY));
        return cookie.load(Constants.COOKIE_KEY);
    },
    login: function (value) {
        //console.info("cookie:"+cookie.load(Constants.COOKIE_KEY));
        cookie.save(Constants.COOKIE_KEY,value);
    },
    logout: function () {
        //console.info("cookie:"+cookie.load(Constants.COOKIE_KEY));
        cookie.remove(Constants.COOKIE_KEY);
        browserHistory.push('/');
    }
}
