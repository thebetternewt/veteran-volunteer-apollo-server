import { Checkbox, Form, Input, Select } from 'antd'
import React, { useState } from 'react'

const Option = Select.Option
const { TextArea } = Input

const ageOptions = ['INFANT', 'TODDLER', 'CHILD', 'TEENAGER']

const HomeMaintenanceDetailsForm = ({
  form,
  needDetails,
  setServiceDetails,
}) => {
  const [indeterminate, setIndeterminate] = useState(false)
  const [checkAll, setCheckAll] = useState(false)

  const { setFieldsValue, getFieldDecorator } = form

  const onCheckAllChange = e => {
    if (e.target.checked) {
      setFieldsValue({ 'details.age': ageOptions })
    } else {
      setFieldsValue({ 'details.age': [] })
    }

    setIndeterminate(false)
    setCheckAll(e.target.checked)
  }

  const handleChecklistChange = checkedList => {
    setIndeterminate(
      !!checkedList.length && checkedList.length < ageOptions.length
    )
    setCheckAll(checkedList.length === ageOptions.length)
  }

  return (
    <>
      <Form.Item label="Ages">
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          Check all
        </Checkbox>

        <hr />

        {getFieldDecorator('details.maintenanceType', {
          preserve: true,
          initialValue: 'electrical',
          rules: [
            {
              message: 'Please choose at least one maintenance type.',
            },
          ],
        })(
          <Select
            style={{ width: 120 }}
            // onChange={handleChange}
          >
            <Option value="electrical">Electrical</Option>
            <Option value="plumbing">Plumbing</Option>
            <Option value="lightbulb">Lightbulb</Option>
            <Option value="other">Other</Option>
          </Select>
        )}
      </Form.Item>

      <Form.Item label="Notes">
        {getFieldDecorator('details.notes', {
          preserve: true,
          rules: [
            {
              required: true,
              type: 'string',
              message:
                'Please give a short description about your home maintenance need.',
            },
          ],
        })(<TextArea autosize />)}
      </Form.Item>
    </>
  )
}

export default HomeMaintenanceDetailsForm
