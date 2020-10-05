/* 
  商品路由
*/
import React,{Component} from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import Home from './home'
import AddProduct from './add-product'
export default class Product extends Component {
  render() {
    return (
      <Switch>
        {/* 统一路由 */}
        <Route path='/product' component={Home} exact/> 
        <Route path='/product/addupdate' component={AddProduct}/>
        <Redirect to='/product'/>
      </Switch>
    )
  }
}