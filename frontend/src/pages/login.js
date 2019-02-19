import React from 'react'
import Layout from '../components/layout'
import { Row, Col } from 'antd'
import LoginForm from '../components/loginForm'
import { getAuthenticatedUser } from '../apollo/client'

import family from '../images/family.jpeg'
import { navigate } from 'gatsby'

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
