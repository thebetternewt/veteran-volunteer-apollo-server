import { Button, Checkbox, Form, Input, InputNumber } from 'antd'
import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import {
  CREATE_VOLUNTEER_PROFILE,
  UPDATE_VOLUNTEER_PROFILE,
} from '../../apollo/mutations'
import { availabilityOptions, needTypes } from '../../constants'
import graphQlErrors from '../../util/graphqlErrors'
import PlaceSearchField from '../common/forms/PlaceSearchField'

const CheckboxGroup = Checkbox.Group

function hasErrors(fieldsErrors) {
  return Object.keys(fieldsErrors).some(field => fieldsErrors[field])
}

const VolunteerProfileForm = props => {
  const [serviceLocation, setServiceLocation] = useState()

  const { profile, form, toggleForm } = props

  const handleSubmit = async (e, submit) => {
    e.preventDefault()
    const { validateFields } = form

    await validateFields(async (errors, values) => {
      if (!errors) {
        const variables = values
        variables.availability = {
          weekdays: values.availability.includes('Weekdays'),
          weekends: values.availability.includes('Weekends'),
        }
        variables.servicesProvided = values.servicesProvided.map(need =>
          need.toUpperCase()
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
        availability.push('Weekdays')
      }
      if (profile.availability.weekends) {
        availability.push('Weekends')
      }
    }
    return availability
  }

  const initServicesProvided = () => {
    return needTypes
      .filter(type => profile && profile.servicesProvided.includes(type.option))
      .map(type => type.name)
  }

  const initServiceRadius = () => (profile ? profile.serviceRadius : 15)

  const initSkills = () => {
    let skills = ''
    if (profile) {
      skills = profile.skills.join(', ')
    }
    return skills
  }

  const profileForm = ({ error, loading, submit }) => (
    <Form onSubmit={e => handleSubmit(e, submit)}>
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
        })(<Input.TextArea autosize />)}
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
          <CheckboxGroup options={availabilityOptions.map(opt => opt.name)} />
        )}
      </Form.Item>
      <Form.Item label="Details">
        {getFieldDecorator('availabilityDetails', {
          initialValue: profile && profile.availability.details,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="What types of needs can you provide?">
        <hr />

        {getFieldDecorator('servicesProvided', {
          initialValue: initServicesProvided(),
          rules: [
            {
              required: true,
              message: 'Please choose at least one need type.',
            },
          ],
        })(<CheckboxGroup options={needTypes.map(opt => opt.name)} />)}
      </Form.Item>
      <Form.Item label="Skills">
        <p>
          In regard to these needs, what types of skills do you posess? (Enter
          values separated by commas, e.g. "Plumbing, Electrical".
        </p>
        {getFieldDecorator('skills', { initialValue: initSkills() })(<Input />)}
      </Form.Item>

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
    </Form>
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
