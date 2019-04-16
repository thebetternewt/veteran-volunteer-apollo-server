import { DatePicker, Form, Input, Checkbox } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import PlaceSearchField from '../../../common/forms/PlaceSearchField'

const BaseNeedForm = props => {
  const [atHome, setAtHome] = useState(false)
  const { form, setBaseLocation } = props
  const { getFieldDecorator } = form

  const disabledDate = current => {
    // Can not select days before today
    return current < moment().endOf('day')
  }

  return (
    <>
      <h2>General Details</h2>
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

      <Form.Item>
        <p style={{ margin: '1rem 0 0' }}>
          <Checkbox checked={atHome} onChange={() => setAtHome(!atHome)} /> This
          need is at my home address.
        </p>

        {!atHome && (
          <PlaceSearchField
            form={form}
            fieldname="baseLocation"
            label="Where are you located?"
            setLocationState={location => setBaseLocation(location)}
            atHome={atHome}
          />
        )}
      </Form.Item>
    </>
  )
}

export default BaseNeedForm
