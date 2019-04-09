import { Icon } from 'antd'
import React from 'react'
import { Query } from 'react-apollo'
import {
  NEED_QUERY,
  VOLUNTEER_PROFILES_FOR_NEED_QUERY,
} from '../../apollo/queries'
import VolunteerCard from './VolunteerCard'

const VolunteerSearch = props => {
  console.log('search props:', props)
  const { needId } = props

  const loader = <Icon type="loading" style={{ fontSize: 24 }} spin />

  return (
    <div>
      <h1>Volunteer Search...</h1>
      <Query query={NEED_QUERY} variables={{ id: needId }}>
        {({ data, loading: needLoading, error }) => {
          if (needLoading) {
            return loader
          }

          if (data && data.need) {
            const { need } = data
            console.log('need:', need)

            const {
              needType,
              location: { __typename, ...location }, // strip __typename field from location
            } = need

            return (
              <Query
                query={VOLUNTEER_PROFILES_FOR_NEED_QUERY}
                variables={{ needType, location }}
                fetchPolicy="network-only"
              >
                {({ data, loading: volunteersLoading, error }) => {
                  if (volunteersLoading) {
                    return loader
                  }

                  if (data && data.volunteerProfilesForNeed) {
                    const { volunteerProfilesForNeed: profiles } = data
                    console.log('profiles:', profiles)

                    return profiles.map(profile => (
                      <VolunteerCard key={profile.id} profile={profile} />
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
