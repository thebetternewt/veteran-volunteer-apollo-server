import React from 'react'
import PlaceSearchField from '../../../common/forms/PlaceSearchField'
import { Form, Input } from 'antd'

const { TextArea } = Input

const TravelDetailsForm = ({ form, needDetails, setNeedDetails }) => (
  <>
    <PlaceSearchField
      form={form}
      fieldname="details.toLocation"
      label="Where are you going?"
      setLocationState={location =>
        setNeedDetails({ ...needDetails, toLocation: location })
      }
    />
    <Form.Item label="Describe your need in detail.">
      {form.getFieldDecorator('details.description', {
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

export default TravelDetailsForm
