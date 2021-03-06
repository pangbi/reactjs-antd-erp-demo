/**
 * COPYRIGHT (C) 2016 Fky. ALL RIGHTS RESERVED.
 *
 * No part of this publication may be reproduced, stored in a retrieval system,
 * or transmitted, on any form or by any means, electronic, mechanical, photocopying,
 * recording, or otherwise, without the prior written permission of Fky.
 *
 * Created By: Liuzh
 * Created On: 2016-4-12 10:06:29
 *
 * Amendment History:
 *
 * Amended By       Amended On      Amendment Description
 * ------------     -----------     ---------------------------------------------
 *
 **/

import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button ,Row,Col} from 'antd';
import * as CommonTypeAction from '../../actions/CommonTypeAction'
import { bindActionCreators } from 'redux';
import * as patternUtil from '../../utils/patternUtil'

const FormItem = Form.Item;

class UpdateActivityProductRelation extends React.Component {
    constructor(props) {
        super(props);
        this.handleReset = this.handleReset.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * 提交表单
     * @param e
     */
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            }
            this.props.handleUpdate(values);
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
        const activityNumber = getFieldProps('activityNumber', {
            rules: [
                {required: true, message: '请输入促销活动编号'}
            ],
            initialValue:singleResult.activityNumber,
        });
        const productId = getFieldProps('productId', {
            rules: [
                {required: true, pattern:patternUtil.numberPattern(0), message: '请输入商品ID主键'}
            ],
            initialValue:singleResult.productId,
        });
        const leastUserBuy = getFieldProps('leastUserBuy', {
            rules: [
                {required: true, pattern:patternUtil.numberPattern(0), message: '请输入用户起批量'}
            ],
            initialValue:singleResult.leastUserBuy,
        });
        const mostUserBuy = getFieldProps('mostUserBuy', {
            rules: [
                {required: true, pattern:patternUtil.numberPattern(0), message: '请输入用户限购量'}
            ],
            initialValue:singleResult.mostUserBuy,
        });
        const productQuantity = getFieldProps('productQuantity', {
            rules: [
                {required: true, pattern:patternUtil.numberPattern(0), message: '请输入活动库存量'}
            ],
            initialValue:singleResult.productQuantity,
        });
        const activitySellInfo = getFieldProps('activitySellInfo', {
            rules: [
                {message: '请输入活动促销语'}
            ],
            initialValue:singleResult.activitySellInfo,
        });

        return (
            <div>
                <Form horizontal onSubmit={this.handleSubmit} form={this.props.form}>
                    <FormItem>
                        <Input type="hidden"  {...getFieldProps('relationId', {initialValue:singleResult.relationId})}/>
                    </FormItem>
                    <FormItem
                            {...formItemLayout}
                            label="促销活动编号："
                    >
                        <Input placeholder="请输入促销活动编号" {...activityNumber}/>
                    </FormItem>
                    <FormItem
                            {...formItemLayout}
                            label="商品ID主键："
                    >
                        <Input placeholder="请输入商品ID主键" {...productId}/>
                    </FormItem>
                    <FormItem
                            {...formItemLayout}
                            label="用户起批量："
                    >
                        <Input placeholder="请输入用户起批量" {...leastUserBuy}/>
                    </FormItem>
                    <FormItem
                            {...formItemLayout}
                            label="用户限购量："
                    >
                        <Input placeholder="请输入用户限购量" {...mostUserBuy}/>
                    </FormItem>
                    <FormItem
                            {...formItemLayout}
                            label="活动库存量："
                    >
                        <Input placeholder="请输入活动库存量" {...productQuantity}/>
                    </FormItem>
                    <FormItem
                            {...formItemLayout}
                            label="活动促销语："
                    >
                        <Input placeholder="请输入活动促销语" {...activitySellInfo}/>
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
//约束子组件接受的prop类型
const propTypes = {
    handleUpdate: React.PropTypes.func.isRequired,
    singleResult: React.PropTypes.object.isRequired,
    initForm: React.PropTypes.object.isRequired,
};
UpdateActivityProductRelation.propTypes = propTypes;

//初始化form表单
function mapPropsToFields(props) {
    return props.initForm
}

UpdateActivityProductRelation = Form.create({mapPropsToFields})(UpdateActivityProductRelation)
export default UpdateActivityProductRelation;
