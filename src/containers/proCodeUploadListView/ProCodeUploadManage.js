/**
 * Created by liuyang on 2016/3/28.
 */
/**
 * Created by zhangqiang on 2016/2/22.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Button , Row , Col ,Icon ,Form, Input ,DatePicker ,Select ,Modal } from 'antd';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';
import * as ProCodeUploadAction from '../../actions/proCodeUploadAction';
import * as CommonTypeAction from '../../actions/CommonTypeAction'
import * as CommonAction from '../../actions/CommonAction'
import * as Constants from '../../constants/constants'
import { bindActionCreators } from 'redux';
import * as domUtil from '../../utils/domUtil'
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

const detailColumns = [{
    title: '序号',
    render: (text, record, index) => <span>{index + 1}</span>,
},
    {
        title: '商品编码',
        dataIndex: 'productCode',
    }, {
        title: '供应商',
        dataIndex: 'supplyName',

    }, {
        title: 'SPU编码',
        dataIndex: 'spuCode',

    }, {
        title: 'SPU名称',
        dataIndex: 'spuName',
    }, {
        title: '规格',
        dataIndex: 'spec',

    }, {
        title: '厂商',
        dataIndex: 'factoryName',

    }, {
        title: '上传失败原因',
        dataIndex: 'errorMsg',

    },

];

export default class ProCodeUploadManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startValue: null,
            endValue: null,
        }
        this.onSelectChange = this.onSelectChange.bind(this)
        this.disabledStartDate = this.disabledStartDate.bind(this);
        this.disabledEndDate = this.disabledEndDate.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleTableSizeChange = this.handleTableSizeChange.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.checkDetail = this.checkDetail.bind(this);
        this.downLoadDetail = this.downLoadDetail.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }


    componentDidUpdate(){
        domUtil.controlTable();
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


    onSelectChange(selectedRowKeys) {
        //console.log('selectedRowKeys changed: ', selectedRowKeys);
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
        if(value !=null && value != ''){
            value = dateFormat(value, 'yyyy-mm-dd HH:MM:ss');
        }
        if (field == "startValue")
            this.props.form.setFieldsValue({createTimeStart: value});
        if (field == "endValue")
            this.props.form.setFieldsValue({createTimeEnd: value});
    }

    handleSearch(e) {
        e.preventDefault();
//        console.log('收到表单值：', this.props.form.getFieldsValue());
        let tables_proName =  document.getElementsByName("pro_detailWin");
        var array = Array.from(tables_proName);
        array.forEach(function (item,index){
            item.outerHTML ='';
        });
        domUtil.initDetail();// 重置详情

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            }
            this.props.ProCodeUploadAction.searchProCodeListView({param: values});
        });
    }


    //handleTableChange(pagination, filters, sorter) {
    //    let params = Object.assign(this.props.form.getFieldsValue(), {
    //        current: pagination.current,
    //        pageSize: pagination.pageSize
    //    });
    //    this.props.ProCodeUploadAction.searchProCodeListView(params);
    //}
    handleTableChange(pagination, filters, sorter) {
        domUtil.initDetail();// 重置详情
        domUtil.controlTable();
        let params = Object.assign(
            {},
            {param: this.props.form.getFieldsValue()},
            {pageNo: pagination.current, pageSize: pagination.pageSize}
        );
        this.props.ProCodeUploadAction.searchProCodeListView(params);
    }

    handleTableSizeChange(current, pageSize) {
        domUtil.initDetail();// 重置详情
        domUtil.controlTable();


        let params = Object.assign(
            {},
            {param: this.props.form.getFieldsValue()},
            {pageNo: current, pageSize: pageSize}
        );
        this.props.ProCodeUploadAction.searchProCodeListView(params);
    }


    handleRowClick(record, index) {
        //console.log(record);
        this.props.commonAction.addOrDeleteSelectedRowKeys(record.key);
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
        this.props.ProCodeUploadAction.addCustomer(form, this.props.form);
    }

    downLoadDetail(e, pk) {
        //this.props.ProCodeUploadAction.exportProductCodeUploadDetail({uploadId:pk+''});
        domUtil.download(Constants.URL_ + '/export/exportProductCodeUploadDetail', 'uploadId=' + pk)
    }

    checkDetail(e, pk) {
        // 点击恢复head的样式 为table始终对齐
       /* let doc = document;
        let tableHead = doc.querySelectorAll('.ant-table-header')[0],
            tableBody = doc.querySelectorAll('.ant-table-body')[0],
            addTrs = tableBody.querySelectorAll('.addTr');

        function compare(){
            if( tableBody.querySelectorAll('.hide').length == addTrs.length ){
                var right =  tableHead.style.paddingRight;
                tableHead.style.cssText = '';
                tableHead.style.paddingRight = right + 'px';
            }
        }
*/

        // 发送请求获取 table 的 具体数据 表头已知
        // 找到最近的父元素 tr 在他后面插入tr tr里面包含table
        let targetTd, target;
        if (e.target.tagName.toLowerCase() === 'button') {
            target = e.target;
        } else {
            target = domUtil.findClosestParent(e.target, 'button');
        }
        let tr = domUtil.findClosestParent(target, 'tr');// 找到最近的tr

        if (domUtil.hasClass(target, 'showDetail')) {
            domUtil.removeClass(target, 'showDetail');
            // 隐藏
            domUtil.addClass(tr.nextSibling, 'hide');
            //compare();
        } else {
            domUtil.addClass(target, 'showDetail');
            if (target.getAttribute('been')) {// 控制只填充数据一次
                // 显示
                this.props.ProCodeUploadAction.listPgProductUploadDetail({
                    paginationFlag: false,
                    param: {uploadId: pk}
                });
                domUtil.removeClass(tr.nextSibling, 'hide');
                /*let w = tableBody.scrollWidth;
                console.log('应该要恢复宽度：', w);
                tableHead.style.cssText = 'width:'+ w +'px;';*/
                return;
            }
            target.setAttribute('been', 'true');// 标记已经

            // 显示 只有第一次的时候需要发送请求
            const nextTr = document.createElement('tr');// 新加元素tr
            nextTr.className = 'addTr';


            const _this = this;
            nextTr.innerHTML = "<td></td>";
            domUtil.insertAfter(nextTr, tr); // 插入节点
            // 获取要插入的最终节点td 并设置合适的宽度
            targetTd = nextTr.querySelector('td');
            targetTd.setAttribute('colspan', '5');
            this.props.ProCodeUploadAction.listPgProductUploadDetail({paginationFlag: false, param: {uploadId: pk}});

            var t = setInterval(function () {
                if (_this.props.loading_proCode) {
                    ReactDOM.render(// 渲染页面
                        <Table id={pk} columns={detailColumns} dataSource={_this.props.pgDetailCodeList.resultList}
                               pagination={false}></Table>,
                        targetTd
                    );
                    _this.props.ProCodeUploadAction.updLoadingStatus();
                   /* let tableHead = document.querySelectorAll('.ant-table-header')[0],
                        tableBody = document.querySelectorAll('.ant-table-body')[0];
                    let w = tableBody.scrollWidth;
                    setTimeout(function(){
                        tableHead.style.cssText = 'width:'+ w +'px;padding-right:0px;';

                    },1);*/
                    clearInterval(t);
                }
            }, 100);

        }

    };

    componentDidMount() {
        //初始化数据
        this.props.ProCodeUploadAction.searchProCodeListView(this.props.form.getFieldsValue());
        //this.props.ProCodeUploadAction.listPgProductUploadDetail();
        //重置弹窗显示状态和table勾选状态
        this.props.commonAction.initModal();
        this.props.commonAction.initSelectedKeys();
        domUtil.controlForm();

    };

    render() {
        const _this = this;
        const columns = [{
            title: '序号',
            render: (text, record, index) => <span>{index + 1}</span>,
        }, {
            title: '上传者',
            dataIndex: 'operator',
        }, {
            title: '上传时间',
            dataIndex: 'createTime',
        }, {
            title: '任务状态',
            dataIndex: 'statusValue',
        }, {
            title: '操作',
            key: 'operation',
            render(text, record, index) {
                if (record.statusValue === '失败') {
                    return <span><Button id={record.uploadId} type="primary" onClick={ (e) => _this.checkDetail(e,record.uploadId)}>查看详情</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type="primary" onClick={ (e) => _this.downLoadDetail(e,record.uploadId)}>导出详情</Button></span>;
                }
            }
        },

        ];
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 14},
        };
        const { selectedRowKeys,pgProCodeList,modalVisiable,initAddCustomerForm} = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;

        const dataList = [];
        //const pagination = {
        //    total: pgProCodeList.total,
        //    current: pgProCodeList.current,
        //    showSizeChanger: true,
        //    onShowSizeChange: this.handleTableSizeChange,
        //    showQuickJumper: true,
        //};
        const pagination = {
            total: pgProCodeList.total,
            current: pgProCodeList.pageNo,
            showSizeChanger: true,
            onShowSizeChange: this.handleTableSizeChange,
            showQuickJumper: true,
            defaultPageSize: pgProCodeList.pageSize,
            pageSize: pgProCodeList.pageSize,
            pageSizeOptions: ['15', '20', '30', '40'],
            showTotal: total=> {
                return `共${total}条记录`
            }
        };

        const { getFieldProps } = this.props.form;

        return (
            <div>
                <Form horizontal className="advanced-search-form" onSubmit={this.handleSearch} form={this.props.form}>
                    <Row type="flex">
                        <Col span="4">
                            <FormItem
                                {...formItemLayout}
                                label="上传者："
                            >
                                <Input {...getFieldProps('operator')} />
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem
                                {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 18},
                                }}
                                label="上传时间："
                            >
                                <DatePicker
                                    {...getFieldProps('createTimeStart')}
                                    format="yyyy-MM-dd HH:mm:ss"
                                    showTime
                                    disabledDate={this.disabledStartDate}
                                    value={this.state.startValue}
                                    placeholder="开始日期"
                                    onChange={this.onChange.bind(this,'startValue')}
                                />
                            </FormItem>
                        </Col>
                        <Col span="5">
                            <FormItem
                                {...{
                                    labelCol: {span: 4},
                                    wrapperCol: {span: 18},
                                }}
                                label="至："
                            >
                                <DatePicker
                                    {...getFieldProps('createTimeEnd')}
                                    format="yyyy-MM-dd HH:mm:ss"
                                    showTime
                                    disabledDate={this.disabledEndDate}
                                    value={this.state.endValue}
                                    placeholder="结束日期"
                                    onChange={this.onChange.bind(this,'endValue')}
                                />
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem
                                {...{
                                    labelCol: {span: 6},
                                    wrapperCol: {span: 14},
                                }}
                                label="任务状态："
                            >
                                <Select
                                    {...getFieldProps('status', {initialValue: '-1'})}
                                    size="large"
                                    placeholder="请选择任务状态"
                                    defaultValue="-1"
                                >
                                    <Option value="-1">全部</Option>
                                    <Option value="1">失败</Option>
                                    <Option value="2">成功</Option>
                                    <Option value="3">处理中</Option>
                                </Select>
                            </FormItem>
                        </Col>

                        <Col span="8" offset="16" style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit" className="topBtn"><Icon type="search"/>搜索</Button>
                            <Button
                                type="ghost"
                                className="topBtn"
                                onClick={this.handleReset}
                            >
                                清除条件
                            </Button>
                        </Col>
                    </Row>
                </Form>


                <Row>
                    <Col span="24">
                        <Table className="uploadTable"
                            rowKey={record  => record.uploadId}
                            columns={columns}
                            dataSource={pgProCodeList.resultList}
                            pagination={pagination}
                            onChange={this.handleTableChange}
                            onRowClick={this.handleRowClick}
                            bordered
                            useFixedHeader
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

function dispatchToProps(dispatch) {
    return {
        ProCodeUploadAction: bindActionCreators(ProCodeUploadAction, dispatch),
        commonTypeAction: bindActionCreators(CommonTypeAction, dispatch),
        commonAction: bindActionCreators(CommonAction, dispatch),
    };
}
function stateToProps(state) {
    return {
        pgProCodeList: state.proCodeUpLoadReducer.pgProCodeList,
        selectedRowKeys: state.common.selectedRowKeys,
        modalVisiable: state.common.modalVisiable,
        pgDetailCodeList: state.proCodeUpLoadReducer.pgDetailCodeList,
        loading_proCode: state.proCodeUpLoadReducer.loading_proCode,
    };
}
ProCodeUploadManage.contextTypes = {
    router: React.PropTypes.object
};
ProCodeUploadManage = Form.create()(ProCodeUploadManage)
export default connect(stateToProps, dispatchToProps)(ProCodeUploadManage);