/**
 * Created by zhangqiang on 2016/2/22.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Upload, Icon ,Button } from 'antd';
import auth from '../../utils/auth'
const FormItem = Form.Item;
class Test extends React.Component {
    normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    render() {
        const { getFieldProps } = this.props.form;

        const au = auth.loggedIn()? auth.loggedIn().token:'';
        const head = {'Authorization':au};
        return (
            <Form horizontal>
                <FormItem
                    label="logo图："
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    help="只能上传excel">
                    <Upload name="file" action="http://10.6.106.21:8383/upload" listType="excel"
                            headers={head}
                        {...getFieldProps('upload', {
                            valuePropName: 'fileList',
                            normalize: this.normFile
                        })}
                    >
                        <Button type="ghost">
                            <Icon type="upload" /> 点击上传
                        </Button>
                    </Upload>
                </FormItem>
            </Form>
        )

    }
}
Test = Form.create()(Test)
export default Test;