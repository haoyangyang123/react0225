import React, { Component } from 'react';
import  { Icon, Menu } from "antd";
import { Link, withRouter } from 'react-router-dom';
import  PropTypes from 'prop-types';
import  menuList from '../../config/menu-config';

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
        const pathnameReg= /^\/product\//;
        if (pathnameReg.test(pathname)){
            pathname = pathname.slice(0,8);
        }
        let  isHome = true;
        this.menus = menuList.map((menu) =>{
            const  children = menu.children;
            if(children) {
                return<SubMenu
                    key={menu.icon}
                    title={
                        <span>
                            <Icon type={menu.icon}/>
                            <span>{menu.title}</span>
                        </span>
                    }>
                    {
                        children.map((item) =>{
                            if(item.key ===pathname){
                                this.openKey = menu.key;
                                isHome = false;
                            }
                            return this.createMenu(item);
                        })
                    }
                </SubMenu>
            }else {
                if (menu.key === pathname) isHome = false;
                return this.createMenu(menu);
            }
        })
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