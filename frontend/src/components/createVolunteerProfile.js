import React, { Component } from 'react'
import { Button } from 'antd'

export default class CreateVolunteerProfile extends Component {
  render() {
    const { cancel } = this.props
    return (
      <div>
        <h3>Create your profile</h3>
        <Button size="large" type="primary" onClick={() => cancel()}>
          cancel
        </Button>
      </div>
    )
  }
}
