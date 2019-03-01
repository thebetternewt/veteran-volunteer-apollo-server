import { Redirect, Router } from '@reach/router'
import React from 'react'
import { getAuthenticatedUser } from '../../apollo/client'
import PrivateRoute from '../../components/common/PrivateRoute'
import Dashboard from '../../components/layouts/dashboard/Dashboard'
import RecipientProfile from '../../components/recipientProfile'
import UserServices from '../../components/userServices'
import CreateService from '../../components/userServices/CreateService'
import VolunteerProfileForm from '../../components/VolunteerProfile'

const AppIndex = props => {
  const user = getAuthenticatedUser()
  if (!user) {
    return <Redirect to="/" noThrow />
  }

  return (
    <Dashboard>
      <Router>
        <UserServices default path="app/services" />
        <VolunteerProfileForm path="app/volunteer-signup" />
        <RecipientProfile path="app/recipient-profile" />
        <CreateService path="app/request-service" />
      </Router>
    </Dashboard>
  )
}

export default props => <PrivateRoute component={AppIndex} {...props} />
