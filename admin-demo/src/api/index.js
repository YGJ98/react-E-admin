/* 
包含应用中所有接口 请求 的模块
url 与 type 不变， 只有 参数 data 是变化的
要求：能根据接口文档定义接口请求函数
*/
import ajax from './ajax'
import {message} from 'antd'
import jsonp from 'jsonp'
const BASE = ''
// 登录
export const reqLogin = (username,password) => {
  return ajax(BASE+'/login',{username,password},'POST')
}



// 获取一级或某个二级分类列表
export const reqCategorys = (parentId) => {
  return ajax(BASE+'/manage/category/list',{parentId})
}

// 添加分类
export const reqAddCategory = (parentId,categoryName) => ajax(BASE + '/manage/category/add', {parentId,categoryName}, 'POST')
// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')
// 删除分类
export const reqRemoveCategory = (name) => ajax(BASE + '/manage/category/detele',{name},'POST')

//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})

//搜索商品分页列表
// searchType：商品名称或商品型号
export const reqSearchProduct = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName,
})

// 添加商品  修改商品   合二为一
// product._id有值，就是update,没值就是add
export const reqAddProduct = (product) => ajax(BASE + '/manage/product/add', product, 'POST')
// 修改商品
// export const reqUpdateProduct = (product) => ajax(BASE+'/manage/product/update',product,'POST')

// 删除商品
export const reqRemoveProduct = (categoryId) => ajax(BASE + '/manage/product/delete',{categoryId},'POST')

// 编辑商品
export const reqUpdateProduct = (product) => ajax(BASE+'/manage/product/update',product,'POST')
// 卖出商品
export const reqSellProduct = (productId,productNum) => ajax(BASE+'/manage/product/sell',{productId,productNum},'POST')



// 获取用户
export const reqUsers = () => ajax(BASE + '/manage/user/list')
// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')

// 删除用户
export const reqDeleteUser = (userId) => ajax(BASE+'/manage/user/delete',{userId},'POST') 


// 获取角色信息
export const reqRoles = () => ajax(BASE+'/manage/role/list')
// 添加角色
export const reqAddRole = (roleName) => ajax(BASE+'/manage/role/add',{roleName},'POST')
// 更新角色
export const reqUpdateRole = (role) => ajax(BASE+'/manage/role/update',role,'POST')

/*
json请求的接口请求函数
 */
export const reqWeather = () => {
  return new Promise((resolve,reject) => {
    const url = `https://v0.yiketianqi.com/api?version=v62&appid=57658385&appsecret=JgA025en`
  jsonp(url,{},(err,data)=>{
    // console.log('jsonp()',err,data)
    console.log(data.hours[0])
    console.log(data.week)
    if(!err) {
      const {week} = data
      const {wea,tem} = data.hours[0]
      resolve({wea,tem,week})
    } else {
      message.error('获取天气预报失败!')
    }
  })
  })
}