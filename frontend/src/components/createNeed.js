import React, { Component } from 'react'
import { Row, Col, Button } from 'antd'
import { FaMapMarkerAlt, FaChild, FaHome, FaSun } from 'react-icons/fa'
import styled from 'styled-components'

const ServiceOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 200ms ease-in;
  text-align: center;
  margin: 1rem 0;

  &:hover {
    transform: scale(1.1);
    color: teal;
  }
`

const ServiceOptionIconWrapper = styled.div`
  margin: 10px;
  
`

export default class CreateNeed extends Component {
  state = {
    needType: null,
    howSoon: null,
  }

  render() {
    const serviceOptions = [
      {
        text: 'Travel',
        iconComponent: ({ size }) => <FaMapMarkerAlt size={size} />,
      },
      {
        text: 'Childcare',
        iconComponent: ({ size }) => <FaChild size={size} />,
      },
      {
        text: 'Home Maintenance',
        iconComponent: ({ size }) => <FaHome size={size} />,
      },
      {
        text: 'Lawncare',
        iconComponent: ({ size }) => <FaSun size={size} />,
      },
    ]

    const serviceOptionItems = serviceOptions.map(({ text, iconComponent }) => (
      <Col xs={12} md={6} >
        <ServiceOption>
          <ServiceOptionIconWrapper >
            {iconComponent({ size: '2.5rem' })}
          </ServiceOptionIconWrapper>
          <h4>{text}</h4>
        </ServiceOption>
      </Col>
    ))

    const { cancel } = this.props

    return (
      <div>
        <h3>What kind of need to you have?</h3>
        <Row justify="center" align="middle" type="flex" gutter={5} style={{ margin: '2rem auto' }} >
          {serviceOptionItems}
        </Row>
        <Button size="large" type="primary" onClick={() => cancel()}>
          cancel
        </Button>
      </div>
    )
  }
}
