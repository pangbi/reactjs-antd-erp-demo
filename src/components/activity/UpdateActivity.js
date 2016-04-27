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
import { Form, Input, Button ,Row,Col,DatePicker,Select,Modal,Icon} from 'antd';
import * as CommonTypeAction from '../../actions/CommonTypeAction'
import { bindActionCreators } from 'redux';
import * as patternUtil from '../../utils/patternUtil'
import dateFormat from 'dateformat';
import * as Constants from '../../constants/constants'
import {CommonUpload} from  '../../components'
const FormItem = Form.Item;

class UpdateActivity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: null,
            endTime: null,
        }
        this.handleReset = this.handleReset.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.disabledStartTime = this.disabledStartTime.bind(this);
        this.disabledEndTime = this.disabledEndTime.bind(this);
        this.onChange = this.onChange.bind(this);
        this.uploadCallBack = this.uploadCallBack.bind(this);
        this.showModal =  this.showModal.bind(this);
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
            let NewStartTime = dateFormat(values.startTime, 'yyyy-mm-dd HH:MM:ss');
            let NewEndTime = dateFormat(values.endTime, 'yyyy-mm-dd HH:MM:ss');
            let newData = Object.assign({},values,{startTime:NewStartTime},{endTime:NewEndTime})
            this.props.handleUpdate(newData);
        });
    }

    /**
     * 重置表单数据
     * @param e
     */
    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
    }


    disabledStartTime(startValue) {
        let endTime = this.props.form.getFieldValue('endTime') ;
        if (!startValue || !endTime) {
            return false;
        }
        return startValue.getTime() >= endTime;

    }

    disabledEndTime(endValue) {
        let startTime = this.props.form.getFieldValue('startTime') ;
        if (!endValue || !startTime) {
            return false;
        }
        return endValue.getTime() <= startTime;
    }

    onChange(field, value) {
        this.setState({
            [field]: value,
        });

        if (field == "startTime")
            this.props.form.setFieldsValue({startTime: value});
        if (field == "endTime")
            this.props.form.setFieldsValue({endTime: value});
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

    /**
    * 渲染组件
    * @returns {XML}
    */
    render() {
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        const {singleResult} = this.props;

        const { getFieldProps } = this.props.form;

        //设置表单内容的name,验证规则,默认值

        const activityName = getFieldProps('activityName', {
            rules: [
                {required: true, message: '请输入促销方案名称'}
            ],
            initialValue: singleResult.activityName,
        });
        const activityType = getFieldProps('activityType', {
            rules: [
                {required: true, message: '请选择促销类型 '}
            ],
            initialValue:singleResult.activityType,
        });

        const activityLogo = getFieldProps('activityLogo', {
            rules: [
                {required: true,message: '请上传LOGO'}
            ],
           initialValue:singleResult.activityLogo,
        });

        const activityUrl = getFieldProps('activityUrl', {
            rules: [
                {message: '请输入促销规则说明URL(不超过500个字符)',pattern:patternUtil.urlPattern}
            ],
            initialValue:singleResult.activityUrl,
        });

        const startTime = getFieldProps('startTime', {
             rules: [
                    {required: true, type: 'date', message: '请输入促销开始时间',}
              ],
              initialValue: singleResult.startTime == null ? singleResult.startTime : (new Date(singleResult.startTime.replace(/-/g, "/"))),
        });

        const endTime = getFieldProps('endTime', {
            rules: [
                {required: true, type: 'date', message: '请输入促销结束时间'}
            ],
            initialValue: singleResult.endTime == null ? singleResult.endTime : (new Date(singleResult.endTime.replace(/-/g, "/"))),
        });

        const giftInfo = getFieldProps('giftInfo', {
            rules: [
                {message: '请输入促销语(不超过100个字符)', pattern: /^\S{0,100}$/}
            ],
            initialValue: singleResult.giftInfo,
        });


        const activityNumber = getFieldProps('activityNumber', {
            rules: [
                {message: '请输入活动编号'}
            ],
            initialValue:singleResult.activityNumber,
        });

        return (
            <div>
                <Form horizontal onSubmit={this.handleSubmit} form={this.props.form}>
                    <FormItem>
                        <Input type="hidden"   {...getFieldProps('activityId', {initialValue:singleResult.activityId})}/>
                    </FormItem>

                    <FormItem>
                        <Input type="hidden"  {...getFieldProps('activityStatus', {initialValue:singleResult.activityStatus})}/>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="促销方案编号："
                    >
                        <p>{this.props.form.getFieldValue('activityNumber')}</p>
                    </FormItem>

                    <FormItem
                            {...formItemLayout}
                            label="促销方案名称："
                    >
                          <Input placeholder="请输入促销方案名称" { ...activityName} disabled={(singleResult && singleResult.activityStatus && (singleResult.activityStatus==1))? false:true}/>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="促销时间："
                    >
                            <DatePicker
                                {...startTime}
                                format="yyyy-MM-dd HH:mm:ss"
                                disabledDate={this.disabledStartTime}
                                value={this.props.form.getFieldValue('startTime')}
                                placeholder="开始日期"
                                showTime
                                disabled={(singleResult && singleResult.activityStatus && (singleResult.activityStatus==1||singleResult.activityStatus==2))? false:true}
                                onChange={this.onChange.bind(this,'startTime')}
                            />
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="至："
                    >
                                <DatePicker
                                    {...endTime}
                                    format="yyyy-MM-dd HH:mm:ss"
                                    disabledDate={this.disabledEndTime}
                                    showTime
                                    value={this.props.form.getFieldValue('endTime')}
                                    placeholder="结束日期"
                                    disabled={(singleResult && singleResult.activityStatus && (singleResult.activityStatus!=3))? false:true}
                                    onChange={this.onChange.bind(this,'endTime')}
                               />
                        </FormItem >

                    <FormItem
                        {...formItemLayout}
                        label="促销类型："
                    >
                        <Select
                            {...activityType}
                            size="large"
                            placeholder="促销类型"
                            disabled>
                            <Option value="1">满赠</Option>
                            <Option value="2">每满赠</Option>
                            <Option value="3">限时特价</Option>
                            <Option value="4">通用促销</Option>
                        </Select>
                    </FormItem>

                    <FormItem {...formItemLayout} label="活动Logo：">
                        <Col span="10">
                        <CommonUpload
                            multiple={false}
                            fileType={Constants.FILE_ACCEPT_JPEG+","+Constants.FILE_ACCEPT_PNG}
                            setFile={this.uploadCallBack}
                            fileSize = {3}
                            uploadName ="选择图片"
                            isShowFile={false}
                        />

                        <Input {...activityLogo} type='hidden'/>
                        </Col>
                        <Col span="12">
                        <Button
                            type="primary"
                            className="topBtn"
                            onClick={this.showModal.bind(this,'preview',3)}
                        >
                            <Icon type="primary"/>图片预览
                        </Button>
                     </Col>
                        <p className="fontRed">注：活动Logo必须上传，大小不超过3M</p>
                    </FormItem>

                    <FormItem
                            {...formItemLayout}
                            label="促销语："
                    >
                        <Input placeholder="请输入促销语(不超过100个字符)" {...giftInfo}/>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="促销规则说明URL："
                    >
                        <Input placeholder="请输入促销规则说明URL(不超过500个字符)" {...activityUrl}/>
                    </FormItem>

                    <Row >
                        <Col span="16" offset="8">
                        <Button type="primary" htmlType="submit">确定</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button type="ghost" onClick={this.props.onCancel}>取消</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}
//约束子组件接受的prop类型
const propTypes = {
    handleUpdate: React.PropTypes.func.isRequired,
    singleResult: React.PropTypes.object.isRequired,
    initForm: React.PropTypes.object.isRequired,
    onCancel: React.PropTypes.func.isRequired,
};
UpdateActivity.propTypes = propTypes;

//初始化form表单
function mapPropsToFields(props) {
    return props.initForm
}

UpdateActivity = Form.create({mapPropsToFields})(UpdateActivity)
export default UpdateActivity;
