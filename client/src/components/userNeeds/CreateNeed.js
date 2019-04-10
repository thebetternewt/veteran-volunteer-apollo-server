import { navigate } from '@reach/router'
import { Button, Form } from 'antd'
import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_NEED } from '../../apollo/mutations'
import graphQlErrors from '../../util/graphqlErrors'
import PrivateRoute from '../common/PrivateRoute'
import StepOne from './forms/StepOne'
import StepThree from './forms/StepThree'
import StepTwo from './forms/StepTwo'
import Summary from './forms/Summary'

const CreateNeed = ({ form }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [needType, setNeedType] = useState()
  const [baseLocation, setBaseLocation] = useState()
  const [needDetails, setNeedDetails] = useState({})

  // TODO: Handle clearing state for fields associated with a specific need
  // when need type changes

  const { validateFields, getFieldValue } = form

  const handleSubmit = async (e, submit) => {
    e.preventDefault()

    await validateFields(async (errors, values) => {
      console.log('values:', values)
      if (!errors) {
        const needInput = {
          needType: needType && needType.toUpperCase(),
          title: getFieldValue('title'),
          date: getFieldValue('date').format(),
          notes: getFieldValue('notes'),
        }

        console.log(needInput)

        if (baseLocation) {
          needInput.location = {
            address: baseLocation.address,
            lat: baseLocation.location.y,
            lng: baseLocation.location.x,
          }
        }

        // Transform Travel location variables
        switch (needType) {
          case 'Travel':
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
          case 'Childcare':
            needInput.childcareNeedDetails = form.getFieldValue('details')
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
    },
    {
      title: 'Need Details',
      component: (
        <StepTwo
          form={form}
          nextStep={goToNextStep}
          baseLocation={baseLocation}
          setBaseLocation={setBaseLocation}
        />
      ),
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
        />
      ),
    },
    {
      title: 'Summary',
      component: <Summary form={form} nextStep={goToNextStep} />,
    },
  ]

  return (
    <>
      <h3>Request Need</h3>
      <Mutation mutation={CREATE_NEED}>
        {(createRequest, { loading, error }) => {
          return (
            <Form
              onSubmit={e => handleSubmit(e, createRequest)}
              style={{ maxWidth: 500 }}
            >
              {steps[currentStep].component}
              <Form.Item>{error && graphQlErrors(error)}</Form.Item>
              <Form.Item>
                {currentStep > 0 && (
                  <Button
                    type="primary"
                    icon="left-circle"
                    onClick={goToPrevStep}
                  >
                    Prev
                  </Button>
                )}
                {currentStep === steps.length - 1 && (
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{ marginRight: '2rem' }}
                  >
                    Request Need
                  </Button>
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
