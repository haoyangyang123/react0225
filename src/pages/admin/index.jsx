import  React, { Component } from  'react';

import  logo from  './logo.png';

export  default  class Admin extends Component{
    render(){
        return <div>
            <header className= "login-header">
                <img src={logo} alt="logo"/>
                <h1>React项目：后台管理系统</h1>
            </header>
        </div>
    }
}
