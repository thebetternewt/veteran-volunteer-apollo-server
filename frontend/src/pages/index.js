import { Row } from 'antd'
import { Link } from 'gatsby'
import React from 'react'
import HomeSignup from '../components/homeSignup'
import Layout from '../components/layouts/main/Layout'
import family from '../images/family.jpeg'

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
