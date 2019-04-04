import { Router } from '@reach/router'
import React from 'react'
import LoginForm from './components/auth/LoginForm'
import SignOut from './components/auth/SignOut'
import SignupForm from './components/auth/SignupForm'
import Dashboard from './components/layouts/dashboard/Dashboard'
import RecipientProfile from './components/recipientProfile'
import UserServices from './components/userServices'
import CreateService from './components/userServices/CreateService'
import VolunteerProfile from './components/volunteerProfile/index'

const App = () => (
  <Router primary={false}>
    <Dashboard path="/">
      <LoginForm default path="signin" />
      <SignupForm path="signup" />
      <UserServices path="dashboard" />
      <VolunteerProfile path="volunteer-profile" />
      <RecipientProfile path="recipient-profile" />
      <CreateService path="request-need" />
      <SignOut path="signout" />
    </Dashboard>
  </Router>
)

export default App
