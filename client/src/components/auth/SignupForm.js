import { navigate } from '@reach/router'
import { Button, Divider, Form, Icon, Input, InputNumber, Select } from 'antd'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { UsaStates } from 'usa-states'
import { SIGNUP } from '../../apollo/mutations'
import graphQlErrors from '../../util/graphqlErrors'

function hasErrors(fieldsError) {
  const errors = {
    ...fieldsError,
    ...fieldsError.address,
    address: null,
  }
  // console.log(errors)
  return Object.keys(errors).some(field => errors[field])
}

const statesWithAbbreviations = new UsaStates().format({
  $name: 'name',
  $abbreviation: 'abbr',
})

class SignupForm extends Component {
  state = {
    confirmDirty: false,
  }

  handleConfirmBlur = e => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('Passwords do not match.')
    } else {
      callback()
    }
  }

  handleSubmit = (e, signup) => {
    e.preventDefault()
    const { validateFields } = this.props.form

    validateFields(async (errors, values) => {
      // console.log('errors:', errors)
      // console.log('values:', values)
      if (!errors) {
        const flattenedValues = {
          ...values,
          ...values.address,
        }
        try {
          await signup({ variables: flattenedValues })
          navigate('/login')
        } catch (err) {
          console.log(err)
        }
        window.scrollTo(0, 0)
      }
    })
  }
  render() {
    // console.log(this.props)
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
      getFieldsValue,
      validateFields,
    } = this.props.form

    const firstNameError =
      isFieldTouched('firstName') && getFieldError('firstName')
    const lastNameError =
      isFieldTouched('lastName') && getFieldError('lastName')
    const emailError = isFieldTouched('email') && getFieldError('email')
    const passwordError =
      isFieldTouched('password') && getFieldError('password')

    const { Option } = Select

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 4,
        },
      },
    }

    const stateOptions = statesWithAbbreviations.map(state => (
      <Option key={state.abbreviation} value={state.abbreviation}>
        {state.name}
      </Option>
    ))

    return (
      <>
        <h2>Sign Up</h2>
        <Mutation mutation={SIGNUP}>
          {(signup, { loading, error }) => (
            <Form onSubmit={e => this.handleSubmit(e, signup)}>
              <Form.Item {...tailFormItemLayout}>
                {error && graphQlErrors(error)}
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                validateStatus={firstNameError ? 'error' : ''}
                help={firstNameError || ''}
                label="First Name"
              >
                {getFieldDecorator('firstName', {
                  rules: [
                    {
                      required: true,
                      message: 'Please enter your first name.',
                    },
                  ],
                })(<Input />)}
              </Form.Item>

              <Form.Item {...formItemLayout} label="Middle Name">
                {getFieldDecorator('middleName')(<Input />)}
              </Form.Item>

              <Form.Item
                {...formItemLayout}
                validateStatus={lastNameError ? 'error' : ''}
                help={lastNameError || ''}
                label="Last Name"
              >
                {getFieldDecorator('lastName', {
                  rules: [
                    { required: true, message: 'Please enter your last name.' },
                  ],
                })(<Input />)}
              </Form.Item>

              <Form.Item {...formItemLayout} label="Age">
                {getFieldDecorator('age', {
                  rules: [
                    {
                      type: 'integer',
                      required: true,
                      message: 'Please enter a whole number.',
                    },
                  ],
                })(<InputNumber min={1} step="1" type="number" />)}
              </Form.Item>

              <Form.Item {...formItemLayout} label="Phone Number">
                {getFieldDecorator('phone', {
                  rules: [
                    {
                      required: true,
                      message: 'Please enter your phone number.',
                    },
                    // TODO: validate phone number input
                    // TODO: input mask
                  ],
                })(<Input type="tel" />)}
              </Form.Item>

              <Form.Item
                {...formItemLayout}
                validateStatus={emailError ? 'error' : ''}
                help={emailError || ''}
                label="Email"
              >
                {getFieldDecorator('email', {
                  rules: [
                    {
                      type: 'email',
                      required: true,
                      message: 'Please enter a valid email address.',
                    },
                  ],
                })(<Input />)}
              </Form.Item>

              <Form.Item
                {...formItemLayout}
                validateStatus={passwordError ? 'error' : ''}
                help={passwordError || ''}
                label="Password"
              >
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: 'Please enter a password.' },
                  ],
                })(
                  <Input.Password
                    prefix={
                      <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="Password"
                  />
                )}
              </Form.Item>

              <Form.Item {...formItemLayout} label="Confirm Password">
                {getFieldDecorator('confirm', {
                  rules: [
                    {
                      required: true,
                      message: 'Please confirm your password.',
                    },
                    {
                      validator: this.compareToFirstPassword,
                    },
                  ],
                })(<Input.Password onBlur={this.handleConfirmBlur} />)}
              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                <Divider orientation="left">Address</Divider>
              </Form.Item>

              <Form.Item {...formItemLayout} label="Street 1">
                {getFieldDecorator('address.street1', {
                  rules: [
                    { required: true, message: 'Address street 1 required.' },
                  ],
                })(<Input />)}
              </Form.Item>

              <Form.Item {...formItemLayout} label="Street 2">
                {getFieldDecorator('address.street2')(<Input />)}
              </Form.Item>

              <Form.Item {...formItemLayout} label="City">
                {getFieldDecorator('address.city', {
                  rules: [{ required: true, message: 'City is required.' }],
                })(<Input />)}
              </Form.Item>

              <Form.Item {...formItemLayout} label="State">
                {getFieldDecorator('address.state', {
                  rules: [{ required: true, message: 'State is required.' }],
                })(
                  <Select
                    showSearch
                    placeholder="Select your state"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {stateOptions}
                  </Select>
                )}
              </Form.Item>

              <Form.Item {...formItemLayout} label="Zipcode">
                {getFieldDecorator('address.zipcode', {
                  rules: [{ required: true, message: 'Zipcode is required.' }],
                })(<Input />)}
              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={hasErrors(getFieldsError())}
                  loading={loading}
                >
                  Sign Up
                </Button>
              </Form.Item>
            </Form>
          )}
        </Mutation>
      </>
    )
  }
}

export default Form.create({ name: 'signup' })(SignupForm)
