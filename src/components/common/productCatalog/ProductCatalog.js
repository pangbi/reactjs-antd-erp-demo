import React from 'react'
import { Input } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as InputSearchAction from '../../../actions/InputSearchAction'
import * as CommonTypeAction from '../../../actions/CommonTypeAction';
import {Select,Form,Col} from 'antd';
const Option = Select.Option;
import './index.less'
class ProductCatalog extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        this.props.commonTypeAction.listCatalogFirst();
        this.handleOnChange1st = this.handleOnChange1st.bind(this);
        this.handleOnChange2nd = this.handleOnChange2nd.bind(this);

    };

    /**
     * 输入查询
     * @param e
     */
    handleOnChange1st(e) {
        const {catalogCode1,catalogCode2,catalogCode3,form} = this.props;
        if (e != '-1') {
            this.props.commonTypeAction.listCatalogSecond(e);
            this.props.commonTypeAction.resetCataLogThird();
        } else {
            this.props.commonTypeAction.resetCataLogSecond();
            this.props.commonTypeAction.resetCataLogThird();
        }
        form.setFieldsValue({ [catalogCode2]: '-1', [catalogCode3]: '-1'});

    }

    /**
     * 输入查询
     * @param e
     */
    handleOnChange2nd(e) {
        const {catalogCode1,catalogCode2,catalogCode3,form} = this.props;
        form.setFieldsValue({[catalogCode3]: '-1'});
        if (e != '-1') {
            this.props.commonTypeAction.listCatalogThird(e);
        } else {
            this.props.commonTypeAction.resetCataLogThird();
        }
    }


    render() {


        const {catalogFirst,catalogSecond,catalogThird,catalogCode1,catalogCode2,catalogCode3} = this.props;
        let catalogFirstOption = [];
        let catalogSecondOption = [];
        let catalogThirdOption = [];
        if (catalogFirst && catalogFirst.length > 0) {
            catalogFirstOption = catalogFirst.map(function (data) {
                return (
                    <Option key={data.infoCode} value={data.infoCode}>{data.infoName}</Option>
                )
            });
        }
        if (catalogSecond && catalogSecond.length > 0) {
            catalogSecondOption = catalogSecond.map(function (data) {
                return (
                    <Option key={data.infoCode} value={data.infoCode}>{data.infoName}</Option>
                )
            })
        }

        if (catalogThird && catalogThird.length > 0) {
            catalogThirdOption = catalogThird.map(function (data) {
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
                        {...getFieldProps(catalogCode1, {initialValue: '-1', trigger: 'onSelect'})}
                        size="large"
                        showSearch
                        placeholder="请选第一级"
                        optionFilterProp="children"
                        notFoundContent="无法找到"
                        searchPlaceholder="输入关键词"
                        onChange={this.handleOnChange1st}
                    >
                        <Option value="-1">全部</Option>
                        {catalogFirstOption}
                    </Select>
                </Col>
                <Col span="8">
                    <Select
                        {...getFieldProps(catalogCode2, {initialValue: '-1', trigger: 'onSelect'})}
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
                        {...getFieldProps(catalogCode3, {initialValue: '-1', trigger: 'onSelect'})}
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
    catalogCode1: React.PropTypes.string.isRequired,
    catalogCode2: React.PropTypes.string.isRequired,
    catalogCode3: React.PropTypes.string.isRequired,
};
ProductCatalog.propTypes = propTypes;


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
        catalogFirst: state.commonType.catalogFirst,
        catalogSecond: state.commonType.catalogSecond,
        catalogThird: state.commonType.catalogThird,
    };
}

/**
 * 把action和store注入到this.props
 */
export default connect(stateToProps, dispatchToProps)(ProductCatalog);
