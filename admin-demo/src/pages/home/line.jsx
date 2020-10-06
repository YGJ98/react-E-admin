import React,{Component} from 'react'
import ReactEcharts from 'echarts-for-react';
export default class Line extends Component {
  getOption = () =>{
    return {
      title: {
        text: '销售统计'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['文具', '娃哈哈', '酒', '烟', '蔬菜']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '文具',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: '娃哈哈',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: '酒',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
            name: '烟',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
            name: '蔬菜',
            type: 'line',
            stack: '总量',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
    ]
    }
  }
  render () {
    return (
      <div>
        <ReactEcharts option={this.getOption()} />
      </div>
    )
  }
}