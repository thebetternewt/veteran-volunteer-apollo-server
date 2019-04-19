import { notification, Alert } from 'antd'
import React from 'react'
import { Mutation, Query } from 'react-apollo'
import { CREATE_REQUEST } from '../../apollo/mutations'
import {
  NEED_QUERY,
  VOLUNTEER_PROFILES_FOR_NEED_QUERY,
} from '../../apollo/queries'
import VolunteerCard from './VolunteerCard'
import Loader from '../common/Loader'

const VolunteerSearch = props => {
  const { needId, navigate } = props
  console.log(props)

  const openNotificationWithIcon = ({ type, message, description }) => {
    notification[type]({
      message,
      description,
    })
  }

  return (
    <div>
      <h1>Volunteer Search...</h1>
      <Query
        query={NEED_QUERY}
        variables={{ id: needId }}
        fetchPolicy="no-cache"
      >
        {({ data: needData, loading: needLoading, error }) => {
          console.log('needData:', needData)
          console.log('needLoading:', needLoading)
          if (needLoading) {
            return <Loader />
          }

          if (needData && needData.need) {
            const { need } = needData

            console.log('need:', need)

            const {
              needType,
              location: { __typename, ...location }, // strip __typename field from location
            } = need

            return (
              <Query
                query={VOLUNTEER_PROFILES_FOR_NEED_QUERY}
                variables={{ needType, location }}
                fetchPolicy="no-cache"
              >
                {({
                  data: profilesData,
                  loading: volunteersLoading,
                  error,
                }) => {
                  if (volunteersLoading) {
                    return <Loader />
                  }

                  if (profilesData && profilesData.volunteerProfilesForNeed) {
                    const { volunteerProfilesForNeed: profiles } = profilesData

                    console.log('searchData:', profilesData)

                    if (profiles.length === 0) {
                      return (
                        <Alert
                          message="No profiles found."
                          type="info"
                          style={{ marginBottom: '1.1rem', maxWidth: 500 }}
                        />
                      )
                    }

                    return profiles.map(profile => (
                      <Mutation mutation={CREATE_REQUEST} key={profile.id}>
                        {(
                          createRequest,
                          { data: requestData, loading: requestLoading, error }
                        ) => {
                          console.log('requestData:', requestData)
                          console.log('requestLoading:', requestLoading)

                          if (error) console.log(error)
                          const handleCreateRequest = async volunteerId => {
                            const variables = {
                              volunteer: volunteerId,
                              need: needId,
                            }
                            try {
                              const result = await createRequest({ variables })
                              console.log('result:', result)

                              // Notify user if success
                              openNotificationWithIcon({
                                type: 'success',
                                message: 'Request sent!',
                                description: `We will notify ${
                                  profile.user.firstName
                                } of your request.`,
                              })

                              navigate('/dashboard')
                            } catch (err) {
                              openNotificationWithIcon({
                                type: 'error',
                                message: 'Error',
                                description: err,
                              })
                              console.log('error:', err)
                            }
                          }
                          return (
                            <VolunteerCard
                              profile={profile}
                              createRequest={handleCreateRequest}
                              loading={requestLoading}
                              error={error}
                            />
                          )
                        }}
                      </Mutation>
                    ))
                  }

                  return null
                }}
              </Query>
            )
          }

          return null
        }}
      </Query>
    </div>
  )
}

export default VolunteerSearch
