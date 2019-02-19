import React from 'react'
import SignUpForm from '../components/signupForm'
import Layout from '../components/layout'
import { Row, Col } from 'antd'

const SignupPage = () => {
  return (
    <Layout>
      <Row style={{ padding: '1rem' }}>
        <Col xs={24} md={12}>
          <SignUpForm />
        </Col>
      </Row>
    </Layout>
  )
}

export default SignupPage
