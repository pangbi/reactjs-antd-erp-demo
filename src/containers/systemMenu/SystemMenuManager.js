/**
 * Created by zhangqiang on 2016/2/22.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Button , Row , Col ,Icon ,Form, Input ,DatePicker ,Select ,Modal } from 'antd';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';
import * as SystemMenuActin from '../../actions/SystemMenuAction';
import * as CommonAction from '../../actions/CommonAction';
import { bindActionCreators } from 'redux';
import {AddSystemMenu} from '../../components';
import {UppSystemMenu} from '../../components';
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const columns = [{
    title: '模块名称',
    dataIndex: 'menuName',
    width: 200
}, {
    title: '模块编码',
    dataIndex: 'menuCode',
    width: 100
}, {
    title: '模块父级编码',
    dataIndex: 'parentMenuId',
    width: 100
}, {
    title: '模块显示编号',
    dataIndex: 'menuOrder',
    width: 100
}, {
    title: '模块链接',
    dataIndex: 'pageUrl',
    width: 100
}, {
    title: '创建人',
    dataIndex: 'creator',
    width: 100
}, {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 130
}, {
    title: '修改人',
    dataIndex: 'updateUser',
    width: 100
}, {
    title: '修改时间',
    dataIndex: 'updateTime',
    width: 130
}, {
    title: '备注',
    dataIndex: 'remarks',
    width: 100
},

];


export default class SystemMenuManager extends React.Component {
    constructor(props) {
        super(props);
        this.onSelectChange = this.onSelectChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }


    onSelectChange(selectedRowKeys) {
//        console.log('selectedRowKeys changed: ', selectedRowKeys);
        //this.setState({selectedRowKeys});
        this.props.commonAction.setSelectedRowKeys([...selectedRowKeys]);
    }


    handleSearch(e) {
        e.preventDefault();
//        console.log('收到表单值：', this.props.form.getFieldsValue());
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            }
            this.props.systemMenuActin.listSystemMenu(values);
        });
    }

    handleReset(e) {
        e.preventDefault();
//        console.info(this.props.form);
        this.props.form.resetFields();
    }




    handleDelete(e) {
        e.preventDefault();
        let selectedRowKeys = this.props.selectedRowKeys;
        //console.info(selectedRowKeys);
        let _this = this;
        if (selectedRowKeys.length != 0) {
            confirm({
                title: '您是否确认要删除所选内容',
                onOk() {
                    _this.props.systemMenuActin.deleteSystemMenu(selectedRowKeys, _this.props.form);
                },
                onCancel() {
                }
            });
        }
    }

    showModal(type, field) {
//        console.info(type);
//        console.info(field);
//        console.info(this.props.selectedRowKeys)
        switch (type) {
            case 'add':
            {
                let selectedRowKeys = this.props.selectedRowKeys;
                if(selectedRowKeys && selectedRowKeys.length < 0){
                    this.props.systemMenuActin.initSystemMenuForm();
                }else{
                    this.props.systemMenuActin.initSystemMenuForm();
                }
                break;

            }
            case 'update':
            {
                let selectedRowKeys = this.props.selectedRowKeys;
                if(selectedRowKeys && selectedRowKeys.length > 0){
                    this.props.systemMenuActin.getSystemMenuByPk(selectedRowKeys);
                }
            }
        }
        this.props.commonAction.showModal(field);
    }

    handleCancel(type,field) {
//        console.info(type);
//        console.info(field);
        switch (type) {
            case 'add':
            {
                this.props.systemMenuActin.initSystemMenuForm();
                break;
            }
            case 'update':
            {
                this.props.systemMenuActin.initSystemMenuForm();
            }
        }
        this.props.commonAction.hideModal(field);
    }



    handleSave(form) {
        this.props.systemMenuActin.addSystemMenu(form, this.props.form);
    }
    handleUpdate(form) {
        this.props.systemMenuActin.updateSystemMenu(form, this.props.form);
    }

    componentDidMount() {
        this.props.commonAction.initModal();
        this.props.commonAction.initSelectedKeys();
        this.props.systemMenuActin.listSystemMenu({});
    };

    render() {
        const formItemLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14},
        };
        const { selectedRowKeys,modalVisiable,systemMenuList,initSystemMenuForm,infoSystemMenu} = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;

        const { getFieldProps } = this.props.form;

        return (
            <div>
                <Row type="flex">
                    <Col span="24">
                        <Button
                            type="primary"
                            size="large"
                            className="topBtn"
                            onClick={this.showModal.bind(this,'add',0)}
                        >
                            <Icon type="save"/>添加
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            className="topBtn"
                            disabled={!hasSelected}
                            onClick={this.showModal.bind(this,'update',1)}
                        >
                            <Icon type="edit"/>修改
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            className="topBtn"
                            disabled={!hasSelected}
                            onClick={this.handleDelete}
                        >
                            <Icon type="delete"/>删除
                        </Button>
                        <span
                            style={{ marginLeft: 8 }}>{hasSelected ? `选择了 ${selectedRowKeys.length} 个对象` : ''}</span>
                    </Col>
                </Row>
                <Form inline className="advanced-search-form" onSubmit={this.handleSearch} form={this.props.form}>
                    <Row type="flex">
                        <Col span="5">
                            <FormItem
                                {...formItemLayout}
                                label="模块编码："
                            >
                                <Input {...getFieldProps('bianma')} />
                            </FormItem>
                        </Col>
                        <Col span="5">
                            <FormItem
                                {...formItemLayout}
                                label="模块名称："
                            >
                                <Input {...getFieldProps('mingcheng')} />
                            </FormItem>
                        </Col>
                        <Col span="5">
                            <Button type="primary" htmlType="submit" className="topBtn"><Icon type="search"/>搜索</Button>
                            <Button type="ghost" className="topBtn" onClick={this.handleReset}>清除条件</Button>
                        </Col>
                    </Row>
                </Form>


                <Row>
                    <Col span="24">
                        <Table
                            className="ant-cust-table"
                            rowKey = {record  => record.id}
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={systemMenuList.data}
                            useFixedHeader
                            bordered
                            pagination={false}
                            defaultExpandedRowKeys={systemMenuList.openKeys}
                            bodyStyle={{overflowY:'scroll',width:'100%', height: '60%'}}
                        />
                    </Col>
                </Row>

                <Modal
                    title="添加"
                    visible={modalVisiable[0]}
                    onCancel={this.handleCancel.bind(this,'add',0)}
                    footer={false}
                >
                    <AddSystemMenu handleSave={form => this.handleSave(form)} initForm={initSystemMenuForm} parentId={selectedRowKeys} modalId="0"/>
                </Modal>

                <Modal
                    title="修改"
                    visible={modalVisiable[1]}
                    onCancel={this.handleCancel.bind(this,'update',1)}
                    footer={false}
                >
                    <UppSystemMenu handleSave={form => this.handleUpdate(form)} initForm={infoSystemMenu} modalId="1"/>
                </Modal>

            </div>
        );
    }
}

function dispatchToProps(dispatch) {
    return {
        systemMenuActin: bindActionCreators(SystemMenuActin, dispatch),
        commonAction: bindActionCreators(CommonAction, dispatch),
    };
}
function stateToProps(state) {
    return {
        selectedRowKeys: state.common.selectedRowKeys,
        modalVisiable: state.common.modalVisiable,
        systemMenuList:state.systemMenu.systemMenuList,
        initSystemMenuForm : state.systemMenu.initSystemMenuForm,
        infoSystemMenu :state.systemMenu.systemMenu,
    };
}
SystemMenuManager.contextTypes = {
    router: React.PropTypes.object
};
SystemMenuManager = Form.create()(SystemMenuManager)
export default connect(stateToProps, dispatchToProps)(SystemMenuManager);