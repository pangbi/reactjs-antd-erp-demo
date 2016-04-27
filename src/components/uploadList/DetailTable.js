/**
 * Created by zhourongjing on 2016/3/29.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Button , Row , Col ,Icon ,Form, Input ,DatePicker ,Select ,Modal } from 'antd';
import * as UploadListAction from '../../actions/UploadListAction';
import * as CommonAction from '../../actions/CommonAction'
import { bindActionCreators } from 'redux';

import { connect } from 'react-redux';


//uploadDetail


const columns = [
    {title : '序号',render: (text, record, index) => <span>{index+1}</span>,width:100},
    {title : '供应商名称', dataIndex : 'supplyName', width : 100},
    {title : 'SPU编码', dataIndex : 'spuCode', width : 100},
    {title : 'SPU名称', dataIndex : 'spuName', width : 100},
    {title : '规格', dataIndex : 'spec', width : 100},
    {title : '厂商', dataIndex : 'factoryName', width : 100},
    {title : '统一价格', dataIndex : 'generalPrice', width : 100},
    {title : '起批量', dataIndex : 'minSalesNumber', width : 100},
    {title : '库存(-1表示无限制)', dataIndex : 'totalSalesNumber', width : 100},
    {title : '排序', dataIndex : 'showIndex', width : 100},
    {title : '广告语', dataIndex : 'adMsg', width:100},
    {title : '销售区域', dataIndex : 'saleArea', width:100},
    //{title : '上传状态', dataIndex : 'uploadCondition',width:100},
    {title : '上传失败原因', dataIndex : 'errorMsg',width:100},

];

export default class DetailTable extends React.Component {
    constructor (props){
        super(props);
    }

    componentDidMount(){
        //alert("Deatil done!");

    }

    render (){
        const {pgList} = this.props;
        return (
            <div>
                <Table
                    rowKey = {record  => record.uploadDetailId}
                    columns={columns}
                    pagination={false}
                    dataSource={pgList.resultList}
                />
            </div>
        )
    }
}

