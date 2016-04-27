/**
 * Created by zhangqiang on 2016/2/22.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Button , Row , Col ,Icon ,Form, Input ,DatePicker ,Select ,Modal } from 'antd';
import {Link} from 'react-router'
import { connect } from 'react-redux';
import dateFormat from 'dateformat';
import * as ProductAction from '../../actions/ProductAction';
import * as CommonAction from '../../actions/CommonAction';
import * as InputSearchAction from '../../actions/InputSearchAction'
import * as Constants from '../../constants/constants'
import { bindActionCreators } from 'redux';
import {SearchInput} from '../../components'
import {ProductCatalog} from '../../components'
import {AreaCodes} from '../../components'
import {CommonUpload} from  '../../components'
import DomUtil from '../../utils/domUtil'

import './index.less'

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const columns = [
    {
        title:'序号',
        dataIndex:'index',
        width: 100
    },
    {
    title: '商品编码',
    dataIndex: 'productCode',
    width: 100,
}, {
    title: '供应商',
    dataIndex: 'supplyName',
    width: 100
},
    {
        title: '所属分类',
        dataIndex: 'catalogName',
        width: 100
    },
    {
        title: 'SPU编码',
        dataIndex: 'spuCode',
        width: 100
    },
    {
        title: 'SPU名称',
        dataIndex: 'productName',
        width: 100
    }, {
        title: '规格',
        dataIndex: 'spec',
        width: 100
    }, {
        title: '生产厂家',
        dataIndex: 'factoryName',
        width: 100
    }, {
        title: '品牌名称',
        dataIndex: 'brandName',
        width: 100
    }, {
        title: '商品编码是否关联',
        dataIndex: 'isSpuRelative',
        width: 100
    }, {
        title: '商品状态',
        dataIndex: 'productStatusName',
        width: 100
    }, {
        title: '更新人',
        dataIndex: 'updateStaff',
        width: 100
    }, {
        title: '更新时间',
        dataIndex: 'updateDate',
        width: 100
    },
];


export default class ProductManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startValue: null,
            endValue: null,
            visible: false,
        }
        this.onSelectChange = this.onSelectChange.bind(this)
        this.disabledStartDate = this.disabledStartDate.bind(this);
        this.disabledEndDate = this.disabledEndDate.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleTableSizeChange = this.handleTableSizeChange.bind(this);
        this.openEditMode = this.openEditMode.bind(this);
        this.exportData = this.exportData.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.uploadCallBack = this.uploadCallBack.bind(this);
        this.saveUpload = this.saveUpload.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
    }

    handleReset() {
        this.props.form.resetFields();
        this.props.inputSearchAction.initSupply();
        this.props.inputSearchAction.hide();
        this.setState({startValue: null,endValue: null})
    }

    exportData() {
        let selectKeys = this.props.selectedRowKeys;
//        console.info(selectKeys);
        let url = Constants.URL_ + '/export/exportProduct'
        if (selectKeys && selectKeys.length > 0) {
            //this.props.productAction.exportData(1,selectKeys);
            let formValues = this.props.form.getFieldsValue();
            //todo 后台接口未实现
            //DomUtil.downloadProduct(1, selectKeys, url, 'get');
            DomUtil.downloadProduct(2, formValues, url, 'get');
        } else {
            let formValues = this.props.form.getFieldsValue();
            //this.props.productAction.exportData(2,formValues);
            DomUtil.downloadProduct(2, formValues, url, 'get');

        }

    }

    uploadCallBack(filePath) {
//        console.info("文件路径在" + filePath);
        this.props.form.setFieldsValue({uploadFileUrl: filePath});
    }

    saveUpload() {
        let filePath = this.props.form.getFieldValue('uploadFileUrl');
//        console.info(filePath);
        if(!(filePath && filePath.path && filePath.name)){
            Modal.error({
                title: `警告`,
                content: '请先上传文件'
            });
            return;
        }
        if(!(filePath.name.indexOf('.xls') > 0 || filePath.name.indexOf('.xlsx') > 0)){
            Modal.error({
                title: `警告`,
                content: '请先上传EXCEL类型文件'
            });
            return;
        }
        this.props.productAction.saveUploadCode(filePath.path,filePath.name, 1, 0,{param: this.props.form.getFieldsValue()});
    }


    showModal(type, field) {
        switch (type) {
            case 'upload':
            {
                //console.info('---------11111上传-上传-上传-上传-上传-上传-上传-上传-上传-上传--')
                //清空上传文件
                this.props.form.setFieldsValue({uploadFileUrl: {}});
                this.props.commonAction.initUploadFile();
                break;
            }
            case 'uploadSuccess':
            {
                //console.info('---------上传成功-----');
                break;
            }

        }
        this.props.commonAction.showModal(field);

    }

    handleCancel(type, field) {

        this.props.commonAction.hideModal(field);

    }


    onSelectChange(selectedRowKeys) {
//        console.log('selectedRowKeys changed: ', selectedRowKeys);
        //this.setState({selectedRowKeys});
        this.props.commonAction.setSelectedRowKeys([...selectedRowKeys]);
    }


    handleSearch(e) {
        e.preventDefault();
        let params = Object.assign(
            {},
            {param: this.props.form.getFieldsValue()},
            {pageNo: 1, pageSize: 15}
        );
//        console.info(params);
        this.props.form.validateFields((errors, param) => {
            if (!errors) {
                return;
            }
        });
        this.props.productAction.listProduct(params);
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
        this.props.productAction.listProduct(params);
    }


    openEditMode() {
        let openEdit = this.props.codeEdit;
        this.props.productAction.initProductCodeList(this.props.productList.resultList,this.props.productCodeList);

        if (!openEdit[40]) {
            this.props.productAction.openEdtiMode();
        } else {
            this.props.productAction.closeEdtiMode();
        }
    }

    componentDidMount() {
        this.props.commonAction.initModal();
        this.props.commonAction.initSelectedKeys();
        this.props.productAction.listProduct({});
        //初始化supplyDiv
        this.props.inputSearchAction.hide();
        this.props.inputSearchAction.initSupply();
        this.props.productAction.closeEdtiMode();
        DomUtil.controlForm();

    };

    // 完成渲染新的props或者state后调用，此时可以访问到新的DOM元素。
    componentDidUpdate(){
        DomUtil.controlTable();
    }

    intpuBlur(index, productId, supplyId, e) {
        /*console.info(e.target.value);
         let value = this.state.value
         value[index]=e.target.value;
         this.setState(Object.assign({},this.state,{value:value}));*/
        let product = {productId: productId, productCode: e.target.value, supplyId: supplyId};
        let params = Object.assign(
            {},
            {param: this.props.form.getFieldsValue()},
            {pageNo: this.props.pageNo, pageSize: this.props.pageSize}
        );
        this.props.productAction.saveProductCode(product, index, params);
    }

    changeInputProductCode(index,e){
        this.props.productAction.changeProductResult(e.target.value,index)
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
        if(value && value!=null && value!='')
            value = dateFormat(value, 'yyyy-mm-dd');
        if (field == "startValue")
            this.props.form.setFieldsValue({updateStartDate: value});
        if (field == "endValue")
            this.props.form.setFieldsValue({updateEndDate: value});
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
        this.props.productAction.listProduct(params);
    }


    render() {
        const formItemLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14},
        };

        const { selectedRowKeys,modalVisiable,initProductForm,productList,codeEdit,productCodeList,isEdit} = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;

        const { getFieldProps } = this.props.form;

        //定义分页属性
        const pagination = {
            total: productList.total,
            current: productList.pageNo,
            showSizeChanger: true,
            onShowSizeChange: this.handleTableSizeChange,
            showQuickJumper: true,
            defaultPageSize: productList.pageSize,
            pageSize: productList.pageSize,
            pageSizeOptions: ['15', '20', '30', '40'],
            showTotal: total=> {
                return `共${total}条记录`
            }
        };
