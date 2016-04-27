/**
 * Created by zhangqiang on 2016/4/5.
 */
import React from 'react'
import {Row,Col} from 'antd';
import './index.less'
export default class AreaPriceDetail extends React.Component {
    constructor() {
        super();
    }

    render() {

        const { areaPriceDetailList } = this.props;

        let table = '';

        if (areaPriceDetailList && areaPriceDetailList.length > 0) {
            let body = areaPriceDetailList.map(function (item) {
                return <tr key={item.productPolicyId}>
                    <td>{item.address}</td>
                    <td>{item.policyPrice}</td>
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
                    <Col span="20" offset="2">
                        <div className="priceList">
                            {table == '' ? <h2>暂无数据</h2> : table}
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
//约束子组件接受的prop类型
const propTypes = {
    areaPriceDetailList: React.PropTypes.array.isRequired,
};
AreaPriceDetail.propTypes = propTypes;
