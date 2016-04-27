/**
 * Created by liuyang on 2016/4/13.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Button , Row , Col ,Icon ,Form, Input ,DatePicker ,Select ,Modal } from 'antd';
import { connect } from 'react-redux';
import * as CommonAction from '../../actions/CommonAction';
import * as CommonTypeAction from '../../actions/CommonTypeAction';
import * as InputSearchAction from '../../actions/InputSearchAction';
import * as EditorProductForAddAction from '../../actions/EditorProductForAddAction';
import { bindActionCreators } from 'redux';
import {SearchInput,BatchUpload,AreaPriceEdit,AreaPriceDetail,ProductCatalog,AreaCodes} from '../../components'
import {Router, Route, Link, IndexRoute, Redirect,IndexLink } from 'react-router'
import dateFormat from 'dateformat';
const FormItem = Form.Item;
const confirm = Modal.confirm;
import domUtil from '../../utils/domUtil';
import './index.less';

export default class EditorProductForAddManage extends React.Component {
    constructor(props) {
        super(props);
        //初始化bind(this)
        this.onSelectChange = this.onSelectChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
        //this.handleSave = this.handleSave.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleTableSizeChange = this.handleTableSizeChange.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);

        this.onChange = this.onChange.bind(this);
        this.editRecord = this.editRecord.bind(this);
        this.saveRecord = this.saveRecord.bind(this);
        this.handleMinSaleChange = this.handleMinSaleChange.bind(this);
        this.handleWmCountChange = this.handleWmCountChange.bind(this);
        this.handleShowIndexChange = this.handleShowIndexChange.bind(this);
        this.handleAdMsgChange = this.handleAdMsgChange.bind(this);
        this.saveRecords = this.saveRecords.bind(this);
        this.handleMaxSaleChange = this.handleMaxSaleChange.bind(this);
    }
    // 完成渲染新的props或者state后调用，此时可以访问到新的DOM元素。
    componentDidUpdate() {
        domUtil.controlTable();
    }

    onChange(field, value) {
        //console.log(field, 'change', value);
        this.setState({
            [field]: value,
        });
    }
    saveRecord(e,index) {
        let record = this.props.editRecordList[index];

        //console.info('==================record======================')
        //console.info(record);
        let {minSale,wmCount,maxSale,adMsg} = record;
        if (!minSale || !wmCount || !adMsg || !maxSale
            || minSale == '' || wmCount == '' || adMsg == ''|| maxSale =='' ) {
            Modal.error({
                title: '提示',
                content: '输入不能为空!'
            });
            return;

        }

        let regInt = /^[1-9][0-9]*$/;
        if (!regInt.test(minSale) || minSale.length>7) {
            Modal.error({
                title: '提示',
                content: '起批量不正确'
            });
            return;
        }
        if ((!(regInt.test(maxSale)) && maxSale != -1) || maxSale.length>7 ) {
            Modal.error({
                title: '提示',
                content: '单用户限购量不正确'
            });
            return;
        }
        if (!(regInt.test(wmCount) || wmCount == -1) || wmCount.length>10) {
            Modal.error({
                title: '提示',
                content: '库存不正确'
            });
            return;
        }

        if (adMsg && adMsg.length > 100) {
            Modal.error({
                title: '提示',
                content: '广告语不能多余100字'
            });
            return;
        }
        let {pageNo,pageSize}  = this.props.pgList;
        let params = Object.assign(
            {},
            {param: this.props.form.getFieldsValue()},
            {pageNo: pageNo, pageSize: pageSize}
        );
        let arr = [];
        record.activityId = this.props.location.query.activityId;
        arr.push(record);
        this.props.editorProductForAddAction.saveRecord(arr,params);
    }
    saveRecords(){
        //获取的选择行
        let selectKeys = this.props.selectedRowKeys;
        //state recordList
        let stateRecordList = this.props.editRecordList;
        let newRecords = [];
        let r=true;
        let contentMsg = '';
        stateRecordList.map(rec => {
           if(selectKeys.includes(rec.productId)){
               rec.activityId = this.props.location.query.activityId;
               newRecords.push(rec);
           }
        });
        if(newRecords.length == 0){
            //Modal.error({
            //    title: '提示',
            //    content: '请选择商品进行添加!'
            //});
            contentMsg= '请选择商品进行添加';
            r=false;
            return false;
        }

        newRecords.map(reco => {
            let {minSale,wmCount,adMsg,maxSale} = reco;
            if (!minSale || !wmCount || !adMsg || !maxSale
                || minSale == '' || wmCount == '' || adMsg == ''|| maxSale =='' ) {
                //Modal.error({
                //    title: '提示',
                //    content: '输入不能为空!'
                //});
                contentMsg= '输入不能为空';
                r=false;
                return false;

            }

            let regInt = /^[1-9][0-9]*$/;
            if (!regInt.test(minSale) || minSale.length>7) {
                //Modal.error({
                //    title: '提示',
                //    content: '起批量不正确'
                //});
                contentMsg= '起批量不正确';
                r=false;
                return false;
            }
            if ((!(regInt.test(maxSale)) && maxSale != -1) || maxSale.length>7 ) {
                //Modal.error({
                //    title: '提示',
                //    content: '单用户限购量不正确'
                //});
                contentMsg= '单用户限购量不正确';
                r=false;
                return false;
            }
            if (!(regInt.test(wmCount) || wmCount == -1) || wmCount.length>10) {
                //Modal.error({
                //    title: '提示',
                //    content: '库存不正确'
                //});
                contentMsg= '库存不正确';
                r=false;
                return false;
            }

            if (adMsg && adMsg.length > 100) {
                //Modal.error({
                //    title: '提示',
                //    content: '广告语不能多余100字'
                //});
                contentMsg= '广告语不能多余100字';
                r=false;
                return false;
            }
        });
        if(!r){
            Modal.error({
                title: '提示',
                content: contentMsg
            });
            return;
        }
        let {pageNo,pageSize}  = this.props.pgList;
        let params = Object.assign(
            {},
            {param: this.props.form.getFieldsValue()},
            {pageNo: pageNo, pageSize: pageSize}
        );
        this.props.editorProductForAddAction.saveRecord(newRecords,params);
    }
    /**
     * 点击table某一行时触发，把选中的记录的主键存入store
     * @param record
     * @param index
     */
    handleRowClick(record, index) {
        this.props.commonAction.addOrDeleteSelectedRowKeys(record.productId);
    }
    editRecord(record) {
        let {productId,wholesalePrice,minSale,wmCount,adMsg} = record;
        let postData = {
            productId: productId,
            wholesalePrice: wholesalePrice,
            minSale: minSale,
            wmCount: wmCount,
            adMsg: adMsg
        }
        this.props.editorProductForAddAction.setEditRecord(postData);
    }
    /**
     * 查询
     * @param e
     */
    handleSearch(e) {
        //组织表单默认提交
        e.preventDefault();
        //this.props.form.setFieldsValue({activityId:this.props.location.query.activityId })
        this.props.editorProductForAddAction.listPg({param: this.props.form.getFieldsValue()});
    }
    /**
     * 重置搜索条件
     * @param e
     */
    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
        this.props.inputSearchAction.initSupply();
        this.props.inputSearchAction.hide();
    }

    handleCancel(field) {
        this.props.commonAction.hideModal(field);
    }
    /**
     * 分页、排序、筛选变化时触发，向后台重新请求数据
     * @param pagination 分页器
     * @param filters
     * @param sorter
     */
    handleTableChange(pagination, filters, sorter) {
        //this.props.form.setFieldsValue({activityId:this.props.location.query.activityId })
        let params = Object.assign(
            {},
            {param: this.props.form.getFieldsValue()},
            {pageNo: pagination.current, pageSize: pagination.pageSize}
        );
        this.props.editorProductForAddAction.listPg(params);
    }
    /**
     * 显示弹窗
     * @param type 弹窗子组件类型
     * @param field 弹窗index [0,1,2,3,4]
     */
    showModal(type, field, productId) {
        switch (type) {
            case 'detail':
            {
                this.props.editorProductForAddAction.listAreaPriceDetail(productId);
                break;
            }
            default :
                return;
        }
        this.props.commonAction.showModal(field);
    }
    /**
     * 组件渲染完成后触发
     */
    componentDidMount() {
        //初始化弹窗状态
        this.props.commonAction.initModal();
        //初始化table选中状态
        this.props.commonAction.initSelectedKeys();
        //初始化supplyDiv
        this.props.inputSearchAction.hide();
        this.props.inputSearchAction.initSupply();
        //加载表单数据
        //this.props.form.setFieldsValue({activityId:this.props.location.query.activityId })
        //this.props.editorProductForAddAction.listPg({param: this.props.form.getFieldsValue()});
    };
    /**
     * 分页组件 改变分页大小时触发，向后台重新请求数据
     * @param current  下一页
     * @param pageSize 分页大小
     */
    handleTableSizeChange(current, pageSize) {
        let params = Object.assign(
            {},
            {param: this.props.form.getFieldsValue()},
            {pageNo: current, pageSize: pageSize}
        );
        this.props.editorProductForAddAction.listPg(params);
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
     * 编辑起售量
     */
    handleMinSaleChange(e,index) {
        this.props.editorProductForAddAction.setEditingRecord(index,{minSale: e.target.value})
    }
    handleMaxSaleChange(e,index) {
        this.props.editorProductForAddAction.setEditingRecord(index,{maxSale: e.target.value})
    }
    /**
     * 编辑库存
     */
    handleWmCountChange(e,index) {
        this.props.editorProductForAddAction.setEditingRecord(index,{wmCount: e.target.value})
    }

    /**
     * 编辑排序
     */
    handleShowIndexChange(e,index) {
        this.props.editorProductForAddAction.setEditingRecord(index,{showIndex: e.target.value})
    }

    /**
     * 编辑广告语
     */
    handleAdMsgChange(e,index) {
        this.props.editorProductForAddAction.setEditingRecord(index,{adMsg: e.target.value})
    }
    render() {

        //获取prop中需要的属性
        const { selectedRowKeys,modalVisiable,pgList,areaList,productId,editRecord,areaPriceDetailList,editRecordList} = this.props;


//定义表头
        const columns = [{
            title: '商品编码',
            dataIndex: 'productCode',
            render: (text, record, index) => {
                return <span >
                    {record.productCode}
                </span>
            },
        }, {
            title: '供应商',
            dataIndex: 'supplyName',
            render: (text, record, index) => {
                return <span >
                    <label title={record.supplyName || ''}>{record.supplyName}</label>
                </span>
            },
            width: '20%'
        },
            {
            title: 'SPU编码',
            dataIndex: 'spuCode',
            render: (text, record, index) => {
                let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                return <span className={flag? 'font_gray':''} >
                    {record.spuCode}
                </span>
            },
        }, {
            title: 'SPU名称',
            dataIndex: 'productName',
            render: (text, record, index) => {
                return <span >
                  <label title={record.productName || ''}> {record.productName}</label>
                </span>
            },
        }, {
            title: '规格',
            dataIndex: 'spec',
            render: (text, record, index) => {
                return <span >
                    <label title={record.spec || ''}> {record.spec}</label>
                </span>
            },
        }, {
            title: '生产厂家',
            dataIndex: 'factoryName',
            render: (text, record, index) => {
                return <span >
                   <label title={record.factoryName || ''}> {record.factoryName}</label>
                </span>
            },
        }, {
            title: '品牌名称',
            dataIndex: 'brandName',
            render: (text, record, index) => {
                return <span>
                     <label title={record.brandName || ''}>  {record.brandName}</label>
                </span>
            },
        },{
                title: '价格',
                dataIndex: 'wholesalePrice',
                render: (text, record, index) => {
                    let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                    let isShow = record.productId == editRecord.productId ? true : false;
                    return <span className={flag? 'font_gray':''}>
                        {record.wholesalePrice}

                        <a href="javascript:void(0);" className="searchPri" onClick={this.showModal.bind(this,'detail',0,record.productId)}>查看 </a>
                </span>
                },
            },
            {
            title: '起批量',
            dataIndex: 'minSale',
            render: (text, record, index) => {
                //let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                let isShow = !record.isSpuRelative ||  record.isSpuRelative == null  ||  record.isSpuRelative == '' ? true : false;

                return <span>
                    <Input type={isShow ? "text":"hidden"}
                        onChange={(e)=>this.handleMinSaleChange(e,index)}
                           defaultValue={record.minSale}
                           value={editRecordList.length == 0?'' :  editRecordList[index].minSale}
                    />
                    {isShow ? '' : <label >{record.minSale}</label>}
                </span>
            },
        },
            {
                title: '单用户限购量',
                dataIndex: 'maxSale',
                render: (text, record, index) => {
                    //let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                    let isShow = !record.isSpuRelative ||  record.isSpuRelative == null  ||  record.isSpuRelative == '' ? true : false;
                    return <span>
                    <Input type={isShow ? "text":"hidden"}
                        onChange={(e)=>this.handleMaxSaleChange(e,index)}
                           defaultValue={-1}
                           value={editRecordList.length == 0?'' :  editRecordList[index].maxSale}
                    />
                        {isShow ? '' : <label >{record.maxSale}</label>}
                </span>
                },
            },{
            title: '活动初始库存',
            dataIndex: 'wmCount',
            render: (text, record, index) => {
                //let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                let isShow = !record.isSpuRelative ||  record.isSpuRelative == null  ||  record.isSpuRelative == '' ? true : false;
                return <span>
                    <Input  type={isShow ? "text":"hidden"}
                        onChange={(e)=>this.handleWmCountChange(e,index)}
                           defaultValue={record.wmCount}
                           value={editRecordList.length == 0?'' :  editRecordList[index].wmCount}
                    />
                    {isShow ? '' : <label >{record.wmCount}</label>}
                </span>
            },
        }, {
            title: '广告语',
            dataIndex: 'adMsg',
            render: (text, record, index) => {
                //let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                let isShow = !record.isSpuRelative ||  record.isSpuRelative == null  ||  record.isSpuRelative == '' ? true : false;
                let adMsg = record.adMsg || '';
                if(adMsg.length > 15)
                    adMsg = adMsg.substring(0,15)+'...'
                return <span>
                    <Input type={isShow ? "text":"hidden"}
                        onChange={(e)=>this.handleAdMsgChange(e,index)}
                           defaultValue={record.adMsg}
                           maxLength="100"
                           value={editRecordList.length == 0?'' :  editRecordList[index].adMsg}
                    />
                    {isShow ? '' : <label title={record.adMsg || ''}>{adMsg}</label>}
                </span>
            },
        }, {
            title: '商品状态',
            dataIndex: 'productStatusName',
            render: (text, record, index) => {
                //let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                return <span  >
                    {record.productStatusName}
                </span>
            },
        }, {
            title: '操作',
            render: (text, record, index) => {
                let isShow = !record.isSpuRelative ||  record.isSpuRelative == null  ||  record.isSpuRelative == '' ? true : false;
                return <span>
                       <Button
                           type="primary"
                           size="small"
                           onClick={(e)=>this.saveRecord(e,index)}
                           disabled={!isShow}
                       >
                           <Icon type="save"/>添加
                       </Button>
                </span>
            },
        },
        ];

        //设置搜索区域输入框大小
        const formItemLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14},
        };

        //selectedRowKeys：选中row的集合，onChange：勾选checkBox时触发
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps(record) {
                return {
                    disabled:  record.isSpuRelative &&  record.isSpuRelative != null  &&  record.isSpuRelative != ''    // 配置无法勾选的列
                };
            },
        };

        //定义分页属性
        const pagination = {
            total: pgList.total,
            current: pgList.pageNo,
            showSizeChanger: true,
            onShowSizeChange: this.handleTableSizeChange,
            showQuickJumper: true,
            defaultPageSize: pgList.pageSize,
            pageSize: pgList.pageSize,
            pageSizeOptions: ['15', '20', '30', '40'],
            showTotal: total=> {
                return `共${total}条记录`
            }
        };

        //是否有选中row
        const hasSelected = selectedRowKeys.length > 0;

        //获取form的getFieldProps，用来标识from组件名称
        const { getFieldProps } = this.props.form;


        let {pageNo,pageSize}  = pgList;
        let params = Object.assign(
            {},
            {param: this.props.form.getFieldsValue()},
            {pageNo: pageNo, pageSize: pageSize}
        );
        let url = "/adminIndex/editorProductForActivityManage?activityId="+this.props.location.query.activityId;
        return (
            <div>
                <Row>
                    <Button
                        type="ghost"
                        className="topBtn"
                        disabled= 'true'
                    >
                        添加商品
                    </Button>
                    <Link className="btnLink"  to={{pathname:"/adminIndex/editorProductForActivityManage" ,query:{activityId:this.props.location.query.activityId}}}>已添加商品</Link>
                </Row>

                <Form horizontal className="advanced-search-form" form={this.props.form}>
                    <Row>
                        <Col span="6">
                            <FormItem
                                {...formItemLayout}
                                label="SPU名称："
                            >
                                <Input {...getFieldProps('productName')} />
                            </FormItem>
                        </Col>

                        <Col span="6">
                            <FormItem
                                {...formItemLayout}
                                label="生产厂家："
                            >
                                <Input {...getFieldProps('factoryName')} />
                            </FormItem>

                        </Col>
                        <Col span="6">
                            <FormItem
                                {...formItemLayout}
                                label="供应商："
                            >
                                <SearchInput
                                    name="supplyName"
                                    form={this.props.form}
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem
                                labelCol={ {span: 5}}
                                wrapperCol={ {span: 19}}
                                label="类目："
                            >
                                <ProductCatalog
                                    catalogCode1="catalogCode1"
                                    catalogCode2="catalogCode2"
                                    catalogCode3="catalogCode3"
                                    form={this.props.form}
                                />
                            </FormItem>
                        </Col>
                        <Col span="10">
                            <Col span="24" style={{ textAlign: 'right' }}>
                                <FormItem>
                                   <Input
                                       type="hidden"
                                       {...getFieldProps('activityId', {initialValue:this.props.location.query.activityId})}
                                   />
                                </FormItem>
                                <Button
                                    type="primary"
                                    onClick={this.handleSearch}
                                    className="topBtn"
                                >
                                    <Icon type="search"/>搜索
                                </Button>
                                <Button
                                    type="ghost"
                                    className="topBtn"
                                    onClick={this.handleReset}
                                >
                                    清除条件
                                </Button>
                            </Col>
                        </Col>
                    </Row>
                </Form>

                <Row>
                    <Button
                        type="ghost"
                        className="topBtn"
                        onClick={this.saveRecords}
                        disabled={!hasSelected}
                    >
                        添加
                    </Button>
                </Row>
                <Row>
                    <Col span="24">
                        <Table
                            className="commonTable editorAddTable singleShort"
                            rowKey={record  => record.productId}
                            columns={columns}
                            rowSelection={rowSelection}
                            onChange={this.handleTableChange}
                            //onRowClick={this.handleRowClick}
                            dataSource={pgList.resultList}
                            bordered
                            useFixedHeader
                            pagination={pagination}
                        />
                    </Col>
                </Row>

                <Modal
                    title="销售区域及价格查看"
                    visible={modalVisiable[0]}
                    onCancel={this.handleCancel.bind(this,0)}
                    footer={false}
                >
                    <AreaPriceDetail
                        areaPriceDetailList={areaPriceDetailList}
                    />
                </Modal>

                <Modal
                    title="销售区域及价格"
                    visible={modalVisiable[1]}
                    onCancel={this.handleCancel.bind(this,1)}
                    footer={false}
                >
                    <AreaPriceEdit
                        areaList={areaList}
                        onCancel={this.handleCancel.bind(this,1)}
                        productId={productId}
                        pagination = {params}
                    />
                </Modal>

            </div>
        );
    }
}

/**
 * 把action操作映射到this.props中
 * @param dispatch
 * @returns {{editorProductForAddAction: *, commonAction: *}}
 */
function dispatchToProps(dispatch) {
    return {
        editorProductForAddAction: bindActionCreators(EditorProductForAddAction, dispatch),
        commonAction: bindActionCreators(CommonAction, dispatch),
        commonTypeAction: bindActionCreators(CommonTypeAction, dispatch),
        inputSearchAction: bindActionCreators(InputSearchAction, dispatch),
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
        pgList: state.editorProductForAddReducer.pgList,
        areaPriceDetailList: state.editorProductForAddReducer.areaPriceDetailList,
        editRecord: state.editorProductForAddReducer.editRecord,
        editRecordList:state.editorProductForAddReducer.editRecordList,
    };
}
/**
 * 获取全局路由
 * @type {{router: *}}
 */
EditorProductForAddManage.contextTypes = {
    router: React.PropTypes.object
};

//经过 Form.create 包装的组件将会自带 this.props.form 属性
EditorProductForAddManage = Form.create()(EditorProductForAddManage)
/**
 * 把action和store注入到this.props
 */
export default connect(stateToProps, dispatchToProps)(EditorProductForAddManage);

