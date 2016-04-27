/**
 * Created by zhangqiang on 2016/2/22.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button ,Row,Col,Alert,Icon  } from 'antd';
import { connect } from 'react-redux';
import * as LoginAction from '../../actions/LoginAction'
import { bindActionCreators } from 'redux';
const FormItem = Form.Item;
import './index.less'
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleReset = this.handleReset.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        //console.log('收到表单值：', this.props.form.getFieldsValue());
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            }
            //console.info(values);
            this.props.actions.login(values, this.context.router);
        });
    }

    handleReset(e) {
        e.preventDefault();
        this.props.login.errMsg = "";
        this.props.form.resetFields();
    }

    render() {
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        const { getFieldProps } = this.props.form;
        const userNameProps = getFieldProps('loginName', {
            rules: [
                {required: true, message: '请输入用户名'}
            ],
        });

        const passwordProps = getFieldProps('loginPassword', {
            rules: [
                {required: true, message: '请输入密码'}
            ],
        });
        const err = this.props.login.errMsg != "" ? <Alert message={this.props.login.errMsg} type="error" showIcon /> : ""
        return <div>
            <div className="topMenu row-flex">

                <span>技术支持：方快1研发团队</span>
                <a href="http://www.fangkuaiyi.com/" target="_blank"><Icon type="link" />企业官网</a>
            </div>
            <Row type="flex" className="login-row" justify="space-around" align="middle">
                <Col span="8"></Col>
                <Col span="8">
                    <div className="loginBox">
                        <div className="picBox">
                            <img src="../../img/logo_backstage.png" className="logoImg1" alt=""/>
                            <h2>方快一后台管理系统</h2>
                        </div>
                        <Row >
                            <Col span="14" offset="6">
                                {err}
                            </Col>
                        </Row>

                        <Form horizontal onSubmit={this.handleSubmit} className="loginForm" form={this.props.form}>
                            <FormItem
                                {...formItemLayout}
                                label="用户名："
                            >
                                <Input  placeholder="请输入用户名" {...userNameProps} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="密码：">
                                <Input type="password" placeholder="请输入密码" {...passwordProps} />
                            </FormItem>
                            <Row >
                                <Col span="16" offset="6">
                                    <Button type="primary" htmlType="submit">确定</Button>
                                    &nbsp;&nbsp;&nbsp;
                                    <Button type="ghost" onClick={this.handleReset}>重置</Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Col>
                <Col span="8"></Col>
            </Row>
        </div>
    }
}
function dispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(LoginAction, dispatch)
    };
}
function stateToProps(state) {
    return {
        login: state.login,
    };
}
const contextTypes = {
    router: React.PropTypes.object
};
Login.contextTypes = contextTypes
Login = Form.create()(Login)
export default connect(stateToProps, dispatchToProps)(Login)

