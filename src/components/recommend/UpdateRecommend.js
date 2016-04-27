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
import { Form, Input, Button ,Row, Col, DatePicker,Tree,Modal} from 'antd';
import * as CommonTypeAction from '../../actions/CommonTypeAction'
import * as RecommendAction from '../../actions/RecommendAction'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as patternUtil from '../../utils/patternUtil'
import {CommonUpload} from '../index'
import * as Constants from '../../constants/constants'
const TreeNode = Tree.TreeNode;
class UpdateRecommend extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setPCPic = this.setPCPic.bind(this);
        this.setMobPic = this.setMobPic.bind(this);
        this.changeUrl = this.changeUrl.bind(this);
        this.changeIndex = this.changeIndex.bind(this);
        this.onCheck = this.onCheck.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    /**
     * 提交表单
     * @param e
     */
    handleSubmit(e) {
        e.preventDefault();
        let {recommendSequence,pcImg,appImg,commendImageUrl,areaList} = this.props.editRecommend;
        /*if(!recommendSequence || recommendSequence==''){
            Modal.error({
                title: '提示',
                content:'请填写推荐位显示顺序'
            });
            return;
        }*/
        if(!areaList || !areaList.length || areaList.length ==0){
            Modal.error({
                title: '提示',
                content:'请勾选推荐位显示省份'
            });
            return;
        }
        if(!pcImg || pcImg==''){
            Modal.error({
                title: '提示',
                content:'请上传PC端图片'
            });
            return;
        }
        if(!appImg || appImg==''){
            Modal.error({
                title: '提示',
                content:'请上传无线端图片'
            });
            return;
        }
        if(commendImageUrl&&commendImageUrl.trim()!=''&& !patternUtil.urlPattern.test(commendImageUrl)){
            Modal.error({
                title: '提示',
                content:'请输入合法URL'
            });
            return;
        }
        this.props.handleSave(this.props.editRecommend)
    }
    /*

     /!**
     * 重置表单值为initialValue中的值（如有）
     * @param e
     *!/
     handleReset(e) {
     e.preventDefault();
     this.props.recommendAction.resetRecommend();
     }
     */

    setPCPic(file) {
        this.props.recommendAction.setRecomend({pcImg: file.path});
    }

    setMobPic(file) {
        this.props.recommendAction.setRecomend({appImg: file.path});
    }

    changeIndex(e) {
        let regInt = /^[1-9][0-9]*$/;
        if (e.target.value=='' || regInt.test(e.target.value))
            this.props.recommendAction.setRecomend({recommendSequence: e.target.value});
    }

    changeUrl(e) {
        this.props.recommendAction.setRecomend({commendImageUrl: e.target.value});
    }

    showModal(img) {
        Modal.info({
            title: '图片预览',
            content: (
                <div>
                    <img style={{maxWidth:400}} src={Constants.URL_IMG_DOMAIN+'/'+img} alt="图片预览"/>
                </div>
            )
        });

    }

    /**
     * 点击checkBox时触发
     */
    onCheck(checkedKeys, e) {
        let {infoCode,infoName} = e.node.props.record;
        this.props.recommendAction.setAreaList({
            infoCode: infoCode,
            infoName: infoName,
        });
    }


    /**
     * 渲染组件
     * @returns {XML}
     */
    render() {


        const { provList,editRecommend} = this.props;

        let checkedKeys = [];
        if (editRecommend && editRecommend.areaList) {
            editRecommend.areaList.map(item => {
                checkedKeys.push(item.infoCode);
            })
        }

        const loop = data => data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode key={item.infoCode} title={item.infoName} record={item}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.infoCode} title={item.infoName} record={item}/>;
        });


        return (
            <div>
                <Row type="flex">
                    <Col span="5" offset="1" style={{ textAlign: 'right' }}>
                        <span style={{color:'red'}}>*</span>推荐位显示顺序:
                    </Col>
                    <Col span="16">
                        <Col span="20">
                            <Input type="text" value={editRecommend.recommendSequence} maxLength="7"
                                   onChange={(e)=>this.changeIndex(e)} />
                        </Col>
                    </Col>

                    <Col span="5" offset="1" style={{ textAlign: 'right' }}>
                        <span style={{color:'red'}}>*</span>推荐位显示省份:
                    </Col>
                    <Col span="16">
                        <Col span="20">
                            <div className="area">
                                <Tree
                                    onCheck={this.onCheck}
                                    checkable
                                    defaultExpandedKeys={['-1']}
                                    checkedKeys={checkedKeys}
                                >
                                    {loop(provList)}
                                </Tree>
                            </div>
                        </Col>
                    </Col>

                    <Col span="5" offset="1" style={{ textAlign: 'right' }}>
                        <span style={{color:'red'}}>*</span>PC端图片:
                    </Col>
                    <Col span="16">
                        <Col span="10">
                            <CommonUpload
                                multiple={false}
                                fileType={Constants.FILE_ACCEPT_JPEG+','+Constants.FILE_ACCEPT_PNG}
                                setFile={this.setPCPic}
                                isShowFile={false}
                                uploadName={'选择图片'}
                            />
                        </Col>
                        <Col span="14">
                            <Button type="primary" disabled={editRecommend.pcImg? false:true} htmlType="button"
                                    onClick={e=>this.showModal(editRecommend.pcImg)}>图片预览</Button>
                            <span style={{color:'red'}}>*注:大小不超过3M</span>
                        </Col>
                    </Col>

                    <Col span="5" offset="1" style={{ textAlign: 'right' }}>
                        <span style={{color:'red'}}>*</span>无线端图片:
                    </Col>
                    <Col span="16">
                        <Col span="10">
                            <CommonUpload
                                multiple={false}
                                fileType={Constants.FILE_ACCEPT_JPEG+','+Constants.FILE_ACCEPT_PNG}
                                setFile={this.setMobPic}
                                isShowFile={false}
                                uploadName={'选择图片'}
                                fileSize={3}
                            />
                        </Col>
                        <Col span="14">
                            <Button type="primary" disabled={editRecommend.appImg? false:true} htmlType="button"
                                    onClick={e=>this.showModal(editRecommend.appImg)}>图片预览</Button>
                            <span style={{color:'red'}}>*注:大小不超过3M</span>
                        </Col>
                    </Col>

                    <Col span="5" offset="1" style={{ textAlign: 'right' }}>
                        促销单页url:
                    </Col>
                    <Col span="16">
                        <Col span="20">
                            <Input type="text" value={editRecommend.commendImageUrl} maxLength="500" onChange={(e)=>this.changeUrl(e)}/>
                        </Col>
                    </Col>
                </Row>
                <Row >
                    <Col span="16" offset="8">
                        <Button type="primary" htmlType="button" onClick={e=>this.handleSubmit(e)}>确定</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button type="ghost" onClick={this.props.onCancel}>取消</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}

//约束子组件接受的prop类型
const propTypes = {
    onCancel: React.PropTypes.func.isRequired,
    handleSave: React.PropTypes.func.isRequired,
    provList: React.PropTypes.array.isRequired,
};
UpdateRecommend.propTypes = propTypes;

/**
 * 把action操作映射到this.props中
 * @param dispatch
 * @returns {{productSaleAction: *, commonAction: *}}
 */
function dispatchToProps(dispatch) {
    return {
        recommendAction: bindActionCreators(RecommendAction, dispatch),
    };
}

/**
 * 把store中的属性映射到this.props中
 * @param state
 * @returns {{selectedRowKeys: *, modalVisiable: *, singleResult: (singleResult|*), pgList: (pgList|*), initForm: *}}
 */
function stateToProps(state) {
    return {
        editRecommend: state.recommendReducer.editRecommend,
    };
}

/**
 * 把action和store注入到this.props
 */
export default connect(stateToProps, dispatchToProps)(UpdateRecommend);
