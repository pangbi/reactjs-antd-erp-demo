import React from 'react'
import { Input } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as InputSearchAction from '../../../actions/InputSearchAction'
import * as CommonTypeAction from '../../../actions/CommonTypeAction';
import {Select,Form,Col} from 'antd';
const FormItem = Form.Item;

const Option = Select.Option;

import './index.less'

class AreaCodes extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        this.props.commonTypeAction.listProvince();
        this.handleOnChange1st = this.handleOnChange1st.bind(this);
        this.handleOnChange2nd = this.handleOnChange2nd.bind(this);

    };

    /**
     * 输入查询
     * @param e
     */
    handleOnChange1st(e) {
        const {province,city,area,form} = this.props;
        if (e != '-1') {
            this.props.commonTypeAction.listCity(e);
            this.props.commonTypeAction.resetCounty();
        } else {
            this.props.commonTypeAction.resetCity();
            this.props.commonTypeAction.resetCounty();
        }
        form.setFieldsValue({ [city]: '-1', [area]: '-1'});

    }

    /**
     * 输入查询
     * @param e
     */
    handleOnChange2nd(e) {
        const {province,city,area,form} = this.props;
        form.setFieldsValue({[city]: e, [area]: '-1'});
        if (e != '-1') {
            this.props.commonTypeAction.listCounty(e);
        } else {
            this.props.commonTypeAction.resetCounty();
        }
    }



    render() {


        const {provinceList,cityList,countyList,province,city,area,provinceOption} = this.props;
        let catalogFirstOption = [];
        let catalogSecondOption = [];
        let catalogThirdOption = [];
        let tempCatalogFirstOption = [];
        tempCatalogFirstOption.push({infoCode:'-1',infoName:'全部'})
        if(provinceOption)
            tempCatalogFirstOption.push(provinceOption);
        if (provinceList && provinceList.length > 0) {
            tempCatalogFirstOption = [...tempCatalogFirstOption,...provinceList];
            catalogFirstOption = tempCatalogFirstOption.map(function (data) {
                return (
                    <Option key={data.infoCode} value={data.infoCode}>{data.infoName}</Option>
                )
            });
        }
        if (cityList && cityList.length > 0) {
            catalogSecondOption = cityList.map(function (data) {
                return (
                    <Option key={data.infoCode} value={data.infoCode}>{data.infoName}</Option>
                )
            })
        }

        if (countyList && countyList.length > 0) {
            catalogThirdOption = countyList.map(function (data) {
                return (
                    <Option key={data.infoCode} value={data.infoCode}>{data.infoName}</Option>
                )
            })
        }

        const { getFieldProps } = this.props.form;
        return (
            <div>
                <Col span="8">
                    <Select
                        {...getFieldProps(province, {initialValue: '-1', trigger: 'onSelect'})}
                        size="large"
                        showSearch
                        placeholder="请选第一级"
                        optionFilterProp="children"
                        notFoundContent="无法找到"
                        searchPlaceholder="输入关键词"
                        onChange={this.handleOnChange1st}
                    >
                        {catalogFirstOption}
                    </Select>
                </Col>
                <Col span="8">
                    <Select
                        {...getFieldProps(city, {initialValue: '-1', trigger: 'onSelect'})}
                        size="large"
                        showSearch
                        placeholder="请选第二级"
                        optionFilterProp="children"
                        notFoundContent="无法找到"
                        searchPlaceholder="输入关键词"
                        onChange={this.handleOnChange2nd}
                    >
                        <Option value="-1">全部</Option>
                        {catalogSecondOption}
                    </Select>
                </Col>
                <Col span="8">
                    <Select
                        {...getFieldProps(area, {initialValue: '-1', trigger: 'onSelect'})}
                        size="large"
                        showSearch
                        placeholder="请选第三级"
                        optionFilterProp="children"
                        notFoundContent="无法找到"
                        searchPlaceholder="输入关键词"
                    >
                        <Option value="-1">全部</Option>
                        {catalogThirdOption}
                    </Select>
                </Col>
            </div>

        )
    }
}

//约束子组件接受的prop类型
const propTypes = {
    form: React.PropTypes.object.isRequired,
    province: React.PropTypes.string.isRequired,
    city: React.PropTypes.string.isRequired,
    area: React.PropTypes.string.isRequired,
    provinceOption:React.PropTypes.object,
};
AreaCodes.propTypes = propTypes;


/**
 * 把action操作映射到this.props中
 * @param dispatch
 * @returns {{systemResourceAction: *, commonAction: *}}
 */
function dispatchToProps(dispatch) {
    return {
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
        provinceList: state.commonType.provinceList,
        cityList: state.commonType.cityList,
        countyList: state.commonType.countyList,
    };
}

/**
 * 把action和store注入到this.props
 */
export default connect(stateToProps, dispatchToProps)(AreaCodes);
