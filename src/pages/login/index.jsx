import React, { Component } from 'react';
import  { Form, Icon, Input, Button, } from  'antd';
import  { reqLogin } from  '../../api';

import  logo from './logo.png';
import './index.less'

const  Item = Form.Item;

class Login extends Component {
    login = (e) =>{
        e.preventDefault();
        this.props.form.validateFields( async (error,valuse) =>{
            if (!error){
                const { username, password} = valuse;
                const  result = await  reqLogin(username,password);
                console.log(result);
                if (result){
                    this.props.history.replace('/');
                } else {
                    this.props.form.resetFields(['password']);
                }
            } else {
                console.log('登录表单校验失败：', error);
            }
        })
    }
    validator = (rule,value,callback) => {
        const  name = rule.fullField === 'usrename' ? '用户名' : '密码';
        if (!value) {
            callback(`必须输入${name}！`);
        } else if (value.length < 4) {
            callback(`${name}必须大于4位`);
        } else if (value.length > 15) {
            callback(`${name}必须小于15位`);
        } else if (!/^[a-zA-Z_0-9]+$/.test(value)) {
            callback(`${name}只能包含英文字母、数字和下划线`);
        } else {
            callback();
        }
    }
    render() {
        const { getFieldDecorator  } = this.props.form;

        return <div className="login">
            <header className= "login-header">
               <img src={logo} alt="logo"/>
               <h1>React项目：后台管理系统</h1>
            </header>
            <section className= "login-content">
                <h2>用户登录</h2>
                <Form onSubmit={this.login} className="login-form">
                    <Item>
                        {
                            getFieldDecorator(
                                'username',
                                {
                                    rules: [
                                        /*{required: true, message: '请输入用户名！'},
                                        {min: 4, message: '用户名必须大于4位'},
                                        {max: 15, message: '用户名必须小于15位'},
                                        {pattern: /^[a-zA-Z_0-9]+$/, message: '用户名只能包含英文字母、数字和下划线'}*/
                                        {
                                            validator: this.validator
                                        }
                                    ]
                                }
                            )(
                                <Input className="login-input" prefix={<Icon type="user"/>} placeholder="用户名"/>
                            )
                        }
                    </Item>
                    <Item>
                        {
                            getFieldDecorator(
                                'password',
                                {
                                    rules:[
                                        {
                                            validator:this.validator
                                        }
                                    ]
                                }
                            )(
                            <Input className="login-input" prefix={<Icon type="lock"/>} placeholder="密码"
                                   type="password"/>
                            )
                        }
                    </Item>
                    <Item>
                        <Button type="primary" htmlType="submit" className="login-btn">登录</Button>
                    </Item>
                </Form>
            </section>
        </div>;
  }
}

export default Form.create()(Login);