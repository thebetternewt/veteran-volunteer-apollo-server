import { Button, Form, Radio, Select } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import BaseServiceForm from './forms/BaseServiceForm'
import TravelForm from './forms/Travel'
import { navigate } from 'gatsby'
import ServiceDetailsForm from './forms/ServiceDetailsForm'
import Summary from './forms/Summary'

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
  const [serviceType, setServiceType] = useState(null)

  const [baseLocation, setBaseLocation] = useState(null)

  // TODO: Handle clearing state for fields associated with a specific service
  // when service type changes

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
    console.log('FORM VALUES:', getFieldsValue())
    console.log('STATE [baseLocation]:', baseLocation)
    setStep(step + 1)
  }

  const goToPrevStep = () => setStep(step - 1)

  const setButtonType = selection => {
    if (!serviceType || selection === serviceType) {
      return 'primary'
    }

    // if (!serviceType) return 'primary'

    // if (selection === serviceType) {
    //   return 'primary'
    // }

    return 'default'
  }

  // let serviceDetailsStepContent = null
  // switch (serviceType) {
  //   case 'Travel':
  //     serviceDetailsStepContent = <TravelForm form={form} />
  //     break
  //   default:
  //     break
  // }

  let content
  switch (step) {
    case 1:
      content = (
        <>
          <h2>Select Service Type</h2>
          {getFieldDecorator('serviceType', { preserve: true })(
            <ServiceTypeOptionsWrapper>
              {serviceTypes.map(type => (
                <Button
                  key={type.name}
                  type={setButtonType(type.name)}
                  icon={type.icon}
                  size="large"
                  // ghost={setButtonType(type.name) === 'primary'}
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
      content = (
        <BaseServiceForm
          form={form}
          nextStep={goToNextStep}
          setBaseLocation={setBaseLocation}
        />
      )
      break
    case 3:
      content = <ServiceDetailsForm form={form} nextStep={goToNextStep} />
      break
    case 4:
      content = <Summary form={form} />
      break

    default:
      break
  }

  console.log(step, serviceType)

  return (
    <>
      <h3>Request Service</h3>
      <Form onSubmit={handleSubmit}>
        {content}
        <Form.Item>
          {step > 1 && (
            <Button type="primary" icon="left-circle" onClick={goToPrevStep}>
              Back
            </Button>
          )}
          {step === 4 && (
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
