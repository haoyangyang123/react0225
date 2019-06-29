import React, { Component } from 'react';
import  { Icon, Menu } from "antd";
import { Link, withRouter } from 'react-router-dom';
import  PropTypes from 'prop-types';
import  menuList from '../../config/menu-config';
import  { getItem } from "../../utils/storage-tools";
import './index.less';
import  logo from '../../assets/images/logo.png';
const  { SubMenu, Item } = Menu;

class LeftNav extends  Component{
    static propTypes = {
        collapsed: PropTypes.bool.isRequired
    };
    createMenu = (menu) => {
        return <Item key={menu.key}>
            <Link to={menu.key}>
                <Icon type={menu.icon}/>
                <span>{menu.title}</span>
            </Link>
        </Item>
    };
    componentWillMount(){
        let { pathname } = this.props.location;
        let { role : { menus}, username }=getItem();
        if (username === 'admin'){
            menus = [
                '/home',
                '/products',
                '/category',
                '/product',
                '/user',
                '/role',
                '/charts',
                '/charts/line',
                '/charts/bar',
                '/charts/pie',
            ]
        }
        const pathnameReg= /^\/product\//;
        if (pathnameReg.test(pathname)){
            pathname = pathname.slice(0,8);
        }
        let  isHome = true;
        this.menus = menuList.reduce((prev,curr) =>{
            const  children = curr.children;
            if (children){
                let isShowSubMenu = false;
                const subMenu = <SubMenu
                    key={curr.key}
                    title={
                        <span>
                            <Icon type={curr.icon} />
                            <span>{curr.title}</span>
                        </span>
                    }
                >
                    {
                        children.reduce((prev, current) => {
                            const menu = menus.find((menu) => menu === current.key);
                            if (menu) {
                                if (current.key === pathname) {
                                    // 说明当前地址是一个二级菜单，需要展开一级菜单
                                    // 初始化展开的菜单
                                    this.openKey = curr.key;
                                    isHome = false;
                                }
                                // 找到了显示
                                isShowSubMenu = true;
                                return [...prev, this.createMenu(current)];
                            } else {
                                return prev;
                            }
                        }, [])
                    }
                </SubMenu>;
                return isShowSubMenu ? [...prev, subMenu] : prev;
            } else {
                // 一级菜单
                // 从权限数组找是否匹配上一级菜单
                const menu = menus.find((menu) => menu === curr.key);
                if (menu) {
                    if (curr.key === pathname) isHome = false;
                    // 匹配上就添加进行，将来会显示菜单
                    return [...prev, this.createMenu(curr)];
                } else {
                    return prev;
                }
            }
        }, []);
        this.selectedKey = isHome ? '/home' : pathname;
    }
    render(){
        const { collapsed } = this.props;
        return<div>
            <Link className="left-nav-logo" to='/home'>
                <img src={logo} alt="logo"/>
                <h1 style={{display:collapsed ? 'none' : 'block'}}>硅谷后台</h1>
            </Link>
            <Menu theme= 'dark' defaultSelectedKeys={[this.selectedKey]} defaultOpenKeys={[this.openKey]} mode="inline">
                {
                    this.menus
                }
                </Menu>
        </div>
    }
}
export default  withRouter(LeftNav);