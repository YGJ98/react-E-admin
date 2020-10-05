import React, { Component } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {Redirect} from 'react-router-dom'
import { reqLogin } from "../../api";
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import "./login.less";

export default class Login extends Component {
  formRef = React.createRef();
  // 提交表单校验
  onFinish = (values) => {
    //  console.log(values);
    this.formRef.current.validateFields().then(async (values) => {
        // success   必须统一写
        const { username, password } = values;
        // 获取用户信息
        const result = await reqLogin(username, password);
        // {status:,data:user}
        if (result.status === 0) {
          message.success("登录成功");

          // 保存user到内存中
          const user = result.data;
          memoryUtils.user = user;
          storageUtils.saveUser(user)

          // 跳转页面
          this.props.history.replace("/");
        } else {
          message.error(result.msg);
        }
      }).catch((errorInfo) => {
        console.log(errorInfo);
      });
  };
  render() {
    // 如果用户已经登录，就自动跳转
    const user = memoryUtils.user
    if(user && user._id) {
      return <Redirect to='/'/>
    }
    return (
      <div className="login">
        <div className="login-content">
          <h2>小E超市管理系统</h2>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
            ref={this.formRef}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, whitespace: true, message: "请输入用户名!" },
                { min: 4, message: "用户名至少4位!" },
                { max: 12, message: "用户名最多12位!" },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: "用户名必须由英文、数字或下划线组成!",
                },
              ]}
              initialValue="admin"
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "请输入密码!" },
                { min: 4, message: "密码至少4位!" },
                { max: 12, message: "密码最多12位!" },
              ]}
              initialValue="admin"
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}
