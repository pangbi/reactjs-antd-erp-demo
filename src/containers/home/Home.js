/**
 * Created by zhangqiang on 2016/2/22.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Spin } from 'antd';
import {LeftMenu,TopMenu,Footer} from '../../components'
import { connect } from 'react-redux';
import * as SystemMenuAction from '../../actions/SystemMenuAction'
import { bindActionCreators } from 'redux';
import auth from '../../utils/auth'
import './index.less'
export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleTopMenuClick = this.handleTopMenuClick.bind(this);
    }

    componentDidMount() {//已插入真实 DOM 后调用
        //todo 暂时不用
        this.props.systemMenuAction.listLeftMenu();
    };



    handleMenuClick(url) {
        this.context.router.push(url);
    }


    handleTopMenuClick(type) {
        if (type == 'logout'){
            auth.logout();
        }else if(type == 'bars'){
            let objRoot = document.querySelector('#root');
            if(objRoot.classList.contains('spread')){
                this.props.systemMenuAction.showVertical();
                objRoot.classList.remove('spread');
            }else {
                this.props.systemMenuAction.showInline();
                //this.props.systemMenuAction.showVertical();
                objRoot.classList.add('spread');
            }
        }
    }

    render() {
        /*if(!auth.loggedIn()){
         this.context.router.push('/login');
         }*/
        let { loading ,location,menuMode} = this.props;
        return (
            <Spin
                size = "large"
                spining={loading}
            >
                <div className="ant-layout-aside">
                    <LeftMenu leftMenu={this.props.leftMenu} mode={menuMode.mode} location={location} handleMenuClick={this.handleMenuClick}/>
                    <div className="ant-layout-main">
                        <TopMenu loggedIn={auth.loggedIn()} handleTopMenuClick={this.handleTopMenuClick}/>
                        <div className="ant-layout-container">
                            <div className="ant-layout-content">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>
        );
    }
}

function dispatchToProps(dispatch) {
    return {
        systemMenuAction: bindActionCreators(SystemMenuAction, dispatch),
    };
}
function stateToProps(state) {
    return {
        leftMenu: state.systemMenu.leftMenu,
        loading:state.common.loading,
        menuMode: state.systemMenu.menuMode,
    };
}
Home.contextTypes = {
    router: React.PropTypes.object
};
export default connect(stateToProps, dispatchToProps)(Home);
