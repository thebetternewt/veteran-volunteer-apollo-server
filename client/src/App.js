import { Router } from '@reach/router'
import React from 'react'
import { getAuthenticatedUser } from './apollo/client'
import LoginForm from './components/auth/LoginForm'
import SignupForm from './components/auth/SignupForm'
import Dashboard from './components/layouts/dashboard/Dashboard'
import UserServices from './components/userServices/index'

const App = props => {
  const user = getAuthenticatedUser()
  // if (!user) {
  //   return <Redirect to="/" noThrow />
  // }

  return (
    <Router>
      <Dashboard path="/">
        <LoginForm default path="login" />
        <SignupForm path="signup" />
        <UserServices path="services" />
        {/* <VolunteerProfileForm path="app/volunteer-signup" />
        <RecipientProfile path="app/recipient-profile" />
        <CreateService path="app/request-service" /> */}
      </Dashboard>
    </Router>
  )
}

export default App
