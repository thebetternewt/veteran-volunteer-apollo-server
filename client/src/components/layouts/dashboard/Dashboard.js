import { Link } from '@reach/router';
import { Avatar, Badge, Button, Icon, Layout } from 'antd';
import React, { useState } from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import { ME_QUERY } from '../../../apollo/queries';
import ScrollToTop from '../../common/ScrollToTop';
import Sidebar from './Sidebar';

const { Header, Content, Footer } = Layout

const StickyHeader = styled(Header)`
  position: sticky;
  top: 0;
  background-color: #326ba0;
  color: #fff;
  padding: 0 1rem;
  width: 100%;
  min-width: 320px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 200;
  transition: all 200ms ease;
`

const defaultContent = (
  <div
    style={{
      padding: 24,
      background: '#fff',
      minHeight: '100vh',
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


  // TODO: set inital sidebarCollapse state based on window size

  return (
    <ScrollToTop>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar collapsed={sidebarCollapsed} />
        <Layout
          style={{
            overflowX: 'visible',
            marginLeft: sidebarCollapsed ? 0 : 200,
            transition: 'all 200ms ease',
          }}
        >
          <StickyHeader>
            <Icon
              className="trigger"
              type={sidebarCollapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{ fontSize: 20 }}
            />
            <Query query={ME_QUERY}>
              {({ data }) => {
                let user
                if (data && data.me) {
                  user = data.me
                }

                return (
                  <>
                    {user ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Badge count={99} offset={[-12, 3]} dot>
                          <Icon
                            type="bell"
                            style={{ fontSize: 20, marginRight: 15 }}
                          />
                        </Badge>

                        <Icon
                          type="setting"
                          style={{ fontSize: 20, marginRight: 15 }}
                        />
                        <Avatar
                          size={40}
                          icon="user"
                          src={user && user.avatar}
                        />
                      </div>
                    ) : (
                      <div>
                        <Link to="/signin">
                          <Button>Sign In</Button>
                        </Link>
                        <Link to="/signup">
                          <Button>Sign Up</Button>
                        </Link>
                      </div>
                    )}
                  </>
                )
              }}
            </Query>
          </StickyHeader>
          <Content
            style={{
              background: '#fff',
              padding: '2rem 1rem',
              maxWidth: '100vw',
              overflow: 'initial',
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
    </ScrollToTop>
  )
}

export default Dashboard
