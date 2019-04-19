import React from 'react'
import moment from 'moment'
import { Query } from 'react-apollo'
import { NEEDS_QUERY } from '../../apollo/queries'
import Loader from '../common/Loader'
import graphQlErrors from '../../util/graphqlErrors'
import styled from 'styled-components'
import { Avatar, Button, Card, Tag } from 'antd'
import { Link } from '@reach/router'
import { needTypes } from '../../constants'

const { Meta } = Card

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

const NeedSearch = () => {
  return (
    <div>
      <h2>Need Search</h2>
      <div>
        <Query query={NEEDS_QUERY}>
          {({ data, loading, error }) => {
            if (loading) {
              return <Loader />
            }

            {
              error && graphQlErrors(error)
            }

            if (data && data.needs) {
              console.log(data)

              // Filter for needs that do have an accepted or completed request.
              const availableNeeds = data.needs.filter(
                need =>
                  need.requests.filter(req =>
                    ['ACCEPTED', 'COMPLETED'].includes(req.status)
                  ).length === 0
              )

              console.log('available:', availableNeeds)
              return availableNeeds.map(need => (
                <NeedCard
                  key={need.id}
                  style={{
                    maxWidth: 400,
                    marginBottom: 20,
                  }}
                  actions={[
                    <Button type="primary" ghost>
                      Details
                    </Button>,
                    <Button type="primary">Request to Help</Button>,
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
                            needTypes.find(type => type.value === need.needType)
                              .label
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
                    {need.location && (
                      <div className="need-details" style={{ opacity: 0.6 }}>
                        {need.location.address}
                      </div>
                    )}
                  </div>
                </NeedCard>
              ))
            }

            return null
          }}
        </Query>
      </div>
    </div>
  )
}

export default NeedSearch
