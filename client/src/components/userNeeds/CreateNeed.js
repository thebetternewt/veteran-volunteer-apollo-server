import { navigate } from '@reach/router'
import { Button, Form } from 'antd'
import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_REQUEST } from '../../apollo/mutations'
import graphQlErrors from '../../util/graphqlErrors'
import PrivateRoute from '../common/PrivateRoute'
import StepOne from './forms/StepOne'
import StepThree from './forms/StepThree'
import StepTwo from './forms/StepTwo'
import Summary from './forms/Summary'

const CreateService = ({ form }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [serviceType, setServiceType] = useState()
  const [baseLocation, setBaseLocation] = useState()
  const [serviceDetails, setServiceDetails] = useState({})

  // TODO: Handle clearing state for fields associated with a specific service
  // when service type changes

  const { validateFields, getFieldValue } = form

  const handleSubmit = async (e, submit) => {
    e.preventDefault()

    await validateFields(async (errors, values) => {
      if (!errors) {
        const serviceInput = {
          serviceType: serviceType && serviceType.toUpperCase(),
          title: getFieldValue('title'),
          date: getFieldValue('date').format(),
          notes: getFieldValue('notes'),
        }

        if (baseLocation) {
          serviceInput.location = {
            address: baseLocation.address,
            lat: baseLocation.location.y,
            lng: baseLocation.location.x,
          }
        }

        // Transform Travel location variables
        switch (serviceType) {
          case 'Travel':
            serviceInput.travelServiceDetails = {
              ...serviceDetails,
              fromLocation: {
                address: baseLocation.address,
                lat: baseLocation.location.y,
                lng: baseLocation.location.x,
              },
              toLocation: {
                address: serviceDetails.toLocation.address,
                lat: serviceDetails.toLocation.location.y,
                lng: serviceDetails.toLocation.location.x,
              },
            }
            break
          case 'Childcare':
            serviceInput.childcareServiceDetails = form.getFieldValue('details')
            break
          default:
            break
        }

        try {
          await submit({
            variables: { service: serviceInput },
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
      title: 'Select Service Type',
      component: (
        <StepOne
          form={form}
          setServiceType={setServiceType}
          selectedServiceType={serviceType}
          nextStep={goToNextStep}
        />
      ),
    },
    {
      title: 'Service Details',
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
      title: 'Service Type Details',
      component: (
        <StepThree
          form={form}
          nextStep={goToNextStep}
          serviceType={serviceType}
          serviceDetails={serviceDetails}
          setServiceDetails={setServiceDetails}
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
      <h3>Request Service</h3>
      <Mutation mutation={CREATE_REQUEST}>
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
                    Request Service
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
  <PrivateRoute
    component={Form.create({ name: 'createService' })(CreateService)}
  />
)
