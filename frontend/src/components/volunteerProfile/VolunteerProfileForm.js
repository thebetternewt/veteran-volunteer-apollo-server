import { AutoComplete, Button, Checkbox, Form, Select } from 'antd'
import axios from 'axios'
import { navigate } from 'gatsby'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_RECIPIENT_PROFILE } from '../apollo/mutations'
import graphQlErrors from './graphqlErrors'

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
    searchText: '',
    searchResults: [],
    selectedLocation: null,
  }

  onChecklistChange = checkedList => {
    console.log(checkedList)
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

  handleSubmit = async (e, createProfile) => {
    e.preventDefault()
    const { validateFields } = this.props.form

    await validateFields(async (errors, values) => {
      console.log('errors:', errors)
      console.log('values:', values)
      console.log(this.state.selectedLocation)
      if (!errors) {
        const variables = {
          allowPhoneContact: values.preferredContact.includes('Phone'),
          allowEmailContact: values.preferredContact.includes('Email'),
          lat: this.state.selectedLocation.location.y,
          lng: this.state.selectedLocation.location.x,
        }
        console.log(variables)
        try {
          await createProfile({ variables })
          navigate('/app')
        } catch (err) {
          console.log(err)
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
    console.log('form rendering...')
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
      getFieldsValue,
      validateFields,
    } = this.props.form

    const { location, searchText, searchResults } = this.state

    const dataSource = searchResults.map(item => ({
      text: item.text,
      value: item.magicKey,
    }))

    const { Option } = Select

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }

    return (
      <>
        <h1>Setup Volunteer Profile</h1>
        <Mutation mutation={CREATE_RECIPIENT_PROFILE}>
          {(createProfile, { loading, error }) => (
            <Form onSubmit={e => this.handleSubmit(e, createProfile)}>
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
                      message:
                        'Please choose at least one preferred contact method.',
                    },
                  ],
                })(
                  <CheckboxGroup
                    options={contactOptions}
                    onChange={this.onChecklistChange}
                  />
                )}
              </Form.Item>

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
                    onSelect={magicKey =>
                      this.handleLocationSearchSelect(magicKey)
                    }
                  />
                )}
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={hasErrors(getFieldsError())}
                  loading={loading}
                >
                  Create Profile
                </Button>
              </Form.Item>
              {/* TODO: 
                    
                    implement later: 
                    Avatar upload
                    ant upload component?

               */}
            </Form>
          )}
        </Mutation>
      </>
    )
  }
}

export default Form.create({ name: 'recipientProfile' })(RecipientProfileForm)
