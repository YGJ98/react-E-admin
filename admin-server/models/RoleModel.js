const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type:String,isRequired:true},
  create_time: {type:Number,default:Date.now()},
  auth_time: Number,
  auth_name: String,
  menus: Array
})
const RoleModel = mongoose.model('roles',roleSchema)

module.exports = RoleModel
