import  React, { Component } from  'react';
import  { Layout } from  'antd';
import  { Route, Switch, Redirect } from 'react-router-dom';
import  Home from '../home';
import  Category from '../category';
import User from '../user';
import Role from '../role';
import Line from '../charts/line';
import Bar from '../charts/bar';
import Pie from '../charts/pie';
import Product from  '../product'
import  LeftNav from '../../components/left-nav';
import  HeaderMain from  '../../components/header-main';
import { getItem } from '../../utils/storage-tools';
import { reqValidateUserInfo } from '../../api';


const  { Header, Content, Footer, Sider } = Layout;
export  default  class  Admin extends  Component{
    state = {
        collapsed: false,
        isLoading:true,
        success:false
    };
    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };
    async componentWillMount() {
        // 判断登录是否成功
        const user = getItem();

        // 用户是刷新进来的
        if (user && user._id) {
            // 发送请求验证 用户信息是否合法
            // 如果用户是登录进来的，就不需要。如果用户是使用之前的值，刷新访问进行来，就需要
            const result = await reqValidateUserInfo(user._id);

            if (result){
               return this.setState({
                   isLoading:false,
                   success:true
               })
            }
        }
        this.setState({
            isLoading:false,
            success:false
        })
    }
    render(){
        const { collapsed,  isLoading, success} = this.state;
        if (isLoading) return null;
        return success ? <Layout style={ { minHeight:'100vh'}}>
                <Sider collapsible collapsed={collapsed} onCollapse={ this.onCollapse}>
                    <LeftNav collapsed={collapsed}/>
                </Sider>
                <Layout>
                    <Header style={ { background: '#ffffff', padding:0, minHeight:100}}>
                        <HeaderMain/>
                    </Header>
                    <Content style={ { margin:'25px 16px'}}>
                        <div style={{ padding: 24, background:'#ffffff', minHeight:360}}>
                            <Switch>
                                <Route path="/home" component={Home}/>
                                <Route path="/category" component={Category}/>
                                <Route path="/product" component={Product}/>
                                <Route path="/user" component={User}/>
                                <Route path="/role" component={Role}/>
                                <Route path="/charts/line" component={Line}/>
                                <Route path="/charts/bar" component={Bar}/>
                                <Route path="/charts/pie" component={Pie}/>
                                <Redirect to="/home"/>
                            </Switch>
                        </div>
                    </Content>
                    <Footer style={ {textAlign:'center' }}>
                        推荐您使用谷歌浏览器，可以使您获得更佳的页面操作体验
                    </Footer>
                </Layout>
            </Layout> : <Redirect to='/login'/>;

    }

}