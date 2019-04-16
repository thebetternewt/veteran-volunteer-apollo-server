import { Checkbox, Form, Input } from 'antd'
import React, { useState } from 'react'

const CheckboxGroup = Checkbox.Group
const { TextArea } = Input

const ageOptions = ['INFANT', 'TODDLER', 'CHILD', 'TEENAGER']

const ChildcareDetailsForm = ({ form }) => {
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

        {getFieldDecorator('details.age', {
          preserve: true,
          rules: [
            {
              validator: (rule, value, cb) =>
                value.length > 0 ? cb() : cb(true),
              type: 'array',
              message: 'Please choose at least one age.',
            },
          ],
        })(
          <CheckboxGroup
            options={ageOptions}
            onChange={handleChecklistChange}
          />
        )}
      </Form.Item>

      <Form.Item label="Describe your need in detail.">
        {getFieldDecorator('details.description', {
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

export default ChildcareDetailsForm
