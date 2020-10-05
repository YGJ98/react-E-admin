import React, { Component } from 'react';
import {Form, Input,Cascader } from 'antd';
export default class UpdateProduct extends Component {
  formRef = React.createRef();  
  state = {
    options:[]
  }
  
  loadData = async selectedOptions => {
    // 得到选择的option对象
    const targetOption = selectedOptions[0]
    // 显示loading
    targetOption.loading = true

    // 根据选中的分类, 请求获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value)
    // 隐藏loading
    targetOption.loading = false
    // 二级分类数组有数据
    if (subCategorys && subCategorys.length>0) {
      // 生成一个二级列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      // 关联到当前option上
      targetOption.children = childOptions
    } else { // 当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }

    // 更新options状态
    this.setState({
      options: [...this.state.options],
    })
  }
  componentDidUpdate() {
    this.formRef.current.setFieldsValue({
      pCategoryId: this.props.product.pCategoryId,
        categoryId: this.props.product.categoryId,
        name: this.props.product.name,
        model: this.props.product.model,
        unit: this.props.product.unit,
        number: this.props.product.number,
        Pprice: this.props.product.Pprice,
        Oprice: this.props.product.Oprice,
    });
}
  render() {
    const {product} = this.props
    const {/* pCategoryId, categoryId */name,model,unit,number,Pprice,Oprice} = product
    return (
      <Form ref={this.formRef} >
        <Form.Item name="name" label="商品名称" initialValue={name} rules={[{ required: true, message: '请输入商品名称' }]}>
          <Input/>
        </Form.Item>
          <Form.Item name="model" label="商品型号" initialValue={model} rules={[{ required: true, message: '请输入商品型号' }]}>
          <Input />
          </Form.Item>
          <Form.Item name="number" label="购买数量" initialValue={number} rules={[{ required: true, message: '请输入购买数量' }]}>
          <Input />
          </Form.Item>
          <Form.Item name="unit" label="单位" initialValue={unit} rules={[{ required: true, message: '请输入商品单位' }]}>
          <Input />
          </Form.Item>
          <Form.Item name="Pprice" label="采购价" initialValue={Pprice} rules={[{ required: true, message: '请输入采购价' }]}>
          <Input prefix="￥"/>
          </Form.Item>
          <Form.Item name="Oprice" label="出售价" initialValue={Oprice} rules={[{ required: true, message: '请输入出售价' }]}>
            <Input prefix="￥"/>
          </Form.Item>
          <Form.Item name="categoryIds"label="商品类别" >
            <Cascader options={this.state.options} loadData={this.loadData} placeholder="请选择商品类别" />
          </Form.Item>
      </Form>
    );
  }
}