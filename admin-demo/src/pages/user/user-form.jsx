import React,{Component} from 'react'
import { Form, Input,Select} from 'antd';
const { Option } = Select;
export default class UserForm extends Component{
  formRef = React.createRef()
  componentWillMount() {
    this.props.setForm(this.formRef)
  }
  render() {
    const {roles} = this.props
    return (
      <Form 
      ref = {this.formRef}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 15 }}>
        <Form.Item
        label="用户名"
        name="username"
        rules={[
                { required: true, whitespace: true, message: "请输入用户名!" },
                { min: 4, message: "用户名至少4位!" },
                { max: 12, message: "用户名最多12位!" },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: "用户名必须由英文、数字或下划线组成!",
                }
        ]}
        >
          <Input placeholder="请输入用户名"/>
        </Form.Item>
        <Form.Item
        label="密码"
        name="password"
        rules={[
                { required: true, message: "请输入密码!" },
                { min: 4, message: "密码至少4位!" },
                { max: 12, message: "密码最多12位!" },
        ]}
        >
          <Input.Password placeholder="请输入密码"/>
        </Form.Item>
        <Form.Item
        label="手机号"
        name="phone"
        rules={[
          { required: true, message: '请输入用户名' },
          {
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            message: "请输入手机号!",
          },
        ]}
        >
         <Input placeholder="请输入手机号"/>
        </Form.Item>
        <Form.Item
        name="email"
        label="E-mail"
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