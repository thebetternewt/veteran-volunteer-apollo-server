import { AuthenticationError } from 'apollo-server-express'
import { User } from './models'

export const attemptSignIn = async (email, password) => {
  const message = 'Incorrect email or password. Please try again.'

  const user = await User.findOne({ email })

  if (!user || !(await user.matchesPassword(password))) {
    throw new AuthenticationError(message)
  }

  return user
}

const signedIn = context => context.user

export const ensureSignedIn = context => {
  if (!signedIn(context)) {
    throw new AuthenticationError('You must be signed in.')
  }
}

export const ensureSignedOut = context => {
  if (signedIn(context)) {
    throw new AuthenticationError('You are already signed in.')
  }
}

const isAdmin = context => context.user.admin

export const ensureAdmin = context => {
  if (!signedIn(context) || !isAdmin(context)) {
    return false
  }

  return true
}
