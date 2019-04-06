import { Button } from 'antd'
import React from 'react'
import styled from 'styled-components'

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

const StepOne = ({ form, setServiceType, selectedServiceType, nextStep }) => {
  const { getFieldDecorator, setFieldsValue } = form

  const setButtonType = selection => {
    if (!selectedServiceType || selection === selectedServiceType) {
      return 'primary'
    }

    return 'default'
  }

  return (
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
                nextStep()
              }}
            >
              {type.name}
            </Button>
          ))}
        </ServiceTypeOptionsWrapper>
      )}
    </>
  )
}

export default StepOne
