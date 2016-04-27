/**
 * Created by zhangqiang on 2016/2/22.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button ,Row,Col} from 'antd';
import * as CommonTypeAction from '../../actions/CommonTypeAction'
import { bindActionCreators } from 'redux';
import * as patternUtil from '../../utils/patternUtil'
const FormItem = Form.Item;
class AddSystemResource extends React.Component {
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
        //console.log('收到表单值：', this.props.form.getFieldsValue());
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

    /**
     * 渲染组件
     * @returns {XML}
     */
    render() {
        //定义表单组件大小
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };

        const { getFieldProps } = this.props.form;

        //设置表单内容的name，验证规则，默认值
        const resCode = getFieldProps('resCode', {
            rules: [
                {required: true, message: '请输入资源code'}
            ],
        });
        const resName = getFieldProps('resName', {
            rules: [
                {required: true, message: '请输入资源名称'}
            ],
        });
        const resUrl = getFieldProps('resUrl', {
            rules: [
                {required: true, message: '请输入资源URL'}
            ],
        });
        const remarks = getFieldProps('remarks', {
            rules: [
                {required: true, message: '请输入备注'}
            ],
        });
        const showIndex = getFieldProps('showIndex', {
            rules: [
                {required: true, pattern:patternUtil.intPattern,message: '请输入显示顺序'}
            ],
        });

        return (
            <div>
                <Form horizontal onSubmit={this.handleSubmit} form={this.props.form}>
                    <FormItem
                        {...formItemLayout}
                        label="资源code："
                    >
                        <Input placeholder="请输入资源code" {...resCode}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="资源名称："
                    >
                        <Input placeholder="请输入资源名称" {...resName}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="资源URL："
                    >
                        <Input placeholder="请输入资源URL" {...resUrl}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注："
                    >
                        <Input placeholder="请输入备注" {...remarks}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="显示顺序："
                    >
                        <Input placeholder="请输入显示顺序" {...showIndex}/>
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
    handleSave: React.PropTypes.func.isRequired,
    initForm: React.PropTypes.object.isRequired,
};
AddSystemResource.propTypes = propTypes;

//初始化form表单
function mapPropsToFields(props) {
    //console.log('mapPropsToFields', props);
    return props.initForm
}
AddSystemResource = Form.create({mapPropsToFields})(AddSystemResource)
export default AddSystemResource;
