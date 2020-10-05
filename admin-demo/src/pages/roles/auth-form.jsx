import React,{Component} from 'react'
import { Form,Input,Tree } from 'antd';
export default class AuthForm extends Component {
  constructor(props) {
    super(props)
    // 根据传入角色的menus生成初始状态
    const {menus} = this.props.role
    this.state={
      // 确定是否选中
      checkedKeys: menus
    }
  }
  /*
  为父组件提交获取最新menus数据的方法
   */
  getMenus = () => this.state.checkedKeys
  
  // 选中某个node时的回调
  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };
   // 根据新传入的role来更新checkedKeys状态
  /*
  当组件接收到新的属性时自动调用
   */
  componentWillReceiveProps (nextProps) {
    // console.log('componentWillReceiveProps()', nextProps)
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys: menus
    })
    // this.state.checkedKeys = menus
  }
  render() {
    const {role} = this.props
    const {checkedKeys} = this.state
    const treeData = [
      {
        title: '平台权限',
        key: 'all',
        children: [
          {
            title: '首页', 
            key: '/home',
          },
          {
            title: '商品',
            key: '/products',
            children: [
              { title: '品类管理',key: '/category', },
              { title: '商品管理',key: '/product' },
            ],
          },
          {
            title: '用户管理',
            key: '/user',
          },
          {
            title: '角色管理',
            key: '/role',
          },
          {
            title: '图形图表',
            key: '/charts',
            children: [
              { title: '柱形图', key: '/charts/bar', },
              { title: '折线图',key: '/charts/line', },
              { title: '饼图',key: '/charts/pie', },
            ],
          },
        ],
      },
      
    ];
    return (
      <div>
        <Form.Item
          label="用户名称"
          name="roleName"
          rules={[{ required: true, message: '请输入用户名称' }]}
        >
          <Input placeholder={role.name} disabled/>
        </Form.Item>
        <Tree
        checkable
        defaultExpandAll = {true}
        checkedKeys={checkedKeys}
        onCheck={this.onCheck}
        treeData={treeData}
        />
      </div>
    )
  }
}