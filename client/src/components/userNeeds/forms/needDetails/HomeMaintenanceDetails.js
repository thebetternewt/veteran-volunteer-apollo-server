import { Form, Input, Select } from 'antd'
import React from 'react'

const Option = Select.Option
const { TextArea } = Input

const HomeMaintenanceDetailsForm = ({ form }) => {
  const { getFieldDecorator } = form

  return (
    <>
      <Form.Item label="Select what type of maintenance you require:">
        {getFieldDecorator('details.maintenanceType', {
          preserve: true,
          rules: [
            {
              required: true,
              message: 'Please choose at least one maintenance type.',
            },
          ],
        })(
          <Select style={{ width: 200 }}>
            <Option value="electrical">Electrical</Option>
            <Option value="plumbing">Plumbing</Option>
            <Option value="small-job">Small Job</Option>
            <Option value="cleaning">Cleaning</Option>
            <Option value="wood-construction">Woodwork/Construction</Option>
            <Option value="other">Other</Option>
          </Select>
        )}
      </Form.Item>

      <Form.Item label="Describe your need in detail.">
        {getFieldDecorator('details.notes', {
          preserve: true,
          validateTrigger: 'onBlur',
          rules: [
            {
              required: true,
              type: 'string',
              min: 10,
              message: 'Must be at least 10 characters.',
            },
          ],
        })(<TextArea autosize />)}
      </Form.Item>
    </>
  )
}

export default HomeMaintenanceDetailsForm
