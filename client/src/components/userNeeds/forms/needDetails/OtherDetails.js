import { Form, Input } from 'antd'
import React from 'react'

const { TextArea } = Input

const OtherDetailsForm = ({ form }) => {
  const { getFieldDecorator } = form

  return (
    <>
      <Form.Item label="Describe your need in detail.">
        {getFieldDecorator('details.description', {
          preserve: true,
          validateTrigger: 'onBlur',
          rules: [
            {
              required: true,
              type: 'string',
              min: 30,
              message: 'Must be at least 30 characters.',
            },
          ],
        })(<TextArea autosize />)}
      </Form.Item>
    </>
  )
}

export default OtherDetailsForm
