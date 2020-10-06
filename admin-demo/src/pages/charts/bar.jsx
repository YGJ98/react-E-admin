/* 
  柱状图路由
*/
import React, { Component } from "react";
import { Card, Button } from "antd";
import ReactEcharts from "echarts-for-react";
export default class Bar extends Component {
  state={
    sales: [5, 20, 36, 10, 10, 20], // 销量的数组
    stores: [6, 20, 40, 20, 15, 30], // 库存的数组
  }
  update = () => {
    this.setState(state=>({
      sales: state.sales.map(item=>item+1),
      stores: state.stores.reduce((pre,item)=>{
        pre.push(item-1)
        return pre
      },[])
    }))
  }
  getOption = (sales,stores) => {
    return {
      title: {
        text: "销售柱状图",
      },
      tooltip: {},
      legend: {
        data: ["销量", "库存"],
      },
      xAxis: {
        data: ["文具", "蔬菜", "烟", "酒", "零食", "娃哈哈"],
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: sales,
        },
        {
          name: "库存",
          type: "bar",
          data: stores,
        },
      ],
    };
  };
  render() {
    const {sales,stores} = this.state
    return (
      <div>
        <Card>
          <Button type="primary" onClick={this.update}>更新</Button>
        </Card>
        <Card title="柱状图">
          <ReactEcharts option={this.getOption(sales,stores)} />
        </Card>
      </div>
    );
  }
}
