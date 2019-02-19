import { Button, Col, Row } from 'antd'
import React, { Component } from 'react'
import styled from 'styled-components'
// import { Button } from './ui/buttons'
import CreateNeed from './createNeed'
import CreateVolunteerProfile from './createVolunteerProfile'

const RegisterOption = styled(Col)`
  p {
    text-align: center;
    margin: 0 0 2rem;
  }
  h2 {
    text-align: center;
    margin: 0;
  }
`

export default class HomeSignup extends Component {
  state = {
    startedNeed: false,
    startedVolunteerProfile: false,
  }

  handleStartNeed = () => this.setState({ startedNeed: true })
  handleStartVolunteerProfile = () =>
    this.setState({ startedVolunteerProfile: true })
  handleCancel = () =>
    this.setState({ startedNeed: false, startedVolunteerProfile: false })

  render() {
    const { startedNeed, startedVolunteerProfile } = this.state

    let content = (
      <>
        <RegisterOption
          xs={{ span: 24, offset: 0 }}
          sm={{ span: 12 }}
          align="center"
        >
          <p>Looking for services?</p>
          <Button
            type="primary"
            size="large"
            shape="round"
            onClick={this.handleStartNeed}
          >
            Post a need
          </Button>
        </RegisterOption>
        <RegisterOption xs={{ span: 24, offset: 0 }} sm={12} align="center">
          <p>Looking to help out?</p>
          <Button
            type="primary"
            size="large"
            shape="round"
            onClick={this.handleStartVolunteerProfile}
          >
            Volunteer
          </Button>
        </RegisterOption>
      </>
    )

    if (startedNeed) {
      content = <CreateNeed cancel={this.handleCancel} />
    }

    if (startedVolunteerProfile) {
      content = <CreateVolunteerProfile cancel={this.handleCancel} />
    }

    return (
      <Row
        align="middle"
        style={{
          borderRadius: 10,
          padding: '2rem',
          backgroundColor: '#fff',
          maxWidth: 900,
          margin: 'auto',
        }}
      >
        {content}
      </Row>
    )
  }
}
