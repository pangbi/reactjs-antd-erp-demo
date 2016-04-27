/**
 * Created by zhourongjing on 2016/3/29.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Button , Row , Col ,Icon ,Form, Input ,DatePicker ,Select ,Modal } from 'antd';
import {DetailTable} from '../../components'
import { connect } from 'react-redux';
import * as UploadListAction from '../../actions/UploadListAction';
import * as CommonAction from '../../actions/CommonAction'
import { bindActionCreators } from 'redux';
import domUtil from '../../utils/domUtil'
import * as Constants from '../../constants/constants'


const FormItem = Form.Item;
window.DOM = [];

class UploadList extends React.Component {
    constructor (props){
        super(props);// 不能少，否则报错

        this.state = {
            startValue: null,
            endValue: null,
            visible: false
        }

        this.handleSearch = this.handleSearch.bind(this);// 搜索 form提交
        this.handleReset = this.handleReset.bind(this);// 清除选项
        this.disabledStartDate = this.disabledStartDate.bind(this);// 开始日期
        this.disabledEndDate = this.disabledEndDate.bind(this);// 结束日期
        this.checkDetail = this.checkDetail.bind(this);// 查看详情
        this.exportDetail = this.exportDetail.bind(this);// 导出详情
        this.handleTableSizeChange = this.handleTableSizeChange.bind(this);// 修改分页数
        this.handleTableChange = this.handleTableChange.bind(this);// 分页切换

    }
    // 约束开始日期
    disabledStartDate(startValue) {
        if (!startValue || !this.state.endValue) {
            return false;
        }

        return startValue.getTime() >= this.state.endValue.getTime();
    }
    // 约束结束日期
    disabledEndDate(endValue) {
        if (!endValue || !this.state.startValue) {
            return false;
        }

        return endValue.getTime() <= this.state.startValue.getTime();
    }

    onChange(field, value) {
        this.setState({
            [field]: value,
        });
        if (field == "startValue")
            this.props.form.setFieldsValue({createTimeStart: value});
        if (field == "endValue")
            this.props.form.setFieldsValue({createTimeEnd: value});
    }
    // 查看详情
    checkDetail(e){
        // 点击恢复head的样式 为table始终对齐
        let doc = document;
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

        const _this = this;
        // 发送请求获取 table 的 具体数据 表头已知
        // 找到最近的父元素 tr 在他后面插入tr tr里面包含table
        let targetTd, target;
        if(e.target.tagName.toLowerCase() === 'button'){
            target = e.target;
        }else {
            target = domUtil.findClosestParent(e.target, 'button');
        }

        let tr = domUtil.findClosestParent(target, 'tr');// 找到最近的tr
        let reactId = tr.dataset.reactid.split('$')[1];

        if( domUtil.hasClass(target,'showDetail') ){
            //console.log(1)
            domUtil.removeClass(target, 'showDetail');
            // 隐藏
            domUtil.addClass(tr.nextSibling,'hide');

            //compare();
        }else {
            //console.log(2)
            domUtil.addClass(target, 'showDetail');

            if( target.getAttribute('been') ){// 控制只填充数据一次
                //console.log(3);
                // 显示
                domUtil.removeClass(tr.nextSibling,'hide');
                //domUtil.controlTable();

                /*let w = tableBody.scrollWidth;
                console.log('应该要恢复宽度：', w);
                tableHead.style.cssText = 'width:'+ w +'px;';*/
                return;
            }
            //console.log(4);
            target.setAttribute('been', 'true');// 标记已经
            // 显示 只有第一次的时候需要发送请求
            const nextTr = document.createElement('tr');// 新加元素tr
            nextTr.className = 'addTr';
            nextTr.hasReturn = false;// 标记请求有没有返回


            nextTr.innerHTML = "<td><div class='addDiv'></div></td>";
            domUtil.insertAfter(nextTr, tr); // 插入节点
            //addDiv.style.width = '1000px';
            // 获取要插入的最终节点td 并设置合适的宽度
            targetTd = nextTr.querySelector('td');
            targetTd.setAttribute('colspan', '5');
            let addDiv = nextTr.querySelector('.addDiv');

            this.props.uploadListAction.uploadDetail({param:{uploadId: reactId}}, nextTr);
            var  timer = setInterval(function(){
                if(nextTr.hasReturn){// 请求已经返回
                    ReactDOM.render(// 渲染页面
                        <DetailTable pgList={_this.props.detailList} />,
                        addDiv
                    );

                    // 内容超出要保持对齐
                   /* let w = tableBody.scrollWidth;
                    setTimeout(function(){
                        tableHead.style.cssText = 'width:'+ w +'px;padding-right:0px;';

                    },1);*/
                    clearInterval(timer);
                }
            },30);


        }

    }


    // 清除
    handleReset(e){
        e.preventDefault();
        //console.info(this.props.form);
        this.props.form.resetFields();
        this.setState({startValue: null,endValue: null})
    }

    /*
     * 搜索
     * */
    handleSearch (e){
        //组织表单默认提交
        e.preventDefault();
        //console.log('收到表单值：', this.props.form.getFieldsValue());


        domUtil.initDetail();// 重置详情

        //return;
        //验证表单
        this.props.form.validateFields((errors, values) => {
            let t   = values.createTimeStart,
                _t  = values.createTimeEnd;
            values.createTimeStart  = domUtil.turnDate(t);
            values.createTimeEnd    = domUtil.turnDate(_t);

            if (!!errors) {
                return;
            }
            this.props.uploadListAction.uploadList({param:values});
        });
    }

    /**
     * 分页、排序、筛选变化时触发，向后台重新请求数据
     * @param pagination 分页器
     * @param filters
     * @param sorter
     */
    handleTableChange(pagination, filters, sorter) {
        domUtil.initDetail();// 重置详情

        let values  = this.props.form.getFieldsValue(),
            startT  = values.createTimeStart,
            EndT    = values.createTimeEnd;
        values.createTimeStart  = domUtil.turnDate(startT);
        values.createTimeEnd    = domUtil.turnDate(EndT);
        let params = Object.assign(
            {},
            {param:values},
            {pageNo: pagination.current,pageSize: pagination.pageSize}
        );
        this.props.uploadListAction.uploadList(params);
    }


    /**
     * 分页组件 改变分页大小时触发，向后台重新请求数据
     * @param current  下一页
     * @param pageSize 分页大小
     */
    handleTableSizeChange(current, pageSize) {
        domUtil.initDetail();// 重置详情

        let params = Object.assign(
            {},
            {param:this.props.form.getFieldsValue()},
            {pageNo: current,pageSize: pageSize}
        );
        this.props.uploadListAction.uploadList(params);
    }

    exportDetail(e){
        let target;
        if(e.target.tagName.toLowerCase() === 'button'){
            target = e.target;
        }else {
            target = domUtil.findClosestParent(e.target, 'button');
        }
        let tr = domUtil.findClosestParent(target, 'tr');// 找到最近的tr
        let reactId = tr.dataset.reactid.split('$')[1];
//        console.log('reactId is :', reactId, this.props);

        //domUtil.download(Constants.URL_ +'/export/exportProductUploadDetail','uploadId='+reactId+'&token=');

        let url = Constants.URL_ +'/export/exportProductUploadDetail',
            formValues = {uploadId : reactId};
        domUtil.downloadProduct(2, formValues, url, 'get');

    }

    componentDidMount(){
        // 默认加载表单数据
//        console.log("xxxx", {param:this.props.form.getFieldsValue()});
        this.props.uploadListAction.uploadList({param:this.props.form.getFieldsValue()});
        domUtil.controlForm();
    }

    componentDidUpdate(){
        console.log('状态state刷新le ');
        domUtil.controlTable();
    }

    render(){
        const _this = this;
        const  columns = [
            {title : '序号',render: (text, record, index) => <span>{index+1}</span>,width:'10%'},
            {title : '上传者', dataIndex : 'operator', },
            {title : '上传时间', dataIndex : 'createTime', },
            {title : '任务状态', dataIndex : 'statusValue', },
            {title : '操作', dataIndex : 'operation',
                render(text, record,index){
                    if( record.statusValue === '成功' ){
                        return'';
                    }
                    if(record.statusValue === '处理中'){
                        return '';
                    }
                    return (
                        <span>
                    <Button className="ant-btn mR10" type="primary" id={record.key} onClick={_this.checkDetail}>查看详情</Button>
                    <Button type="primary" onClick={_this.exportDetail}>导出详情</Button>
                </span>);
                }
            },
        ];


        //设置搜索区域输入框大小
        const formItemLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14},
        };
        //获取prop中需要的属性
        const { pgList,singleResult,initForm} = this.props;

        //获取form的getFieldProps，用来标识from组件名称
        const { getFieldProps } = this.props.form;
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

        return (
            <div>
                <Form  className="advanced-search-form " onSubmit={this.handleSearch} form={this.props.form}>
                    <Row type="flex">
                        <Col span="4">
                            <FormItem
                                {...formItemLayout}
                                label="上传者："
                            >
                                <Input {...getFieldProps('operator')} />
                            </FormItem>
                        </Col>
                        <Col span="5">
                            <FormItem
                                {...formItemLayout}
                                label="上传时间："
                            >
                                <DatePicker
                                    {...getFieldProps('createTimeStart')}
                                    format="yyyy-MM-dd HH:mm:ss"
                                    disabledDate={this.disabledStartDate}
                                    value={this.state.startValue}
                                    placeholder="开始日期"
                                    showTime
                                    onChange={this.onChange.bind(this,'startValue')}
                                />
                            </FormItem>
                        </Col>
                        <Col span="5">
                            <FormItem
                                {...formItemLayout}
                                label="至："
                            >
                                <DatePicker
                                    {...getFieldProps('createTimeEnd')}
                                    disabledDate={this.disabledEndDate}
                                    format="yyyy-MM-dd HH:mm:ss"
                                    showTime
                                    value={this.state.endValue}
                                    placeholder="结束日期"
                                    onChange={this.onChange.bind(this,'endValue')}
                                />
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem
                                {...formItemLayout}
                                label="任务状态："
                            >
                                <Select
                                    {...getFieldProps('status', {initialValue: '-1'})}
                                    defaultValue="处理中"
                                    style={{ width: 120 }} >
                                    <Option value="-1">全部</Option>
                                    <Option value="1">失败</Option>
                                    <Option value="2">成功</Option>
                                    <Option value="3">处理中</Option>
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
                <Table className="uploadTable"
                    rowKey = {record  => record.uploadId}
                    pagination = {pagination}
                    onChange={this.handleTableChange}
                    columns={columns}
                    dataSource={pgList.resultList}
                    bordered
                    useFixedHeader
                />
            </div>
        )
    }

}
/**
 * 把store中的属性映射到this.props中
 * @param state
 * @returns {{selectedRowKeys: *, modalVisiable: *, singleResult: (singleResult|*), pgList: (pgList|*), initForm: *}}
 */
function stateToProps(state) {
    return {
        pgList : state.uploadListReducer.pgList,
        initForm : state.uploadListReducer.initForm,
        detailList : state.uploadListReducer.detailList,
        loading:state.uploadListReducer.loading,
    };
}
/**
 * 把action操作函数方法 映射到this.props中
 * @param dispatch
 * @returns {{systemResourceAction: *, commonAction: *}}
 */
function dispatchToProps(dispatch) {
    return {
        uploadListAction: bindActionCreators(UploadListAction, dispatch),
        commonAction: bindActionCreators(CommonAction, dispatch),
    };
}

//经过 Form.create 包装的组件将会自带 this.props.form 属性
UploadList = Form.create()(UploadList)

//export default UploadList;
export default connect(stateToProps, dispatchToProps)(UploadList);