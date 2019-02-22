import { Icon, Layout, Menu } from 'antd'
import { Link } from 'gatsby'
import React from 'react'
import { logOutUser } from '../../apollo/client'

const { Sider } = Layout

const logoStyles = {
  height: 40,
  background: `rgba(255,255,255,.2)`,
  margin: 16,
}

const Sidebar = ({ collapsed = false }) => {
  return (
    <Sider
      trigger={null}
      // breakpoint="lg"
      collapsedWidth="0"
      collapsed={collapsed}
      // onBreakpoint={broken => {
      //   console.log(broken)
      // }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type)
      }}
    >
      <div className="logo" style={logoStyles} />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">
          <Link to="/app/services">
            <Icon type="thunderbolt" />
            <span className="nav-text">Services</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/app/volunteer-profile">
            <Icon type="user" />
            <span className="nav-text">Volunteer Profile</span>
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
    </Sider>
  )
}

export default Sidebar
