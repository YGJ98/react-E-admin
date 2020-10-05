/* 
    角色管理
*/
import React, { Component } from 'react';
import { Card,Button,Table,message,Modal } from 'antd';
import { reqRoles,reqAddRole,reqUpdateRole } from '../../api';
import AddForm from './add-form';
import AuthForm from './auth-form';
import memoryUtils from "../../utils/memoryUtils"
import {formateDate} from '../../utils/dateUtils'
import storageUtils from "../../utils/storageUtils";
export default class role extends Component {
  state = {
    roles:[],
    role:{},  // 是否选中的对象
    visible: 0
  }
  constructor (props) {
    super(props)

    this.auth = React.createRef()
  }
  initColumns = () => {
    this.columns =  [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time) => formateDate(create_time)
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      }
    ];
  }
  // 获取角色信息
  getRoles = async () => {
    const result = await reqRoles()
    if(result.status===0) {
      const roles = result.data
      this.setState({roles})
    }
  }
  // 添加角色
  AddRole =  ()=>{
    this.formRef.current.validateFields().then(async value=>{
      // console.log(value)
      this.setState({
        visible:0
      })
      const {roleName} = value
      this.formRef.current.resetFields()
      const result = await reqAddRole(roleName)
      if(result.status===0) {
        message.success('创建角色成功')
        this.getRoles()
      }
    })
  }
  // 更新权限
  updateRole = async () => {
    this.setState({
      visible:0
    })

    const role = this.state.role
    const menus = this.auth.current.getMenus()
    role.menus = menus
    role.auth_time = Date.now()
    role.auth_name = memoryUtils.user.username
    // console.log(role)
    const result = await reqUpdateRole(role)
    if (result.status===0) {
      // this.getRoles()
      // 如果当前更新的是自己角色的权限, 强制退出
      if (role._id === memoryUtils.user.role_id) {
        memoryUtils.user = {}
        storageUtils.removeUser()
        this.props.history.replace('/login')
        message.success('当前用户角色权限修改成功，请重新登录')
      } else {
        message.success('设置角色权限成功')
        this.setState({
          roles: [...this.state.roles]
        })
      }

    }
  }
  handleCancel = () => {
    this.setState({
      visible:0
    })
  }
  componentWillMount(){
    this.initColumns()
  }
  componentDidMount() {
    this.getRoles()
  }
  render() {
    const { roles,role,visible } = this.state
    const title = (
      <span>
        <Button type="primary" style={{marginRight:20}}onClick={() => this.setState({visible: 1})}>创建角色</Button>
        <Button type="primary" disabled={!role._id} onClick={()=> this.setState({visible:2})}>设置角色权限</Button>
      </span>
    )
    return (
      <Card title={title}>
        <Table
        bordered
        rowKey= '_id'
        columns={this.columns}
        dataSource={roles}
        rowSelection={{type:'radio',selectedRowKeys:[role._id],onSelect: (role) => { // 选择某个radio时回调
          this.setState({
            role
          })
        }}}
        pagination={{
          defaultPageSize: 5, 
          showQuickJumper: true,
        }}
        onRow={role => {
          return {
            onClick: event => {
              console.log('Role,Click',role)
              this.setState({role})
            }, // 点击行
          };
        }}
      />
       <Modal
          title="添加角色"
          visible={visible===1}
          okText="确定"
          cancelText ="取消"
          onOk={this.AddRole}
          onCancel={this.handleCancel}
        >
          <AddForm setForm={formRef=>this.formRef = formRef}/>
      </Modal>
       <Modal
          title="设置角色权限"
          visible={visible===2}
          okText="确定"
          cancelText ="取消"
          onOk={this.updateRole}
          onCancel={this.handleCancel}
        >
          <AuthForm ref={this.auth} role={role}/>
      </Modal>
      </Card>
    );
  }
}