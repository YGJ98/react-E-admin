import React,{Component} from 'react'
import { Form, Input,Select} from 'antd';
const { Option } = Select;
export default class UserForm extends Component{
  formRef = React.createRef()
  componentWillMount() {
    this.props.setForm(this.formRef)
  }
  render() {
    const {roles,user} = this.props
    return (
      <Form 
      ref = {this.formRef}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 15 }}>
        <Form.Item
        label="用户名"
        name="username"
        initialValue={user.username}
        rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入用户名"/>
        </Form.Item>
        {user._id ? null :(<Form.Item
        label="密码"
        name="password"
        initialValue={user.password}
        rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input.Password placeholder="请输入密码"/>
        </Form.Item>)}
        <Form.Item
        label="手机号"
        name="phone"
        initialValue={user.phone}
        rules={[{ required: true, message: '请输入用户名' }]}
        >
         <Input placeholder="请输入手机号"/>
        </Form.Item>
        <Form.Item
        name="email"
        label="E-mail"
        initialValue={user.email}
        rules={[
          {
            type: 'email',
            message: '请输入邮箱!',
          },
          {
            required: true,
            message: '请输入邮箱!',
          },
        ]}
      >
        <Input placeholder="请输入邮箱"/>
      </Form.Item>
        <Form.Item
        label="角色"
        name="role_id"
        initialValue={user.role_id}
        rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Select placeholder="请选择角色">
            {
              roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
            }
          </Select>
        </Form.Item>
      </Form>
    )
  }
}