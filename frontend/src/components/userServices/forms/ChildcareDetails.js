import { Checkbox, Form } from 'antd'
import React, { useState } from 'react'

const CheckboxGroup = Checkbox.Group

const ageOptions = ['INFANT', 'TODDLER', 'CHILD', 'TEENAGER']

const ChildcareDetailsForm = ({ form, serviceDetails, setServiceDetails }) => {
  const [indeterminate, setIndeterminate] = useState(false)
  const [checkAll, setCheckAll] = useState(false)
  const [checkedList, setCheckedList] = useState([])

  const { setFieldsValue, getFieldDecorator, getFieldsError } = form

  const onCheckAllChange = e => {
    if (e.target.checked) {
      setFieldsValue({ ages: ageOptions })
    } else {
      setFieldsValue({ ages: [] })
    }

    setIndeterminate(false)
    setCheckAll(e.target.checked)
  }

  const handleChecklistChange = checkedList => {
    setCheckedList(checkedList)
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
          required: true,
          rules: [
            {
              required: true,
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
    </>
  )
}

export default ChildcareDetailsForm
