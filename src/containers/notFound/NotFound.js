/**
 * Created by zhangqiang on 2016/2/22.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './notfound.less'

export default class NotFound extends React.Component {
    render() {
        return (
            <div className="not-found-wrap">
                <img src="../../img/err_03.jpg" alt="" />

                <a href="javascript:;" className="backIndex">返回首页</a>
            </div>
        )

    }
}