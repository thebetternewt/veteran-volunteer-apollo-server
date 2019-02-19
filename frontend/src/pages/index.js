import React from 'react'
import { Link } from 'gatsby'
import { Row, Col } from 'antd'

import family from '../images/family.jpeg'

import Layout from '../components/layout'
import HomeSignup from '../components/homeSignup'

const IndexPage = () => (
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
        <HomeSignup />
      </Row>
    </div>

    <Link to="/app/">Go to App</Link>
  </Layout>
)

export default IndexPage
