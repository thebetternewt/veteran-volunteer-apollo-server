import { Redirect, Router } from '@reach/router'
import React from 'react'
import VolunteerProfile from '../../../../src/models'
import { getAuthenticatedUser } from '../../apollo/client'
import PrivateRoute from '../../components/privateRoute'
import RecipientProfile from '../../components/recipientProfile'
import UserServices from '../../components/userServices/index'
import Dashboard from './dashboard'

const AppIndex = props => {
  const user = getAuthenticatedUser()
  if (!user) {
    return <Redirect to="/" noThrow />
  }

  return (
    <Dashboard>
      <Router>
        <UserServices default path="app/services" />
        <VolunteerProfile path="app/volunteer-signup" />
        <RecipientProfile path="app/recipient-profile" />
      </Router>
    </Dashboard>
  )
}

export default props => <PrivateRoute component={AppIndex} {...props} />
