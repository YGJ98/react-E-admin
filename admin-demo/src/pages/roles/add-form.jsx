import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'

export default class UpdateForm extends Component {
  formRef = React.createRef();  
  static propTypes = {
      setForm:PropTypes.func.isRequired
  }
  componentWillMount() {
      this.props.setForm(this.formRef)
  }
  render() {
      return (
          <Form ref={this.formRef} >
            <Form.Item
              label="用户名称"
              name="roleName"
              rules={[{ required: true, message: '请输入用户名称' }]}
          >
            <Input />
            </Form.Item>
          </Form>
      )
  }
}
