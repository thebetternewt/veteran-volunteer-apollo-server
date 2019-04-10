import { Button } from 'antd';
import React from 'react';
import styled from 'styled-components';

const needTypes = [
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

const NeedTypeOptionsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;

  button {
    margin: 0 15px 15px 0;
  }
`

const StepOne = ({ form, setNeedType, selectedNeedType, nextStep }) => {
  const { getFieldDecorator, setFieldsValue } = form

  const setButtonType = selection => {
    if (!selectedNeedType || selection === selectedNeedType) {
      return 'primary'
    }

    return 'default'
  }

  return (
    <>
      <h2>Select Need Type</h2>
      {getFieldDecorator('needType', { preserve: true })(
        <NeedTypeOptionsWrapper>
          {needTypes.map(type => (
            <Button
              key={type.name}
              type={setButtonType(type.name)}
              icon={type.icon}
              size="large"
              // ghost={setButtonType(type.name) === 'primary'}
              onClick={() => {
                setFieldsValue({ needType: type.name })
                setNeedType(type.name)
                nextStep()
              }}
            >
              {type.name}
            </Button>
          ))}
        </NeedTypeOptionsWrapper>
      )}
    </>
  )
}

export default StepOne
