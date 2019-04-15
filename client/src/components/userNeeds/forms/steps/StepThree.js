import { Button, Form } from 'antd'
import React from 'react'
import NeedDetails from '../needDetails/NeedDetails'

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

  return (
    <>
      <NeedDetails
        form={form}
        needType={getFieldValue('needType')}
        needDetails={needDetails}
        setNeedDetails={setNeedDetails}
      />
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
