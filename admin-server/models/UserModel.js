/*
能操作users集合数据的Model
 */
const mongoose = require('mongoose')
const md5 = require('blueimp-md5')

const userSchema = new mongoose.Schema({
  username: {type: String, required: true}, // 用户名
  password: {type: String, required: true}, // 密码
  phone: String,
  email: String,
  create_time: {type: Number, default: Date.now},
  role_id: String
})
const UserModel = mongoose.model('users', userSchema)

// 初始化默认超级管理员用户: admin/admin
UserModel.findOne({username: 'admin'}).then(user => {
  if(!user) {
    UserModel.create({username: 'admin', password:'admin'})
            .then(user => {
              console.log('初始化用户: 用户名: admin 密码为: admin')
            })
  }
})
module.exports = UserModel