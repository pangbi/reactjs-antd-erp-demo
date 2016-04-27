/**
 * COPYRIGHT (C) 2016 Fky. ALL RIGHTS RESERVED.
 *
 * No part of this publication may be reproduced, stored in a retrieval system,
 * or transmitted, on any form or by any means, electronic, mechanical, photocopying,
 * recording, or otherwise, without the prior written permission of Fky.
 *
 * Created By: Liuzh
 * Created On: 2016-4-12 10:06:28
 *
 * Amendment History:
 *
 * Amended By       Amended On      Amendment Description
 * ------------     -----------     ---------------------------------------------
 *
 **/

import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Button , Row , Col ,Icon ,Form, Input ,DatePicker ,Select ,Modal } from 'antd';
import {AddActivity , UpdateActivity} from '../../components'
import { connect } from 'react-redux';
import * as ActivityAction from '../../actions/ActivityAction';
import * as CommonAction from '../../actions/CommonAction'
import { bindActionCreators } from 'redux';
import DomUtil from '../../utils/domUtil'
import dateFormat from 'dateformat';
import {ProvinceCodes} from '../../components'
import './index.less'

const FormItem = Form.Item;
const confirm = Modal.confirm;

//定义表头

export default class ActivityManager extends React.Component {
    /**
    * 构造方法 初始化数据
    * @param props
    */
    constructor(props) {
        super(props);
        //初始化bind(this)
        this.state = {
            startValue: null,
            endValue: null,
            visible: false,
        }
        this.onSelectChange = this.onSelectChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleTableSizeChange = this.handleTableSizeChange.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.disabledStartDate = this.disabledStartDate.bind(this);
        this.disabledEndDate = this.disabledEndDate.bind(this);
    }

    // 完成渲染新的props或者state后调用，此时可以访问到新的DOM元素。
    componentDidUpdate(){
        DomUtil.controlTable();
    }

    opreationByType(type,activityId){
        // 1 发布  2 中止
        let status = 0;
        let notice = '';
        if(type==1){
            status = 2;
            notice = "是否要发布活动";
        }else if(type==2){
            status = 5;
            notice = "是否要中止活动";
        }

        let params = Object.assign(
            {},
            {param: this.props.form.getFieldsValue()},
            {pageNo: this.props.pageNo, pageSize: this.props.pageSize}
        );
        let _this = this;
        confirm({
            title: notice,
            onOk() {
                _this.props.activityAction.changeStausByPK(activityId,status,params);
            }
        });
    }

    /**
    * 点击table第一列checkBox时调用，
    * @param selectedRowKeys 所有选中row的key的集合
    */
    onSelectChange(selectedRowKeys) {
        console.info(selectedRowKeys);
        this.props.commonAction.setSelectedRowKeys([...selectedRowKeys]);
    }

    /**
     * 查询
     * @param e
     */
    handleSearch(e) {
        //组织表单默认提交
        e.preventDefault();
        console.log('收到表单值：', this.props.form.getFieldsValue());
        this.props.activityAction.listPg({param:this.props.form.getFieldsValue()});
    }

