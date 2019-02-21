import { Button, Form, Radio, Select } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import BaseServiceForm from './forms/BaseServiceForm'
import TravelForm from './forms/travel'
import { navigate } from 'gatsby'

const serviceTypes = [
  {
    name: 'Travel',
    icon: 'car',
  },
  {
    name: 'Childcare',
    icon: 'smile',
  },
  {
    name: 'Lawncare',
    icon: 'home',
  },
]

const ServiceTypeOptionsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;

  button {
    margin: 0 15px 15px 0;
  }
`

const CreateService = ({ form }) => {
  const [step, setStep] = useState(1)
  const [serviceType, setServiceType] = useState()

  const { getFieldDecorator, setFieldsValue, getFieldsValue } = form

  const handleSubmit = async e => {
    e.preventDefault()

    const { validateFields } = this.props.form

    await validateFields(async (errors, values) => {
      console.log('errors:', errors)
      console.log('values:', values)
      const { selectedLocation } = this.state
      // if (!errors) {

      //   console.log(variables)
      //   try {
      //     await submit({ variables, refetchQueries: ['Me'] })
      //     this.props.toggleForm()
      //   } catch (err) {
      //     console.error(err)
      //   }
      // }
      window.scrollTo(0, 0)
    })
  }

  // TODO: Tie into browser routing
  const goToNextStep = () => {
    console.log(getFieldsValue())
    setStep(step + 1)
  }
  const goToPrevStep = () => setStep(step - 1)

  let serviceDetailsStepContent = null
  switch (serviceType) {
    case 'Travel':
      serviceDetailsStepContent = <TravelForm form={form} />
      break
    default:
      break
  }

  let content
  switch (step) {
    case 1:
      content = (
        <>
          <h2>Select Service Type</h2>
          {getFieldDecorator('serviceType')(
            <ServiceTypeOptionsWrapper>
              {serviceTypes.map(type => (
                <Button
                  key={type.name}
                  type="primary"
                  icon={type.icon}
                  size="large"
                  ghost
                  onClick={() => {
                    setFieldsValue({ serviceType: type.name })
                    setServiceType(type.name)
                    goToNextStep()
                  }}
                >
                  {type.name}
                </Button>
              ))}
            </ServiceTypeOptionsWrapper>
          )}
        </>
      )
      break
    case 2:
      content = <BaseServiceForm form={form} nextStep={goToNextStep} />
      break
    case 3:
      content = serviceDetailsStepContent
      break

    default:
      break
  }

  console.log(step, serviceType)

  return (
    <>
      <h3>Request Service</h3>
      <Form>
        {content}
        <Form.Item>
          {step > 1 && (
            <Button type="primary" icon="left-circle" onClick={goToPrevStep}>
              Back
            </Button>
          )}
          {step === 3 && (
            <Button
              type="primary"
              htmlType="submit"
              // disabled={hasErrors(getFieldsError())}
              // loading={loading}
              style={{ marginRight: '2rem' }}
            >
              Request Service
            </Button>
          )}
          <Button type="secondary" onClick={() => navigate('/app')}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default Form.create({ name: 'createService' })(CreateService)
