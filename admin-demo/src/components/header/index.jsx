import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import { Modal} from 'antd';
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import menuList from '../../config/menuConfig'
import storageUtils from '../../utils/storageUtils'
import {reqWeather} from '../../api'
import './index.less'
import LinkButton from '../link-button';
class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()),
    wea: '',
    tem: '',
    week:''
  }
  getTime = () => {
    setInterval(()=>{
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    },1000)
  }
  getWeather = async () => {
    const {wea,tem,week} = await reqWeather()
    this.setState({wea,tem,week})
  }
  getTitle = () => {
    const path = this.props.location.pathname
    let title
    menuList.forEach(item=>{
      if(item.key===path) {
        title = item.title
      } else if(item.children) {
        const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
        if(cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }
  logout = () => {
    // 显示确认框
    Modal.confirm({
      content: '确定退出吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        console.log('OK', this)
        // 删除保存的user数据
        storageUtils.removeUser()
        memoryUtils.user = {}

        // 跳转到login
        this.props.history.replace('/login')
      }
    })
  }
  componentDidMount() {
    this.getTime()
    this.getWeather()
  }
  // 销毁 所有的调用
  componentWillUnmount () {
    // 清除定时器
    clearInterval(this.intervalId)
  }
  render() {
    const {currentTime,wea,tem,week} = this.state
    const username = memoryUtils.user.username
    const title = this.getTitle()
    return (
      <div className="Header">
        <div className="Header-top">
          <span>欢迎,{username}</span>
          <LinkButton onClick = {this.logout} >退出</LinkButton>
        </div>
        <div className="Header-bottom">
          <div className="Header-bottom-left">{title}</div>
          <div className="Header-bottom-right">
            <span>{currentTime}</span>
            <span>{week}</span>
            <span>{wea}</span>
            <span>{tem + '℃'}</span>
          </div>
        </div>
      </div>
    )
  }
}

// 包装后的组件
export default withRouter(Header)