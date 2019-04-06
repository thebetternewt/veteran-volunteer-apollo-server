import React, { useEffect } from 'react';
import { Mutation } from 'react-apollo';
import { SIGN_OUT } from '../../apollo/mutations';

const CallSignOut = ({ signOut }) => {

  useEffect(() => {
    const handleSignOut = async () => {
      console.log('Signing out...')
      await signOut()

      window.location.replace('/signin')
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
