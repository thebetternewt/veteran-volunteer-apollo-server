import { Avatar, Icon, Layout } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import { getAuthenticatedUser } from '../../apollo/client'
import Sidebar from './sidebar'

const { Header, Content, Footer, Sider } = Layout

const StickyHeader = styled(Header)`
  position: sticky;
  top: 0;
  background-color: #326ba0;
  color: #fff;
  padding: 0 1rem;
  min-width: 320px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 200;
`

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

const initSidebarCollapsed = () => {
  if (typeof window === 'undefined') return false

  return window.innerWidth <= 756
}

const Dashboard = ({ children = defaultContent }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    initSidebarCollapsed()
  )
  const user = getAuthenticatedUser()

  // TODO: set inital sidebarCollapse state based on window size

  return (
    <Layout style={{ minHeight: '100vh', overflowX: 'visible' }}>
      <Sidebar collapsed={sidebarCollapsed} />
      <Layout>
        <StickyHeader>
          <Icon
            className="trigger"
            type={sidebarCollapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{ fontSize: 20 }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon type="setting" style={{ fontSize: 20, marginRight: 15 }} />
            <Avatar size={40} icon="user" src={user && user.avatar} />
          </div>
        </StickyHeader>
        <Content
          style={{
            background: '#fff',
            padding: '2rem 1rem',
            minWidth: 288,
          }}
        >
          {children}
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
