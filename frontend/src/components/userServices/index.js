import { Avatar, Button, Card, Divider, Icon, Row } from 'antd'
import { Link } from 'gatsby'
import moment from 'moment'
import React from 'react'
import { Query } from 'react-apollo'
import styled from 'styled-components'
import { ME_QUERY } from '../../apollo/queries'

const { Meta } = Card

const ServiceSectionHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 2rem;

  h2 {
    margin-right: 1rem;
  }
`

const ServiceCard = styled(Card)`
  width: 400px;
  max-width: 100%;
  margin: 0 1rem 1rem 0;

  .service-details {
    text-transform: capitalize;
    word-wrap: none;
  }

  @media screen and (max-width: 756px) {
    width: 380px;
    margin-right: 0;
  }
`

const UserServices = () => {
  return (
    <>
      <h3 style={{ color: '#777' }}>My Services</h3>
      <div>
        <ServiceSectionHeader>
          <h2>Requested</h2>
          <Link to="/app/request-service">
            <Button type="primary" icon="plus-circle">
              Request New Service
            </Button>
          </Link>
        </ServiceSectionHeader>
        <Row type="flex">
          <Query query={ME_QUERY}>
            {({ data, loading }) => {
              if (loading) return <Icon type="loading" size={64} />

              if (data && data.me) {
                console.log(data)
                const { me } = data
                const { requestedServices } = me

                const serviceCards = requestedServices.map(req => (
                  <ServiceCard
                    key={req.id}
                    style={{
                      maxWidth: 400,
                      marginBottom: 20,
                    }}
                    actions={[
                      <Icon type="info-circle" />,
                      <Icon type="message" />,
                    ]}
                  >
                    <Meta
                      avatar={
                        <Avatar icon="avatar" size={64} src={me.avatar} />
                      }
                      title={req.title}
                      description={
                        <div style={{ marginBottom: '1rem' }}>
                          <div className="service-details">
                            Type: {req.serviceType.toLowerCase()}
                          </div>
                          {req.date && (
                            <div className="service-details">
                              When: {moment(req.date, 'x').format('LLL')}
                            </div>
                          )}
                        </div>
                      }
                    />
                    <div>
                      <p>Lorem ipsum dolor sit amet.</p>
                    </div>
                  </ServiceCard>
                ))

                return serviceCards
              }

              return null
            }}
          </Query>
        </Row>
      </div>
      <Divider />
      <div>
        <ServiceSectionHeader>
          <h2>Volunteered</h2>
          <Button type="primary" icon="search">
            Browse Requested Services
          </Button>
        </ServiceSectionHeader>
        <Row type="flex">
          <ServiceCard
            style={{ maxWidth: 400, marginBottom: 20 }}
            actions={[<Icon type="info-circle" />, <Icon type="message" />]}
          >
            <Meta
              avatar={
                <Avatar
                  size={64}
                  src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairCurly&accessoriesType=Prescription02&hairColor=Brown&facialHairType=Blank&clotheType=Overall&clotheColor=Pink&eyeType=Surprised&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Brown"
                />
              }
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
          </ServiceCard>
        </Row>
      </div>
    </>
  )
}

export default UserServices
