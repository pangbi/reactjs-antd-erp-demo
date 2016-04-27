/**
 * Created by zhangqiang on 2016/2/22.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Button , Row , Col ,Icon ,Form, Input ,DatePicker ,Select ,Modal } from 'antd';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';
import * as CustomerAction from '../../actions/CustomerAction';
import * as CommonTypeAction from '../../actions/CommonTypeAction'
import * as CommonAction from '../../actions/CommonAction'
import { bindActionCreators } from 'redux';
import {AddCustomer} from '../../components'
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const columns = [{
    title: '公司名称',
    dataIndex: 'companyName',
    width: 100
}, {
    title: '客户类型',
    dataIndex: 'customerType',
    width: 100
}, {
    title: '企业类型',
    dataIndex: 'businessType',
    width: 100
}, {
    title: '联系人',
    dataIndex: 'contact',
    width: 100
}, {
    title: '联系电话',
    dataIndex: 'tel',
    width: 100
}, {
    title: '联系操作',
    dataIndex: 'contactType',
    width: 100
}, {
    title: '已上传资质',
    dataIndex: 'zizhi',
    width: 100
}, {
    title: '审核未通过原因',
    dataIndex: 'remark',
    width: 100
}, {
    title: '服务',
    dataIndex: 'fuwu',
    width: 100
}, {
    title: '详细地址',
    dataIndex: 'address',
    width: 100
}, {
    title: 'VIP信息',
    dataIndex: 'vip',
    width: 100
},

];


export default class CustomerManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startValue: null,
            endValue: null,
            visible: false
        }
        this.onSelectChange = this.onSelectChange.bind(this)
        this.disabledStartDate = this.disabledStartDate.bind(this);
        this.disabledEndDate = this.disabledEndDate.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleProvinceChange = this.handleProvinceChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleTableSizeChange = this.handleTableSizeChange.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        //this.showModal = this.showModal.bind(this);
        //this.handleCancel = this.handleCancel.bind(this);
        this.handleSave = this.handleSave.bind(this);
        //this.footer = this.handleSave.bind(this);
    }


    onSelectChange(selectedRowKeys) {
//        console.log('selectedRowKeys changed: ', selectedRowKeys);
        //this.setState({selectedRowKeys});
        this.props.commonAction.setSelectedRowKeys([...selectedRowKeys]);
    }

    disabledStartDate(startValue) {
        if (!startValue || !this.state.endValue) {
            return false;
        }
        return startValue.getTime() >= this.state.endValue.getTime();
    }

    disabledEndDate(endValue) {
        if (!endValue || !this.state.startValue) {
            return false;
        }
        return endValue.getTime() <= this.state.startValue.getTime();
    }

    onChange(field, value) {
        //console.log(field, 'change', value);
        this.setState({
            [field]: value,
        });
        if (field == "startValue")
            this.props.form.setFieldsValue({beginDate: value});
        if (field == "endValue")
            this.props.form.setFieldsValue({endDate: value});
    }

    handleSearch(e) {
        e.preventDefault();
//        console.log('收到表单值：', this.props.form.getFieldsValue());
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            }
            this.props.customerAction.searchCustomer(values);
        });
    }

    handleReset(e) {
        e.preventDefault();
//        console.info(this.props.form);
        this.props.form.resetFields();
    }

    handleProvinceChange(value) {
//        console.info(`select value ${value}`);
//        console.info(this);
        if (value != "-1")
            this.props.commonTypeAction.listCity(value);
        else
            this.props.commonTypeAction.resetCity();
        this.props.commonTypeAction.resetCounty();
        this.props.form.setFieldsValue({city: '-1', county: '-1'});
    }

    handleCityChange(value) {
        if (value != "-1")
            this.props.commonTypeAction.listCounty(value);
        else
            this.props.commonTypeAction.resetCounty();
        this.props.form.setFieldsValue({county: '-1', city: value});
    }

    handleTableChange(pagination, filters, sorter) {
        let params = Object.assign(this.props.form.getFieldsValue(), {
            current: pagination.current,
            pageSize: pagination.pageSize
        });
        this.props.customerAction.searchCustomer(params);
    }

    handleTableSizeChange(current, pageSize) {
        let params = Object.assign(this.props.form.getFieldsValue(), {current: 1, pageSize: pageSize});
        this.props.customerAction.searchCustomer(params);
    }

    handleRowClick(record, index) {
//        console.log(record);
        this.props.commonAction.addOrDeleteSelectedRowKeys(record.key);
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
                    _this.props.customerAction.deleteCustomer(selectedRowKeys, _this.props.form);
                },
                onCancel() {
                }
            });
        }
    }

    showModal(field) {
//        console.info(field);
        this.props.commonAction.showModal(field);
        this.props.commonAction.initAddCustomerForm();
    }

    handleCancel(field) {
        this.props.commonAction.hideModal(field);
        this.props.commonAction.initAddCustomerForm();
    }


    handleSave(form) {
        this.props.customerAction.addCustomer(form, this.props.form);
    }


    componentDidMount() {
        //初始化数据
        this.props.commonTypeAction.listBusinessType();
        this.props.commonTypeAction.listOperactionType();
        this.props.commonTypeAction.listAuditingType();
        this.props.commonTypeAction.listProvince();

        this.props.customerAction.searchCustomer(this.props.form.getFieldsValue());

        //重置弹窗显示状态和table勾选状态
        this.props.commonAction.initModal();
        this.props.commonAction.initSelectedKeys();

    };

    render() {
        const formItemLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14},
        };
        const { selectedRowKeys,businessType,operationType,auditingType,provinceList ,cityList,countyList,customerList,modalVisiable,initAddCustomerForm} = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;

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

        const auditingTypeOption = auditingType.map(function (data) {
            return (
                <Option key={data.infoCode} value={data.infoCode}>{data.infoName}</Option>
            )
        });

        const provinceOption = provinceList.map(function (data) {
            return (
                <Option key={data.infoCode} value={data.infoCode}>{data.infoName}</Option>
            )
        });

        const cityOption = cityList.map(function (data) {
            return (
                <Option key={data.infoCode} value={data.infoCode}>{data.infoName}</Option>
            )
        });

        const countyOption = countyList.map(function (data) {
            return (
                <Option key={data.infoCode} value={data.infoCode}>{data.infoName}</Option>
            )
        });

        const dataList = [];
        customerList.resultList.map((data) => {
            dataList.push({
                key: data.id,
                companyName: data.companyName,
                customerType: data.customerType,
                businessType: data.businessType,
                contact: data.contact,
                tel: data.tel,
                contactType: data.contactType,
                zizhi: `已上传${data.totalZizhi}份(审核通过${data.passedZizhi}份)`,
                fuwu: `失效时间:${dateFormat(data.addDate, "yyyy-mm-dd")}`,
                remark: data.remark,
                address: data.address,
                vip: data.vip ? "是VIP" : "不是VIP",
            });
        });

        const pagination = {
            total: customerList.total,
            current: customerList.current,
            showSizeChanger: true,
            onShowSizeChange: this.handleTableSizeChange,
            showQuickJumper: true,
        };

        const { getFieldProps } = this.props.form;

        return (
            <div>
                <Row type="flex">
                    <Col span="24">
                        <Button
                            type="primary"
                            size="large"
                            className="topBtn"
                            onClick={this.showModal.bind(this,0)}
                        >
                            <Icon type="save"/>添加
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            className="topBtn"
                            disabled={!hasSelected}
                            onClick={this.showModal.bind(this,1)}
                        >
                            <Icon type="search"/>查看
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            className="topBtn"
                            disabled={!hasSelected}
                            onClick={this.showModal.bind(this,2)}
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
                <Form horizontal className="advanced-search-form" onSubmit={this.handleSearch} form={this.props.form}>
                    <Row type="flex">
                        <Col span="4">
                            <FormItem
                                {...formItemLayout}
                                label="公司名称："
                            >
                                <Input {...getFieldProps('companyName')} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="最小失效时间："
                            >
                                <DatePicker
                                    {...getFieldProps('beginDate')}
                                    disabledDate={this.disabledStartDate}
                                    value={this.state.startValue}
                                    placeholder="开始日期"
                                    onChange={this.onChange.bind(this,'startValue')}
                                />
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem
                                {...formItemLayout}
                                label="企业类型："
                            >
                                <Select
                                    {...getFieldProps('companyType', {initialValue: '-1'})}
                                    size="large"
                                    placeholder="请选择企业类型"
                                    defaultValue="-1"
                                >
                                    <Option value="-1">全部</Option>
                                    {businessTypeOption}
                                </Select>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="最大失效时间："
                            >
                                <DatePicker
                                    {...getFieldProps('endDate')}
                                    disabledDate={this.disabledEndDate}
                                    value={this.state.endValue}
                                    placeholder="结束日期"
                                    onChange={this.onChange.bind(this,'endValue')}
                                />
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem
                                {...formItemLayout}
                                label="经营类型："
                            >
                                <Select
                                    {...getFieldProps('operationType', {initialValue: '-1'})}
                                    size="large"
                                    placeholder="请选择经营类型"
                                    defaultValue="-1">
                                    <Option value="-1">全部</Option>
                                    {operationTypeOption}
                                </Select>
                            </FormItem>


                            <FormItem
                                {...formItemLayout}
                                label="省："
                            >
                                <Select
                                    {...getFieldProps('province', {initialValue: '-1', trigger: 'onSelect'})}
                                    size="large"
                                    showSearch
                                    placeholder="请选省"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                    searchPlaceholder="输入关键词"
                                    defaultValue="-1"
                                    onChange={this.handleProvinceChange}
                                >
                                    <Option value="-1">全部</Option>
                                    {provinceOption}
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem
                                {...formItemLayout}
                                label="审核状态："
                            >
                                <Select
                                    {...getFieldProps('auditingType', {initialValue: '-1'})}
                                    size="large"
                                    placeholder="请选择审核状态"
                                    defaultValue="-1"
                                >
                                    <Option value="-1">全部</Option>
                                    {auditingTypeOption}
                                </Select>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="城市："
                            >
                                <Select
                                    {...getFieldProps('city', {initialValue: '-1'})}
                                    size="large"
                                    showSearch
                                    placeholder="请选市"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                    searchPlaceholder="输入关键词"
                                    onChange={this.handleCityChange}
                                >
                                    <Option value="-1">全部</Option>
                                    {cityOption}
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="4">
                            <FormItem
                                {...formItemLayout}
                                label="联系人："
                            >
                                <Input {...getFieldProps('contacts')}/>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="县(区)："
                            >
                                <Select
                                    {...getFieldProps('county', {initialValue: '-1', trigger: 'onSelect'})}
                                    size="large"
                                    showSearch
                                    placeholder="请选县(区)"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                    searchPlaceholder="输入关键词"
                                >
                                    <Option value="-1">全部</Option>
                                    {countyOption}
                                </Select>
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
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={dataList}
                            pagination={pagination}
                            onChange={this.handleTableChange}
                            onRowClick={this.handleRowClick}
                            useFixedHeader
                            bordered
                            bodyStyle={{overflowY:'scroll',width:'100%', height: '60%'}}
                        />
                    </Col>
                </Row>


                <Modal
                    title="添加用户"
                    visible={modalVisiable[0]}
                    onCancel={this.handleCancel.bind(this,0)}
                    footer={false}
                >
                    <AddCustomer handleSave={form => this.handleSave(form)} initForm={initAddCustomerForm}/>
                </Modal>

                <Modal
                    title="查看用户"
                    visible={modalVisiable[1]}
                    onCancel={this.handleCancel.bind(this,1)}
                    footer={false}
                >
                    <h1>查看用户</h1>
                </Modal>

                <Modal
                    title="修改用户"
                    visible={modalVisiable[2]}
                    onCancel={this.handleCancel.bind(this,2)}
                    footer={false}
                >
                    <h1>修改用户</h1>
                </Modal>

            </div>
        );
    }
}

function dispatchToProps(dispatch) {
    return {
        customerAction: bindActionCreators(CustomerAction, dispatch),
        commonTypeAction: bindActionCreators(CommonTypeAction, dispatch),
        commonAction: bindActionCreators(CommonAction, dispatch),
    };
}
function stateToProps(state) {
    return {
        businessType: state.commonType.businessType,
        operationType: state.commonType.operationType,
        auditingType: state.commonType.auditingType,
        provinceList: state.commonType.provinceList,
        cityList: state.commonType.cityList,
        countyList: state.commonType.countyList,
        customerList: state.customer.customerList,
        selectedRowKeys: state.common.selectedRowKeys,
        modalVisiable: state.common.modalVisiable,
        initAddCustomerForm: state.common.initAddCustomerForm,
    };
}
CustomerManage.contextTypes = {
    router: React.PropTypes.object
};
CustomerManage = Form.create()(CustomerManage)
export default connect(stateToProps, dispatchToProps)(CustomerManage);