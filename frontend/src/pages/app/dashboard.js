import { Avatar, Icon, Layout } from 'antd'
import React, { useState } from 'react'
import { getAuthenticatedUser } from '../../apollo/client'
import Sidebar from './sidebar'
const { Header, Content, Footer, Sider } = Layout

const defaultContent = (
  <div
    style={{
      padding: 24,
      background: '#fff',
      minHeight: 360,
    }}
  >
    content
  </div>
)

const initSidebarCollapsed = window.innerWidth <= 756

const Dashboard = ({ children = defaultContent }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(initSidebarCollapsed)
  const user = getAuthenticatedUser()

  // TODO: set inital sidebarCollapse state based on window size

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={sidebarCollapsed} />
      <Layout>
        <Header
          style={{
            backgroundColor: '#326ba0',
            color: '#fff',
            padding: '0 1rem',
            minWidth: 320,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Icon
            className="trigger"
            type={sidebarCollapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{ fontSize: 20 }}
          />
          {/* <h2 style={{ margin: 0 }}>Dashboard</h2> */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon type="setting" style={{ fontSize: 20, marginRight: 15 }} />
            <Avatar size={40} icon="user" src={user.avatar} />
          </div>
        </Header>
        <Content
          style={{
            background: '#fff',
            padding: '2rem 1rem',
            minWidth: 288,
          }}
        >
          {/* <div style={{ padding: 24, background: '#fff', minHeight: 360 }}> */}
          {children}
          {/* </div> */}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Veterans Center © {new Date().getFullYear()}
          <br />
          Created by BIS 8753
        </Footer>
      </Layout>
    </Layout>
  )
}

export default Dashboard
