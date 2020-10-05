import React, { Component } from 'react';
import {Link,withRouter} from 'react-router-dom';
import { Menu,} from 'antd';
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import memoryUtils from "../../utils/memoryUtils"
import './index.less';

const { SubMenu } = Menu;

 class LeftNav extends Component {
  state = {
    collapsed: false,
  };

  /*
  判断当前登陆用户对item是否有权限
     角色用户权限
   */
  hasAuth = (item) => {
    const {key, isPublic} = item

    const menus = memoryUtils.user.role.menus
    const username = memoryUtils.user.username
    /*
    1. 如果当前用户是admin
    2. 如果当前item是公开的
    3. 当前用户有此item的权限: key有没有menus中
     */
    if(username==='admin' || isPublic || menus.indexOf(key)!==-1) {
      return true
    } else if(item.children){ // 4. 如果当前用户有此item的某个子item的权限
      // ！！ 如果 找到为 true,没找到为 false
      return !!item.children.find(child =>  menus.indexOf(child.key)!==-1)
    }

    return false
  }



  // 遍历两种方法，map   reduce
  // getMenuNodes_map = (menuList) => {
  //   return menuList.map(item => {
  //     if(!item.children) {
  //       return (
  //         <Menu.Item key={item.key} icon={item.icon}>
  //           <Link to={item.key}>{item.title}</Link>
  //         </Menu.Item>
  //       )
  //     } else {
  //       return (
  //         <SubMenu key={item.key} icon={item.icon} title={item.title}>
  //           {this.getMenuNodes(item.children)}
  //         </SubMenu>
  //       )
  //     }
  //   })
  // }
  getMenuNodes = (menuList) => {
    // 得到当前请求的路由路径
    const path = this.props.location.pathname

    return menuList.reduce((pre, item) => {

      // 如果当前用户有item对应的权限, 才需要显示对应的菜单项
     if(this.hasAuth(item)) {
      if(!item.children) {
        pre.push((
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.key}>{item.title}</Link>
          </Menu.Item>
        ))
      } else {
        // 查找一个与当前请求路径匹配的子Item
        const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
        // 如果存在, 说明当前item的子列表需要打开
        if (cItem) {
          this.openKey = item.key
        }
        pre.push((
          <SubMenu key={item.key} icon={item.icon} title={item.title}>
            {this.getMenuNodes(item.children)}
          </SubMenu>
        ))
      }
     }

      return pre
    }, [])
  }
  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList)
  }
  render() {
    let path = this.props.location.pathname

    //  解决路由未选中的 bug
    if(path.indexOf('/product')===0) {
      path = '/product'
    }

    const openKey = this.openKey
    return (
      <div className="left-nav">
        <Link to='/' className="left-nav-header">
          <img src={logo} alt="logo"/>
          <h1>小E后台</h1>
        </Link>
        <Menu
          // 控制选中的，下面两个
          // defaultSelectedKeys={[path]}
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
          // 控制导航收缩
          // inlineCollapsed={this.state.collapsed}
        >
          {/* <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="/home">首页</Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<HomeOutlined />} title="商品">
            {/* key的值要不一样，才可以选中，因此使用目录定义 */}
          {/* <Menu.Item key="category">
          <Link to="/category">品类管理</Link>
          </Menu.Item>
          <Menu.Item key="product">
          <Link to="/product">商品管理</Link>
          </Menu.Item>
          </SubMenu>  */}
          {
            this.menuNodes
          }
        </Menu>
      </div>
    );
  }
}
export default withRouter(LeftNav)