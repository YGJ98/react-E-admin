import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'

export default class UpdateForm extends Component {
  formRef = React.createRef();  
  static propTypes = {
      categoryName:PropTypes.string.isRequired,
      setForm:PropTypes.func.isRequired
  }
  componentDidUpdate() {
      this.formRef.current.setFieldsValue({
          categoryName: this.props.categoryName,
      });
  }
  componentWillMount() {
      this.props.setForm(this.formRef)
  }
  render() {
      const { categoryName } = this.props
      return (
          <Form ref={this.formRef} >
              <Form.Item name='categoryName' initialValue={categoryName} rules={[{ required: true,message: '分类名称必须输入!'}]}>
                  <Input  placeholder='请输入分类名称' ></Input>
              </Form.Item>
          </Form>
      )
  }
}
