/**
 * Created by zhangqiang on 2016/3/22.
 */
import React from 'react';
import ReactDOM from 'react-dom';
export default class AdminIndex extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const HREF = 'http://' + location.host + '/adminIndex';
        let A1 = HREF + '/productInfoManage',
            A2 = HREF + '/proCodeUploadManage',
            A3 = HREF + '/productSaleManage',
            A4 = HREF + '/uploadList';
        return (
            <div>
                <ul className="adUl">
                    <li>
                        <a href={A1} target="_self">
                            <div className="left">
                                69
                            </div>
                            <div className="right">
                                <p>商品基本信息管理</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href={A2} target="_self">
                            <div className="left">
                                69
                            </div>
                            <div className="right">
                                <p>编码上传列表</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href={A3} target="_self">
                            <div className="left">
                                69
                            </div>
                            <div className="right">
                                <p>商品销售管理</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href={A4} target="_self">
                            <div className="left">
                                69
                            </div>
                            <div className="right">
                                <p>商品上传列表</p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>

        )

    }
}