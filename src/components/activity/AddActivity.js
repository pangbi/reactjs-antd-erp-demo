/**
 * COPYRIGHT (C) 2016 Fky. ALL RIGHTS RESERVED.
 *
 * No part of this publication may be reproduced, stored in a retrieval system,
 * or transmitted, on any form or by any means, electronic, mechanical, photocopying,
 * recording, or otherwise, without the prior written permission of Fky.
 *
 * Created By: Liuzh
 * Created On: 2016-4-12 10:06:27
 *
 * Amendment History:
 *
 * Amended By       Amended On      Amendment Description
 * ------------     -----------     ---------------------------------------------
 *
 **/

import React from 'react';
import ReactDOM from 'react-dom';
import { Select,Form, Input, Button ,Row, Col, DatePicker,Modal,Icon} from 'antd';
const Option = Select.Option;
import * as CommonTypeAction from '../../actions/CommonTypeAction'
import * as CommonAction from '../../actions/CommonAction';
import * as Constants from '../../constants/constants'
import {CommonUpload} from  '../../components'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as patternUtil from '../../utils/patternUtil'
import dateFormat from 'dateformat';
const FormItem = Form.Item;


class AddActivity extends React.Component {
    constructor(props) {
        super(props);
        this.handleReset = this.handleReset.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.disabledStartDate = this.disabledStartDate.bind(this);
        this.disabledEndDate = this.disabledEndDate.bind(this);
        this.uploadCallBack = this.uploadCallBack.bind(this);
    }

