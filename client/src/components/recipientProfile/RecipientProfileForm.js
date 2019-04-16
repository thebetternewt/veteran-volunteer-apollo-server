import { Button, Checkbox, Form } from 'antd'
import React, { useState, useEffect } from 'react'
import { Mutation } from 'react-apollo'
import {
  CREATE_RECIPIENT_PROFILE,
  UPDATE_RECIPIENT_PROFILE,
} from '../../apollo/mutations'
import graphQlErrors from '../../util/graphqlErrors'
import { hasErrors } from '../common/forms/helpers'
import PlaceSearchField from '../common/forms/PlaceSearchField'

const CheckboxGroup = Checkbox.Group

const contactOptions = ['Phone', 'Email']

// function hasErrors(fieldsErrors) {
//   return Object.keys(fieldsErrors).some(field => fieldsErrors[field])
// }

const RecipientProfileForm = props => {
  const [selectedLocation, setSelectedLocation] = useState()
  const [checkAll, setCheckAll] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)

  const { profile, form, toggleForm } = props
  const {
    setFieldsValue,
    getFieldValue,
    validateFields,
    getFieldDecorator,
    getFieldsError,
  } = form

  console.log('Profile:', profile)

  // Update preferredContact checkAll on component mount
  useEffect(() => {
    if (!profile) return
    const preferredContact = getFieldValue('preferredContact')
    console.log(preferredContact)
    return handleChecklistChange(preferredContact)
  }, [])

  const initPreferredContact = () => {
    const { allowPhoneContact, allowEmailContact } = profile
    let preferredContact = []
    if (profile) {
      if (allowPhoneContact) {
        preferredContact.push('Phone')
      }
      if (allowEmailContact) {
        preferredContact.push('Email')
      }
    }
    return preferredContact
  }

  const handleChecklistChange = checkedList => {
    setIndeterminate(
      !!checkedList.length && checkedList.length < contactOptions.length
    )
    setCheckAll(checkedList.length === contactOptions.length)
  }

  const onCheckAllChange = e => {
    if (e.target.checked) {
      setFieldsValue({ preferredContact: contactOptions })
    } else {
      setFieldsValue({ preferredContact: [] })
    }

    setIndeterminate(false)
    setCheckAll(e.target.checked)
  }

  const handleLocationSelect = location => setSelectedLocation(location)

  const handleSubmit = async (e, submit) => {
    e.preventDefault()

    await validateFields(async (errors, values) => {
      if (!errors) {
        const variables = {
          allowPhoneContact: values.preferredContact.includes('Phone'),
          allowEmailContact: values.preferredContact.includes('Email'),
        }

        if (selectedLocation) {
          variables.location = {
            address: selectedLocation.address,
            lat: selectedLocation.location.y,
            lng: selectedLocation.location.x,
          }
        }

        try {
          await submit({ variables, refetchQueries: ['Me'] })
          // ? toggleForm...
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

  const profileForm = ({ error, loading, submit }) => (
    <Form onSubmit={e => handleSubmit(e, submit)}>
      <Form.Item>{error && graphQlErrors(error)}</Form.Item>

      <Form.Item label="Preferred Contact">
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          Check all
        </Checkbox>

        <hr />

        {getFieldDecorator('preferredContact', {
          initialValue: profile && initPreferredContact(),
          rules: [
            {
              required: true,
              message: 'Please choose at least one preferred contact method.',
            },
          ],
        })(
          <CheckboxGroup
            options={contactOptions}
            onChange={handleChecklistChange}
          />
        )}
      </Form.Item>

      <PlaceSearchField
        fieldname="location"
        label="Where are you located?"
        form={form}
        setLocationState={handleLocationSelect}
        initialValue={profile && profile.location}
      />

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
      <h1>{profile ? 'Update Profile' : 'Create Profile'}</h1>
      {profile ? (
        <Mutation mutation={UPDATE_RECIPIENT_PROFILE}>
          {(updateProfile, { loading, error }) =>
            profileForm({ error, loading, submit: updateProfile })
          }
        </Mutation>
      ) : (
        <Mutation mutation={CREATE_RECIPIENT_PROFILE}>
          {(createProfile, { loading, error }) =>
            profileForm({ error, loading, submit: createProfile })
          }
        </Mutation>
      )}
    </>
  )
}

export default Form.create({ name: 'recipientProfile' })(RecipientProfileForm)
