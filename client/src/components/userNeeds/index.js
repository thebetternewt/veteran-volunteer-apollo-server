import { Link } from '@reach/router'
import { Avatar, Button, Card, Divider, Icon, Row } from 'antd'
import moment from 'moment'
import React from 'react'
import { Query } from 'react-apollo'
import styled from 'styled-components'
import { ME_QUERY } from '../../apollo/queries'
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
                console.log(data)
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
          <h2>Volunteered</h2>
          <Button type="primary" icon="search">
            Browse Requested Needs
          </Button>
        </NeedSectionHeader>
        <Row type="flex">
          <NeedCard
            style={{ maxWidth: 400, marginBottom: 20 }}
            actions={[<Icon type="info-circle" />, <Icon type="message" />]}
          >
            <Meta
              avatar={<Avatar size={64} src="http://i.pravatar.cc/300" />}
              title="Leaky faucet"
              description={
                <div style={{ marginBottom: '1rem' }}>
                  <div>Type: Home Repair</div>
                  <div>When: Thursday, March 1st</div>
                </div>
              }
            />
            <div>
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
          </NeedCard>
        </Row>
      </div>
    </>
  )
}

export default () => <PrivateRoute component={UserNeeds} />