    /**
     * 提交表单
     * @param e
     */
    handleSubmit(e) {
        console.log('收到表单值：', this.props.form.getFieldsValue());
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            }
            this.props.handleSave(values);
        });
    }

    /**
     * 重置表单值为initialValue中的值（如有）
     * @param e
     */
    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
    }
    onChangeStartTime(value) {
        value = dateFormat(value, 'yyyy-mm-dd HH:MM:ss');
        this.props.form.setFieldsValue({startTime: value});
    }
    onChangeEndTime(value) {
        value = dateFormat(value, 'yyyy-mm-dd HH:MM:ss');
        this.props.form.setFieldsValue({endTime: value});
    }

    disabledStartDate(startValue) {
        if (!startValue || !this.props.form.getFieldValue("endValue")) {
            return false;
        }
        return startValue.getTime() >= this.props.form.getFieldValue("endValue").getTime();
    }

    disabledEndDate(endValue) {
        if (!endValue || !this.props.form.getFieldValue("startValue")){
            return false;
        }
        return endValue.getTime() <= this.props.form.getFieldValue("startValue").getTime();
    }

    uploadCallBack(filePath) {
        console.info("文件名："+filePath.name+"文件路径在：" + filePath.dist+","+filePath.path);
        //console.info("this="+this);
        this.props.form.setFieldsValue({activityLogo: filePath.dist});
    }

    showModal(type, field) {
        let activityLogo = this.props.form.getFieldValue('activityLogo');
        Modal.info({
            title: '图片预览',
            content: (
                <div>
                    <img src={Constants.URL_IMG_DOMAIN + "/"+activityLogo} alt="图片预览"/>
                </div>
            )
        });
    }

    handleCancel(type, field) {
        this.props.commonAction.hideModal(field);
    }

    componentDidMount() {
        this.props.commonAction.hideModal(2);
    }

    checkActivityName(rule, value, callback){
        if ( !value ||typeof  value == 'undefined' || value === "" || value.trim() === "") {
            callback([new Error('促销方案名称不能为空')]);
        }
        if(! /^[\s\S]{1,100}$/.test(value)){
            callback([new Error('促销方案名称不超过100字符!')]);
        }else{
            callback();
        }

    }

    /**
     * 渲染组件
     * @returns {XML}
     */
    render() {
        //定义表单组件大小
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14}
        };

        const { getFieldProps } = this.props.form;
        const { modalVisiable} = this.props;

        //设置表单内容的name，验证规则，默认值
        const activityName = getFieldProps('activityName', {
            rules: [
                //{required: true,message: '请输入促销方案名称(不超过100字)',pattern:/^\S{1,100}$/},
                {required: true,message: '请输入促销方案名称(不超过100字符)',min:1,max:100},
                {validator:this.checkActivityName}
            ]
        });
        const startTime = getFieldProps('startTime', {
            rules: [
                {required: true,message: '请输入促销开始时间'}
            ]
        });
        const endTime = getFieldProps('endTime', {
            rules: [
                {required: true,message: '请输入促销结束时间'}
            ]
        });
        const activityType = getFieldProps('activityType', {
            rules: [
                {required: true, message: '请选择促销类型'}
            ]
        });
        const activityLogo = getFieldProps('activityLogo', {
            rules: [
                {required: true,message: '请输入活动Logo'}
            ]
        });
        const giftInfo = getFieldProps('giftInfo', {
            rules: [
                {message: '请输入促销语(不超过100个字符)',pattern:/^[\s\S]{0,100}$/}
            ]
        });
        const activityUrl = getFieldProps('activityUrl', {
            rules: [
                {message: '请输入促销规则说明URL(不超过500个字符)',pattern:patternUtil.urlPattern}
            ]
        });

        return (
            <div>
                <Form horizontal onSubmit={this.handleSubmit} form={this.props.form}>

                    <FormItem {...formItemLayout} label="促销方案名称：">
                        <Input placeholder="请输入促销方案名称" {...activityName}/>
                    </FormItem>

                    <FormItem {...formItemLayout} label="促销开始时间：" >
                        <DatePicker placeholder="请输入促销开始时间"
                                    {...startTime}
                                    disabledDate={this.disabledStartDate}
                                    format="yyyy-MM-dd HH:mm:ss"
                                    showTime
                                    value={this.props.form.getFieldValue("startTime")}
                                    onChange={this.onChangeStartTime.bind(this)}
                        />
                    </FormItem>

                    <FormItem {...formItemLayout} label="促销结束时间：">
                        <DatePicker placeholder="请输入促销结束时间"
                                    {...endTime}
                                    disabledDate={this.disabledEndDate}
                                    format="yyyy-MM-dd HH:mm:ss"
                                    showTime
                                    value={this.props.form.getFieldValue("endTime")}
                                    onChange={this.onChangeEndTime.bind(this)}
                        />
                    </FormItem>

                    <FormItem {...formItemLayout} label="促销类型：">
                        <Select {...activityType}>
                            <Option value="1">满赠</Option>
                            <Option value="2">每满赠</Option>
                            <Option value="3">限时特价</Option>
                            <Option value="4">通用促销</Option>
                        </Select>
                    </FormItem>

                    <FormItem {...formItemLayout} label="活动Logo：" >
                        <Col span="12">
                            <CommonUpload
                                multiple={false}
                                fileType={Constants.FILE_ACCEPT_JPEG + "," + Constants.FILE_ACCEPT_PNG}
                                setFile={this.uploadCallBack}
                                uploadName ="选择图片"
                                isShowFile={false}
                                fileSize = {3}
                            />
                        </Col>
                        <Col span="12">
                            <Button
                                type="primary"
                                size="large"
                                className="topBtn"
                                onClick={this.showModal.bind(this,'preview',2)}
                                disabled={this.props.form.getFieldValue('activityLogo') ? false : true }
                            >
                                <Icon type="primary"/>图片预览
                            </Button>
                        </Col>
                        <Input {...activityLogo} type='hidden'/>
                        <p className="fontRed">注：活动Logo必须上传，大小不超过3M</p>
                    </FormItem>

                    <FormItem {...formItemLayout} label="促销语：" >
                        <Input placeholder="请输入促销语(不超过100个字符)" {...giftInfo}/>
                    </FormItem>

                    <FormItem {...formItemLayout} label="促销规则说明URL：">
                        <Input placeholder="请输入促销规则说明URL(不超过500个字符)" {...activityUrl}/>
                    </FormItem>

                    <Row >
                        <Col span="16" offset="8">
                        <Button type="primary" htmlType="submit">确定</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button type="ghost" onClick={this.handleReset}>重置</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

function dispatchToProps(dispatch) {
    return {
        commonAction: bindActionCreators(CommonAction, dispatch)
    };
}
function stateToProps(state) {
    return {
        modalVisiable: state.common.modalVisiable
    };
}
//约束子组件接受的prop类型
const propTypes = {
    handleSave: React.PropTypes.func.isRequired,
    initForm: React.PropTypes.object.isRequired
};
AddActivity.propTypes = propTypes;

//初始化form表单
function mapPropsToFields(props) {
    return props.initForm
}

AddActivity = Form.create({mapPropsToFields})(AddActivity);
export default connect(stateToProps, dispatchToProps)(AddActivity);

