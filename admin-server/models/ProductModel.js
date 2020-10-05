const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  categoryId: {type: String, required: true},   // 所属分类的id
  pCategoryId: {type: String, required: true},  // 所属分类的父分类id
  name:{type:String,isRequired:true},      // 商品名称
  model:{type:String,isRequired:true},    //型号
  unit:{type:String,isRequired:true},    //单位
  number:{type:Number,isRequired:true},  //数量
  Pprice:{type:Number,isRequired:true},      //采购价
  Oprice:{type:Number,isRequired:true},       //出售价
  Factory:{type:String,isRequired:true}       //出售价
})
const ProductModel = mongoose.model('products',ProductSchema)
module.exports = ProductModel