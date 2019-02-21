import { Button, Form, Input } from 'antd'
import React, { Component } from 'react'
import PlaceSearchField from '../../common/forms/PlaceSearchField'

class BaseServiceForm extends Component {
  state = {
    disableNext: true,
  }

  checkForErrors = async () => {
    const { validateFields } = this.props.form

    const err = await validateFields(errors => {
      console.log('errors:', errors)
      return errors
    })

    return !!err
  }

  render() {
    const { nextStep, form } = this.props
    const { getFieldDecorator, getFieldsError, validateFields } = form
    const { disableNext } = this.state

    return (
      <>
        {/* <Form.Item>{error && graphQlErrors(error)}</Form.Item> */}

        <Form.Item
          label="Title"
          help="Enter a descriptive title for your request."
        >
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: 'Please enter a title.',
              },
            ],
          })(<Input />)}
        </Form.Item>

        {/* TODO: Set selected location in parent form */}
        <PlaceSearchField
          form={form}
          fieldname="baseLocation"
          label="Where are you located?"
        />

        <Form.Item>
          <Button
            type="primary"
            style={{ marginRight: '2rem' }}
            onClick={() => {
              // if (!this.checkForErrors())
              nextStep()
            }}
          >
            Next
          </Button>
        </Form.Item>
      </>
    )
  }
}

export default BaseServiceForm
