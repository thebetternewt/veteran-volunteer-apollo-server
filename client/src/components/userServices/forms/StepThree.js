import { Button, Form } from 'antd';
import React from 'react';
import ChildcareDetailsForm from './ChildcareDetails';
import TravelDetailsForm from './TravelDetails';

const ServiceDetailsForm = props => {
  const {
    nextStep,
    form,
    serviceDetails,
    setServiceDetails,
  } = props

  const {
    validateFields,
    getFieldValue,
    setFieldsValue,
  } = form

  const checkFieldsForErrors = fieldnames => {
    console.log(fieldnames)
    let errorExists = false

    if (!serviceDetails.toLocation) {
      setFieldsValue({ 'details.toLocation': null })
    }

    validateFields(fieldnames, {}, errors => {
      console.log('errors:', errors)
      errorExists = !!errors
    })

    return errorExists
  }

  let serviceDetailsFields = null
  switch (getFieldValue('serviceType')) {
    case 'Travel':
      serviceDetailsFields = (
        <TravelDetailsForm
          form={form}
          serviceDetails={serviceDetails}
          setServiceDetails={setServiceDetails}
        />
      )
      break
    case 'Childcare':
      serviceDetailsFields = (
        <ChildcareDetailsForm
          form={form}
          serviceDetails={serviceDetails}
          setServiceDetails={setServiceDetails}
        />
      )
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
            if (!checkFieldsForErrors(['details'])) nextStep()
          }}
        >
          Next
        </Button>
      </Form.Item>
    </>
  )
}

export default ServiceDetailsForm
