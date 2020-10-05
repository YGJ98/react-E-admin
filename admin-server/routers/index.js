const express = require('express')
const md5 = require('blueimp-md5')
const UserModel = require('../models/UserModel')
const CategoryModel = require('../models/CategoryModel')
const ProductModel = require('../models/ProductModel')
const RoleModel = require('../models/RoleModel')
// 指定需要过滤的属性
const filter = {password: 0, __v: 0}
const router = express.Router()

// 登录
router.post('/login', (req, res) => {
  // console.log(req.body)
  const {username,password} = req.body
  UserModel.findOne({username}).then(user=>{
    if(user) {
      res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24})
      if (user.role_id) {
        RoleModel.findOne({_id: user.role_id})
          .then(role => {
            user._doc.role = role
            console.log('role user', user)
            res.send({status: 0, data: user})
          })
      } else {
        user._doc.role = {menus: []}
        // 返回登陆成功信息(包含user)
        res.send({status: 0, data: user})
      }
    } else {
      res.send({status: 1, msg: '用户名或密码不正确!'})
    }
  }).catch(err=>{
    console.log('登陆异常',err)
    res.send({status:1,msg:'登录异常，请重新登录'})
  })
  
})


// 获取一级或某个二级分类列表
router.get('/manage/category/list', (req, res) => {
  const parentId = req.query.parentId || '0'
  CategoryModel.find({parentId})
    .then(categorys => {
      res.send({status: 0, data: categorys})
    })
    .catch(error => {
      res.send({status: 1, msg: '获取分类列表异常, 请重新尝试'})
    })
})

// 添加分类
router.post('/manage/category/add',(req,res)=>{
  const {parentId,categoryName} = req.body
  CategoryModel.create({name:categoryName,parentId:parentId || '0'}).then((categorys)=>{
    res.send({status:0,data:categorys})
  }).catch(err=>{
    res.send({status:1,msg:'添加分类失败，请重新尝试!'})
  })
})

// 更新分类
router.post('/manage/category/update', (req, res) => {
  const {categoryId, categoryName} = req.body
  CategoryModel.findOneAndUpdate({_id: categoryId}, {name: categoryName})
    .then(oldCategory => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('更新分类名称异常', error)
      res.send({status: 1, msg: '更新分类名称异常, 请重新尝试'})
    })
})

// 删除分类
router.post('/manage/category/detele',(req,res)=>{
  const {name} = req.body
  CategoryModel.findOneAndDelete({name}).then(result=>{
    res.send({status:0})
  })
})

// 根据分类ID获取分类
router.get('/manage/category/info',(req,res)=>{
  const {categoryId} = req.body
  CategoryModel.findOne({_id:categoryId}).then(categorys=>{
    res.send({status:0,data:categorys})
  }).catch(err=>{
    res.send({status:1,msg:'获取分类失败，请重新尝试'})
  })
})




// 获取商品分页列表
router.get('/manage/product/list', (req, res) => {
  const {pageNum, pageSize} = req.query
  ProductModel.find({})
    .then(products => {
      res.send({status: 0, data: products})
    })
    .catch(error => {
      console.error('获取商品列表异常', error)
      res.send({status: 1, msg: '获取商品列表异常, 请重新尝试'})
    })
})

// 根据ID/Name搜索产品分页列表
router.get('/manage/product/search', (req, res) => {
  const {pageNum, pageSize, searchName, productName, productDesc} = req.query
  let contition = {}
  if (productName) {
    contition = {name: new RegExp(`^.*${productName}.*$`)}
  } else if (productDesc) {
    contition = {model: new RegExp(`^.*${productDesc}.*$`)}
  }
  ProductModel.find(contition)
    .then(products => {
      res.send({status: 0, data: products })
    })
    .catch(error => {
      console.error('搜索商品列表异常', error)
      res.send({status: 1, msg: '搜索商品列表异常, 请重新尝试'})
    })
})

// 添加商品
router.post('/manage/product/add',(req,res)=>{
  const product = req.body
  ProductModel.create(product).then((product)=>{
    res.send({status:0,data:product})
  }).catch(err=>{
    res.send({status:1,msg:'添加商品失败，请重新尝试!'})
  })
})

// 删除商品
router.post('/manage/product/delete',(req,res)=>{
  const {categoryId} = req.body
  ProductModel.findOneAndDelete({categoryId}).then(result=>{
    res.send({status:0})
  })
})
// 编辑更新商品
router.post('/manage/product/update',(req,res)=>{
  const product = req.body
  ProductModel.updateMany({},product).then(result=>{
    res.send({status:0})
  }).catch(err=>{
    res.send({status:1})
  })
})
// 卖出商品
router.post('/manage/product/sell', (req, res) => {
  const {productId,productNum} = req.body
  ProductModel.findOneAndUpdate({_id: productId}, {number: productNum})
    .then(oldCategory => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('更新分类名称异常', error)
      res.send({status: 1, msg: '更新分类名称异常, 请重新尝试'})
    })
})


// 获取用户信息(不好写)
router.get('/manage/user/list', (req, res) => {
  UserModel.find({username: {'$ne': 'admin'}})
    .then(users => {
      RoleModel.find().then(roles => {
        res.send({status: 0, data: {users, roles}})
      })
    })
    .catch(error => {
      res.send({status: 1, msg: '获取用户列表异常, 请重新尝试'})
    })
})
// 添加用户
router.post('/manage/user/add', (req, res) => {
  const {username, password} = req.body
  UserModel.findOne({username})
    .then(user => {
      if (user) {
        res.send({status: 1, msg: '此用户已存在'})
        return new Promise(() => {
        })
      } else {
        return UserModel.create({...req.body, password: md5(password )})
      }
    })
    .then(user => {
      res.send({status: 0, data: user})
    })
    .catch(error => {
      console.error('注册异常', error)
      res.send({status: 1, msg: '添加用户异常, 请重新尝试'})
    })
})


// 更新用户
router.post('/manage/user/update',(req,res)=>{
  const user = req.body
  UserModel.findOneAndUpdate({_id:user._id},user).then(oldUser=>{
    const data = Object.assign(oldUser, user)
      // 返回
    res.send({status: 0, data})
  }).catch(err=>{
    res.send({status:1,msg:'更新用户失败'})
  })
})

// 删除用户
router.post('/manage/user/delete', (req, res) => {
  const {userId} = req.body
  UserModel.deleteOne({_id: userId})
    .then((doc) => {
      res.send({status: 0})
    })
})

// 获取角色信息
router.get('/manage/role/list', (req, res) => {
  RoleModel.find().then(role=>{
    res.send({status:0,data:role})
  }).catch(err=>{
    res.send({status:1,msg:'获取角色信息失败'})
  })
})

// 添加角色信息
router.post('/manage/role/add', (req, res) => {
  const {roleName} = req.body
  RoleModel.create({name:roleName}).then(role=>{
    res.send({status:0,data:role})
  }).catch(err=>{
    res.send({status:1,msg:'添加角色失败'})
  })  
})

// 更新角色权限
router.post('/manage/role/update', (req, res) => {
  const role = req.body
  role.auth_time = Date.now()
  RoleModel.findOneAndUpdate({_id: role._id}, role)
    .then(oldRole => {
      // console.log('---', oldRole._doc)
      res.send({status: 0, data: {...oldRole._doc, ...role}})
    })
    .catch(error => {
      console.error('更新角色异常', error)
      res.send({status: 1, msg: '更新角色异常, 请重新尝试'})
    })
})

module.exports = router