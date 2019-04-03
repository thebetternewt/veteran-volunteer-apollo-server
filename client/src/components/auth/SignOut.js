import React, { useContext, useEffect } from 'react'
import { Mutation } from 'react-apollo'
import { SIGN_OUT } from '../../apollo/mutations'
import { AuthContext } from '../../contexts/auth.context'
import { clearUserToken } from '../../util/tokens'

const CallSignOut = ({ signOut }) => {
  const authContext = useContext(AuthContext)

  useEffect(() => {
    const handleSignOut = async () => {
      console.log('Signing out...')
      await signOut()
      clearUserToken()
      authContext.setAuthenticatedUser(null)
      window.location.replace('/')
    }

    handleSignOut()
  }, [])

  return null
}

const SignOut = () => {
  return (
    <Mutation mutation={SIGN_OUT}>
      {signOut => <CallSignOut signOut={signOut} />}
    </Mutation>
  )
}

export default SignOut
