import React, { Component } from 'react';
import { Card,Select,Input,Table,Button, message,Modal } from 'antd';
import { reqProducts,reqSearchProduct,reqRemoveProduct, reqSellProduct } from '../../api';
import UpdateProduct from './update-product'
import SellProduct from './sell-product'
const { Option } = Select;
export default class Home extends Component {
  state={
    tatol: 0,
    products: [],
    loading: false,
    searchName:'',
    searchType:'productName',
    visible:0
  }
  inintColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        width: 200,
        dataIndex: 'name',
        fixed: 'left'
      },
      {
        title: '型号',
        dataIndex: 'model',
      },
      { title: '单位', dataIndex: 'unit' },
      { title: '数量', dataIndex: 'number'},
      { title: '采购价', dataIndex: 'Pprice', render: (price) => '¥' + price },
      { title: '出售价', dataIndex: 'Oprice',render: (price) => '¥' + price },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 200,
        render: (product,index) => (
          <span>
            <Button type='primary' size='small' onClick={()=>this.Update(product)}>编辑</Button>
            <Button type='primary' danger size='small' style={{margin:'0 10px'}} onClick={()=>this.removeProduct(index)}>删除</Button>
            <Button type='primary' danger size='small' onClick={()=>this.sell(product)}>卖出</Button>
          </span>
        )
      },
    ];
  }
  // 获取商品
  getProducts = async (pageNum) => {
    this.pageNum = pageNum // 保存pageNum, 让其它方法可以看到
    this.setState({loading: true}) // 显示loading

    const {searchName, searchType} = this.state
    // 如果搜索关键字有值, 说明我们要做搜索分页
    let result
    if (searchName) {
      result = await reqSearchProduct({pageNum, pageSize: 5, searchName, searchType})
    } else { // 一般分页请求
      result = await reqProducts(pageNum)
    }

    this.setState({loading: false}) // 隐藏loading
    if (result.status === 0) {
      // 取出分页数据, 更新状态, 显示分页列表
      const products = result.data
      this.setState({
        products
      })
    }
  }
  // 删除商品
  removeProduct = async(values) =>{

    const {categoryId} = values
    const result = await reqRemoveProduct(categoryId)
    if(result.status===0) {
      message.success('删除成功')
      this.getProducts()
    }
  }
  // 编辑商品
  Update = (product) => {
    this.product = product
    console.log(product)
    this.setState({
      visible:1
    })
  }
  UpdateProduct = () =>{
    this.setState({
      visible:0
    })
  }
  handleCancel =()=>{
    this.setState({
      visible:0
    })
  }
  // 卖出商品
  sell=(product)=>{
    this.product = product
    this.setState({
      visible:2
    })
  }
  sellProduct=()=>{
    this.formRef.current.validateFields().then(async value=>{
      this.setState({
        visible:0
      })
      const productId = this.product._id
      const productNum = this.product.number - value.num * 1
      // console.log(productId,productNum)
      // 清除输入数据
      this.formRef.current.resetFields()
     const result = await reqSellProduct(productId,productNum)
     if(result.status===0) {
      this.getProducts()
     }
    })
  }

  componentWillMount() {
    this.inintColumns()
  }
  componentDidMount () {
    this.getProducts()
  }
  render() {
    const {products,total,loading,searchName,searchType,visible} = this.state
    const product = this.product || {}
    const title = (
      <span>
        <Select value= {searchType} style={{ width: 120 }} onChange={value=>this.setState({searchType:value})}>
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按型号搜索</Option>
        </Select>
        <Input placeholder='关键字' style={{width:150,margin:'0 15px'}} value={searchName} onChange={event=>this.setState({searchName:event.target.value})}/>
        <Button type="primary" onClick={()=>this.getProducts(1)}>搜索</Button>
      </span>
    )
    
    
    const extra = (
      <Button type="primary" onClick={()=>this.props.history.push('/product/addupdate')}>添加商品</Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table 
        bordered
        loading={loading}
        rowKey='_id'
        columns={this.columns} 
        dataSource={products} 
        scroll={{ x: 1300 }}
        pagination={{
          current: this.pageNum,
          total, 
          defaultPageSize: 5, 
          showQuickJumper: true,
          onChange: this.getProducts
        }}
         />
      <Modal
      title="修改商品"
      visible={visible === 1}
      okText="确定"
      cancelText ="取消"
      onOk={this.UpdateProduct}
      onCancel={this.handleCancel}
    >
      <UpdateProduct product={product}/>
    </Modal>
      <Modal
      title="卖出商品"
      visible={visible === 2}
      okText="确定"
      cancelText ="取消"
      onOk={this.sellProduct}
      onCancel={this.handleCancel}
    >
      <SellProduct product={product} setForm = {(formRef)=>{this.formRef=formRef}}/>
      </Modal>
    
    </Card>
    );
  }
}