import { Button, Form } from 'antd'
import React, { useState } from 'react'
import TravelForm from './Travel'

const ServiceDetailsForm = props => {
  const [fromLocation, setFromLocation] = useState(null)
  const [toLocation, setToLocation] = useState(null)

  const { nextStep, form } = props
  const { getFieldDecorator, getFieldsError, validateFields } = form

  const checkForErrors = async () => {
    const err = await validateFields(errors => {
      console.log('errors:', errors)
      return errors
    })

    return !!err
  }

  let serviceDetailsFields = null
  switch (form.getFieldValue('serviceType')) {
    case 'Travel':
      serviceDetailsFields = <TravelForm form={form} />
      break
    default:
      break
  }

  return (
    <>
      {serviceDetailsFields}
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

export default ServiceDetailsForm
