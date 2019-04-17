import { Link } from '@reach/router'
import { Alert, Avatar, Button, Card, Divider, Icon, Row, Tag } from 'antd'
import moment from 'moment'
import React from 'react'
import { Mutation, Query } from 'react-apollo'
import styled from 'styled-components'
import { ACCEPT_REQUEST } from '../../apollo/mutations'
import { REQUESTS_QUERY, NEEDS_QUERY, ME_QUERY } from '../../apollo/queries'
import PrivateRoute from '../common/PrivateRoute'
import { needTypes } from '../../constants'

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
  height: 100%;

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
          <Query query={ME_QUERY}>
            {({ data }) => {
              if (data && data.me) {
                if (data.me.recipientProfile) {
                  return (
                    <Link to="/request-need">
                      <Button type="primary" icon="plus-circle">
                        Request New Need
                      </Button>
                    </Link>
                  )
                }

                return (
                  <Link to="/recipient-profile">
                    <Button type="primary">
                      Create Recipient Profile <Icon type="right-circle" />
                    </Button>
                  </Link>
                )
              }
              return null
            }}
          </Query>
        </NeedSectionHeader>
        <Row type="flex">
          <Query query={NEEDS_QUERY} variables={{ currentUser: true }}>
            {({ data, loading }) => {
              if (loading) return <Icon type="loading" size={64} />

              if (data && data.needs) {
                const { needs } = data

                console.log('needs:', needs)

                const needCards = needs.map(need => (
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
                      <>
                        {need.requests.filter(
                          req =>
                            !['CANCELLED', 'COMPLETED'].includes(req.status)
                        ).length === 0 ? (
                          <Link to={`/volunteer-search/${need.id}`}>
                            <Button type="primary">Find a Volunteer</Button>
                          </Link>
                        ) : (
                          <Button type="danger" ghost>
                            Cancel Request
                          </Button>
                        )}
                      </>,
                    ]}
                  >
                    <Meta
                      avatar={
                        <Avatar
                          icon="avatar"
                          size={64}
                          src={need.recipient.avatar}
                        />
                      }
                      title={need.title}
                      description={
                        <div style={{ marginBottom: '1rem' }}>
                          <div className="need-details">
                            Type:{' '}
                            {
                              needTypes.find(
                                type => type.value === need.needType
                              ).label
                            }
                          </div>
                          {need.date && (
                            <div className="need-details">
                              When: {moment(need.date, 'x').format('LLL')}
                            </div>
                          )}
                          {need.requests[0] && (
                            <Tag
                              color={
                                need.requests[0].status === 'PENDING'
                                  ? 'gold'
                                  : 'green'
                              }
                              style={{ marginTop: 8 }}
                            >
                              {need.requests[0].status}
                            </Tag>
                          )}
                        </div>
                      }
                    />
                    <div>
                      <p>{need.notes || need.needDetails.description}</p>
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
                          <Tag
                            color={
                              request.status === 'PENDING' ? 'gold' : 'green'
                            }
                          >
                            {request.status}
                          </Tag>
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
          {/* <Button type="primary" icon="search">
            Browse Requested Needs
          </Button> */}
          <Query query={ME_QUERY}>
            {({ data }) => {
              if (data && data.me) {
                if (data.me.volunteerProfile) {
                  return (
                    <Link to="/needs">
                      <Button type="primary" icon="plus-circle">
                        Browse Requested Needs
                      </Button>
                    </Link>
                  )
                }

                return (
                  <Link to="/volunteer-profile">
                    <Button type="primary">
                      Create Volunteer Profile <Icon type="right-circle" />
                    </Button>
                  </Link>
                )
              }
              return null
            }}
          </Query>
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
