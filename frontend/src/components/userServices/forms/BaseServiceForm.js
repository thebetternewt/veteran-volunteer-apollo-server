import { AutoComplete, Button, Form } from 'antd'
import React, { Component } from 'react'
import graphQlErrors from '../../graphqlErrors'

const serviceTypes = ['TRAVEL', 'LAWNCARE']

class BaseServiceForm extends Component {
  state = {
    selectedLocation: null,
  }
  handleSubmit = async e => {
    e.preventDefault()

    const { validateFields } = this.props.form

    await validateFields(async (errors, values) => {
      console.log('errors:', errors)
      console.log('values:', values)
      const { selectedLocation } = this.state
      // if (!errors) {

      //   console.log(variables)
      //   try {
      //     await submit({ variables, refetchQueries: ['Me'] })
      //     this.props.toggleForm()
      //   } catch (err) {
      //     console.error(err)
      //   }
      // }
      window.scrollTo(0, 0)
    })
  }

  render() {
    const loading = false
    const error = null
    const profile = null
    const dataSource = []
    const { getFieldDecorator, getFieldsError } = this.props.form

    return (
      <>
        <h2>Request a Service</h2>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>{error && graphQlErrors(error)}</Form.Item>
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
                // onChange={this.onLocationSearchChange}
                placeholder="Autocorrect find a place"
                onSelect={magicKey => this.handleLocationSearchSelect(magicKey)}
              />
            )}
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              // disabled={hasErrors(getFieldsError())}
              loading={loading}
              style={{ marginRight: '2rem' }}
            >
              {profile ? 'Update Profile' : 'Create Profile'}
            </Button>
            {profile && !loading && (
              <Button
                type="secondary"
                // onClick={toggleForm}
              >
                Cancel
              </Button>
            )}
          </Form.Item>
        </Form>
      </>
    )
  }
}

export default Form.create({ name: 'recipientProfile' })(BaseServiceForm)
