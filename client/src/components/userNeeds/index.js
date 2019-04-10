import { Link } from '@reach/router'
import { Alert, Avatar, Button, Card, Divider, Icon, Row, Tag } from 'antd'
import moment from 'moment'
import React from 'react'
import { Mutation, Query } from 'react-apollo'
import styled from 'styled-components'
import { ACCEPT_REQUEST } from '../../apollo/mutations'
import { ME_QUERY, REQUESTS_QUERY } from '../../apollo/queries'
import PrivateRoute from '../common/PrivateRoute'

const { Meta } = Card

const NeedSectionHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 2rem;

  h2 {
    margin-right: 1rem;
  }
`

const NeedCard = styled(Card)`
  width: 400px;
  max-width: 100%;
  margin: 0 1rem 1rem 0;

  .need-details {
    text-transform: capitalize;
    word-wrap: none;
  }

  @media screen and (max-width: 756px) {
    width: 380px;
    margin-right: 0;
  }
`

const UserNeeds = () => {
  return (
    <>
      <h3 style={{ color: '#777' }}>Dashboard</h3>
      <div>
        <NeedSectionHeader>
          <h2>My Needs</h2>
          <Link to="/request-need">
            <Button type="primary" icon="plus-circle">
              Request New Need
            </Button>
          </Link>
        </NeedSectionHeader>
        <Row type="flex">
          <Query query={ME_QUERY}>
            {({ data, loading }) => {
              if (loading) return <Icon type="loading" size={64} />

              if (data && data.me) {
                const { me } = data
                const { requestedNeeds } = me

                const needCards = requestedNeeds.map(need => (
                  <NeedCard
                    key={need.id}
                    style={{
                      maxWidth: 400,
                      marginBottom: 20,
                    }}
                    actions={[
                      <Button type="primary" ghost>
                        Edit Need
                      </Button>,
                      <Link to={`/volunteer-search/${need.id}`}>
                        <Button type="primary">Find a Volunteer</Button>
                      </Link>,
                    ]}
                  >
                    <Meta
                      avatar={
                        <Avatar icon="avatar" size={64} src={me.avatar} />
                      }
                      title={need.title}
                      description={
                        <div style={{ marginBottom: '1rem' }}>
                          <div className="need-details">
                            Type: {need.needType.toLowerCase()}
                          </div>
                          {need.date && (
                            <div className="need-details">
                              When: {moment(need.date, 'x').format('LLL')}
                            </div>
                          )}
                        </div>
                      }
                    />
                    <div>
                      <p>{need.notes || 'Lorem ipsum dolor sit amet'}</p>
                    </div>
                    {/* <Link to={`/volunteer-search/${need.id}`}>
                      <Button type="primary" ghost>
                        Find a Volunteer!
                      </Button>
                    </Link> */}
                  </NeedCard>
                ))

                return needCards
              }

              return null
            }}
          </Query>
        </Row>
      </div>
      <Divider />
      <div>
        <NeedSectionHeader>
          <h2>Pending Requests</h2>
        </NeedSectionHeader>
        <Row type="flex">
          <Query
            query={REQUESTS_QUERY}
            variables={{ status: 'PENDING' }}
            fetchPolicy="network-only"
          >
            {({ data, loading }) => {
              if (loading) return <Icon type="loading" size={64} />

              if (data && data.requests) {
                const { requests } = data

                const pendingRequests = requests.filter(
                  req => req.status === 'PENDING'
                )

                if (pendingRequests.length === 0) {
                  return (
                    <Alert
                      message="No pending requests."
                      type="info"
                      style={{ marginBottom: '1.1rem' }}
                    />
                  )
                }

                const needCards = pendingRequests.map(request => (
                  <NeedCard
                    key={request.id}
                    style={{ maxWidth: 400, marginBottom: 20 }}
                    actions={[
                      <Button type="primary" ghost>
                        Details
                      </Button>,
                      <Mutation
                        mutation={ACCEPT_REQUEST}
                        variables={{ requestId: request.id }}
                        refetchQueries={['Requests']}
                      >
                        {(accept, { data, loading, error }) => {
                          // TODO: Handle data, loading, and errors */

                          return (
                            <Button type="primary" onClick={accept}>
                              Accept
                            </Button>
                          )
                        }}
                      </Mutation>,
                    ]}
                  >
                    <Alert
                      message={request.status}
                      type={
                        request.status === 'PENDING' ? 'warning' : 'success'
                      }
                      style={{ marginBottom: '1.1rem' }}
                    />
                    <Meta
                      avatar={
                        <Avatar
                          size={64}
                          src={
                            request.recipient.avatar ||
                            'http://i.pravatar.cc/300'
                          }
                        />
                      }
                      title={request.need.title}
                      description={
                        <div style={{ marginBottom: '1rem' }}>
                          <div>
                            Type:{' '}
                            <Tag color="purple">{request.need.needType}</Tag>
                          </div>
                          <div>
                            When: {moment(request.need.date, 'x').format('LLL')}
                          </div>
                        </div>
                      }
                    />
                    <div>
                      <p>{request.need.notes}</p>
                    </div>
                  </NeedCard>
                ))

                return needCards
              }

              return null
            }}
          </Query>
        </Row>
      </div>
      <Divider />
      <div>
        <NeedSectionHeader>
          <h2>Volunteered Requests</h2>
          <Button type="primary" icon="search">
            Browse Requested Needs
          </Button>
        </NeedSectionHeader>
        <Row type="flex">
          <Query
            query={REQUESTS_QUERY}
            variables={{ status: 'ACCEPTED' }}
            fetchPolicy="network-only"
          >
            {({ data, loading }) => {
              if (loading) return <Icon type="loading" size={64} />

              if (data && data.requests) {
                const { requests } = data

                if (requests.length === 0) {
                  return (
                    <Alert
                      message="No accepted requests."
                      type="info"
                      style={{ marginBottom: '1.1rem' }}
                    />
                  )
                }

                const needCards = requests.map(request => (
                  <NeedCard
                    key={request.id}
                    style={{ maxWidth: 400, marginBottom: 20 }}
                    actions={[
                      <Button type="primary" ghost>
                        Details
                      </Button>,

                      <Button type="primary" disabled={true}>
                        Accepted
                      </Button>,
                    ]}
                  >
                    <Meta
                      avatar={
                        <Avatar
                          size={64}
                          src={
                            request.recipient.avatar ||
                            'http://i.pravatar.cc/300'
                          }
                        />
                      }
                      title={request.need.title}
                      description={
                        <div style={{ marginBottom: '1rem' }}>
                          <div>
                            Type:{' '}
                            <Tag color="purple">{request.need.needType}</Tag>
                          </div>
                          <div>
                            When: {moment(request.need.date, 'x').format('LLL')}
                          </div>
                        </div>
                      }
                    />
                    <div>
                      <p>{request.need.notes}</p>
                    </div>
                  </NeedCard>
                ))

                return needCards
              }

              return null
            }}
          </Query>
        </Row>
      </div>
    </>
  )
}

export default () => <PrivateRoute component={UserNeeds} />
