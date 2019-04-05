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

const ARCGIS_SUGGEST_BASE_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest'
const ARCGIS_FIND_ADDRESS_CANDIDATES_BASE_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates'

const CheckboxGroup = Checkbox.Group

const contactOptions = ['Phone', 'Email']

function hasErrors(fieldsErrors) {
  return Object.keys(fieldsErrors).some(field => fieldsErrors[field])
}

const VolunteerProfileForm = props => {
  const [confirmDirty, setConfirmDirty] = useState(false)
  const [availability, setAvailability] = useState([])
  const [availabilityDetail, setAvailabilityDetail] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [serviceLocation, setServiceLocation] = useState()
  const [serviceRadius, setServiceRadius] = useState(props.serviceRadius || 15)

  const { profile, form, toggleForm } = props

  // getInitState = () => {

  //   const checkedList = []
  //   if (profile) {
  //     if (profile.allowEmailContact) {
  //       checkedList.push('Email')
  //     }
  //     if (profile.allowPhoneContact) {
  //       checkedList.push('Phone')
  //     }

  //     if (profile.location) {
  //       this.setState({
  //         location: { lat: profile.location[1], lng: profile.location[0] },
  //       })
  //     }

  //     form.setFieldsValue({ preferredContact: checkedList })
  //     this.handleChecklistChange(checkedList)
  //   }
  // }

  // componentDidMount() {
  //   this.getInitState()
  // }

  const handleChecklistChange = checkedList => {
    setAvailability(checkedList)
    // this.setState({
    //   checkedList,
    //   indeterminate:
    //     !!checkedList.length && checkedList.length < contactOptions.length,
    //   checkAll: checkedList.length === contactOptions.length,
    // })
  }

  // const onCheckAllChange = e => {
  //   const { setFieldsValue } = form
  //   if (e.target.checked) {
  //     setFieldsValue({ preferredContact: contactOptions })
  //   } else {
  //     setFieldsValue({ preferredContact: [] })
  //   }
  //   this.setState({
  //     // checkedList: e.target.checked ? contactOptions : [],
  //     indeterminate: false,
  //     checkAll: e.target.checked,
  //   })
  // }

  const handleNumberChange = e => {
    const number = parseInt(e.target.value || 0, 10)
    if (Number.isNaN(number)) {
      return
    }
    // if (!('value' in this.props)) {
    //   this.setState({ number });
    // }
    setServiceRadius(number)
  }

  const handleLocationSelect = newLocation => {
    console.log('newLocation:', newLocation)
    setServiceLocation(newLocation)
  }

  console.log('serviceLocation:', serviceLocation)

  const handleSubmit = async (e, submit) => {
    e.preventDefault()
    const { validateFields } = form

    await validateFields(async (errors, values) => {
      console.log('errors:', errors)
      console.log('values:', values)
      if (!errors) {
        //   const variables = {
        //     allowPhoneContact: values.preferredContact.includes('Phone'),
        //     allowEmailContact: values.preferredContact.includes('Email'),
        //   }

        const variables = values
        variables.availability = {
          weekdays: values.availability.includes('Weekdays'),
          weekends: values.availability.includes('Weekends'),
        }
        variables.servicesProvided = values.servicesProvided.map(need =>
          need.toUpperCase()
        )

        if (serviceLocation) {
          console.log('serviceLocation:', serviceLocation)
          variables.serviceLocation = {
            address: serviceLocation.address,
            lat: serviceLocation.location.y,
            lng: serviceLocation.location.x,
          }
        }

        try {
          console.log('variables:', variables)
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

  const initServiceRadius = () => profile && profile.serviceRadius

  const initSkills = () => {
    let skills = ''
    if (profile) {
      skills = profile.skills.join(', ')
    }
    return skills
  }

  console.log(toggleForm)

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
          <CheckboxGroup
            options={availabilityOptions.map(opt => opt.name)}
            // onChange={handleChecklistChange}
          />
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
        })(
          <CheckboxGroup
            options={needTypes.map(opt => opt.name)}
            onChange={handleChecklistChange}
          />
        )}
      </Form.Item>
      <Form.Item label="Skills">
        <p>
          In regard to these needs, what types of skills do you posess? (Enter
          values separated by commas, e.g. "Plumbing, Electrical".
        </p>
        {getFieldDecorator('skills', { initialValue: initSkills() })(<Input />)}
      </Form.Item>

      {!profile && (
        <PlaceSearchField
          fieldname="serviceLocation"
          label="What area do you wish to serve? First choose a starting location, then enter a radius in miles."
          form={form}
          setLocationState={handleLocationSelect}
        />
      )}

      <Form.Item label="Service Radius (miles)">
        {getFieldDecorator('serviceRadius', {
          initialValue: initServiceRadius(),
        })(
          <InputNumber
            min={1}
            // value={serviceRadius}
            // onChange={handleNumberChange}
          />
        )}
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
