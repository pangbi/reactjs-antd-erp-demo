/**
 * Created by zhangqiang on 2016/2/22.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Button ,Row,Col} from 'antd';
import * as CommonTypeAction from '../../actions/CommonTypeAction'
import { bindActionCreators } from 'redux';
const FormItem = Form.Item;
class AddSystemMenu extends React.Component {
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
    };

    checkTel(rule, value, callback) {
        if (value) {
            if (value.length != 11)
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

        const { getFieldProps } = this.props.form;
        const {initForm,parentId} = this.props;
        let pid = "";
        if(parentId&&parentId.length>0){
            pid = parentId[0];
        }

        const menuName = getFieldProps('menuName', {
            rules: [
                {required: true, message: '请输入模块名称'}
            ],
        });
        const menuCode = getFieldProps('menuCode', {
            rules: [
                {required: true, message: '请输入模块编号'}
            ],
        });
        const parentMenuId = getFieldProps('parentMenuId', {
            rules: [
            ],
            initialValue:pid+''
        });
        const menuOrder = getFieldProps('menuOrder', {
            rules: [
                {required: true, message: '请输入模块显示编号'}
            ],
        });
        const pageUrl = getFieldProps('pageUrl', {
            rules: [
                {required: true, message: '请输入模块链接'}
            ],
        });
        const remarks = getFieldProps('remarks', {
            rules: [
                {required: true, message: '请输入备注'}
            ],
        });

        return (
            <div>
                <Form horizontal onSubmit={this.handleSubmit} form={this.props.form}>
                    <FormItem
                        {...formItemLayout}
                        label="模块名称："
                    >
                        <Input placeholder="请输入模块名称" {...menuName}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="模块编码："
                    >
                        <Input placeholder="请输入模块编码" {...menuCode}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="模块父级编码："
                    >
                        <Input placeholder="请输入父级模块" {...parentMenuId}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="模块显示编号："
                    >
                        <Input placeholder="请输入模块显示编号" {...menuOrder}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="模块链接："
                    >
                        <Input placeholder="请输入模块链接" {...pageUrl}/>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注："
                    >
                        <Input placeholder="请输入备注" {...remarks}/>
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
const propTypes = {
    handleSave: React.PropTypes.func.isRequired,
    initForm: React.PropTypes.object.isRequired,
    parentId:React.PropTypes.array.isRequired
};
AddSystemMenu.propTypes = propTypes;

//初始化form表单
function mapPropsToFields(props) {
//    console.log("==========================================")
//    console.log('mapPropsToFields', props);
    return props.initForm
}
AddSystemMenu = Form.create({mapPropsToFields})(AddSystemMenu)
export default AddSystemMenu;
