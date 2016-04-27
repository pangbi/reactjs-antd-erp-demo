/**
 * Created by zhangqiang on 2016/3/29.
 */
import React from 'react'
import CommonUpload from '../common/upload/CommonUpload'
import { Tree ,Row,Col,Button ,Modal,Input} from 'antd';
import * as Constants from '../../constants/constants'
import { connect } from 'react-redux';
import * as ProductSaleAction from '../../actions/ProductSaleAction';
import { bindActionCreators } from 'redux';
import * as patternUtil from '../../utils/patternUtil'
import './index.less'
const TreeNode = Tree.TreeNode;
export default class AreaPriceEdit extends React.Component {
    constructor() {
        super();
        this.onCheck = this.onCheck.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.changePrice = this.changePrice.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.state = {checkedKeys: ["0-0-0"]};
    }


    /**
     * 点击checkBox时触发
     */
    onCheck(checkedKeys, e) {
        //console.info(checkedKeys);
       // console.info(e.node.props.eventKey);
        //let keys = this.state.checkedKeys;
        //keys.push(e.node.props.eventKey);
        //this.setState({checkedKeys:keys})
        //console.info(this.state.checkedKeys)
        let {infoCode,infoName,province,provinceName,cityCode,cityName,areaName,areaCode} = e.node.props.record;
        let _provinceCode = province ? province:'';
        let _provinceName = provinceName ? provinceName:'';
        let _cityCode = cityCode ? cityCode:'';
        let _cityName = cityName ? cityName:'';
        let _areaName = areaName ? areaName:'';
        let _areaCode = areaCode ? areaCode:'';
        let showTitle = '';
        if(infoCode == '-1')
            showTitle = infoName;
        else{
            showTitle = _provinceName+' '+  _cityName + ' ' + _areaName;
        }

        this.props.productSaleAction.setAreaPriceCode({
            areaCode:infoCode,
            areaName:infoName,
            price:'',
            provinceCode:_provinceCode,
            provinceName:_provinceName,
            cityCode:_cityCode,
            cityName:_cityName,
            area:_areaCode,
            showTitle:showTitle
        });
//        console.info(e.node.props.record);
    }

    changePrice(e,item){
        let value = e.target.value;
        this.props.productSaleAction.setAreaPriceValue({areaCode:item.areaCode,price:value});
    }

    handleSave() {
        const { areaPriceList ,productId ,pagination } = this.props;
        if(!productId || productId==''){
            Modal.error({
                title: `警告`,
                content: '请选择商品'
            });
            return;
        }
        if (!areaPriceList || areaPriceList.length == 0) {
            Modal.error({
                title: `警告`,
                content: '选择区域'
            });
            return;
        }
        let flag = false;
        let reg = /^[1-9][0-9]*$|^(?:[1-9][0-9]*\.[0-9]+|0\.(?!0+$)[0-9]+)$/;
        areaPriceList.map((item)=>{
            if(item.price == '' || !reg.test(item.price)){
                flag = true;
            }
        })

        if(flag){
            Modal.error({
                title: `警告`,
                content: '价格不正确'
            });
            return;
        }
        let areaPrice = [];
        areaPriceList.map((item)=>{
            areaPrice.push({
                province:item.provinceCode,
                cityCode:item.cityCode,
                areaCode:item.area,
                policyPrice:item.price
            })
        })

        //save
        this.props.productSaleAction.saveAreaPrice({productId:productId,productPolicyList:areaPrice},pagination);
    }

    /**
     * 清空设置
     */
    handleReset(){
        this.props.productSaleAction.initAreaPriceEdit();
    }

    render() {

        const { areaList,areaPriceList } = this.props;


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

        let checkedKeys = [];

        let table = '';
        let _this = this;
        if (areaPriceList && areaPriceList.length > 0) {
            let body = areaPriceList.map(function (item) {
                checkedKeys.push(item.areaCode);
                return <tr key={item.areaCode}>
                    <td>{item.showTitle}</td>
                    <td><Input size="small" value={item.price} defaultValue={item.price} onChange={(e)=>_this.changePrice(e,item)}/></td>
                </tr>
            });

            table = <table className="price_table">
                <tbody>
                <tr>
                    <td>区域</td>
                    <td>价格(元)</td>
                </tr>
                {body}
                </tbody>
            </table>
        }


        return (
            <div >
                <Row type="flex">
                    <Col span="20" offset="4">
                        第1步:选择区域
                        <br/>
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
                        <br/>
                    </Col>

                    <Col span="20" offset="4">
                        第2步:设置价格
                        <br/>
                    </Col>

                    <Col span="20" offset="4">
                        <br/>
                        <div className="price">
                            {table}
                        </div>
                        <br/>
                    </Col>

                </Row>

                <Row >
                    <Col span="16" offset="8">
                        <Button type="primary" htmlType="button" onClick={this.handleSave}>确定</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button type="ghost" onClick={this.handleReset}>清空设置</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}
//约束子组件接受的prop类型
const propTypes = {
    onCancel: React.PropTypes.func.isRequired,
    areaList: React.PropTypes.array.isRequired,
    productId:React.PropTypes.number.isRequired,
    pagination:React.PropTypes.object.isRequired,
};
AreaPriceEdit.propTypes = propTypes;

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
        areaPriceList: state.productSaleReducer.areaPriceList,
    };
}

/**
 * 把action和store注入到this.props
 */
export default connect(stateToProps, dispatchToProps)(AreaPriceEdit);