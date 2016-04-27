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
import * as ActivityDetailAction from '../../actions/ActivityDetailAction';
import * as CommonAction from '../../actions/CommonAction'
import { bindActionCreators } from 'redux';
import domUtil from '../../utils/domUtil'
import dateFormat from 'dateformat';
import {ProvinceCodes} from '../../components'
import * as Constants from '../../constants/constants'
import './index.less'

const FormItem = Form.Item;
const confirm = Modal.confirm;

//定义表头

export default class ActivityDetailManager extends React.Component {
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
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleTableSizeChange = this.handleTableSizeChange.bind(this);
        this.activityInfoByPk = this.activityInfoByPk.bind(this);
    }

    // 完成渲染新的props或者state后调用，此时可以访问到新的DOM元素。
/*
    componentDidUpdate(){
        DomUtil.controlTable();
    }
*/

    componentDidUpdate() {
        domUtil.controlTable();
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
        console.log('收到表单值：', this.props.form.getFieldsValue());
        this.props.activityDetailAction.listPg({param:this.props.form.getFieldsValue()});
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
        this.props.activityDetailAction.listPg(params);
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
        this.props.activityDetailAction.listPg(params);
    }

    /**
    * 点击table某一行时触发，把选中的记录的主键存入store
    * @param record
    * @param index
    */
    handleRowClick(record, index) {
        this.props.commonAction.addOrDeleteSelectedRowKeys(record.key);
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

    activityInfoByPk(){
        console.info(location);
    }

    /**
    * 组件渲染完成后触发
    */
    componentDidMount() {
        this.props.form.setFieldsValue({ "activityId":this.props.location.query.activityId});
        console.info(this.props.form.getFieldsValue());
        this.props.activityDetailAction.getByPK(this.props.location.query.activityId);
        //加载表单数据
        this.props.activityDetailAction.logList(this.props.location.query.activityId);
        this.props.activityDetailAction.listPg({param:this.props.form.getFieldsValue()});

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
        const { selectedRowKeys,modalVisiable,pgList,logList,singleResult,location} = this.props;
        //selectedRowKeys：选中row的集合，onChange：勾选checkBox时触发


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
                    key:data.productId,
                    productCode:data.productCode,
                    supplyName:data.supplyName,
                    spuCode:data.spuCode,
                    spuName:data.productName,
                    spec:data.spec,
                    factoryName:data.factoryName,
                    brandName:data.brandName,
                    leastUserBuy:data.leastUserBuy,
                    mostUserBuy:data.mostUserBuy,
                    productQuantity:data.productQuantity,
                    productNowQuantity:data.productNowQuantity,
                    activitySellInfo:data.activitySellInfo,
                    statusValue:data.statusValue,
                })
            })
        }

        const logTables = [];
        if (logList&&logList.length > 0) {
            logList.map((data, index)=> {
                logTables.push({
                    logDate:data.logDate,
                    userName:data.userName,
                    logNode:data.logNode,
                    key: index,
                })
            })
        }
        const columns = [{
            title:'排序',
            render: (text, record, index) => <span>{index+1}</span>,
            width:35
        },
            {
                title: '商品编码',
                dataIndex: 'productCode',
                width: 100
            },
            {
                title: '供应商',
                dataIndex: 'supplyName',
                width: 100
            },
            {
                title: 'SPU编码',
                dataIndex: 'spuCode',
                width: 100
            },
            {
                title: 'SPU名称',
                dataIndex: 'spuName',
                width: 100
            },
            {
                title: '规格',
                dataIndex: 'spec',
                width: 100
            },
            {
                title: '厂商',
                dataIndex: 'factoryName',
                width: 100
            },
            {
                title: '品牌',
                dataIndex: 'brandName',
                width: 100
            },
            {
                title: '起批量',
                dataIndex: 'leastUserBuy',
                width: 50
            },
            {
                title: '单用户限购量',
                dataIndex: 'mostUserBuy',
                width: 50
            },
            {
                title: '活动初始库存',
                dataIndex: 'productQuantity',
                width: 50
            },
            {
                title: '活动实时库存',
                dataIndex: 'productNowQuantity',
                width: 50
            },
            {
                title: '促销语',
                dataIndex: 'activitySellInfo',
                width: 100
            },
            {
                title: '商品状态',
                dataIndex: 'statusValue',
                width: 50
            }
        ];

        const logColumns = [
            {
                title: '操作时间',
                dataIndex: 'logDate',
                width: 100
            },
            {
                title: '操作人',
                dataIndex: 'userName',
                width: 100
            },
            {
                title: '操作详情',
                dataIndex: 'logNode',
                width: 100
            },
        ];

        let baseInfoTables ='';
        if(singleResult){
             baseInfoTables =<div className="baseInfo">
                 <table>
                     <thead>
                        <th>促销基本信息</th>
                     </thead>
                     <tbody>
                        <tr><td>促销方案编号:</td><td> {singleResult.activityNumber}</td></tr>
                        <tr><td>促销方案名称:</td><td> {singleResult.activityName}</td></tr>
                        <tr><td>促销时间:</td><td> {singleResult.startTime}至{singleResult.endTime}</td></tr>
                        <tr><td>促销类型:</td><td>{singleResult.activityType}</td></tr>
                        <tr><td> 活动Logo:</td><td> <a  href={Constants.URL_IMG_DOMAIN+singleResult.activityLogo} target="_blank">预览图片</a></td></tr>
                        <tr><td> 促销语:</td><td>{singleResult.giftInfo}</td></tr>
                        <tr><td>促销规则说明url:</td><td> {singleResult.activityUrl}</td></tr>
                     </tbody>
                 </table>
             </div>;
        }

        let  activityId = this.props.location.query.activityId;
        let editProductsUrl = "/adminIndex/editorProductForActivityManage?activityId="+activityId;

        let toEditLink= '';
        if(singleResult.activityStatus   !='3'){
            toEditLink = <a href={editProductsUrl} target="_blank">跳转到商品编辑页面</a>;
        }


        return (
            <div>
                <div className="baseInfo">
                <Row type="flex">
                    <label className="ac_title">促销基本信息</label>
                </Row>
                <Row type="flex">
                    <Col span="3">
                        促销方案编号:
                    </Col>
                    <Col span="21">
                        {singleResult.activityNumber}
                    </Col>
                </Row>
                <Row type="flex">
                    <Col span="3">
                        促销方案名称:
                    </Col>
                    <Col span="21">
                        {singleResult.activityName}
                    </Col>
                </Row>
                <Row type="flex">
                    <Col span="3">
                        促销时间:
                    </Col>
                    <Col span="21">
                        {singleResult.startTime}至{singleResult.endTime}
                    </Col>
                </Row>
                <Row type="flex">
                    <Col span="3">
                        促销类型:
                    </Col>
                    <Col span="21">
                        {singleResult.activityType}
                    </Col>
                </Row>
                <Row type="flex">
                    <Col span="3">
                        活动Logo:
                    </Col>
                    <Col span="21">
                        <a  href={Constants.URL_IMG_DOMAIN+singleResult.activityLogo} target="_blank">预览图片</a>
                    </Col>
                </Row>
                <Row type="flex">
                    <Col span="3">
                        促销语:
                    </Col>
                    <Col span="21">
                        {singleResult.giftInfo}
                    </Col>
                </Row>
                <Row type="flex">
                    <Col span="3">
                        促销规则说明url:
                    </Col>
                    <Col span="21">
                        {singleResult.activityUrl}
                    </Col>
                </Row>
                </div>
                <div className="activity_products">
                    <Row type="flex">
                    <label className="ac_title" >促销商品</label>
                        {toEditLink}
                </Row>
                <Row>
                    <Col span="24">
                    <Table
                        className="commonTable singleShort"
                        rowKey = {record  => record.key}
                        columns={columns}
                        onChange={this.handleTableChange}
                        dataSource={tables}
                        bordered
                        pagination={pagination}
                        useFixedHeader
                    />
                    </Col>
                </Row>
                </div>
                <div className="oplog">
                    <Row type="flex">
                        <label className="ac_title" >操作日志</label>
                    </Row>
                    <Row type="flex">
                    <Col span="12">
                        <Table
                            className="commonTable"
                            rowKey = {record  => record.key}
                            columns={logColumns}
                            dataSource={logTables}
                            bordered
                            useFixedHeader
                            pagination={false}
                        />
                    </Col>
                    </Row>

                </div>
                <Form>
                    <FormItem>
                        <Input {...getFieldProps('activityId')} type="hidden" value={location.query.activityId}/>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

/**
* 把action操作映射到this.props中
* @param dispatch
* @returns {{ActivityDetailAction: *, commonAction: *}}
*/
function dispatchToProps(dispatch) {
    return {
        activityDetailAction: bindActionCreators(ActivityDetailAction, dispatch),
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
        singleResult:state.activityDetailReducer.singleResult,
        pgList : state.activityDetailReducer.pgList,
        logList: state.activityDetailReducer.logList,
    };
}
/**
* 获取全局路由
* @type {{router: *}}
*/
ActivityDetailManager.contextTypes = {
    router: React.PropTypes.object
};

//经过 Form.create 包装的组件将会自带 this.props.form 属性
ActivityDetailManager = Form.create()(ActivityDetailManager)

/**
* 把action和store注入到this.props
*/
export default connect(stateToProps, dispatchToProps)(ActivityDetailManager);
