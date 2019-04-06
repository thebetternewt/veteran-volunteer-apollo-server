import { Button, Checkbox, Form } from 'antd';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { CREATE_RECIPIENT_PROFILE, UPDATE_RECIPIENT_PROFILE } from '../../apollo/mutations';
import graphQlErrors from '../../util/graphqlErrors';
import { hasErrors } from '../common/forms/helpers';
import PlaceSearchField from '../common/forms/PlaceSearchField';


const CheckboxGroup = Checkbox.Group

const contactOptions = ['Phone', 'Email']

// function hasErrors(fieldsErrors) {
//   return Object.keys(fieldsErrors).some(field => fieldsErrors[field])
// }

class RecipientProfileForm extends Component {
  state = {
    confirmDirty: false,
    indeterminate: false,
    checkAll: false,
    location: {
      lat: null,
      lng: null,
    },
    searchResults: [],
    selectedLocation: null,
  }

  getInitState = () => {
    const { profile, form } = this.props

    const checkedList = []
    if (profile) {
      if (profile.allowEmailContact) {
        checkedList.push('Email')
      }
      if (profile.allowPhoneContact) {
        checkedList.push('Phone')
      }

      if (profile.location) {
        this.setState({
          location: { lat: profile.location[1], lng: profile.location[0] },
        })
      }

      form.setFieldsValue({ preferredContact: checkedList })
      this.handleChecklistChange(checkedList)
    }
  }

  componentDidMount() {
    this.getInitState()
  }

  handleChecklistChange = checkedList => {
    this.setState({
      checkedList,
      indeterminate:
        !!checkedList.length && checkedList.length < contactOptions.length,
      checkAll: checkedList.length === contactOptions.length,
    })
  }

  onCheckAllChange = e => {
    const { setFieldsValue } = this.props.form
    if (e.target.checked) {
      setFieldsValue({ preferredContact: contactOptions })
    } else {
      setFieldsValue({ preferredContact: [] })
    }
    this.setState({
      // checkedList: e.target.checked ? contactOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    })
  }

  handleLocationSelect = location =>
    this.setState({ selectedLocation: location })

  handleSubmit = async (e, submit) => {
    e.preventDefault()
    const { validateFields } = this.props.form

    await validateFields(async (errors, values) => {
      console.log('errors:', errors)
      const { selectedLocation } = this.state
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
          this.props.toggleForm && this.props.toggleForm()
        } catch (err) {
          console.error(err)
        }
        window.scrollTo(0, 0)
      }
    })
  }

  render() {
    const { profile, toggleForm, form } = this.props
    const { getFieldDecorator, getFieldsError } = form

    console.log(toggleForm)

    const profileForm = ({ error, loading, submit }) => (
      <Form onSubmit={e => this.handleSubmit(e, submit)}>
        <Form.Item>{error && graphQlErrors(error)}</Form.Item>

        <Form.Item label="Preferred Contact">
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            Check all
          </Checkbox>

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
              options={contactOptions}
              onChange={this.handleChecklistChange}
            />
          )}
        </Form.Item>

        {!profile && (
          <PlaceSearchField
            fieldname="location"
            label="Where are you located?"
            form={form}
            setLocationState={this.handleLocationSelect}
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
}

export default Form.create({ name: 'recipientProfile' })(RecipientProfileForm)
