/**
 * Created by zhangqiang on 2016/3/29.
 */
import React from 'react'
import CommonUpload from '../common/upload/CommonUpload'
import { Tree ,Row,Col,Button ,Modal} from 'antd';
import * as Constants from '../../constants/constants'
import { connect } from 'react-redux';
import * as ProductSaleAction from '../../actions/ProductSaleAction';
import { bindActionCreators } from 'redux';
import domUtil from '../../utils/domUtil'
import './index.less'
const TreeNode = Tree.TreeNode;
export default class BatchUpload extends React.Component {
    constructor() {
        super();
        this.setFile = this.setFile.bind(this);
        this.onCheck = this.onCheck.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }


    /**
     * 上传文件成功后回调
     * @param file {name,path}
     */
    setFile(file) {
        //console.info('===getFile===')
        //console.info(file);

        this.props.productSaleAction.setBatchUploadFilePath(file);
    }

    /**
     * 点击checkBox时触发
     */
    onCheck(checkedKeys, e) {
        //console.info(checkedKeys);
        //console.info(e.node.props.eventKey);
        //let keys = this.state.checkedKeys;
        //keys.push(e.node.props.eventKey);
        //this.setState({checkedKeys:keys})
       // console.info(e.node.props.record)
        let {infoCode,province,cityCode,areaCode} = e.node.props.record;
        let _provinceCode = province ? province:'';
        let _cityCode = cityCode ? cityCode:'';
        let _areaCode = areaCode ? areaCode:'';
        this.props.productSaleAction.setBatchUploadAreas({
            areaCode:infoCode,
            provinceCode:_provinceCode,
            cityCode:_cityCode,
            area:_areaCode
        });
    }

    handleSave() {
        const { areas , file  } = this.props.batchUpload;
        if (!areas || areas.length == 0) {
            Modal.error({
                title: `警告`,
                content: '请选择区域'
            });
            return;
        }
        if (!file || !file.path || file.path == '') {
            Modal.error({
                title: `警告`,
                content: '请先上传文件'
            });
            return;
        }

        if(!(file.name.indexOf('.xls') > 0 || file.name.indexOf('.xlsx') > 0)){
            Modal.error({
                title: `警告`,
                content: '请先上传EXCEL类型文件'
            });
            return;
        }

        let productPolicyList = [];
        areas.map((item)=>{
            productPolicyList.push({
                province:item.provinceCode,
                cityCode:item.cityCode,
                areaCode:item.area
            })
        })

        //save
        this.props.productSaleAction.saveBatchUpload({path:file.path,fileName:file.name,productPolicyList:productPolicyList})
    }

    render() {

        const { areaList , batchUpload } = this.props;

        let checkedKeys = [];
        if(this.props.batchUpload.areas && this.props.batchUpload.areas.length > 0){
            this.props.batchUpload.areas.map(item => {
                checkedKeys.push(item.areaCode);
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
            <div >
                <Row type="flex">
                    <Col span="20" offset="4">
                        第1步:选择区域
                    </Col>
                    <Col span="20" offset="4">
                        <div className="area">
                            <Tree
                                onCheck={this.onCheck}
                                checkable
                                checkedKeys={checkedKeys}
                            >
                                {loop(areaList)}
                            </Tree>
                        </div>
                    </Col>

                    <Col span="20" offset="4">
                        第2步:批量上传
                    </Col>

                    <Col span="20" offset="4">
                        <CommonUpload
                            multiple={false}
                            fileType={Constants.FILE_ACCEPT_EXCEL}
                            setFile={this.setFile}
                        />
                    </Col>

                    <Col span="20" offset="4">
                        <a href="javascript:void(0);" onClick={e=>domUtil.download(Constants.URL_+'/export/download','fileName=product')}>批量上传模版下载</a>
                    </Col>

                </Row>

                <Row >
                    <Col span="16" offset="8">
                        <Button type="primary" htmlType="button" onClick={this.handleSave}>确定</Button>
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
    areaList:React.PropTypes.array.isRequired,
};
BatchUpload.propTypes = propTypes;

/**
 * 把action操作映射到this.props中
 * @param dispatch
 * @returns {{productSaleAction: *, commonAction: *}}
 */
function dispatchToProps(dispatch) {
    return {
        productSaleAction: bindActionCreators(ProductSaleAction, dispatch),
    };
}

/**
 * 把store中的属性映射到this.props中
 * @param state
 * @returns {{selectedRowKeys: *, modalVisiable: *, singleResult: (singleResult|*), pgList: (pgList|*), initForm: *}}
 */
function stateToProps(state) {
    return {
        batchUpload: state.productSaleReducer.batchUpload,

    };
}

/**
 * 把action和store注入到this.props
 */
export default connect(stateToProps, dispatchToProps)(BatchUpload);