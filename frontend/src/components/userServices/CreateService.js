import { Button, Form } from 'antd'
import { navigate } from 'gatsby'
import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_SERVICE } from '../../apollo/mutations'
import graphQlErrors from '../../util/graphqlErrors'
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
      console.log('errors:', errors)
      // console.log('values:', values)

      console.log('toLocation before vars:', serviceDetails.toLocation)

      if (!errors) {
        const variables = {
          serviceType: serviceType && serviceType.toUpperCase(),
          title: getFieldValue('title'),
          date: getFieldValue('date').format(),
          notes: getFieldValue('notes'),
        }

        if (baseLocation) {
          variables.location = {
            lat: baseLocation.location.y,
            lng: baseLocation.location.x,
          }
        }

        // Transform Travel location variables
        switch (serviceType) {
          case 'Travel':
            variables.travelServiceDetails = {
              ...serviceDetails,
              fromName: baseLocation.address,
              fromLocation: {
                lat: baseLocation.location.y,
                lng: baseLocation.location.x,
              },
              toName: serviceDetails.toLocation.address,
              toLocation: {
                lat: serviceDetails.toLocation.location.y,
                lng: serviceDetails.toLocation.location.x,
              },
            }
            break
          case 'Childcare':
            variables.childcareServiceDetails = form.getFieldValue('details')
            break
          default:
            break
        }

        console.log(variables)
        try {
          await submit({ variables, refetchQueries: ['Me'] })
          navigate('/app')
        } catch (err) {
          console.error(err)
        }
      }
      window.scrollTo(0, 0)
    })
  }

  // TODO: Tie into browser routing
  const goToNextStep = () => {
    console.log('')
    console.log('')
    console.log('FORM VALUES:', form.getFieldsValue())
    console.log('STATE [baseLocation]:', baseLocation)
    console.log('STATE [serviceType]:', serviceType)
    console.log('STATE [serviceDetails]:', serviceDetails)
    setCurrentStep(currentStep + 1)
  }

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
      <Mutation mutation={CREATE_SERVICE}>
        {(createService, { loading, error }) => {
          return (
            <Form onSubmit={e => handleSubmit(e, createService)}>
              {steps[currentStep].component}
              <Form.Item>{error && graphQlErrors(error)}</Form.Item>
              <Form.Item>
                {currentStep > 1 && (
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

export default Form.create({ name: 'createService' })(CreateService)