    /**
     * 重置搜索条件
     * @param e
     */
    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
        this.setState({startValue: null,endValue: null})
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
        this.props.activityAction.listPg(params);
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
        this.props.activityAction.listPg(params);
    }

    /**
    * 点击table某一行时触发，把选中的记录的主键存入store
    * @param record
    * @param index
    */
    handleRowClick(record, index) {
        this.props.commonAction.addOrDeleteSelectedRowKeys(record.key);
    }


    /**
    * 显示弹窗
    * @param type 弹窗子组件类型
    * @param field 弹窗index [0,1,2,3,4]
    */
    showModal(type, field,activityId) {
        switch (type) {
        case 'add':
        {
            this.props.activityAction.initForm();
            //初始化 添加页面的上传文件组件
            this.props.commonAction.initUploadFile();
            break;
        }
        case 'update':
        {
            this.props.activityAction.initForm();
            this.props.activityAction.getByPK(activityId);
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
        this.props.activityAction.add(form,{param:this.props.form.getFieldsValue()});
    }

    /**
    * 更新记录
    * @param form
    */
    handleUpdate(form){
        this.props.activityAction.update(form ,{param:this.props.form.getFieldsValue()});
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
                title: '您是否确认要删除所选记录?',
                onOk() {
                _this.props.activityAction.deleteByPks(selectedRowKeys,params);
                }
            });
        }
    }    /**
     * 删除选中记录
     * @param e
     */
    clickDelete(id) {
        let selectedRowKeys = [id];
        let params = {param:this.props.form.getFieldsValue()};
        let _this = this;
        if (selectedRowKeys.length != 0) {
            confirm({
                title: '您是否确认要删除所选记录?',
                onOk() {
                   _this.props.activityAction.deleteByPks(selectedRowKeys,params);
                }
            });
        }
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
        value = dateFormat(value, 'yyyy-mm-dd');
        if (field == "startValue")
            this.props.form.setFieldsValue({startTime: value});
        if (field == "endValue")
            this.props.form.setFieldsValue({endTime: value});
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
        this.props.activityAction.listPg({param:this.props.form.getFieldsValue()});

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


        const tables = [];
        if (pgList.resultList && pgList.resultList.length > 0) {
            pgList.resultList.map((data, index)=> {
                tables.push({
                    key:data.activityId,
                    activityNumber:data.activityNumber,
                    activityName:data.activityName,
                    creator:data.creator,
                    activityType:data.activityType,
                    activityStatusName:data.activityStatusName,
                    activityStatus:data.activityStatus,
                    activityProductQuantity:data.activityProductQuantity,
                    isRecommend:data.isRecommend,
                    activityTime:data.startTime+"--"+data.endTime,
                    recommendProvinceName:data.recommendProvinceName,
                    recommendPositionName:data.recommendPositionName
                })
            })
        }

        let activityStatusData = [{infoName: '已创建', infoCode: '1'}, {infoName: '已发布', infoCode: '2'}, {infoName: '已结束',infoCode: '3'},{infoName: '进行中',infoCode: '4'},{infoName: '已中止',infoCode: '5'}]
        const activityStatusOption = activityStatusData.map(function (data) {
            return (
                <Option key={data.infoCode} value={data.infoCode}>{data.infoName}</Option>
            )
        })

        let activityTypeData = [{infoName: '满赠', infoCode: '1'}, {infoName: '每满赠', infoCode: '2'},{infoName: '限时特价', infoCode: '3'},{infoName: '通用促销', infoCode: '4'}]
        const activityTypeOption = activityTypeData.map(function (data) {
            return (
                <Option key={data.infoCode} value={data.infoCode}>{data.infoName}</Option>
            )
        })


        const columns = [{
            title:'序号',
            render: (text, record, index) => <span>{index+1}</span>,
        },
            {
                title: '促销方案编号',
                dataIndex: 'activityNumber',
            },
            {
                title: '促销方案名称',
                dataIndex: 'activityName',
            },
            {
                title: '创建人',
                dataIndex: 'creator',
            },
            {
                title: '活动类型',
                dataIndex: 'activityType',
            },
            {
                title: '活动状态',
                dataIndex: 'activityStatusName',
            },
            {
                title: '活动商品数量',
                dataIndex: 'activityProductQuantity',
            },
            {
                title: '促销时间',
                dataIndex: 'activityTime',
            },
            {
                title: '推荐省份',
                dataIndex: 'recommendProvinceName',
            },
            {
                title: '推荐位及排序',
                dataIndex: 'recommendPositionName',
            },
            {
                title: '操作',
                render: (text, record, index) => {
                    let  status = record.activityStatus;
                    let activityId = record.key;
                    let detailUrl = "/adminIndex/activityDetail?activityId="+activityId;
                    let editProductsUrl = "/adminIndex/editorProductForActivityManage?activityId="+activityId;
                    let recommonUrl = "/adminIndex/recommend?recommendNumber="+activityId;

                    let showContent = '';
                    if(status==1){
                        showContent = <div className="opreationDiv"><span><a href={detailUrl} target="_blank">查看详情</a><a href="javascript:void(0);" onClick={this.showModal.bind(this,'update',1,activityId)}  >编辑方案</a><a  href={editProductsUrl} target="_blank">编辑商品</a><a href={recommonUrl} target="_blank">推荐设置</a><a href="javascript:void(0)" onClick={this.opreationByType.bind(this,1,record.key)}>发布</a><a href="javascript:void(0)"  onClick={this.clickDelete.bind(this,record.key)}>删除方案</a></span></div>;
                    }else if(status==2){
                        showContent = <div className="opreationDiv"><span><a href={detailUrl} target="_blank">查看详情</a><a href="javascript:void(0);" onClick={this.showModal.bind(this,'update',1,activityId)}  >编辑方案</a><a href={editProductsUrl} target="_blank">编辑商品</a><a  href={recommonUrl}  target="_blank">推荐设置</a><a href="javascript:void(0)"  onClick={this.opreationByType.bind(this,2,record.key)}>中止</a></span></div>;
                    }else if(status==3){
                        showContent =  <div className="opreationDiv"><span><a href={detailUrl} target="_blank">查看详情</a></span></div>
                    }else if(status==4){
                        showContent = <div className="opreationDiv"><span><a href={detailUrl} target="_blank">查看详情</a><a href="javascript:void(0);" onClick={this.showModal.bind(this,'update',1,activityId)} >编辑方案</a><a href={editProductsUrl} target="_blank">编辑商品</a><a  href={recommonUrl}  target="_blank">推荐设置</a><a href="javascript:void(0)" onClick={this.opreationByType.bind(this,2,record.key)}>中止</a></span></div>;
                    }else if(status==5){
                        showContent = <div className="opreationDiv"><span><a href={detailUrl} target="_blank">查看详情</a><a href="javascript:void(0);" onClick={this.showModal.bind(this,'update',1,activityId)} >编辑方案</a><a href={editProductsUrl} target="_blank">编辑商品</a><a href={recommonUrl}  target="_blank">推荐设置</a><a href="javascript:void(0)" onClick={this.opreationByType.bind(this,1,record.key)}>发布</a></span></div>;
                    }
                    return <div >
                        {showContent}
                    </div>
                },
            },
        ];



        return (
            <div className="activiyList">
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

                    <Button type="primary" htmlType="submit"  onClick={this.handleSearch}  className="topBtn"><Icon type="search"/>搜索</Button>
                    <Button type="ghost" className="topBtn" onClick={this.handleReset}>清除</Button>
                    </Col>
                </Row>
                <Form horizontal className="advanced-search-form" onSubmit={this.handleSearch} form={this.props.form}>
                    <Row type="flex">
                        <Col span="6">
                        <FormItem
                                {...formItemLayout}
                                label="促销方案编号："
                        >
                            <Input {...getFieldProps('activityNumber')} />
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem
                                {...formItemLayout}
                                label="促销方案名称："
                        >
                            <Input {...getFieldProps('activityName')} />
                        </FormItem>
                            </Col>
                        <Col span="6">

                        <FormItem
                                {...formItemLayout}
                                label="活动类型："
                        >

                            <Select
                                {...getFieldProps('activityType', {initialValue: '', trigger: 'onSelect'})}
                                size="large"
                                showSearch
                                optionFilterProp="children"
                                placeholder="商品状态"
                                notFoundContent="无法找到"
                                searchPlaceholder="输入关键词"
                            >
                                <Option value="">全部</Option>
                                {activityTypeOption}
                            </Select>
                        </FormItem>
                            </Col>
                        <Col span="6">
                            <FormItem
                                {...formItemLayout}
                                label="活动状态"
                            >

                                <Select
                                    {...getFieldProps('activityStatus', {initialValue: '', trigger: 'onSelect'})}
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                    placeholder="商品状态"
                                    notFoundContent="无法找到"
                                    searchPlaceholder="输入关键词"
                                >
                                    <Option value="">全部</Option>
                                    {activityStatusOption}
                                </Select>

                            </FormItem>
                        </Col>
                       </Row>


                    <Row type="flex">


                        <Col span="6">
                        <FormItem
                                {...formItemLayout}
                                label="创建人："
                        >
                            <Input {...getFieldProps('creator')} />
                        </FormItem>
                            </Col>
                        <Col span="6">
                            <FormItem
                                {...formItemLayout}
                                label="活动开始时间："
                            >
                                <DatePicker {...getFieldProps('startTime')}
                                    disabledDate={this.disabledStartDate}
                                    value={this.state.startValue}
                                    placeholder="开始日期"
                                    onChange={this.onChange.bind(this,'startValue')}
                                />
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem
                                {...formItemLayout}
                                label="活动结束时间："
                            >
                                <DatePicker {...getFieldProps('endTime')}
                                    disabledDate={this.disabledEndDate}
                                    value={this.state.endValue}
                                    placeholder="结束日期"
                                    onChange={this.onChange.bind(this,'endValue')}
                                />
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem
                                {...formItemLayout}
                                label="推荐省份"
                            >
                                <ProvinceCodes
                                    province="recommendProvinceName"
                                    city =""
                                    area=""
                                    form={this.props.form}
                                />

                            </FormItem>
                        </Col>
                        </Row>
                </Form>


                <Row className="form-wrap">
                    <Col span="24">
                    <Table
                        className="commonTable singleShort"
                        rowKey = {record  => record.key}
                        columns={columns}
                        onChange={this.handleTableChange}
                        onRowClick={this.handleRowClick}
                        dataSource={tables}
                        bordered
                        pagination={pagination}
                        useFixedHeader
                    />
                    </Col>
                </Row>

                <Modal
                        title="添加"
                        visible={modalVisiable[0]}
                        onCancel={this.handleCancel.bind(this,0)}
                        footer={false}
                        maskClosable={false}
                >
                    <AddActivity handleSave={form => this.handleSave(form)} initForm={initForm}/>
                </Modal>

               <Modal
                        title="修改"
                        visible={modalVisiable[1]}
                        onCancel={this.handleCancel.bind(this,1)}
                        footer={false}
                        maskClosable={false}
                >
                    <UpdateActivity handleUpdate={form => this.handleUpdate(form)} singleResult={singleResult} initForm={initForm} onCancel={this.handleCancel.bind(this,1)} />
                </Modal>

            </div>
        );
    }
}

/**
* 把action操作映射到this.props中
* @param dispatch
* @returns {{activityAction: *, commonAction: *}}
*/
function dispatchToProps(dispatch) {
    return {
        activityAction: bindActionCreators(ActivityAction, dispatch),
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
        singleResult:state.activityReducer.singleResult,
        pgList : state.activityReducer.pgList,
        initForm : state.activityReducer.initForm,
    };
}
/**
* 获取全局路由
* @type {{router: *}}
*/
ActivityManager.contextTypes = {
    router: React.PropTypes.object
};

//经过 Form.create 包装的组件将会自带 this.props.form 属性
ActivityManager = Form.create()(ActivityManager)

/**
* 把action和store注入到this.props
*/
export default connect(stateToProps, dispatchToProps)(ActivityManager);
