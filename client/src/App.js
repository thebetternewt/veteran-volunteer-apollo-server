import { Router } from '@reach/router'
import React, { useContext } from 'react'
import LoginForm from './components/auth/LoginForm'
import SignOut from './components/auth/SignOut'
import SignupForm from './components/auth/SignupForm'
import Dashboard from './components/layouts/dashboard/Dashboard'
import RecipientProfile from './components/recipientProfile'
import UserServices from './components/userServices'
import CreateService from './components/userServices/CreateService'
import { AuthContext } from './contexts/auth.context'

const App = () => {
  const authContext = useContext(AuthContext)

  return (
    <Router primary={false}>
      <Dashboard path="/">
        <LoginForm default path="signin" />
        <SignupForm path="signup" />
        <UserServices path="needs" />
        <RecipientProfile path="recipient-profile" />
        <CreateService path="request-need" />
        <SignOut path="signout" />
        {/* <VolunteerProfileForm path="app/volunteer-signup" />  */}
      </Dashboard>
    </Router>
  )
}

export default App
