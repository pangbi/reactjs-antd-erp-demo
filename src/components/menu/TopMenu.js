/**
 * Created by zhangqiang on 2016/2/22.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import './index.less'
export default class TopMenu extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick    = this.handleClick.bind(this);
    }

    handleClick(e) {
//        console.info('click key ', e.key);
        this.props.handleTopMenuClick(e.key);
    }


    render() {
        return (
            <div className='ant-layout-header'>
                <Menu className="header-menu" onClick={this.handleClick}
                      mode="horizontal">

                    <Menu.Item key="bars" className="totalBtn-wrap" style={{float:'left',border:0}}>
                        <Icon className="totalBtn" type="bars"  />
                    </Menu.Item>

                    <Menu.Item key="logo" style={{float:'left',border:0}}>
                        <div className="topImg"><img src="./img/logo.png"/></div>
                    </Menu.Item>

                    <Menu.Item key="logout">
                        <span><Icon type="logout" />退出</span>
                    </Menu.Item>
                    <Menu.Item key="user">
                        <span><Icon type="user" />{this.props.loggedIn ? this.props.loggedIn.data.loginName :''}</span>
                    </Menu.Item>
                </Menu>
            </div>
        )
    }
}

//约束子组件接受的prop类型
const propTypes = {
    loggedIn: React.PropTypes.object.isRequired,//登录用户信息
    handleTopMenuClick: React.PropTypes.func.isRequired,//点击节点调用方法
};
TopMenu.propTypes = propTypes;