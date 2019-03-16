import React from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import { Button } from 'antd'

const Header = ({ siteTitle }) => (
  <div
    style={{
      background: `teal`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
        color: '#fff',
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      <Link to="/login">
        <Button>Login</Button>
      </Link>
      <Link to="/signup">
        <Button>Sign Up</Button>
      </Link>
    </div>
  </div>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
