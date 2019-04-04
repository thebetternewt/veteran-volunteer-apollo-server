import { Icon } from 'antd'
import React, { useState } from 'react'
import { Query } from 'react-apollo'
import { ME_QUERY } from '../../apollo/queries'
import PrivateRoute from '../common/PrivateRoute'
import VolunteerProfile from './VolunteerProfile'
import VolunteerProfileForm from './VolunteerProfileForm'

const VolunteerProfileIndex = () => {
  const [showForm, setShowForm] = useState(false)

  const toggleShowForm = () => setShowForm(!showForm)

  return (
    <Query query={ME_QUERY}>
      {({ data, loading }) => {
        if (loading) {
          return <Icon type="loading" />
        }

        if (data && data.me) {
          const { me } = data
          const { volunteerProfile } = me

          if (volunteerProfile) {
            volunteerProfile.name = me.fullName
            volunteerProfile.avatar = me.avatar

            if (showForm) {
              return (
                <VolunteerProfileForm
                  profile={volunteerProfile}
                  toggleForm={toggleShowForm}
                />
              )
            }

            return (
              <VolunteerProfile
                profile={volunteerProfile}
                toggleForm={toggleShowForm}
              />
            )
          }
        }

        return <VolunteerProfileForm />
      }}
    </Query>
  )
}

export default () => <PrivateRoute component={VolunteerProfileIndex} />
