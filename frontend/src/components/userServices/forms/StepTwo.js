import { Button, Form, Input } from 'antd'
import React from 'react'
import PlaceSearchField from '../../common/forms/PlaceSearchField'

const BaseServiceForm = props => {
  const { nextStep, form, baseLocation, setBaseLocation } = props
  const {
    getFieldDecorator,
    getFieldsError,
    validateFields,
    setFieldsValue,
  } = form

  // Check specified field for errors and reset state for any absent
  // location values.
  const checkFieldsForErrors = fieldnames => {
    let errorExists = false

    if (!baseLocation) {
      setFieldsValue({ baseLocation: null })
    }

    validateFields(fieldnames, {}, errors => {
      console.log('errors:', errors)
      errorExists = !!errors
    })

    return errorExists
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
            if (!checkFieldsForErrors(['title', 'baseLocation'])) nextStep()
          }}
        >
          Next
        </Button>
      </Form.Item>
    </>
  )
}

export default BaseServiceForm
