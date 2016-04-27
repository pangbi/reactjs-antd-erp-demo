/**
 * Created by zhourongjing on 2016/3/29.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Select } from 'antd';
const Option = Select.Option;



export default class MissonCondition extends React.Component{
    constructor(props){
        super(props);
    }
    handleChange(value) {
        //console.log(`selected ${value}`);
    }
    render() {
        return (
            <div>
                <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.handleChange}>
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="disabled" disabled>Disabled</Option>
                    <Option value="yiminghe">yiminghe</Option>
                </Select>
            </div>
        )
    }
}