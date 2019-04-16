import { navigate } from '@reach/router'
import { Button, Form } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'
import { CREATE_NEED } from '../../apollo/mutations'
import graphQlErrors from '../../util/graphqlErrors'
import PrivateRoute from '../common/PrivateRoute'
import StepOne from './forms/steps/StepOne'
import StepThree from './forms/steps/StepThree'
import StepTwo from './forms/steps/StepTwo'
import Summary from './forms/steps/Summary'

const Muted = styled.span`
  opacity: 0.5;
`

const CreateNeed = ({ form }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [needType, setNeedType] = useState()
  const [baseLocation, setBaseLocation] = useState()
  const [needDetails, setNeedDetails] = useState({})
  const [hasErrors, setHasErrors] = useState(false)

  // TODO: Handle clearing state for fields associated with a specific need
  // when need type changes

  const { validateFields, getFieldValue, setFieldsValue } = form

  // Check specified field for errors and reset state for any absent
  // location values.
  const checkFieldsForErrors = fieldnames => {
    let errorExists = false

    if (!baseLocation) {
      setFieldsValue({ baseLocation: null })
    }

    validateFields(fieldnames, {}, errors => {
      console.log('errors:', errors)
      errorExists = !!errors
    })

    return errorExists
  }

  const handleSubmit = async (e, submit) => {
    e.preventDefault()

    await validateFields(async (errors, values) => {
      console.log('values:', values)
      if (!errors) {
        const needInput = {
          needType: needType.value,
          title: getFieldValue('title'),
          date: getFieldValue('date').format(),
          notes: getFieldValue('notes'),
        }

        console.log(needInput)

        console.log('baselocation:', baseLocation)

        if (baseLocation) {
          needInput.location = {
            address: baseLocation.address,
            lat: baseLocation.location.y,
            lng: baseLocation.location.x,
          }
        }

        switch (needType.value) {
          // Transform Travel location variables
          case 'TRAVEL':
            needInput.travelNeedDetails = {
              ...needDetails,
              fromLocation: {
                address: baseLocation.address,
                lat: baseLocation.location.y,
                lng: baseLocation.location.x,
              },
              toLocation: {
                address: needDetails.toLocation.address,
                lat: needDetails.toLocation.location.y,
                lng: needDetails.toLocation.location.x,
              },
            }
            break
          case 'CHILDCARE':
            needInput.childcareNeedDetails = form.getFieldValue('details')
            break
          case 'HOME_MAINTENANCE':
            needInput.homeMaintenanceNeedDetails = form.getFieldValue('details')
            break
          case 'OTHER':
            console.log('OTHER!')
            console.log(form.getFieldValue('details'))
            needInput.otherNeedDetails = form.getFieldValue('details')
            break
          default:
            break
        }

        try {
          await submit({
            variables: needInput,
            refetchQueries: ['Me'],
          })
          navigate('/dashboard')
        } catch (err) {
          console.error(err)
        }
      }
      window.scrollTo(0, 0)
    })
  }

  // TODO: Tie into browser routing
  const goToNextStep = () => setCurrentStep(currentStep + 1)

  const goToPrevStep = () => setCurrentStep(currentStep - 1)

  const steps = [
    {
      title: 'Select Need Type',
      component: (
        <StepOne
          form={form}
          setNeedType={setNeedType}
          selectedNeedType={needType}
          nextStep={goToNextStep}
        />
      ),
      errorFields: [],
    },
    {
      title: 'Need Details',
      component: (
        <StepTwo
          form={form}
          nextStep={goToNextStep}
          baseLocation={baseLocation}
          setBaseLocation={setBaseLocation}
          setHasErrors={setHasErrors}
        />
      ),
      errorFields: ['title', 'date', 'baseLocation'],
    },
    {
      title: 'Need Type Details',
      component: (
        <StepThree
          form={form}
          nextStep={goToNextStep}
          needType={needType}
          needDetails={needDetails}
          setNeedDetails={setNeedDetails}
          setHasErrors={setHasErrors}
        />
      ),
      errorFields: ['details'],
    },
    {
      title: 'Summary',
      component: (
        <Summary
          form={form}
          nextStep={goToNextStep}
          location={baseLocation}
          needType={needType}
        />
      ),
      errorFields: [],
    },
  ]

  return (
    <>
      <h3>
        Request Need{' '}
        <Muted>
          (step {currentStep + 1}/{steps.length})
        </Muted>{' '}
      </h3>
      <Mutation mutation={CREATE_NEED}>
        {(createNeed, { loading, error }) => {
          return (
            <Form
              onSubmit={e => handleSubmit(e, createNeed)}
              style={{ maxWidth: 500 }}
            >
              {steps[currentStep].component}
              <Form.Item>{error && graphQlErrors(error)}</Form.Item>
              <Form.Item style={{ display: 'flex' }}>
                {currentStep > 0 && (
                  <Button
                    type="primary"
                    icon="left-circle"
                    onClick={goToPrevStep}
                  >
                    Prev
                  </Button>
                )}
                {currentStep === steps.length - 1 ? (
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{ marginRight: '2rem' }}
                  >
                    Request Need
                  </Button>
                ) : (
                  <>
                    {currentStep > 0 && (
                      <Button
                        type="primary"
                        icon="right-circle"
                        style={{ margin: '0 2rem' }}
                        onClick={() => {
                          if (
                            !checkFieldsForErrors(
                              steps[currentStep].errorFields
                            )
                          )
                            goToNextStep()
                        }}
                      >
                        Next
                      </Button>
                    )}
                  </>
                )}
                <Button
                  type="secondary"
                  disabled={loading}
                  onClick={() => navigate('/app')}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          )
        }}
      </Mutation>
    </>
  )
}

export default () => (
  <PrivateRoute component={Form.create({ name: 'createNeed' })(CreateNeed)} />
)
