/**
 * Created by zhangqiang on 2016/2/22.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Button , Row , Col ,Icon ,Form, Input ,DatePicker ,Select ,Modal } from 'antd';
import { connect } from 'react-redux';
import * as ProductSaleAction from '../../actions/ProductSaleAction';
import * as CommonAction from '../../actions/CommonAction'
import * as CommonTypeAction from '../../actions/CommonTypeAction'
import * as InputSearchAction from '../../actions/InputSearchAction'
import { bindActionCreators } from 'redux';
import {SearchInput,BatchUpload,AreaPriceEdit,AreaPriceDetail,ProductCatalog,AreaCodes} from '../../components'
import {Link} from 'react-router'
import dateFormat from 'dateformat';
const FormItem = Form.Item;
const confirm = Modal.confirm;
import './index.less'
import domUtil from '../../utils/domUtil'


export default class ProductSaleManage extends React.Component {
    /**
     * 构造方法 初始化数据
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            updateStartDate: null,
            updateEndDate: null
        }
        //初始化bind(this)
        this.onSelectChange = this.onSelectChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.handleTableSizeChange = this.handleTableSizeChange.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleUp = this.handleUp.bind(this);
        this.handleDown = this.handleDown.bind(this);
        this.handleStartUse = this.handleStartUse.bind(this);
        this.handleStopUse = this.handleStopUse.bind(this);
        this.disabledStartDate = this.disabledStartDate.bind(this);
        this.disabledEndDate = this.disabledEndDate.bind(this);
        this.onChange = this.onChange.bind(this);
        this.editRecord = this.editRecord.bind(this);
        this.saveRecord = this.saveRecord.bind(this);
        this.handleWholesalePriceChange = this.handleWholesalePriceChange.bind(this);
        this.handleMinSaleChange = this.handleMinSaleChange.bind(this);
        this.handleWmCountChange = this.handleWmCountChange.bind(this);
        this.handleShowIndexChange = this.handleShowIndexChange.bind(this);
        this.handleAdMsgChange = this.handleAdMsgChange.bind(this);
        //this.scrollTable = this.scrollTable.bind(this);

    }


    /*scrollTable(){
        console.log('xx');
    }*/
    /**
     * 点击table第一列checkBox时调用，
     * @param selectedRowKeys 所有选中row的key的集合
     */
    onSelectChange(selectedRowKeys) {
//        console.info(selectedRowKeys);
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
        this.props.productSaleAction.listPg({param: this.props.form.getFieldsValue()});
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

    /**
     * 分页、排序、筛选变化时触发，向后台重新请求数据
     * @param pagination 分页器
     * @param filters
     * @param sorter
     */
    handleTableChange(pagination, filters, sorter) {
        let params = Object.assign(
            {},
            {param: this.props.form.getFieldsValue()},
            {pageNo: pagination.current, pageSize: pagination.pageSize}
        );
        this.props.productSaleAction.listPg(params);
    }

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
        this.props.productSaleAction.listPg(params);
    }

    /**
     * 点击table某一行时触发，把选中的记录的主键存入store
     * @param record
     * @param index
     */
    handleRowClick(record, index) {
//        console.log('click');
        this.props.commonAction.addOrDeleteSelectedRowKeys(record.productId);
    }


    /**
     * 显示弹窗
     * @param type 弹窗子组件类型
     * @param field 弹窗index [0,1,2,3,4]
     */
    showModal(type, field, productId) {
        switch (type) {
            case 'batchUpload':
            {
                this.props.productSaleAction.initBatchUpload();
                this.props.commonAction.initUploadFile();
                break;
            }
            case 'edit':
            {
                //this.props.productSaleAction.initAreaPriceEdit();
                this.props.productSaleAction.reEditAreaPriceDetail(productId);
                this.props.productSaleAction.setProductId(productId);
                break;
            }
            case 'detail':
            {
                this.props.productSaleAction.listAreaPriceDetail(productId);
                break;
            }
            default :
                return;
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
        this.props.productSaleAction.add(form, {param: this.props.form.getFieldsValue()});
    }

    /**
     * 更新记录
     * @param form
     */
    handleUpdate(form) {
        this.props.productSaleAction.update(form, {param: this.props.form.getFieldsValue()});
    }

    /**
     * 上架
     * @param e
     */
    handleUp(e) {
        e.preventDefault();
        let {selectedRowKeys,pgList} = this.props;
        let _this = this;
        if (selectedRowKeys.length != 0) {
            let resultList = pgList.resultList;
            let flag = false;
            resultList.map(item => {
                selectedRowKeys.map(key => {
                    if (item.productId == key && (item.infoCode != 2 || item.pricePolicy == 0))
                        flag = true;
                })
            })
            if (flag) {
                confirm({
                    title: '提示',
                    content: '将要上架的商品存在不符合上架条件的，点击确定只上架符合条件的商品，点击取消放弃上架！',
                    onOk() {
                        _this.props.productSaleAction.up(selectedRowKeys, {param: _this.props.form.getFieldsValue()});
                    }
                });
            } else {
                this.props.productSaleAction.up(selectedRowKeys, {param: _this.props.form.getFieldsValue()});
            }

        }
    }

    /**
     * 下架
     * @param e
     */
    handleDown(e) {
        e.preventDefault();
        let selectedRowKeys = this.props.selectedRowKeys;
        if (selectedRowKeys.length != 0) {
            this.props.productSaleAction.down(selectedRowKeys, {param: this.props.form.getFieldsValue()});
        }
    }

    /**
     * 启用
     * @param e
     */
    handleStartUse(e) {
        e.preventDefault();
        let selectedRowKeys = this.props.selectedRowKeys;
        if (selectedRowKeys.length != 0) {
            this.props.productSaleAction.startUse(selectedRowKeys, {param: this.props.form.getFieldsValue()});
        }
    }

    /**
     * 停用
     * @param e
     */
    handleStopUse(e) {
        e.preventDefault();
        let selectedRowKeys = this.props.selectedRowKeys;
        if (selectedRowKeys.length != 0) {
            this.props.productSaleAction.stopUse(selectedRowKeys, {param: this.props.form.getFieldsValue()});
        }
    }

    disabledStartDate(startValue) {
        let updateEndDate = this.props.form.getFieldValue('updateEndDate') ;
        if (!startValue || !updateEndDate) {
            return false;
        }
        return startValue.getTime() >= updateEndDate;
    }

    disabledEndDate(endValue) {
        let updateStartDate = this.props.form.getFieldValue('updateStartDate') ;
        if (!endValue || !updateStartDate) {
            return false;
        }
        return endValue.getTime() <= updateStartDate;
    }

    onChange(field, value) {
        //console.log(field, 'change', value);
        this.setState({
            [field]: value,
        });
        if(value && value!=null && value!='')
            value = dateFormat(value, 'yyyy-mm-dd');
        if (field == "updateStartDate")
            this.props.form.setFieldsValue({updateStartDate: value});
        if (field == "updateEndDate")
            this.props.form.setFieldsValue({updateEndDate: value});
    }

    /**
     * 进入编辑模式
     */
    editRecord(record) {
        let {productId,wholesalePrice,minSale,wmCount,showIndex,adMsg} = record;
        let postData = {
            productId: productId,
            wholesalePrice: wholesalePrice,
            minSale: minSale,
            wmCount: wmCount,
            showIndex: showIndex,
            adMsg: adMsg
        }
        this.props.productSaleAction.setEditRecord(postData);
    }

    /**
     * 保存编辑模式下的记录
     */
    saveRecord() {
        let record = this.props.editRecord;
        //console.info('==================record======================')
        //console.info(record);
        let {wholesalePrice,minSale,wmCount,showIndex,adMsg} = record;
        if (!wholesalePrice || !minSale || !wmCount || !showIndex ||
            wholesalePrice == '' || minSale == '' || wmCount == '' || showIndex == '' ) {
            Modal.error({
                title: '提示',
                content: '输入不能为空!'
            });
            return;

        }
        let reg = /^[1-9][0-9]*$|^(?:[1-9][0-9]*\.[0-9]+|0\.(?!0+$)[0-9]+)$/;
        if (!reg.test(wholesalePrice)) {
            Modal.error({
                title: '提示',
                content: '统一价格不正确!'
            });
            return;
        }
        let regInt = /^[1-9][0-9]*$/;
        if (!regInt.test(minSale)) {
            Modal.error({
                title: '提示',
                content: '起批量必须大于0'
            });
            return;
        }

        if (!(regInt.test(wmCount) || wmCount == -1)) {
            Modal.error({
                title: '提示',
                content: '库存不正确'
            });
            return;
        }

        if (!(regInt.test(showIndex) || showIndex == 0)) {
            Modal.error({
                title: '提示',
                content: '排序不正确'
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

        this.props.productSaleAction.saveRecord(record,params);
    }

    /**
     * 编辑统一价格
     */
    handleWholesalePriceChange(e) {
        this.props.productSaleAction.setEditingRecord({wholesalePrice: e.target.value})
    }

    /**
     * 编辑起售量
     */
    handleMinSaleChange(e) {
        this.props.productSaleAction.setEditingRecord({minSale: e.target.value})
    }

    /**
     * 编辑库存
     */
    handleWmCountChange(e) {
        this.props.productSaleAction.setEditingRecord({wmCount: e.target.value})
    }

    /**
     * 编辑排序
     */
    handleShowIndexChange(e) {
        this.props.productSaleAction.setEditingRecord({showIndex: e.target.value})
    }

    /**
     * 编辑广告语
     */
    handleAdMsgChange(e) {
        this.props.productSaleAction.setEditingRecord({adMsg: e.target.value})
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
        this.props.productSaleAction.listPg({param: this.props.form.getFieldsValue()});
        //加载城市树
        this.props.commonTypeAction.getAreaList();
        domUtil.controlForm();

    };

    // 完成渲染新的props或者state后调用，此时可以访问到新的DOM元素。
    componentDidUpdate(){
        domUtil.controlTable();

    }

    /**
     * 渲染组件
     * @returns {XML}
     */
    render() {

        //获取prop中需要的属性
        const { selectedRowKeys,modalVisiable,pgList,areaList,productId,editRecord,areaPriceDetailList} = this.props;


//定义表头
        const columns = [{
            title: '序号',
            render: (text, record, index) => <span>{index + 1}</span>,
        }, {
            title: '商品编码',
            dataIndex: 'productCode',
            render: (text, record, index) => {
                let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                return <span className={flag? 'font_gray':''} >
                    {record.productCode}
                </span>
            },
            width: '10%'
        }, {
            title: '供应商',
            dataIndex: 'supplyName',
            render: (text, record, index) => {
                let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                let supplyStatus = '';
                if(record.infoCode !=2 ){
                    supplyStatus = <span className="font_red">{record.supplyServiceValue}</span>;
                }
                return <span>
                        <span className={flag? 'font_gray':''} >
                            {record.supplyName}
                        </span>
                        {supplyStatus}
                    </span>
            },
            width: '20%'
        }, {
            title: '所属分类',
            dataIndex: 'catalogName',
            render: (text, record, index) => {
                let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                return <span className={flag? 'font_gray':''} >
                    {record.catalogName}
                </span>
            },
        }, {
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
                let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                return <span className={flag? 'font_gray':''} >
                    {record.productName}
                </span>
            },
        }, {
            title: '规格',
            dataIndex: 'spec',
            render: (text, record, index) => {
                let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                return <span className={flag? 'font_gray':''} >
                    {record.spec}
                </span>
            },
        }, {
            title: '生产厂家',
            dataIndex: 'factoryName',
            render: (text, record, index) => {
                let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                return <span className={flag? 'font_gray':''} >
                    {record.factoryName}
                </span>
            },
        }, {
            title: '品牌名称',
            dataIndex: 'brandName',
            render: (text, record, index) => {
                let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                return <span className={flag? 'font_gray':''} >
                    {record.brandName}
                </span>
            },
        }, {
            title: '统一价格(元)',
            dataIndex: 'wholesalePrice',
            render: (text, record, index) => {
                let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                let isShow = record.productId == editRecord.productId && record.productStatus!='8' ? true : false;
                return <span>
                    <Input type={isShow ? "text":"hidden"}
                           onChange={this.handleWholesalePriceChange}
                           defaultValue={record.wholesalePrice}
                           value={editRecord.wholesalePrice}
                    />
                    {isShow ? '' : <label className={flag? 'font_gray':''}>{record.wholesalePrice}</label>}
                </span>
            },
        }, {
            title: '销售区域及价格',
            dataIndex: 'areaPrice',
            render: (text, record, index) => {
                return <span>
                    {record.pricePolicy && record.pricePolicy == 2 ?
                        <span style={{background:'red'}}>价</span> : ''
                    }
                    <a href="javascript:void(0);" onClick={this.showModal.bind(this,'detail',0,record.productId)}>
                          查看 </a>
                    <a href="javascript:void(0);" onClick={this.showModal.bind(this,'edit',1,record.productId)}> 编辑 </a>
        </span>
            },
        }, {
            title: '起批量',
            dataIndex: 'minSale',
            render: (text, record, index) => {
                let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                let isShow = record.productId == editRecord.productId && record.productStatus!='8' ? true : false;
                return <span>
                    <Input type={isShow ? "text":"hidden"}
                           onChange={this.handleMinSaleChange}
                           defaultValue={record.minSale}
                           value={editRecord.minSale}
                    />
                    {isShow ? '' : <label className={flag? 'font_gray':''}>{record.minSale}</label>}
                </span>
            },
        }, {
            title: '库存(-1表示无限制)',
            dataIndex: 'wmCount',
            render: (text, record, index) => {
                let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                let isShow = record.productId == editRecord.productId && record.productStatus!='8' ? true : false;
                return <span>
                    <Input type={isShow ? "text":"hidden"}
                           onChange={this.handleWmCountChange}
                           defaultValue={record.wmCount}
                           value={editRecord.wmCount}
                    />
                    {isShow ? '' : <label className={flag? 'font_gray':''}>{record.wmCount}</label>}
                </span>
            },
        }, {
            title: '排序',
            dataIndex: 'showIndex',
            render: (text, record, index) => {
                let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                let isShow = record.productId == editRecord.productId ? true : false;
                return <span>
                    <Input type={isShow ? "text":"hidden"}
                           onChange={this.handleShowIndexChange}
                           defaultValue={record.showIndex}
                           value={editRecord.showIndex}
                    />
                    {isShow ? '' : <label className={flag? 'font_gray':''}>{record.showIndex}</label>}
                </span>
            },
        }, {
            title: '广告语',
            dataIndex: 'adMsg',
            render: (text, record, index) => {
                let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                let isShow = record.productId == editRecord.productId && record.productStatus!='8' ? true : false;
                let adMsg = record.adMsg || '';
                if(adMsg.length > 15)
                    adMsg = adMsg.substring(0,15)+'...'
                return <span>
                    <Input type={isShow ? "text":"hidden"}
                           onChange={this.handleAdMsgChange}
                           defaultValue={record.adMsg}
                           maxLength="100"
                           value={editRecord.adMsg}
                    />
                    {isShow ? '' : <label className={flag? 'font_gray':''} title={record.adMsg || ''}>{adMsg}</label>}
                </span>
            },
        }, {
            title: '商品状态',
            dataIndex: 'productStatusName',
            render: (text, record, index) => {
                let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                return <span className={flag? 'font_gray':''} >
                    {record.productStatusName}
                </span>
            },
        }, {
            title: '更新人',
            dataIndex: 'updateStaff',
            render: (text, record, index) => {
                let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                return <span className={flag? 'font_gray':''} >
                    {record.updateStaff}
                </span>
            },
        }, {
            title: '更新时间',
            dataIndex: 'updateDate',
            render: (text, record, index) => {
                let flag = (record.infoCode != 2 || record.pricePolicy == 0)?true:false;
                return <span className={flag? 'font_gray':''} >
                    {record.updateDate}
                </span>
            },
        }, {
            title: '操作',
            render: (text, record, index) => {
                let content = '';
                if (!editRecord.productId || record.productId != editRecord.productId) {
                    content = <Button
                        type="primary"
                        size="large"
                        onClick={this.editRecord.bind(this,record)}
                    >
                        <Icon type="edit"/>修改
                    </Button>
                } else {
                    content = <Button
                        type="primary"
                        size="large"
                        onClick={this.saveRecord}
                    >
                        <Icon type="save"/>保存
                    </Button>
                }
                return <span>
                        {content}
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
            onChange: this.onSelectChange
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

        /*const dataSource = [];
         pgList.resultList.map((record, index) => {
         dataSource.push({
         key: record.resId,
         resCode: record.resCode
         })
         })*/

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

        return (
            <div>
                <Row type="flex">
                    <Col span="24">
                        <Button
                            type="primary"
                            size="large"
                            className="topBtn"
                            onClick={this.showModal.bind(this,'batchUpload',2,'')}
                        >
                            <Icon type="folder-open"/>批量上传
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            className="topBtn"
                            disabled={!hasSelected}
                            onClick={this.handleUp}
                        >
                            <Icon type="upload"/>上架
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            className="topBtn"
                            disabled={!hasSelected}
                            onClick={this.handleDown}
                        >
                            <Icon type="download"/>下架
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            className="topBtn"
                            disabled={!hasSelected}
                            onClick={this.handleStopUse}
                        >
                            <Icon type="cross"/>停用
                        </Button>
                    </Col>
                </Row>
                <Form horizontal className="advanced-search-form J_form" form={this.props.form}>
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
                                label="SPU编码："
                            >
                                <Input {...getFieldProps('spuCode')} />
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
                                label="品牌名称："
                            >
                                <Input {...getFieldProps('brandName')} />
                            </FormItem>
                        </Col>
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
                                label="供应商："
                            >
                                <SearchInput
                                    name="supplyName"
                                    form={this.props.form}
                                />
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem
                                {...formItemLayout}
                                label="编码是否关联："
                            >
                                <Select
                                    {...getFieldProps('isSpuRelative', {initialValue: '-1'})}
                                    size="large"
                                    placeholder="编码是否关联"
                                    defaultValue="-1">
                                    <Option value="-1">全部</Option>
                                    <Option value="1">是</Option>
                                    <Option value="0">否</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem
                                {...formItemLayout}
                                label="商品价格是否维护："
                            >
                                <Select
                                    {...getFieldProps('isSpuPriceMaintenance', {initialValue: '-1'})}
                                    size="large"
                                    placeholder="商品价格是否维护"
                                    defaultValue="-1">
                                    <Option value="-1">全部</Option>
                                    <Option value="0">否</Option>
                                    <Option value="1">是</Option>
                                </Select>
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
                            <FormItem
                                {...formItemLayout}
                                label="更新人："
                            >
                                <Input {...getFieldProps('updateStaff')} />
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem
                                labelCol={ {span: 8}}
                                wrapperCol={ {span: 16}}
                                label="更新时间："
                            >
                                <Col span="11">
                                    <DatePicker
                                        {...getFieldProps('updateStartDate')}
                                        disabledDate={this.disabledStartDate}
                                        value={this.props.form.getFieldValue('updateStartDate')}
                                        placeholder="开始日期"
                                        onChange={this.onChange.bind(this,'updateStartDate')}
                                    />
                                </Col>
                                <Col span="2">
                                    <p className="ant-form-split">-</p>
                                </Col>
                                <Col span="11">
                                    <DatePicker
                                        {...getFieldProps('updateEndDate')}
                                        disabledDate={this.disabledEndDate}
                                        value={this.props.form.getFieldValue('updateEndDate')}
                                        placeholder="结束日期"
                                        onChange={this.onChange.bind(this,'updateEndDate')}
                                    />
                                </Col>
                            </FormItem>
                        </Col>
                        <Col span="10">

                        </Col>
                    </Row>

                    <div className="btn-wrap">
                        <Col span="24" style={{ textAlign: 'right' }}>
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
                            <a href="javascript:;" className="J_btn">点击展开</a>
                        </Col>
                    </div>
                </Form>


                <Row className="form-wrap">
                    <Col span="24">
                        <Table className="productSaleTable"
                            rowKey={record  => record.productId}
                            columns={columns}
                            rowSelection={rowSelection}
                            onChange={this.handleTableChange}
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

                <Modal
                    title="批量上传"
                    visible={modalVisiable[2]}
                    onCancel={this.handleCancel.bind(this,2)}
                    footer={false}
                >
                    <BatchUpload
                        areaList={areaList}
                        onCancel={this.handleCancel.bind(this,2)}
                    />
                </Modal>

                <Modal
                    title="提示"
                    visible={modalVisiable[3]}
                    onCancel={this.handleCancel.bind(this,3)}
                    footer={false}
                >
                    <div style={{textAlign:'center'}}>
                        <p>
                            <br/>
                            <br/>
                            <br/>
                            文件上传成功！任务正在进行中，详情请进入商品上传列表中查看。
                        </p>
                        <p>
                            <br/>
                            <Link to="adminIndex/uploadList">点击跳转到商品上传列表</Link>
                            <br/>
                            <br/>
                            <br/>
                        </p>
                    </div>
                </Modal>

            </div>
        );
    }
}

/**
 * 把action操作映射到this.props中
 * @param dispatch
 * @returns {{productSaleAction: *, commonAction: *}}
 */
function dispatchToProps(dispatch) {
    return {
        productSaleAction: bindActionCreators(ProductSaleAction, dispatch),
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
        singleResult: state.systemResourceReducer.singleResult,
        pgList: state.productSaleReducer.pgList,
        initForm: state.systemResourceReducer.initForm,
        areaList: state.commonType.areaList,
        areaPriceDetailList: state.productSaleReducer.areaPriceDetailList,
        productId: state.productSaleReducer.productId,
        editRecord: state.productSaleReducer.editRecord,
    };
}
/**
 * 获取全局路由
 * @type {{router: *}}
 */
ProductSaleManage.contextTypes = {
    router: React.PropTypes.object
};

//经过 Form.create 包装的组件将会自带 this.props.form 属性
ProductSaleManage = Form.create()(ProductSaleManage)
/**
 * 把action和store注入到this.props
 */
export default connect(stateToProps, dispatchToProps)(ProductSaleManage);

