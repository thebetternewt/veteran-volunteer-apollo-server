import { AutoComplete, Button, Checkbox, Form } from 'antd'
import axios from 'axios'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import {
  CREATE_RECIPIENT_PROFILE,
  UPDATE_RECIPIENT_PROFILE,
} from '../../apollo/mutations'
import graphQlErrors from '../graphqlErrors'

const ARCGIS_SUGGEST_BASE_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest'
const ARCGIS_FIND_ADDRESS_CANDIDATES_BASE_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates'

const CheckboxGroup = Checkbox.Group

const contactOptions = ['Phone', 'Email']

function hasErrors(fieldsErrors) {
  return Object.keys(fieldsErrors).some(field => fieldsErrors[field])
}

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

  handleSubmit = async (e, submit) => {
    e.preventDefault()
    const { validateFields } = this.props.form

    await validateFields(async (errors, values) => {
      console.log('errors:', errors)
      // console.log('values:', values)
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

        console.log(variables)
        try {
          await submit({ variables, refetchQueries: ['Me'] })
          this.props.toggleForm()
        } catch (err) {
          console.error(err)
        }
        window.scrollTo(0, 0)
      }
    })
  }

  searchForLocation = async searchText => {
    // Fetch suggest results from ArcGIS
    const searchResults = await axios.get(ARCGIS_SUGGEST_BASE_URL, {
      params: { f: 'json', text: searchText },
    })

    const { suggestions } = searchResults.data

    this.setState({ searchResults: suggestions || [] })
  }

  onLocationSearchChange = async searchText => {
    this.setState({ searchText })
    await this.searchForLocation(searchText)
  }

  handleLocationSearchSelect = async magicKey => {
    console.log('magicKey', magicKey)

    // Fetch address candidate results from ArcGIS
    const searchResults = await axios.get(
      ARCGIS_FIND_ADDRESS_CANDIDATES_BASE_URL,
      {
        params: { f: 'json', magicKey },
      }
    )

    const { data } = searchResults
    console.log('selected data', data)

    if (data.candidates) {
      this.setState({ selectedLocation: data.candidates[0] })
    }
  }

  render() {
    const { profile, toggleForm } = this.props
    const { getFieldDecorator, getFieldsError } = this.props.form

    const { searchResults } = this.state

    const dataSource = searchResults.map(item => ({
      text: item.text,
      value: item.magicKey,
    }))

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

        {/* TODO: Move location to user account */}
        {!profile && (
          <Form.Item label="Where are you located?">
            {getFieldDecorator('location', {
              rules: [
                {
                  required: true,
                  message: 'Please select a location.',
                },
              ],
            })(
              <AutoComplete
                dataSource={dataSource}
                onChange={this.onLocationSearchChange}
                placeholder="Autocorrect find a place"
                onSelect={magicKey => this.handleLocationSearchSelect(magicKey)}
              />
            )}
          </Form.Item>
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
