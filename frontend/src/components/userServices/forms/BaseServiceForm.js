import { Button, Form, Input } from 'antd'
import React from 'react'
import PlaceSearchField from '../../common/forms/PlaceSearchField'

const BaseServiceForm = props => {
  const { nextStep, form, setBaseLocation } = props
  const { getFieldDecorator, getFieldsError, validateFields } = form

  const checkForErrors = async () => {
    const err = await validateFields(errors => {
      console.log('errors:', errors)
      return errors
    })

    return !!err
  }

  return (
    <>
      {/* <Form.Item>{error && graphQlErrors(error)}</Form.Item> */}

      <Form.Item
        label="Title"
        help="Enter a descriptive title for your request."
      >
        {getFieldDecorator('title', {
          preserve: true,
          rules: [
            {
              required: true,
              message: 'Please enter a title.',
            },
          ],
        })(<Input />)}
      </Form.Item>

      {/* TODO: ADD DATE!!! */}

      {/* TODO: Set selected location in parent form */}
      <PlaceSearchField
        form={form}
        fieldname="baseLocation"
        label="Where are you located?"
        setLocationState={location => setBaseLocation(location)}
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

export default BaseServiceForm
