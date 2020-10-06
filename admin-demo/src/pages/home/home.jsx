/* 
  首页路由
*/
import React, { Component } from "react";
import { Statistic, Card, Row, Col } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import Line from "./line";
export default class Home extends Component {
  render() {
    return (
      <div>
        <Card>
          <Row gutter={4}>
            <Col span={3}>
              <Card>
                <Statistic
                  title="同上周相比"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={3}>
              <Card>
                <Statistic
                  title="同上个月相比"
                  value={9.3}
                  precision={2}
                  valueStyle={{ color: "#cf1322" }}
                  prefix={<ArrowDownOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
          </Row>
          <Line />
        </Card>
      </div>
    );
  }
}
