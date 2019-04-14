import { Button, Form } from 'antd'
import React from 'react'
import ChildcareDetailsForm from './ChildcareDetails'
import TravelDetailsForm from './TravelDetails'
import HomeMaintenanceDetailsForm from './HomeMaintenanceDetails'

const NeedDetailsForm = props => {
  const { nextStep, form, needDetails, setNeedDetails } = props

  const { validateFields, getFieldValue, setFieldsValue } = form

  const checkFieldsForErrors = fieldnames => {
    let errorExists = false

    if (!needDetails.toLocation) {
      setFieldsValue({ 'details.toLocation': null })
    }

    validateFields(fieldnames, {}, errors => {
      console.log('errors:', errors)
      errorExists = !!errors
    })

    return errorExists
  }

  let needDetailsFields = null
  switch (getFieldValue('needType')) {
    case 'Travel':
      needDetailsFields = (
        <TravelDetailsForm
          form={form}
          needDetails={needDetails}
          setNeedDetails={setNeedDetails}
        />
      )
      break
    case 'Childcare':
      needDetailsFields = (
        <ChildcareDetailsForm
          form={form}
          needDetails={needDetails}
          setNeedDetails={setNeedDetails}
        />
      )
      break
    case 'HomeMaintenance':
      needDetailsFields = (
        <HomeMaintenanceDetailsForm
          form={form}
          needDetails={needDetails}
          setNeedDetails={setNeedDetails}
        />
      )
      break
    default:
      break
  }

  return (
    <>
      {needDetailsFields}
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

export default NeedDetailsForm
