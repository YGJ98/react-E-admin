import React, { Component } from 'react';
import { Card,Form, Input,Cascader ,Button,message } from 'antd';
import { reqCategorys,reqAddProduct} from '../../api'
export default class UpdateProduct extends Component {
  formRef = React.createRef();
  state = {
    options:[]
  }
  initOptions = (categorys) => {
    // 根据categorys生成options
    const options = categorys.map(c=>({
      value: c._id,
      label: c.name,
      isLeaf: false   // 没有子分页
    }))
    this.setState({options})
  }
  // 获取一级/二级分类
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)   // {status: 0, data: categorys}
    if (result.status===0) {
      const categorys = result.data
      // 如果是一级分类列表
      if (parentId==='0') {
        this.initOptions(categorys)
      } else { // 二级列表
        return categorys  // 返回二级列表 ==> 当前async函数返回的promsie就会成功且value为categorys
      }
    }
  }
  loadData = async selectedOptions => {
    // 得到选择的option对象
    const targetOption = selectedOptions[0]
    // 显示loading
    targetOption.loading = true

    // 根据选中的分类, 请求获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value)
    // 隐藏loading
    targetOption.loading = false
    // 二级分类数组有数据
    if (subCategorys && subCategorys.length>0) {
      // 生成一个二级列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      // 关联到当前option上
      targetOption.children = childOptions
    } else { // 当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }

    // 更新options状态
    this.setState({
      options: [...this.state.options],
    })
  }
  submit = () => {
    this.formRef.current.validateFields().then(async(values)=>{
      // console.log(values)
      const {name,model,number,unit,Pprice,Oprice,factory,categoryIds} = values
      let pCategoryId, categoryId
        if (categoryIds.length===1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
      const product = {name,model,number,unit,Pprice,Oprice,factory,categoryId,pCategoryId}
      const result = await reqAddProduct(product)
      if(result.status===0) {
        message.success('添加成功')
        this.props.history.goBack()
      }
    })
  }
  componentDidMount () {
    this.getCategorys('0')
  }
  render() {
    const {options} = this.state
    
    return (
      <Card title="添加商品" bordered={false}>
         <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 8 }}
        ref={this.formRef}
        >
          <Form.Item name="name" label="商品名称" rules={[{ required: true, message: '请输入商品名称' }]}>
          <Input />
          </Form.Item>
          <Form.Item name="model" label="商品型号" rules={[{ required: true, message: '请输入商品型号' }]}>
          <Input />
          </Form.Item>
          <Form.Item name="number" label="购买数量" rules={[{ required: true, message: '请输入购买数量' }]}>
          <Input />
          </Form.Item>
          <Form.Item name="unit" label="单位" rules={[{ required: true, message: '请输入商品单位' }]}>
          <Input />
          </Form.Item>
          <Form.Item name="Pprice" label="采购价" rules={[{ required: true, message: '请输入采购价' }]}>
          <Input prefix="￥"/>
          </Form.Item>
          <Form.Item name="Oprice" label="出售价" rules={[{ required: true, message: '请输入出售价' }]}>
            <Input prefix="￥"/>
          </Form.Item>
          <Form.Item name="Factory" label="生产厂家" rules={[{ required: true, message: '请输入生产厂家' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="categoryIds"label="商品类别">
            <Cascader options={options} loadData={this.loadData} placeholder="请选择商品类别" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{margin:'0 360px'}} onClick={this.submit}>提交</Button>
          </Form.Item>
          
        </Form>
    </Card>
    );
  }
}