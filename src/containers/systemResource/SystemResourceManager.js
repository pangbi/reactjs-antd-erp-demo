/**
 * Created by zhangqiang on 2016/2/22.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Button , Row , Col ,Icon ,Form, Input ,DatePicker ,Select ,Modal } from 'antd';
import {AddSystemResource , UpdateSystemResource} from '../../components'
import { connect } from 'react-redux';
import * as SystemResourceAction from '../../actions/SystemResourceAction';
import * as CommonAction from '../../actions/CommonAction'
import { bindActionCreators } from 'redux';
const FormItem = Form.Item;
const confirm = Modal.confirm;

//定义表头
const columns = [{
    title:'序号',
    render: (text, record, index) => <span>{index+1}</span>,
    width:35
},{
    title: '资源code',
    dataIndex: 'resCode',
    width: 100
}, {
    title: '资源名称',
    dataIndex: 'resName',
    width: 100
}, {
    title: '资源URL',
    dataIndex: 'resUrl',
    width: 100
}, {
    title: '备注',
    dataIndex: 'remarks',
    width: 100
}, {
    title: '显示顺序',
    dataIndex: 'showIndex',
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
},

];


export default class SystemResourceManager extends React.Component {
    /**
     * 构造方法 初始化数据
     * @param props
     */
    constructor(props) {
        super(props);
        //初始化bind(this)
        this.onSelectChange = this.onSelectChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleTableSizeChange = this.handleTableSizeChange.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
    }


    /**
     * 点击table第一列checkBox时调用，
     * @param selectedRowKeys 所有选中row的key的集合
     */
    onSelectChange(selectedRowKeys) {
        this.props.commonAction.setSelectedRowKeys([...selectedRowKeys]);
    }


    /**
     * 查询
     * @param e
     */
    handleSearch(e) {
        //组织表单默认提交
        e.preventDefault();
//        console.log('收到表单值：', this.props.form.getFieldsValue());
        //验证表单
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            }
            this.props.systemResourceAction.listPg({param:values});
        });
    }

    /**
     * 重置搜索条件
     * @param e
     */
    handleReset(e) {
        e.preventDefault();
//        console.info(this.props.form);
        this.props.form.resetFields();
    }

    /**
     * 分页、排序、筛选变化时触发，向后台重新请求数据
     * @param pagination 分页器
     * @param filters
     * @param sorter
     */
    handleTableChange(pagination, filters, sorter) {
        let params = Object.assign(
            {},
            {param:this.props.form.getFieldsValue()},
            {pageNo: pagination.current,pageSize: pagination.pageSize}
        );
        this.props.systemResourceAction.listPg(params);
    }

    /**
     * 分页组件 改变分页大小时触发，向后台重新请求数据
     * @param current  下一页
     * @param pageSize 分页大小
     */
    handleTableSizeChange(current, pageSize) {
        let params = Object.assign(
            {},
            {param:this.props.form.getFieldsValue()},
            {pageNo: current,pageSize: pageSize}
        );
        this.props.systemResourceAction.listPg(params);
    }

    /**
     * 点击table某一行时触发，把选中的记录的主键存入store
     * @param record
     * @param index
     */
    handleRowClick(record, index) {
        this.props.commonAction.addOrDeleteSelectedRowKeys(record.resId);
    }


    /**
     * 显示弹窗
     * @param type 弹窗子组件类型
     * @param field 弹窗index [0,1,2,3,4]
     */
    showModal(type, field) {
        switch (type) {
            case 'add':
            {
                this.props.systemResourceAction.initForm();
                break;
            }
            case 'update':
            {
                let selectedRowKeys = this.props.selectedRowKeys;
                if(selectedRowKeys.length>1){
                    Modal.error({
                        title: '只能选择一条记录',
                        okText:'确定'
                    });
                    return;
                }else{
                    this.props.systemResourceAction.initForm();
                    this.props.systemResourceAction.getByPK(selectedRowKeys[0]);
                }
                break;
            }
            default:
                    break;
        }
        this.props.commonAction.showModal(field);

    }

    /**
     * 关闭弹窗
     * @param field 弹窗index [0,1,2,3,4]
     */
    handleCancel(field) {
        this.props.commonAction.hideModal(field);
    }


    /**
     * 添加记录
     * @param form
     */
    handleSave(form) {
        this.props.systemResourceAction.add(form,{param:this.props.form.getFieldsValue()});
    }

    /**
     * 更新记录
     * @param form
     */
    handleUpdate(form){
        this.props.systemResourceAction.update(form ,{param:this.props.form.getFieldsValue()});
    }

    /**
     * 删除选中记录
     * @param e
     */
    handleDelete(e) {
        e.preventDefault();
        let selectedRowKeys = this.props.selectedRowKeys;
        let params = {param:this.props.form.getFieldsValue()};
        let _this = this;
        if (selectedRowKeys.length != 0) {
            confirm({
                title: '您是否确认要删除所选内容',
                onOk() {
                    _this.props.systemResourceAction.deleteByPks(selectedRowKeys,params);
                }
            });
        }
    }


    /**
     * 组件渲染完成后触发
     */
    componentDidMount() {
        //初始化弹窗状态
        this.props.commonAction.initModal();
        //初始化table选中状态
        this.props.commonAction.initSelectedKeys();
        //加载表单数据
        this.props.systemResourceAction.listPg({param:this.props.form.getFieldsValue()});
    };

    /**
     * 渲染组件
     * @returns {XML}
     */
    render() {
        //设置搜索区域输入框大小
        const formItemLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14},
        };
        //获取prop中需要的属性
        const { selectedRowKeys,modalVisiable,pgList,singleResult,initForm} = this.props;
        //selectedRowKeys：选中row的集合，onChange：勾选checkBox时触发
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        //定义分页属性
        const pagination = {
            total: pgList.total,
            current: pgList.pageNo,
            showSizeChanger: true,
            onShowSizeChange: this.handleTableSizeChange,
            showQuickJumper: true,
            defaultPageSize:pgList.pageSize,
            pageSize:pgList.pageSize,
            pageSizeOptions:['15', '20', '30', '40'],
            showTotal:total=>{return `共${total}条记录`}
        };

        //是否有选中row
        const hasSelected = selectedRowKeys.length > 0;

        //获取form的getFieldProps，用来标识from组件名称
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
                    </Col>
                </Row>
                <Form inline className="advanced-search-form" onSubmit={this.handleSearch} form={this.props.form}>
                    <Row type="flex">
                        <Col span="24">
                            <FormItem
                                {...formItemLayout}
                                label="资源code："
                            >
                                <Input {...getFieldProps('resCode')} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="资源名称："
                            >
                                <Input {...getFieldProps('resName')} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="资源URL："
                            >
                                <Input {...getFieldProps('resUrl')} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="备注："
                            >
                                <Input {...getFieldProps('remarks')} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="显示顺序："
                            >
                                <Input {...getFieldProps('showIndex')} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="创建人："
                            >
                                <Input {...getFieldProps('creator')} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="创建时间："
                            >
                                <Input {...getFieldProps('createTime')} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="修改人："
                            >
                                <Input {...getFieldProps('updateUser')} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="修改时间："
                            >
                                <Input {...getFieldProps('updateTime')} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8" offset="16" style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit" className="topBtn"><Icon type="search"/>搜索</Button>
                            <Button type="ghost" className="topBtn" onClick={this.handleReset}>清除条件</Button>
                        </Col>
                    </Row>
                </Form>


                <Row>
                    <Col span="24">
                        <Table
                            className="ant-cust-table"
                            rowKey = {record  => record.resId}
                            columns={columns}
                            rowSelection={rowSelection}
                            onChange={this.handleTableChange}
                            onRowClick={this.handleRowClick}
                            dataSource={pgList.resultList}
                            useFixedHeader
                            bordered
                            pagination={pagination}
                            bodyStyle={{overflowY:'scroll',width:'100%', height: '60%'}}
                        />
                    </Col>
                </Row>

                <Modal
                    title="添加"
                    visible={modalVisiable[0]}
                    onCancel={this.handleCancel.bind(this,0)}
                    footer={false}
                >
                    <AddSystemResource handleSave={form => this.handleSave(form)} initForm={initForm}/>
                </Modal>

                <Modal
                    title="修改"
                    visible={modalVisiable[1]}
                    onCancel={this.handleCancel.bind(this,1)}
                    footer={false}
                >
                    <UpdateSystemResource handleUpdate={form => this.handleUpdate(form)} singleResult={singleResult} initForm={initForm}/>
                </Modal>

            </div>
        );
    }
}

