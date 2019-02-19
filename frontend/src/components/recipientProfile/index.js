import { Icon } from 'antd'
import React, { useState } from 'react'
import { Query } from 'react-apollo'
import { ME_QUERY } from '../../apollo/queries'
import RecipientProfile from './RecipientProfile'
import RecipientProfileForm from './RecipientProfileForm'

export default () => {
  const [showForm, setShowForm] = useState(false)

  const toggleShowForm = () => setShowForm(!showForm)

  return (
    <Query query={ME_QUERY}>
      {({ data, loading }) => {
        // console.log(data, loading)

        if (loading) {
          return <Icon type="loading" />
        }

        if (data && data.me) {
          const { me } = data
          const { recipientProfile } = me

          if (recipientProfile) {
            recipientProfile.name = me.fullName
            recipientProfile.avatar = me.avatar

            if (showForm) {
              return (
                <RecipientProfileForm
                  profile={recipientProfile}
                  toggleForm={toggleShowForm}
                />
              )
            }

            return (
              <RecipientProfile
                profile={recipientProfile}
                editProfile={toggleShowForm}
              />
            )
          }
        }

        return <RecipientProfileForm />
      }}
    </Query>
  )
}

// export default RecipientProfile
