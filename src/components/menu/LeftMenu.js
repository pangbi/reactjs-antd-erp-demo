/**
 * Created by zhangqiang on 2016/2/22.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Menu, Icon ,MenuItemGroup} from 'antd';
import * as menuUtil from '../../utils/menuUtil'
const SubMenu = Menu.SubMenu;

export default class LeftMenu extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        //this.state={oldHash:null,selectKeys:[]};
    }

    generateMenuItem(item) {
        return item.map((itm) => {
            if (itm.children != null) {
                const itx = this.generateMenuItem(itm.children);
                return (
                    <SubMenu title={<span><Icon type={itm.icon} url={itm.url} /><span>{itm.text}</span></span>} key={itm.id} >
                        { itx }
                    </SubMenu>
                );
            }
            else {
                return (
                    <Menu.Item key={itm.id} url={itm.url}>
                        <span><Icon type={itm.icon} /><span>{ itm.text }</span></span>
                    </Menu.Item>
                );
            }

        })
    }



    getMenuItems(data,mode) {
        const menuItems = data;
        let showTile  = mode  === 'inline' ;
        const subMenu = menuItems.map((category) => {
            if (category.children != null) {
                const subMenuItems = this.generateMenuItem(category.children);
                return (
                    <SubMenu title={<span><Icon type={category.icon||'bars'} url={category.url} /><span>{showTile?category.text:''}</span></span>}
                             key={category.id}>
                        { subMenuItems }
                    </SubMenu>
                );
            } else {
                return (
                    <Menu.Item key={category.id} url={category.url} className="single">
                        <span><Icon type={category.icon||'bars'} /><span>{showTile ? category.text : ''}</span></span>
                    </Menu.Item>
                );
            }

        });

        return [...subMenu];
    }

    handleClick(e) {
        this.props.handleMenuClick(e.item.props.url);
    }

    render() {
        let {leftMenu,location,mode} = this.props;
        let {pathname,key} = location;

        let menu = this.getMenuItems(leftMenu,mode);

       /* //判断当前页面路径的hashkey 和历史hashkey是否一样，如果不一样替换state中的oldHash，并且遍历leftmenu 判断选中的菜单是哪个
        if(!(key===this.state.oldHash)&&leftMenu&&leftMenu.length>0){

            let selectKeys = [];
            const loop =  data => data.map(item=>{
                if(item.children){
                    loop(item.children);
                }
                if(item.url && (item.url==('/'+pathname)||(item.url+'/')==('/'+pathname))){
                        selectKeys.push(item.id+'');
                }
            })

            loop(leftMenu);
            this.setState({oldHash:key,selectKeys:selectKeys});
        }*/
        //todo 效率低  每次state变化都触发
        let selectKeys = [];
        if(leftMenu&&leftMenu.length>0){
            const loop =  data => data.map(item=>{
                if(item.children){
                    loop(item.children);
                }
                if(item.url && (item.url==('/'+pathname)||(item.url+'/')==('/'+pathname))){
                    selectKeys.push(item.id+'');
                }
            })

            loop(leftMenu);
        }

        return (
            <aside className="ant-layout-sider">
                <Menu
                    mode={mode}
                    theme="light"
                    onClick={this.handleClick}
                    selectedKeys={selectKeys}
                >
                    {menu}
                </Menu>
            </aside>
        )
    }
}

//约束子组件接受的prop类型
const propTypes = {
    leftMenu: React.PropTypes.array.isRequired,//展示左侧树的数据
    location: React.PropTypes.object.isRequired,//当前路径
    handleMenuClick: React.PropTypes.func.isRequired,//点击节点调用方法
    mode:React.PropTypes.string.isRequired//menu显示模式
};
LeftMenu.propTypes = propTypes;