function aa (){}
aa();
this.add = {};

        const tables = [];
        if (productList.resultList && productList.resultList.length > 0) {
            productList.resultList.map((data, index)=> {
                tables.push({
                    key: data.productId,
                    index:index+1,
                    productCode: <div>
                        <Input type={codeEdit[index]? 'text':'hidden'} defaultValue={data.productCode}
                               onBlur={this.intpuBlur.bind(this,index,data.productId,data.supplyId)} onChange={this.changeInputProductCode.bind(this,index)}
                               value={(productCodeList[index])?productCodeList[index]:''}
                        />
                        <label className={codeEdit[index]? 'hid_common':'show_common'}>{data.productCode}</label>
                    </div>,
                    supplyName: data.supplyName,
                    catalogName: data.catalogName,
                    spuCode: data.spuCode,
                    productName: data.productName,
                    spec: data.spec,
                    factoryName: data.factoryName,
                    brandName: data.brandName,
                    isSpuRelative: data.isSpuRelative,
                    productStatusName: data.productStatusName,
                    updateStaff: data.updateStaff,
                    updateDate: data.updateDate,
                })
//                console.log(tables)
            })
        }
        /*<Foo province="prov" city = 'city' country="country" setField={this.props.form}/>*/
        let realationData = [{infoName: '否', infoCode: '0'}, {infoName: '是', infoCode: '1'}]
        const isRelationOption = realationData.map(function (data) {
            return (
                <Option key={data.infoCode} value={data.infoCode}>{data.infoName}</Option>
            )
        })

        let productStatusData = [ {infoName: '销售中', infoCode: '8'}, {
            infoName: '下架',
            infoCode: '5'
        }]
        const productStatusOption = productStatusData.map(function (data) {
            return (
                <Option key={data.infoCode} value={data.infoCode}>{data.infoName}</Option>
            )
        })

        return (
            <div>
                <Row type="flex">
                    <Col span="24">
                        <Button
                            type="primary"
                            size="large"
                            className="topBtn"
                            onClick={this.exportData.bind(this)}
                        >
                            <Icon type="primary"/>导出
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            className="topBtn"
                            onClick={this.openEditMode}
                        >
                            <Icon type="primary"/>{isEdit?'查看模式':'编辑模式'}
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            className="topBtn"
                            onClick={this.showModal.bind(this,'upload',0)}
                        >
                            <Icon type="primary"/>上传商品编码
                        </Button>
                    </Col>
                </Row>
                <Form horizontal className="advanced-search-form J_form" onSubmit={this.handleSearch} form={this.props.form}>
                    <Row type="flex">
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
                        <Col span="6">
                            <FormItem
                                {...formItemLayout}
                                label="商品状态："
                            >
                                <Select
                                    {...getFieldProps('productStatus', {initialValue: '-1', trigger: 'onSelect'})}
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                    placeholder="商品状态"
                                    notFoundContent="无法找到"
                                    searchPlaceholder="输入关键词"
                                >
                                    <Option value="-1">全部</Option>
                                    {productStatusOption}
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
                                        value={this.state.startValue}
                                        placeholder="开始日期"
                                        onChange={this.onChange.bind(this,'startValue')}
                                    />
                                </Col>
                                <Col span="2">
                                    <p className="ant-form-split">-</p>
                                </Col>
                                <Col span="11">
                                    <DatePicker
                                        {...getFieldProps('updateEndDate')}
                                        disabledDate={this.disabledEndDate}
                                        value={this.state.endValue}
                                        placeholder="结束日期"
                                        onChange={this.onChange.bind(this,'endValue')}
                                    />
                                </Col>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem
                                {...formItemLayout}
                                label="商品编码是否关联："
                            >
                                <Select
                                    {...getFieldProps('isSpuRelative', {initialValue: '-1', trigger: 'onSelect'})}
                                    size="large"
                                    showSearch
                                    placeholder="请选第二级"
                                    optionFilterProp="children"
                                    notFoundContent="无法找到"
                                    searchPlaceholder="输入关键词"
                                >
                                    <Option value="-1">全部</Option>
                                    {isRelationOption}
                                </Select>
                            </FormItem>
                        </Col>

                    </Row>
                    <div className="btn-wrap">
                                <Col span="24"  style={{ textAlign: 'right' }}>
                                    <Button type="primary" htmlType="submit" className="topBtn"><Icon type="search"/>搜索</Button>
                                    <Button type="ghost" className="topBtn" onClick={this.handleReset}>清除条件</Button>
                                    <a href="javascript:;" className="J_btn">点击展开</a>
                                </Col>
                    </div>
                </Form>


                <Row>
                    <Col span="24">
                        <Table className="productManagerTable"
                            rowSelection={rowSelection}
                            onChange={this.handleTableChange}
                            columns={columns}
                            dataSource={tables}
                            bordered
                            pagination={pagination}
                            useFixedHeader
                        />
                    </Col>
                </Row>

                <Modal
                    title="上传编码"
                    visible={modalVisiable[0]}
                    onCancel={this.handleCancel.bind(this,'upload',0)}
                    footer={false}
                >
                    <div>
                        <CommonUpload
                            multiple={false}
                            fileType={Constants.FILE_ACCEPT_EXCEL}
                            setFile={this.uploadCallBack}
                        /></div>
                    <div>
                        <a href="javascript:void(0);" onClick={e=>DomUtil.download(Constants.URL_+'/export/download','fileName=productCode')}>供应商编码导入模板下载</a>
                        <Input {...getFieldProps('uploadFileUrl')} type='hidden'/>
                    </div>
                    <div><Button type="primary" htmlType="submit" onClick={this.saveUpload}
                                 className="topBtn">上传</Button>
                    </div>
                </Modal>

                <Modal
                    title="上传编码"
                    visible={modalVisiable[1]}
                    onCancel={this.handleCancel.bind(this,'uploadSuccess',1)}
                    footer={false}
                >
                    <div><span>文件上传成功！任务正在进行中，详情请进入商品编码上传列表中查看</span></div>
                    <div class="toUploadList">
                        <Link to="adminIndex/proCodeUploadManage">点击跳转到编码上传列表</Link>
                    </div>
                </Modal>

            </div>
        );
    }
}

function dispatchToProps(dispatch) {
    return {
        productAction: bindActionCreators(ProductAction, dispatch),
        commonAction: bindActionCreators(CommonAction, dispatch),
        inputSearchAction: bindActionCreators(InputSearchAction, dispatch),
    };
}
function stateToProps(state) {
    return {
        selectedRowKeys: state.common.selectedRowKeys,
        modalVisiable: state.common.modalVisiable,
        initProductForm: state.productReducer.initProductForm,
        productList: state.productReducer.productList,
        codeEdit: state.productReducer.codeEdit,
        productCodeList:state.productReducer.initProductCodeList,
        isEdit:state.productReducer.isEdit,
    };
}
ProductManager.contextTypes = {
    router: React.PropTypes.object
};
ProductManager = Form.create()(ProductManager)
export default connect(stateToProps, dispatchToProps)(ProductManager);