/**
 * 把action操作映射到this.props中
 * @param dispatch
 * @returns {{systemResourceAction: *, commonAction: *}}
 */
function dispatchToProps(dispatch) {
    return {
        systemResourceAction: bindActionCreators(SystemResourceAction, dispatch),
        commonAction: bindActionCreators(CommonAction, dispatch),
    };
}

/**
 * 把store中的属性映射到this.props中
 * @param state
 * @returns {{selectedRowKeys: *, modalVisiable: *, singleResult: (singleResult|*), pgList: (pgList|*), initForm: *}}
 */
function stateToProps(state) {
    return {
        selectedRowKeys: state.common.selectedRowKeys,
        modalVisiable: state.common.modalVisiable,
        singleResult:state.systemResourceReducer.singleResult,
        pgList : state.systemResourceReducer.pgList,
        initForm : state.systemResourceReducer.initForm,
    };
}
/**
 * 获取全局路由
 * @type {{router: *}}
 */
SystemResourceManager.contextTypes = {
    router: React.PropTypes.object
};

//经过 Form.create 包装的组件将会自带 this.props.form 属性
SystemResourceManager = Form.create()(SystemResourceManager)
/**
 * 把action和store注入到this.props
 */
export default connect(stateToProps, dispatchToProps)(SystemResourceManager);