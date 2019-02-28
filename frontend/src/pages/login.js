import { Col, Row } from 'antd'
import React from 'react'
import LoginForm from '../components/auth/LoginForm'
import Layout from '../components/layouts/main/Layout'
import family from '../images/family.jpeg'

const LoginPage = () => (
  <Layout>
    <div
      style={{
        width: '100vw',
        minHeight: '60vh',
        padding: '2rem',
        backgroundImage: `url(${family})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Row justify="space-around">
        <Col
          xs={24}
          md={{ span: 12, offset: 6 }}
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: '2rem',
          }}
        >
          <LoginForm />
        </Col>
      </Row>
    </div>
  </Layout>
)

export default LoginPage
