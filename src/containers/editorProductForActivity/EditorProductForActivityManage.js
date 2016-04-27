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
import * as EditorProductForActivityAction from '../../actions/EditorProductForActivityAction';
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
        this.handleLeastUserBuyChange = this.handleLeastUserBuyChange.bind(this);
        this.handleProductQuantityChange = this.handleProductQuantityChange.bind(this);
        this.handleShowIndexChange = this.handleShowIndexChange.bind(this);
        this.handleActivitySellInfoChange = this.handleActivitySellInfoChange.bind(this);
        this.handleMostUserBuyChange = this.handleMostUserBuyChange.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
        this.deleteRecords = this.deleteRecords.bind(this);
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
    deleteRecord(e,index){
        let record = this.props.editRecordList[index];
        let relationId = record.relationId;
        let arr = [];
        arr.push(relationId);
        let _this = this;
        let {pageNo,pageSize}  = this.props.pgList;
        let params = Object.assign(
            {},
            {param: this.props.form.getFieldsValue()},
            {pageNo: pageNo, pageSize: pageSize}
        );
        confirm({
            title: '提示',
            content: '是否删除该商品？',
            onOk() {
                _this.props.editorProductForActivityAction.deleteRecord(arr,params);
            }
        });
    }
    deleteRecords(e,index){
        let selectKeys = this.props.selectedRowKeys;
        let _this = this;
        let {pageNo,pageSize}  = this.props.pgList;
        let params = Object.assign(
            {},
            {param: this.props.form.getFieldsValue()},
            {pageNo: pageNo, pageSize: pageSize}
        );
        confirm({
            title: '提示',
            content: '是否删除选中商品？',
            onOk() {
                _this.props.editorProductForActivityAction.deleteRecord(selectKeys,params);
            }
        });
    }
    saveRecord(e,index) {
        let record = this.props.editRecordList[index];

        //console.info('==================record======================')
        //console.info(record);
        let {leastUserBuy,mostUserBuy,productQuantity,activitySellInfo} = record;
        if (!leastUserBuy || !mostUserBuy || !productQuantity || !activitySellInfo
            || leastUserBuy == '' || mostUserBuy == '' || productQuantity == ''|| activitySellInfo =='' ) {
            Modal.error({
                title: '提示',
                content: '输入不能为空!'
            });
            return;

        }

        let regInt = /^[1-9][0-9]*$/;
        if (!regInt.test(leastUserBuy) || leastUserBuy.length > 7) {
            Modal.error({
                title: '提示',
                content: '起批量不正确'
            });
            return;
        }
        if ((!regInt.test(mostUserBuy) && mostUserBuy != -1) || mostUserBuy.length > 7) {
            Modal.error({
                title: '提示',
                content: '单用户限购量不正确'
            });
            return;
        }
        if ((!(regInt.test(productQuantity))) || mostUserBuy.length > 10) {
            Modal.error({
                title: '提示',
                content: '库存不正确'
            });
            return;
        }

        if (activitySellInfo && activitySellInfo.length > 100) {
            Modal.error({
                title: '提示',
                content: '促销语不能多余100字'
            });
            return;
        }
        let {pageNo,pageSize}  = this.props.pgList;
        let params = Object.assign(
            {},
            {param: this.props.form.getFieldsValue()},
            {pageNo: pageNo, pageSize: pageSize}
        );
        this.props.editorProductForActivityAction.saveRecord(record,params);
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
        this.props.editorProductForActivityAction.setEditRecord(postData);
    }
    /**
     * 查询
     * @param e
     */
    handleSearch(e) {
        //组织表单默认提交
        e.preventDefault();
        //this.props.form.setFieldsValue({activityId:this.props.location.query.activityId })
        this.props.editorProductForActivityAction.listPg({param: this.props.form.getFieldsValue()});
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
        this.props.editorProductForActivityAction.listPg(params);
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
                this.props.editorProductForActivityAction.listAreaPriceDetail(productId);
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
        this.props.editorProductForActivityAction.listPg({param: this.props.form.getFieldsValue()});
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
        this.props.editorProductForActivityAction.listPg(params);
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
    handleLeastUserBuyChange(e,index) {
        this.props.editorProductForActivityAction.setEditingRecord(index,{leastUserBuy: e.target.value})
    }
    changeShowIndex(e,index) {
        let record = this.props.editRecordList[index];
        let {showIndex} = record;
        let regInt = /^[1-9][0-9]*$/;
        if (!showIndex
            || showIndex == '') {
            Modal.error({
                title: '提示',
                content: '输入不能为空!'
            });
            return;
        }
        if (!regInt.test(showIndex)|| showIndex.length>7) {
            Modal.error({
                title: '提示',
                content: '排序输入不正确'
            });
            return;
        }
        let params = Object.assign(
            {},
            {param: this.props.form.getFieldsValue()},
            {pageNo: this.props.pageNo, pageSize: this.props.pageSize}
        );
        this.props.editorProductForActivityAction.changeShowIndex(record,params);
    }
    handleMostUserBuyChange(e,index) {
        this.props.editorProductForActivityAction.setEditingRecord(index,{mostUserBuy: e.target.value})
    }
    /**
     * 编辑库存
     */
    handleProductQuantityChange(e,index) {
        this.props.editorProductForActivityAction.setEditingRecord(index,{productQuantity: e.target.value})
    }

    /**
     * 编辑排序
     */
    handleShowIndexChange(e,index) {
        this.props.editorProductForActivityAction.setEditingRecord(index,{showIndex: e.target.value})
    }

    /**
     * 编辑促销语
     */
    handleActivitySellInfoChange(e,index) {
        this.props.editorProductForActivityAction.setEditingRecord(index,{activitySellInfo: e.target.value})
    }
    render() {

        //获取prop中需要的属性
        const { selectedRowKeys,modalVisiable,pgList,areaList,productId,editRecord,areaPriceDetailList,editRecordList} = this.props;


//定义表头
        const columns = [{
            title: '排序',
            dataIndex: 'showIndex',
            render: (text, record, index) => {
                let isShow = record.status == 1? true : false;
                return <span>
                    <Input type={isShow ? "text":"hidden"}
                           onChange={(e)=>this.handleShowIndexChange(e,index)}
                           onBlur = {(e)=>this.changeShowIndex(e,index)}
                           defaultValue={record.showIndex}
                           value={editRecordList.length == 0?'' :  editRecordList[index].showIndex}
                    />
                    {isShow ? '' : <label >{record.showIndex}</label>}
                </span>
            },
        },{
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
        },
            {
            title: 'SPU编码',
            dataIndex: 'spuCode',
            render: (text, record, index) => {
                return <span>
                    {record.spuCode}
                </span>
            },
        }, {
            title: 'SPU名称',
            dataIndex: 'productName',
            render: (text, record, index) => {
                return <span>
                   <label title={record.productName || ''}>{record.productName}</label>
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
                    <label title={record.factoryName || ''}>  {record.factoryName}</label>
                </span>
            },
        }, {
            title: '品牌名称',
            dataIndex: 'brandName',
            render: (text, record, index) => {
                return <span >
                   <label title={record.brandName || ''}>{record.brandName}</label>
                </span>
            },
        },{
                title: '价格',
                dataIndex: 'wholesalePrice',
                render: (text, record, index) => {
                    return <span >
                        {record.wholesalePrice} <a href="javascript:void(0);" className="searchPri" onClick={this.showModal.bind(this,'detail',0,record.productId)}>
                            查看 </a>
                </span>
                },
            },
            {
            title: '起批量',
            dataIndex: 'leastUserBuy',
            render: (text, record, index) => {
                let isShow = record.status == 1? true : false;
                return <span>
                    <Input  type={isShow ? "text":"hidden"}
                        onChange={(e)=>this.handleLeastUserBuyChange(e,index)}
                           defaultValue={record.leastUserBuy}
                           value={editRecordList.length == 0?'' :  editRecordList[index].leastUserBuy}
                    />
                    {isShow ? '' : <label >{record.leastUserBuy}</label>}
                </span>
            },
        },
            {
                title: '单用户限购量',
                dataIndex: 'mostUserBuy',
                render: (text, record, index) => {
                    let isShow = record.status == 1? true : false;
                    return <span>
                    <Input type={isShow ? "text":"hidden"}
                        onChange={(e)=>this.handleMostUserBuyChange(e,index)}
                           defaultValue={ -1 }
                           value={editRecordList.length == 0?'' :  editRecordList[index].mostUserBuy}
                    />
                        {isShow ? '' : <label >{record.mostUserBuy}</label>}
                </span>
                },
            },{
            title: '活动初始库存',
            dataIndex: 'productQuantity',
            render: (text, record, index) => {
                let isShow = record.status == 1? true : false;
                return <span>
                    <Input type={isShow ? "text":"hidden"}
                        onChange={(e)=>this.handleProductQuantityChange(e,index)}
                           defaultValue={record.productQuantity}
                           value={editRecordList.length == 0?'' :  editRecordList[index].productQuantity}
                    />
                    {isShow ? '' : <label >{record.productQuantity}</label>}
                </span>
            },
        },{
                title: '活动实时库存',
                dataIndex: 'productNowQuantity',
                render: (text, record, index) => {

                    return <span>
                          {record.productNowQuantity}
                </span>
                },
            }, {
            title: '促销语',
            dataIndex: 'activitySellInfo',
            render: (text, record, index) => {
                let isShow = record.status == 1? true : false;
                let activitySellInfo = record.activitySellInfo || '';
                if(activitySellInfo.length > 15)
                    activitySellInfo = activitySellInfo.substring(0,15)+'...'
                return <span>
                    <Input type={isShow ? "text":"hidden"}
                        onChange={(e)=>this.handleActivitySellInfoChange(e,index)}
                           defaultValue={record.activitySellInfo}
                           maxLength="100"
                           value={editRecordList.length == 0?'' :  editRecordList[index].activitySellInfo}
                    />
                    {isShow ? '' : <label title={record.activitySellInfo || ''} >{activitySellInfo}</label>}
                </span>
            },
        }, {
            title: '商品状态',
            dataIndex: 'statusValue',
            render: (text, record, index) => {
                let isRed = record.statusValue == '已从活动中删除'? true : false;
                return <span className ={isRed? 'font_red':''}>
                    {record.statusValue}
                </span>
            },
        }, {
            title: '操作',
            render: (text, record, index) => {
                return <span>
                       <Button
                           type="primary"
                           size="small"
                           onClick={(e)=>this.saveRecord(e,index)}
                           disabled = {record.status != 1}
                       >
                           <Icon type="save"/>保存
                       </Button>
                    <Button
                        type="primary"
                        size="small"
                        onClick={(e)=>this.deleteRecord(e,index)}
                        disabled = {record.status != 1}
                    >
                        <Icon type="save"/>删除
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
                    disabled:  record.status != 1    // 配置无法勾选的列
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
        //let url = "/adminIndex/editorProductForAddManage?activityId="+this.props.location.query.activityId;
        return (
            <div>
                <Row>
                    <Link className="btnLink" to={{pathname:"/adminIndex/editorProductForAddManage" ,query:{activityId:this.props.location.query.activityId}}}>添加商品</Link>

                    <Button
                        type="ghost"
                        className="topBtn"
                        disabled= 'true'
                    >
                        已添加的商品
                    </Button>
                </Row>

                <Form horizontal className="advanced-search-form" form={this.props.form}>
                    <Row>
                        <Col span="6">
                            <FormItem
                                {...formItemLayout}
                                label="商品编码："
                            >
                                <Input {...getFieldProps('productCode')} />
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
                        </Col >
                        <Col span="6">
                            <FormItem
                                {...formItemLayout}
                                label="SPU编码："
                            >
                                <Input {...getFieldProps('spuCode')} />
                            </FormItem>
                        </Col >
                        <Col span="6">
                            <FormItem
                                {...formItemLayout}
                                label="SPU名称："
                            >
                                <Input {...getFieldProps('productName')} />
                            </FormItem>
                        </Col >

                    </Row>
                    <Row>
                        <Col span="6" >
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
                                label="品牌名称："
                            >
                                <Input {...getFieldProps('brandName')} />
                            </FormItem>

                        </Col>
                        <Col span="12" >
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
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem
                                labelCol={ {span: 5}}
                                wrapperCol={ {span: 19}}
                                label="销售区域："
                            >
                                <AreaCodes
                                    province="province"
                                    city="cityCode"
                                    area="areaCode"
                                    form={this.props.form}
                                    provinceOption = {{infoCode:'-999',infoName:'全国'}}//呵呵
                                />
                            </FormItem>

                        </Col>
                        <Col span="6">
                            <FormItem
                                {...formItemLayout}
                                label="商品状态："
                            >
                                <Select
                                    {...getFieldProps('productStatus', {initialValue: '-1'})}
                                    size="large"
                                    placeholder="商品状态"
                                    defaultValue="-1"
                                >
                                    <Option value="-1">全部</Option>
                                    <Option value="8">销售中</Option>
                                    <Option value="5">下架</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="6">
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
                        onClick={this.deleteRecords}
                        disabled={!hasSelected}
                    >
                        删除
                    </Button>
                </Row>
                <Row>
                    <Col span="24">
                        <Table  className="commonTable editorActivityTable twoShort"
                            rowKey={record  => record.relationId}
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
 * @returns {{editorProductForActivityAction: *, commonAction: *}}
 */
function dispatchToProps(dispatch) {
    return {
        editorProductForActivityAction: bindActionCreators(EditorProductForActivityAction, dispatch),
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
        pgList: state.editorProductForActivityReducer.pgList,
        areaPriceDetailList: state.editorProductForActivityReducer.areaPriceDetailList,
        editRecord: state.editorProductForActivityReducer.editRecord,
        editRecordList:state.editorProductForActivityReducer.editRecordList,
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

