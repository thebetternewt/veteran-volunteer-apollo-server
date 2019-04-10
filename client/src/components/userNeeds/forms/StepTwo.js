import { Button, DatePicker, Form, Input } from 'antd';
import moment from 'moment';
import React from 'react';
import PlaceSearchField from '../../common/forms/PlaceSearchField';

const BaseNeedForm = props => {
  const { nextStep, form, baseLocation, setBaseLocation } = props
  const { getFieldDecorator, validateFields, setFieldsValue } = form

  const disabledDate = current => {
    // Can not select days before today
    return current < moment().endOf('day')
  }

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

      <Form.Item label="When do you need help?" help="Select a date and time.">
        {getFieldDecorator('date', {
          preserve: true,
          rules: [
            { required: true, message: 'Please choose a date and time.' },
          ],
        })(
          <DatePicker
            showTime={{ use12Hours: true, format: 'h:mm a', minuteStep: 15 }}
            placeholder="Select Date & Time"
            format="LLL"
            style={{ width: '100%' }}
            showToday={false}
            disabledDate={disabledDate}
          />
        )}
      </Form.Item>

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
            if (!checkFieldsForErrors(['title', 'date', 'baseLocation']))
              nextStep()
          }}
        >
          Next
        </Button>
      </Form.Item>
    </>
  )
}

export default BaseNeedForm
