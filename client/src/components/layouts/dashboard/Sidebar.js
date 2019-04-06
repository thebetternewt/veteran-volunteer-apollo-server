import { Link } from '@reach/router';
import { Icon, Layout, Menu } from 'antd';
import React from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import { ME_QUERY } from '../../../apollo/queries';

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
      <Query query={ME_QUERY}>
        {({ data }) => {
          let user
          if (data && data.me) {
            user = data.me
          }

          return (
            <>
              {user && (
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                  <Menu.Item key="1">
                    <Link to="/dashboard">
                      <Icon type="thunderbolt" />
                      <span className="nav-text">Dashboard</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Link to="/volunteer-profile">
                      <Icon type="user" />
                      <span className="nav-text">Volunteer Profile</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="3">
                    <Link to="/recipient-profile">
                      <Icon type="video-camera" />
                      <span className="nav-text">Recipient Profile</span>
                    </Link>
                  </Menu.Item>

                  <Menu.Item key="4">
                    <Link to="/signout">
                      <Icon type="logout" />
                      <span className="nav-text">Sign Out</span>
                    </Link>
                  </Menu.Item>
                </Menu>
              )}
            </>
          )
        }}
      </Query>
    </FixedSider>
  )
}

export default Sidebar
