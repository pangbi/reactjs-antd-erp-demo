/**
 * COPYRIGHT (C) 2016 Fky. ALL RIGHTS RESERVED.
 *
 * No part of this publication may be reproduced, stored in a retrieval system,
 * or transmitted, on any form or by any means, electronic, mechanical, photocopying,
 * recording, or otherwise, without the prior written permission of Fky.
 *
 * Created By: Liuzh
 * Created On: 2016-4-12 10:06:30
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
import {AddRecommend , UpdateRecommend} from '../../components'
import { connect } from 'react-redux';
import * as RecommendAction from '../../actions/RecommendAction';
import * as CommonAction from '../../actions/CommonAction'
import * as CommonTypeAction from '../../actions/CommonTypeAction'
import { bindActionCreators } from 'redux';
import DomUtil from '../../utils/domUtil'

const FormItem = Form.Item;
const confirm = Modal.confirm;

export default class RecommendManager extends React.Component {
    /**
     * 构造方法 初始化数据
     * @param props
     */
    constructor(props) {
        super(props);
        //初始化bind(this)
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.showModal = this.showModal.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    // 完成渲染新的props或者state后调用，此时可以访问到新的DOM元素。
    componentDidUpdate() {
        DomUtil.controlTable();
    }


    /**
     * 显示弹窗
     * @param type 弹窗子组件类型
     * @param field 弹窗index [0,1,2,3,4]
     */
    showModal(type, field, record) {
        let recommendNumber = this.props.location.query.recommendNumber;
        switch (type) {
            case 'add':
            {
                //this.props.recommendAction.initForm();
                this.props.recommendAction.resetRecommend();
                this.props.recommendAction.setRecomend({
                    recommendNumber: recommendNumber,
                    recommendPositionName: record.recommendPositionName,
                    recommendPositionCode: record.recommendPositionCode,
                });
                break;
            }
            case 'update':
            {
                this.props.recommendAction.resetRecommend();
                this.props.recommendAction.getByPK(record.recommendId);
                //this.props.recommendAction.getByPK(1);
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
        let recommendNumber = this.props.location.query.recommendNumber;
        this.props.recommendAction.add(form, recommendNumber);
    }

    /**
     * 更新记录
     * @param form
     */
    handleUpdate(form) {
        let recommendNumber = this.props.location.query.recommendNumber;
        this.props.recommendAction.update(form, recommendNumber);
    }

    /**
     * 删除选中记录
     * @param e
     */
    handleDelete(record) {
        let recommendNumber = this.props.location.query.recommendNumber;
        let _this = this;
        let pks = [];
        pks.push(record.recommendId);
        confirm({
            title: '您是否确认要取消推荐?',
            onOk() {
                _this.props.recommendAction.deleteByPks(pks, recommendNumber);
            }
        });
    }


    /**
     * 组件渲染完成后触发
     */
    componentDidMount() {
        //初始化弹窗状态
        this.props.commonAction.initModal();
        //初始化table选中状态
        this.props.commonAction.initSelectedKeys();

        let recommendNumber = this.props.location.query.recommendNumber;
        //加载表单数据
        this.props.recommendAction.listPg(recommendNumber);

        //加载城市树
        this.props.commonTypeAction.getProvList();
    };


    /**
     * 渲染组件
     * @returns {XML}
     */
    render() {

        //获取prop中需要的属性
        const {modalVisiable,pgList,provList} = this.props;

        //定义表头
        const columns = [{
            title: '序号',
            render: (text, record, index) => <span>{index + 1}</span>,
            width: 35
        },
            //{
            //    title: '推荐编号，关联的数据主键',
            //    dataIndex: 'recommendNumber',
            //    width: 100
            //},
            {
                title: '推荐位名称',
                dataIndex: 'recommendPositionName',
                width: 100
            },
            {
                title: '推荐顺序',
                dataIndex: 'recommendSequence',
                width: 100
            },
            {
                title: '推荐省份',
                dataIndex: 'recommendProvinceName',
                width: 100
            },
            {
                title: '操作',
                width: 100,
                render:(text, record) => {
                    let flag = (record.recommendId && record.recommendId != "") ? true : false;
                    return (
                        <span>

                            {flag ?
                                <span>
                                    <a href="javascript:void(0);" onClick={()=>this.handleDelete(record)}>取消推荐</a>
                                    &nbsp;&nbsp;|&nbsp;&nbsp;
                                    <a href="javascript:void(0);"
                                       onClick={()=>this.showModal('update',1,record)}>编辑推荐</a>
                                    &nbsp;&nbsp;
                                </span>
                                :
                                <a href="javascript:void(0);"
                                   onClick={()=>this.showModal('add',0,record)}>推荐</a>
                            }
                    </span>
                    );
                }

            },
        ];


        return (
            <div>
                <Row>
                    <Col span="24">
                        <Table
                            className="commonTable"
                            rowKey={index  => index}
                            columns={columns}
                            dataSource={pgList?pgList:[]}
                            bordered
                            useFixedHeader
                            pagination={false}
                        />
                    </Col>
                </Row>

                <Modal
                    title="推荐设置"
                    visible={modalVisiable[0]}
                    onCancel={()=>this.handleCancel(0)}
                    maskClosable={false}
                    footer={false}
                >
                    <AddRecommend onCancel={()=>this.handleCancel(0)} provList={provList}
                                  handleSave={form => this.handleSave(form)}/>
                </Modal>

                <Modal
                    title="编辑推荐"
                    visible={modalVisiable[1]}
                    onCancel={()=>this.handleCancel(1)}
                    maskClosable={false}
                    footer={false}
                >
                    <UpdateRecommend onCancel={()=>this.handleCancel(1)} provList={provList}
                                     handleSave={form => this.handleUpdate(form)}/>
                </Modal>


            </div>
        );
    }
}

/**
 * 把action操作映射到this.props中
 * @param dispatch
 * @returns {{recommendAction: *, commonAction: *}}
 */
function dispatchToProps(dispatch) {
    return {
        recommendAction: bindActionCreators(RecommendAction, dispatch),
        commonAction: bindActionCreators(CommonAction, dispatch),
        commonTypeAction: bindActionCreators(CommonTypeAction, dispatch),
    };
}

/**
 * 把store中的属性映射到this.props中
 * @param state
 * @returns {{selectedRowKeys: *, modalVisiable: *, singleResult: (singleResult|*), pgList: (pgList|*), initForm: *}}
 */
function stateToProps(state) {
    return {
        modalVisiable: state.common.modalVisiable,
        pgList: state.recommendReducer.pgList,
        provList: state.commonType.provList,
    };
}
/**
 * 获取全局路由
 * @type {{router: *}}
 */
RecommendManager.contextTypes = {
    router: React.PropTypes.object
};

//经过 Form.create 包装的组件将会自带 this.props.form 属性
RecommendManager = Form.create()(RecommendManager)

/**
 * 把action和store注入到this.props
 */
export default connect(stateToProps, dispatchToProps)(RecommendManager);
