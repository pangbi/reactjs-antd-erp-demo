import React from 'react'
import { Input } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as InputSearchAction from '../../../actions/InputSearchAction'
import './index.less'

 class SearchInput extends React.Component {
    constructor () {
        super();
        this.handleOnKeyUp = this.handleOnKeyUp.bind(this);
        this.handleOnFocus = this.handleOnFocus.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    /**
     * 输入查询
     * @param e
     */
    handleOnKeyUp(e){
        let value = e.target.value;
        const {name,form} = this.props;
        if(value && value.trim() != ''){
            this.props.inputSearchAction.show();
            form.setFieldsValue({[name]:value});
            this.props.inputSearchAction.listSupply({supplyName:value});
        }
        else{
            this.props.inputSearchAction.hide();
        }
    }

    /**
     * input 获得焦点
     * @param e
     */
    handleOnFocus(e){
        this.props.inputSearchAction.show();
    }

     /**
      * 失去焦点 影藏列表
      * @param e
      */
     handleBlur(e){
         setTimeout(() => {
             this.props.inputSearchAction.hide();
         },500);
     }

     /**
      * 单击某行 影藏搜索结果
      * @param data
      */
    handleRowClick(record){
        const {name,form} = this.props;
         form.setFieldsValue({[name]:record.custName});
        this.props.inputSearchAction.hide();
    }

    render () {

        const {display,supplyList,name,form} = this.props;
        let result;
        if(supplyList && supplyList.length > 0){

            let table = supplyList.map((supply,index) => {
                return <tr key={index} onClick={this.handleRowClick.bind(null,supply)}>
                    <td style={{width:'125px'}}>{supply.custName}</td>
                    <td style={{width:'125px'}}><span style={{color:supply.infoCode&&supply.infoCode==2?'':'red'}}>{supply.infoName}</span></td>
                </tr>
            })
            result = <table className="search-table" >
                <thead className="thead">
                    <tr key="-1" ><td style={{width:'125px'}}><b>供应商名称</b></td><td style={{width:'125px'}}><b>审核状态</b></td></tr>
                </thead>
                <tbody className="searchBody">
                    {table}
                </tbody>
            </table>
        }else{
            result=<h2>未匹配数据</h2>
        }

        return (
            <div >
                <Input
                    {...form.getFieldProps(name)}
                    onFocus={this.handleOnFocus}
                    onKeyUp={this.handleOnKeyUp}
                    onBlur={this.handleBlur}
                />
                <div className="search_input" style={{'display':display?'block':'none'}}>
                        {result}
                </div>
            </div>
        )
    }
}

//约束子组件接受的prop类型
const propTypes = {
    form: React.PropTypes.object.isRequired,
    name: React.PropTypes.string.isRequired,
};
SearchInput.propTypes = propTypes;


/**
 * 把action操作映射到this.props中
 * @param dispatch
 * @returns {{systemResourceAction: *, commonAction: *}}
 */
function dispatchToProps(dispatch) {
    return {
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
        display: state.inputSearchReducer.display.display,
        supplyList: state.inputSearchReducer.supplyList,
    };
}

/**
 * 把action和store注入到this.props
 */
export default connect(stateToProps, dispatchToProps)(SearchInput);
