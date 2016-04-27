/**
 * Created by zhangqiang on 2016/2/22.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button ,Row,Col,Alert,Select,Radio,DatePicker } from 'antd';
import { connect } from 'react-redux';
import * as CommonTypeAction from '../../actions/CommonTypeAction'
import { bindActionCreators } from 'redux';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class AddCustomer extends React.Component {
    constructor(props) {
        super(props);
        this.handleReset = this.handleReset.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
//        console.log('收到表单值：', this.props.form.getFieldsValue());
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            }
            this.props.handleSave(values);
        });
    }

    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
    }

    componentDidMount() {
        //初始化数据
        this.props.commonTypeAction.listBusinessType();
        this.props.commonTypeAction.listOperactionType();
        this.props.commonTypeAction.listAuditingType();
        this.props.commonTypeAction.listProvince();
    };

    checkTel(rule, value, callback) {
        if (value) {
            if(value.length != 11)
                callback(new Error('请输入11位的电话号码!'));
            else
                callback();
        } else {
            callback();
        }
    }

    render() {
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };

        const { businessType,operationType} = this.props;

        const businessTypeOption = businessType.map(function (data) {
            return (
                <Option key={data.infoCode} value={data.infoCode}>{data.infoName}</Option>
            )
        });

        const operationTypeOption = operationType.map(function (data) {
            return (
                <Option key={data.infoCode} value={data.infoCode}>{data.infoName}</Option>
            )
        });

        const { getFieldProps } = this.props.form;

        const companyNameProps = getFieldProps('companyName', {
            rules: [
                {required: true, message: '请输入公司名称'}
            ],
        });

        const customerTypeProps = getFieldProps('customerType', {
            rules: [
                {required: true, message: '请选择企业类型'}
            ],
        });

        const businessTypeProps = getFieldProps('businessType', {
            rules: [
                {required: true, message: '请选择经营类型'}
            ],
        });

        const contactProps = getFieldProps('contact', {
            rules: [
                {required: true, message: '请输入联系人'}
            ],
        });

        const telProps = getFieldProps('tel', {
            rules: [
                {required: true, message: '请输入联系方式'},
                {validator:this.checkTel}
            ],
        });

        const addressProps = getFieldProps('address', {
            rules: [
                {required: true, message: '请输入联系方式'}
            ],
        });

        const remarkProps = getFieldProps('remark', {
            rules: [
                {required: true, message: '请输入联系方式'}
            ],
        });

        const addDateProps = getFieldProps('addDate', {
            rules: [
                {required: true, type: 'date', message: '请输入失效时间'}
            ],
        });

        return (
            <div>
                <Form horizontal onSubmit={this.handleSubmit} form={this.props.form}>
                    <FormItem
                        {...formItemLayout}
                        label="公司名称："
                    >
                        <Input name="companyName" id="companyName" placeholder="请输入公司名称" {...companyNameProps} />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="企业类型：">
                        <Select
                            {...customerTypeProps}
                            size="large"
                            placeholder="请选择企业类型"
                        >
                            {businessTypeOption}
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="经营类型：">
                        <Select
                            {...businessTypeProps}
                            size="large"
                            placeholder="请选择经营类型"
                        >
                            {operationTypeOption}
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="联系人：">
                        <Input type="text" placeholder="请输入联系人" {...contactProps} />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="联系方式：">
                        <Input type="text" placeholder="请输入联系方式" {...telProps} />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="地址：">
                        <Input type="text" placeholder="请输入地址" {...addressProps} />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="失效时间：">
                        <DatePicker
                            {...addDateProps}
                            placeholder="请输入失效时间"
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注：">
                        <Input type="textarea" placeholder="请输入备注" {...remarkProps} />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="是否是VIP   ：">
                        <RadioGroup
                            {...getFieldProps('isVip', {initialValue: false})}
                        >
                            <Radio value={true}>是VIP</Radio>
                            <Radio value={false}>不是VIP</Radio>
                        </RadioGroup>

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
        )
    }
}
function dispatchToProps(dispatch) {
    return {
        commonTypeAction: bindActionCreators(CommonTypeAction, dispatch),
    };
}
function stateToProps(state) {
    return {
        businessType: state.commonType.businessType,
        operationType: state.commonType.operationType,
    };
}
const propTypes = {
    handleSave: React.PropTypes.func.isRequired,
    initForm: React.PropTypes.object.isRequired,
};
AddCustomer.propTypes = propTypes;

//初始化form表单
function mapPropsToFields(props){
//    console.log('mapPropsToFields', props);
    return props.initForm
}
AddCustomer = Form.create({mapPropsToFields})(AddCustomer)
export default connect(stateToProps, dispatchToProps)(AddCustomer);
