import { Button } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { needTypes } from '../../../../constants'

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
    if (!selectedNeedType || selection === selectedNeedType.value) {
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
              key={type.value}
              type={setButtonType(type.value)}
              icon={type.icon}
              size="large"
              onClick={() => {
                setFieldsValue({ needType: type.value })
                setNeedType(type)
                nextStep()
              }}
            >
              {type.label}
            </Button>
          ))}
        </NeedTypeOptionsWrapper>
      )}
    </>
  )
}

export default StepOne
