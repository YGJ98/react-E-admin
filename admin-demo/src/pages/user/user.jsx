/* 
  用户管理
*/
import React,{PureComponent} from 'react'
import { Card,Button,Table, Modal,message } from 'antd'
import UserForm from './user-form'
import UpdateForm from './update-form'
import {reqUsers,reqAddOrUpdateUser,reqDeleteUser} from '../../api'
import {formateDate} from "../../utils/dateUtils"
export default class User extends PureComponent {
  state={
    users:[],
    roles:[],
    visible:false
  }
  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },

      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id) => this.roleNames[role_id]
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <Button type="primary" style={{marginRight:15}} onClick={() => this.showUpdate(user)}>修改</Button>
            <Button type="primary" danger onClick={() => this.deleteUser(user)}>删除</Button>
          </span>
        )
      },
    ]
  }
   /*
  根据role的数组, 生成包含所有角色名的对象(属性名用角色id值)
   */
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    // 保存
    this.roleNames = roleNames
  }
  getUsers = async () => {
    const result = await reqUsers()
    if(result.status===0) {
      const {users,roles} = result.data
      this.initRoleNames(roles)
      this.setState({
        users,
        roles
      })
    }
  }
  showAdd = () => {
    this.user = null  //  去除前面保存的user
    this.setState({visible:1})
  }
  // 修改
  showUpdate = (user) => {
    this.user = user
    this.setState({
      visible:2
    })
  }
  addOrUpdateUser = () => {
    this.setState({visible:false})
    this.formRef.current.validateFields().then(async user=>{
      // console.log(user)
      // 如果是更新, 需要给user指定_id属性
    if (this.user) {
      user._id = this.user._id
    }
      this.formRef.current.resetFields()
      const result = await reqAddOrUpdateUser(user)
    if(result.status===0) {
      message.success(`${this.user ? '修改' : '添加'}用户成功`)
      this.getUsers()
    }
    })
  }
  //删除
  deleteUser =(user)=>{
    Modal.confirm({
      title: `确认删除${user.username}吗?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if(result.status===0) {
          message.success('删除用户成功!')
          this.getUsers()
        }
      }
    })
  }
  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getUsers()
  }
  render() {
    const {users,visible,roles} = this.state
    const user = this.user || {}
    const title = <Button type="primary" onClick={this.showAdd}>创建用户</Button>
    return (
      <Card title={title}>
        <Table 
        bordered
        rowKey='_id'
        columns={this.columns} 
        dataSource={users}
        pagination={{defaultPageSize: 5}}
      />
      <Modal
          title='添加用户'
          visible={visible===1}
          okText="确定"
          cancelText ="取消"
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.setState({visible: false})
          }}
        >
          <UserForm setForm = {formRef => this.formRef = formRef} roles = {roles}/>
      </Modal>
      <Modal
          title='修改用户'
          visible={visible===2}
          okText="确定"
          cancelText ="取消"
          onOk={this.addOrUpdateUser}
          onCancel={() =>{
            this.formRef.current.resetFields()
            this.setState({visible: false})
          }}
        >
          <UpdateForm setForm = {formRef => this.formRef = formRef} roles = {roles} user={user}/>
      </Modal>
    </Card>
    )
  }
}