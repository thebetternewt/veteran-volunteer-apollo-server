import { Link } from '@reach/router'
import { Button, Form, Icon, Input } from 'antd'
import React from 'react'
import { Mutation, Query } from 'react-apollo'
import { SIGN_IN } from '../../apollo/mutations'
import { ME_QUERY } from '../../apollo/queries'
import graphQlErrors from '../../util/graphqlErrors'

const NormalLoginForm = props => {
  const { form, navigate } = props

  const handleSubmit = (e, signIn) => {
    e.preventDefault()

    const { validateFields } = form

    validateFields(async (err, values) => {
      if (!err) {
        try {
          await signIn({ variables: values, refetchQueries: () => ['Me'] })
          navigate('/dashboard')
        } catch (err) {
          console.error(err)
        }
      }
    })
  }

  const { getFieldDecorator } = props.form

  return (
    <>
      <h2>Login</h2>
      <Query query={ME_QUERY}>
        {({ data }) => {
          if (data && data.me) {
            console.log('me:', data.me)
            navigate('/dashboard')
          }

          return null
        }}
      </Query>
      <Mutation mutation={SIGN_IN}>
        {(login, { data, loading, error }) => (
          <Form onSubmit={e => handleSubmit(e, login)}>
            <Form.Item>{error && graphQlErrors(error)}</Form.Item>
            <Form.Item>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter your email address.',
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Email"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please enter your password.' },
                ],
              })(
                <Input.Password
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="password"
                  placeholder="Password"
                />
              )}
            </Form.Item>
            <Form.Item>
              {/* {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>Remember me</Checkbox>)}
              <a className="login-form-forgot" href="">
                Forgot password
              </a> */}
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={loading}
              >
                Log in
              </Button>
              <div>
                Or <Link to="/signup">Create an account</Link>
              </div>
            </Form.Item>
          </Form>
        )}
      </Mutation>
    </>
  )
}

export default Form.create({ name: 'normal_login' })(NormalLoginForm)
