import { Router } from '@reach/router'
import React from 'react'
import LoginForm from './components/auth/LoginForm'
import SignOut from './components/auth/SignOut'
import SignupForm from './components/auth/SignupForm'
import Dashboard from './components/layouts/dashboard/Dashboard'
import RecipientProfile from './components/recipientProfile'
import VolunteerSearch from './components/search/VolunteerSearch'
import UserNeeds from './components/userNeeds'
import CreateNeed from './components/userNeeds/CreateNeed'
import VolunteerProfile from './components/volunteerProfile/index'
import NeedSearch from './components/search/NeedSearch'

const App = () => (
  <Router primary={false}>
    <Dashboard path="/">
      <LoginForm default path="signin" />
      <SignupForm path="signup" />
      <UserNeeds path="dashboard" />
      <VolunteerProfile path="volunteer-profile" />
      <RecipientProfile path="recipient-profile" />
      <CreateNeed path="request-need" />
      <VolunteerSearch path="volunteer-search/:needId" />
      <NeedSearch path="needs" />
      <SignOut path="signout" />
    </Dashboard>
  </Router>
)

export default App
