import React,{Component} from 'react'
import {Redirect,Switch,Route} from 'react-router-dom'
import { Layout } from 'antd';
import memoryUtils from '../../utils/memoryUtils'
import Header from '../../components/header'
import LeftNav from '../../components/left-nav'
import Home from '../home/home'
import category from '../category/category'
import product from '../product/product'
import users from '../user/user'
import role from '../roles/role'
import bar from '../charts/bar'
import line from '../charts/line'
import pie from '../charts/pie'
import NotFound from '../../pages/not-found/not-found'
const { Footer, Sider, Content } = Layout;
export default class Admin extends Component{
  render() {
    const user = memoryUtils.user
    if(!user || !user._id) {
      return <Redirect to="/login"/>
    }
    return (
      <Layout style={{minHeight: '100%'}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{margin: 20,backgroundColor:'#fff'}}>
            <Switch>
              <Redirect exact from='/' to='/home'/>
              <Route path='/home' component={Home}/>
              <Route path='/category' component={category}/>
              <Route path='/product' component={product}/>
              <Route path='/user' component={users}/>
              <Route path='/role' component={role}/>
              <Route path='/charts/bar' component={bar}/>
              <Route path='/charts/line' component={line}/>
              <Route path='/charts/pie' component={pie}/>
              <Route component={NotFound}/>
            </Switch>
          </Content>
          <Footer style={{textAlign: "center"}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}