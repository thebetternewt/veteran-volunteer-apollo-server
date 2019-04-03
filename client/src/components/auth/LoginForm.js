import { Link, Redirect } from '@reach/router'
import { Button, Form, Icon, Input } from 'antd'
import jwtDecode from 'jwt-decode'
import React, { useContext } from 'react'
import { Mutation } from 'react-apollo'
import { getAuthenticatedUser } from '../../apollo/client'
import { SIGN_IN } from '../../apollo/mutations'
import { AuthContext } from '../../contexts/auth.context'
import graphQlErrors from '../../util/graphqlErrors'
import { setUserToken } from '../../util/tokens'

const NormalLoginForm = props => {
  const authContext = useContext(AuthContext)
  const { form, navigate } = props

  if (authContext.user) {
    navigate('/dashboard')
  }

  const handleSubmit = (e, signIn) => {
    e.preventDefault()

    const { validateFields } = form

    validateFields(async (err, values) => {
      if (!err) {
        try {
          const result = await signIn({ variables: values })
          console.log('result:', result)

          const token = result.data.signIn

          setUserToken(token)

          console.log('authCtx1:', authContext)
          const decodedToken = jwtDecode(token)
          console.log('decodedToken:', decodedToken)
          !authContext.user && authContext.setAuthenticatedUser(decodedToken)
          console.log('authCtx2:', authContext)
          navigate('/dashboard')

          // setAuthenticatedUser(token)
          // ('/app')
        } catch (err) {
          console.error(err)
        }
      }
    })
  }

  // Redirect to app dashboard if logged in
  const user = getAuthenticatedUser()
  console.log('user:', user)
  if (user) {
    return <Redirect from="/login" to="/services" noThrow />
  }

  const { getFieldDecorator } = props.form

  return (
    <>
      <h2>Login</h2>
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
