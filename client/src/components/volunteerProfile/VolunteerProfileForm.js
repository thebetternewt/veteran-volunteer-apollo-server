import { Button, Checkbox, Form, Input } from 'antd'
import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import {
  CREATE_VOLUNTEER_PROFILE,
  UPDATE_VOLUNTEER_PROFILE,
} from '../../apollo/mutations'
import { availabilityOptions } from '../../constants'
import graphQlErrors from '../../util/graphqlErrors'
import { hasErrors } from '../common/forms/helpers'
import PlaceSearchField from '../common/forms/PlaceSearchField'

const ARCGIS_SUGGEST_BASE_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest'
const ARCGIS_FIND_ADDRESS_CANDIDATES_BASE_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates'

const CheckboxGroup = Checkbox.Group

const contactOptions = ['Phone', 'Email']

// function hasErrors(fieldsErrors) {
//   return Object.keys(fieldsErrors).some(field => fieldsErrors[field])
// }

const VolunteerProfileForm = props => {
  const [confirmDirty, setConfirmDirty] = useState(false)
  const [availability, setAvailability] = useState([])
  const [availabilityDetail, setAvailabilityDetail] = useState('')
  const [location, setLocation] = useState({ lat: null, lng: null })
  const [searchResults, setSearchResults] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)

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

  const handleLocationSelect = newLocation => setLocation(newLocation)

  const handleSubmit = async (e, submit) => {
    e.preventDefault()
    const { validateFields } = form

    await validateFields(async (errors, values) => {
      console.log('errors:', errors)
      if (!errors) {
        const variables = {
          allowPhoneContact: values.preferredContact.includes('Phone'),
          allowEmailContact: values.preferredContact.includes('Email'),
        }

        if (selectedLocation) {
          variables.location = {
            lat: selectedLocation.location.y,
            lng: selectedLocation.location.x,
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

  console.log(toggleForm)

  const profileForm = ({ error, loading, submit }) => (
    <Form onSubmit={e => handleSubmit(e, submit)}>
      <Form.Item>{error && graphQlErrors(error)}</Form.Item>

      <Form.Item label="Bio">
        {getFieldDecorator('bio', {
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

      <Form.Item label="Preferred Contact">
        {/* <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            Check all
          </Checkbox> */}

        <hr />

        {getFieldDecorator('preferredContact', {
          rules: [
            {
              required: true,
              message: 'Please choose at least one preferred contact method.',
            },
          ],
        })(
          <CheckboxGroup
            options={availabilityOptions.map(opt => opt.name)}
            onChange={handleChecklistChange}
          />
        )}
      </Form.Item>

      {!profile && (
        <PlaceSearchField
          fieldname="location"
          label="Where are you located?"
          form={form}
          setLocationState={handleLocationSelect}
        />
      )}

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
