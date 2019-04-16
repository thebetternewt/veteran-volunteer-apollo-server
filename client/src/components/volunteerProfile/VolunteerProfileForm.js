import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Radio,
  TimePicker,
} from 'antd'
import React, { useState, useEffect } from 'react'
import { Mutation } from 'react-apollo'
import {
  CREATE_VOLUNTEER_PROFILE,
  UPDATE_VOLUNTEER_PROFILE,
} from '../../apollo/mutations'
import { availabilityOptions, needTypes } from '../../constants'
import graphQlErrors from '../../util/graphqlErrors'
import PlaceSearchField from '../common/forms/PlaceSearchField'
import styled from 'styled-components'

const { TextArea } = Input
const CheckboxGroup = Checkbox.Group
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const StyledForm = styled(Form)`
  label {
    font-weight: 600;
  }
`

function hasErrors(fieldsErrors) {
  return Object.keys(fieldsErrors).some(field => fieldsErrors[field])
}

const VolunteerProfileForm = props => {
  const [serviceLocation, setServiceLocation] = useState()
  const [selectedServiceOption, setSelectedServiceOption] = useState()

  const { profile, form, toggleForm } = props
  const { validateFields, getFieldValue } = form

  useEffect(() => {
    return setSelectedServiceOption(getFieldValue('servicesProvided')[0])
  }, [])

  console.log('Profile:', profile)

  const handleSubmit = async (e, submit) => {
    e.preventDefault()

    await validateFields(async (errors, values) => {
      if (!errors) {
        const variables = values
        variables.availability = {
          weekdays: values.availability.includes('WEEKDAYS'),
          weekends: values.availability.includes('WEEKENDS'),
          details: values.availabilityDetails,
        }
        variables.servicesProvided = values.servicesProvided.map(need =>
          need.replace(' ', '_').toUpperCase()
        )

        if (serviceLocation) {
          variables.serviceLocation = {
            address: serviceLocation.address,
            lat: serviceLocation.location.y,
            lng: serviceLocation.location.x,
          }
        }

        try {
          await submit({ variables, refetchQueries: ['Me'] })
          /**
           * Check if toggleForm exists before executing. In the case that
           * createProfile (not updateProfile) succeeds, the "Me" query
           * is refetched, causing the root component to re-render. At this
           * point, the toggleForm function no longer exists and throws an
           * error in the console. There may be a better way to handle this.
           */
          toggleForm && toggleForm()
        } catch (err) {
          console.error(err)
        }
        window.scrollTo(0, 0)
      }
    })
  }

  // const { profile, toggleForm, form } = this.props
  const { getFieldDecorator, getFieldsError } = form

  const initAvailability = () => {
    let availability = []
    if (profile) {
      if (profile.availability.weekdays) {
        availability.push('WEEKDAYS')
      }
      if (profile.availability.weekends) {
        availability.push('WEEKENDS')
      }
    }
    return availability
  }

  const initServicesProvided = () => {
    return needTypes
      .filter(type => profile && profile.servicesProvided.includes(type.value))
      .map(type => type.value)
  }

  const initServiceRadius = () => (profile ? profile.serviceRadius : 15)

  // const initSkills = () => {
  //   let skills = ''
  //   if (profile) {
  //     skills = profile.skills.join(', ')
  //   }
  //   return skills
  // }

  const showSelectedServiceOptionFields = selectedService => {
    console.log('selectedService', selectedService)
    switch (selectedService) {
      case 'TRAVEL':
        return (
          <Form.Item>
            <div>
              <strong>Can you provide a vehicle for transportation?</strong>{' '}
              <Checkbox style={{ marginLeft: 5 }}>Yes</Checkbox>
            </div>
            <div style={{ display: 'flex' }}>
              <strong>How many passengers can you carry?</strong>
              <Input type="number" style={{ margin: '0 5px', width: 80 }} />
            </div>
          </Form.Item>
        )
      case 'CHILDCARE':
        return (
          <Form.Item>
            <p style={{ margin: 0 }}>
              I am comfortable with the following age groups:
            </p>
            <CheckboxGroup
              options={['INFANT', 'TODDLER', 'CHILD', 'TEENAGER']}
              style={{ marginBottom: 20 }}
            />
            <div style={{ display: 'flex' }}>
              <div style={{ flexShrink: 0 }}>I am comfortable sitting</div>
              <Input style={{ margin: '0 5px', width: 50 }} />
              <div style={{ flexShrink: 0 }}>children at a time.</div>
            </div>
            <Checkbox>I can prep and serve a meal.</Checkbox>
          </Form.Item>
        )

      case 'LAWNCARE':
        return (
          <Form.Item>
            <Checkbox>I have my own equipment.</Checkbox>
            <p style={{ margin: 0 }}>
              I can provide the following types of lawncare:
            </p>
            <CheckboxGroup
              options={[
                'Mow lawn',
                'Trim shrubs',
                'Plant/weed garden',
                'Clean gutters',
                'Other',
              ]}
              style={{ marginBottom: 20 }}
            />
            <p style={{ margin: 0 }}>If "Other", please describe:</p>
            <TextArea autosize />
          </Form.Item>
        )

      case 'HOME_MAINTENANCE':
        return (
          <Form.Item>
            <Checkbox>I have my own equipment.</Checkbox>
            <p style={{ margin: 0 }}>
              I can provide the following types of maintenance:
            </p>
            <CheckboxGroup
              options={[
                'Electrical',
                'Plumbing',
                'Woodwork/construction',
                'Small jobs',
                'Cleaning',
                'Other',
              ]}
              style={{ marginBottom: 20 }}
            />
            <p style={{ margin: 0 }}>If "Other", please describe:</p>
            <TextArea autosize />
          </Form.Item>
        )

      case 'OTHER':
        return (
          <Form.Item>
            <p style={{ margin: 0 }}>
              Please describe the service you can provide:
            </p>
            <TextArea autosize />
          </Form.Item>
        )

      default:
        return null
    }
  }

  const profileForm = ({ error, loading, submit }) => (
    <StyledForm
      onSubmit={e => handleSubmit(e, submit)}
      style={{ maxWidth: 500 }}
    >
      <Form.Item>{error && graphQlErrors(error)}</Form.Item>

      <Form.Item label="Bio">
        {getFieldDecorator('bio', {
          initialValue: profile && profile.bio,
          rules: [
            {
              required: true,
              min: 100,
              max: 500,
              message:
                'Please enter a short description of yourself between 100 and 500 characters.',
            },
          ],
        })(<TextArea autosize />)}
      </Form.Item>

      <Form.Item label="Availability">
        <hr />
        {getFieldDecorator('availability', {
          initialValue: initAvailability(),
          rules: [
            {
              required: true,
              message: 'Please choose at least one availability option.',
            },
          ],
        })(
          <CheckboxGroup
            options={availabilityOptions.map(opt => ({
              label: opt.label,
              value: opt.value,
            }))}
          />
        )}
        <div>
          From:
          <TimePicker use12Hours format="h:mm A" style={{ margin: '0 5px' }} />
          To:
          <TimePicker use12Hours format="h:mm A" style={{ margin: '0 5px' }} />
        </div>
      </Form.Item>
      <Form.Item label="Details">
        {getFieldDecorator('availabilityDetails', {
          initialValue: profile && profile.availability.details,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="What types of services can you provide?">
        <hr />

        {getFieldDecorator('servicesProvided', {
          initialValue: initServicesProvided(),
          rules: [
            {
              required: true,
              message: 'Please choose at least one need type.',
            },
          ],
        })(
          <CheckboxGroup
            options={needTypes.map(opt => ({
              label: opt.label,
              value: opt.value,
            }))}
          />
        )}
      </Form.Item>

      {/* Need Type Fields  */}
      <Form.Item label="Details">
        <RadioGroup
          onChange={e => setSelectedServiceOption(e.target.value)}
          defaultValue={getFieldValue('servicesProvided')[0]}
        >
          {getFieldValue('servicesProvided').map(opt => (
            <RadioButton key={opt} value={opt}>
              {opt}
            </RadioButton>
          ))}
        </RadioGroup>
      </Form.Item>

      {showSelectedServiceOptionFields(selectedServiceOption)}

      {/* <Form.Item label="Skills">
        <p>
          In regard to these needs, what types of skills do you posess? (Enter
          values separated by commas, e.g. "Plumbing, Electrical".
        </p>
        {getFieldDecorator('skills', { initialValue: initSkills() })(<Input />)}
      </Form.Item> */}

      {
        <PlaceSearchField
          fieldname="serviceLocation"
          label="What area do you wish to serve? First choose a starting location, then enter a radius in miles."
          form={form}
          setLocationState={setServiceLocation}
          initialValue={profile && profile.serviceLocation}
        />
      }

      <Form.Item label="Service Radius (miles)">
        {getFieldDecorator('serviceRadius', {
          initialValue: initServiceRadius(),
        })(<InputNumber min={1} />)}
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={hasErrors(getFieldsError())}
          loading={loading}
          style={{ marginRight: '2rem' }}
        >
          {profile ? 'Update Profile' : 'Create Profile'}
        </Button>
        {profile && !loading && (
          <Button type="secondary" onClick={toggleForm}>
            Cancel
          </Button>
        )}
      </Form.Item>
    </StyledForm>
  )

  return (
    <>
      <h1>{profile ? 'Update Profile' : 'Create Volunteer Profile'}</h1>
      {profile ? (
        <Mutation mutation={UPDATE_VOLUNTEER_PROFILE}>
          {(updateProfile, { loading, error }) =>
            profileForm({ error, loading, submit: updateProfile })
          }
        </Mutation>
      ) : (
        <Mutation mutation={CREATE_VOLUNTEER_PROFILE}>
          {(createProfile, { loading, error }) =>
            profileForm({ error, loading, submit: createProfile })
          }
        </Mutation>
      )}
    </>
  )
}

export default Form.create({ name: 'volunteerProfile' })(VolunteerProfileForm)
