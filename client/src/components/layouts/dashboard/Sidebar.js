import { Link, Location } from '@reach/router'
import { Icon, Layout, Menu } from 'antd'
import React from 'react'
import { Query } from 'react-apollo'
import styled from 'styled-components'
import { ME_QUERY } from '../../../apollo/queries'

const { Sider } = Layout

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 16px;

  h1 {
    color: #fff;
    font-weight: bold;
    font-size: 2rem;
    text-align: center;
    margin: 0;
  }
`

const FixedSider = styled(Sider)`
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
`

const Sidebar = ({ collapsed = false }) => {
  return (
    <FixedSider trigger={null} collapsedWidth="0" collapsed={collapsed}>
      <Logo>
        <h1>MFVS</h1>
      </Logo>
      <Location>
        {({ location }) => (
          <Query query={ME_QUERY}>
            {({ data }) => {
              let user
              if (data && data.me) {
                user = data.me
              }

              return (
                <>
                  {user && (
                    <Menu
                      theme="dark"
                      mode="inline"
                      defaultSelectedKeys={[location.pathname]}
                      selectedKeys={[location.pathname]}
                    >
                      <Menu.Item key="/dashboard">
                        <Link to="/dashboard">
                          <Icon type="thunderbolt" />
                          <span className="nav-text">Dashboard</span>
                        </Link>
                      </Menu.Item>

                      <Menu.Item key="/recipient-profile">
                        <Link to="/recipient-profile">
                          <Icon type="video-camera" />
                          <span className="nav-text">Recipient Profile</span>
                        </Link>
                      </Menu.Item>

                      <Menu.Item key="/volunteer-profile">
                        <Link to="/volunteer-profile">
                          <Icon type="user" />
                          <span className="nav-text">Volunteer Profile</span>
                        </Link>
                      </Menu.Item>

                      {user.admin && (
                        <Menu.Item key="/manage-users">
                          <Link to="/manage-users">
                            <Icon type="usergroup-add" />
                            <span className="nav-text">Manage Users</span>
                          </Link>
                        </Menu.Item>
                      )}

                      <Menu.Item key="/signout">
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
        )}
      </Location>
    </FixedSider>
  )
}

export default Sidebar
