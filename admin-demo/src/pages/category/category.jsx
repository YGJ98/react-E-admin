/* 
  商品分类
*/
import React, { Component } from "react";
import { Card, Button, Table, message,Modal } from "antd";
import { reqCategorys,reqUpdateCategory,reqAddCategory,reqRemoveCategory } from "../../api";
import LinkButton from "../../components/link-button"
import AddForm from './add-form'
import UpdateForm from './update-form'
export default class Category extends Component {
  state = {
    loading: false, 
    categorys: [], 
    subCategorys: [], 
    parentId: '0', 
    parentName: '', 
    visible: 0
  };
  inintColumns = () => {
    this.columns = [
      {
        title: "分类名称",
        align: "center",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "操作",
        width: 500,
        align: "center",
        render: (category,index) => (
          <span>
            <Button type="primary" onClick={() => this.update(category)}>修改分类</Button>
            {this.state.parentId === '0'?<Button type="dashed" onClick={()=>this.showSubCategorys(category)}>查看子分类</Button>:null}
            <Button type="primary" danger onClick={()=>this.removeCategory(index)}>
              删除
            </Button>
          </span>
        ),
      },
    ];
  };
  // 获取一级//二级分类
  getCategorys = async () => {

    // 在发请求前, 显示loading
    this.setState({loading: true})
    const {parentId} = this.state
    // 发异步ajax请求, 获取数据
    const result = await reqCategorys(parentId)
    // 在请求完成后, 隐藏loading
    this.setState({loading: false})

    if(result.status===0) {
      // 取出分类数组(可能是一级也可能二级的)
      const categorys = result.data
      if(parentId==='0') {
        // 更新一级分类状态
        this.setState({
          categorys
        })
      } else {
        // 更新二级分类状态
        this.setState({
          subCategorys: categorys
        })
      }
    } else {
      message.error('获取分类列表失败')
    }
  }
  // 获取二级分类
  showSubCategorys = (category) => {
    // 更新状态
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => { // 在状态更新且重新render()后执行
      // console.log('parentId', this.state.parentId) // '0'
      // 获取二级分类列表显示
      this.getCategorys()
    })

    // setState()不能立即获取最新的状态: 因为setState()是异步更新状态的
    // console.log('parentId', this.state.parentId) // '0'
  }
  // 显示一级分类
  showCategorys = () => {
    // 更新为显示一列表的状态
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }
  // 添加商品更新
  Add = () => {
    this.setState({
      visible:1
    })
  }
  addCategory = () => {
    this.formRef.current.validateFields()
      .then( async values=>{
        this.setState({
          visible:0
        })
        const {category,categoryName} = this.formRef.current.getFieldValue()
        console.log(category,categoryName)
        // 清除输入数据
        this.formRef.current.resetFields()
        // 参数的顺序要和接口的参数顺序一致
        const result = await reqAddCategory(category,categoryName)
        if(result.status===0) {
          if(category === this.state.parentId) {
            this.getCategorys()
          } else if(category === '0') {
            // 在二级分类下添加一级分类
            this.getCategorys('0')
          }
        }
      }) 
  }
  // 更新
  update = (category) => {
    // 保存分类对象
    this.category = category
    
    this.setState({
      visible: 2
    })
  }
  updateCategory = () => {
    // console.log(this.formRef)
    this.formRef.current.validateFields()
      .then(async values=>{
        this.setState({
          visible:0
        })
        const categoryId = this.category._id
        const {categoryName} = values
        console.log(categoryId,categoryName)
        // 清除输入数据
        this.formRef.current.resetFields()
        const result = await reqUpdateCategory({categoryId, categoryName})
        if (result.status===0) {
          // 3. 重新显示列表
          this.getCategorys()
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  //删除
  removeCategory = async (values)=>{
    console.log(values)
    const {name} = values
    console.log(name)
    const result = await reqRemoveCategory(name)
    if(result.status===0) {
      message.success('删除成功')
      this.getCategorys()
    }

  }
  handleCancel = () => {
    this.setState({
      visible: 0
    })
  }
  componentWillMount() {
    this.inintColumns();
  }
  componentDidMount() {
    this.getCategorys();
  }
  render() {
    const {categorys, subCategorys, parentId, parentName, loading,visible} = this.state

    const category = this.category || {}  

    const title = parentId === '0'? '一级分类': (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <span style={{margin:10}}>&gt;</span>
        <span>{parentName}</span>
      </span>
    );
    const extra = <Button type="primary" onClick={this.Add}>添加分类</Button>;
    return (
      <Card title={title} extra={extra}>
        <Table
          dataSource={parentId === '0'? categorys : subCategorys }
          columns={this.columns}
          bordered
          rowKey="_id"
          loading={loading}
          pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        />

        <Modal
          title="添加分类"
          visible={visible === 1}
          okText="确定"
          cancelText ="取消"
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
          categorys={categorys}
          parentId={parentId}
          setForm = {(formRef)=>{this.formRef=formRef}}/>
        </Modal>

        <Modal
          title="修改分类"
          visible={visible === 2}
          okText="确定"
          cancelText ="取消"
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm 
          categoryName={category.name} 
          setForm = {(formRef)=>{this.formRef=formRef}}/>
        </Modal>
      </Card>
    );
  }
}
