import React, { Component } from 'react';
import { Form, Input } from 'antd';

export default class SellProduct extends Component {
  formRef = React.createRef();  
  componentDidUpdate() {
    this.formRef.current.setFieldsValue({
        name: this.props.product.name
    });
  }
  componentWillMount() {
    this.props.setForm(this.formRef)
  }
  render() {
    const {product} = this.props
    return (
      <Form ref={this.formRef}>
        <Form.Item name="name" label="商品名称" initialValue={product.name} rules={[{ required: true, message: '请输入商品名称' }]}>
          <Input/>
        </Form.Item>
        <Form.Item name="num" label="卖出数量"  rules={[{ required: true, message: '请输入卖出数量' }]}>
          <Input />
        </Form.Item>
      </Form>
    );
  }
}