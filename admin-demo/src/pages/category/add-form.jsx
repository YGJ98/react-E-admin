import React,{Component} from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'
const { Option } = Select;
export default class AddForm extends Component{
  formRef = React.createRef();
  static propTypes = {
    categorys:PropTypes.array.isRequired,
    parentId:PropTypes.string.isRequired,
    setForm:PropTypes.func.isRequired
  }
  componentWillMount() {
    this.props.setForm(this.formRef)
}
  render() {
    const { categorys,parentId } = this.props
    return (
      <Form  ref={this.formRef}>
        <span>分类级别:</span>
        <Form.Item  name='category' initialValue={parentId}>
          <Select
          >
            <Option value="0">一级分类</Option>
            {
              categorys.map(category => <Option value={category._id}>{category.name}</Option>)
            }
          </Select>
        </Form.Item>
        <span>分类名称:</span>
        <Form.Item  name="categoryName" rules={[{ required: true,message: '分类名称必须输入!'}]}>
          <Input />
        </Form.Item>
      </Form>
    )
  }
}