/**
 * Created by zhangqiang on 2016/2/22.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/lib/index.css';

export default class App extends React.Component {

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}