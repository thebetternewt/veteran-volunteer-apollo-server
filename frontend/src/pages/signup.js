import { Col, Row } from 'antd'
import React from 'react'
import SignUpForm from '../components/auth/SignupForm'
import Layout from '../components/layouts/main/Layout'

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
