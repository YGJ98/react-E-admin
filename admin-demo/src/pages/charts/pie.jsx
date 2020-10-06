/* 
  饼状图路由
*/
import React, { Component } from 'react';
import {Card} from 'antd';
import ReactEcharts from "echarts-for-react";
export default class Pie extends Component {
  getOption = () => {
    return {
      title: {
        text: '销售饼状图',
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['酒', '烟', '娃哈哈', '文具', '蔬菜']
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: '80%',
            center: ['50%', '60%'],
            data: [
                {value: 335, name: '酒'},
                {value: 310, name: '烟'},
                {value: 234, name: '娃哈哈'},
                {value: 135, name: '文具'},
                {value: 1548, name: '蔬菜'}
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
    }
  }
  render() {
    return (
      <div>
        <Card>
        <ReactEcharts option={this.getOption()} />
        </Card>
      </div>
    );
  }
}

