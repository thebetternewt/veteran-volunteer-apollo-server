import { Router } from '@reach/router'
import React from 'react'
import LoginForm from './components/auth/LoginForm'
import SignupForm from './components/auth/SignupForm'
import Dashboard from './components/layouts/dashboard/Dashboard'
import RecipientProfile from './components/recipientProfile'
import UserServices from './components/userServices'
import CreateService from './components/userServices/CreateService'

const App = () => (
  <Router primary={false}>
    <Dashboard path="/">
      <LoginForm default path="login" />
      <SignupForm path="signup" />
      <UserServices path="services" />
      <RecipientProfile path="recipient-profile" />
      <CreateService path="app/request-service" />
      {/* <VolunteerProfileForm path="app/volunteer-signup" />  */}
    </Dashboard>
  </Router>
)

export default App
