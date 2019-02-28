import { Icon, Layout, Menu } from 'antd'
import { Link } from 'gatsby'
import React from 'react'
import styled from 'styled-components'
import { logOutUser } from '../../../apollo/client'

const { Sider } = Layout

const logoStyles = {
  height: 40,
  background: `rgba(255,255,255,.2)`,
  margin: 16,
}

const FixedSider = styled(Sider)`
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
`

const Sidebar = ({ collapsed = false }) => {
  return (
    <FixedSider trigger={null} collapsedWidth="0" collapsed={collapsed}>
      <div className="logo" style={logoStyles} />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">
          <Link to="/app/services">
            <Icon type="thunderbolt" />
            <span className="nav-text">Services</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/app/volunteer-signup">
            <Icon type="user" />
            <span className="nav-text">Profile</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/app/recipient-profile">
            <Icon type="video-camera" />
            <span className="nav-text">Recipient Profile</span>
          </Link>
        </Menu.Item>

        <Menu.Item
          key="4"
          onClick={() => {
            logOutUser()
            window.location.href = '/'
          }}
        >
          <Icon type="logout" />
          <span className="nav-text">Log Out</span>
        </Menu.Item>
      </Menu>
    </FixedSider>
  )
}

export default Sidebar
