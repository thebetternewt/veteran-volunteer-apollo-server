import { AuthenticationError } from 'apollo-server-express'
import { SESS_NAME } from './config'
import { User } from './models'

export const attemptSignIn = async (email, password) => {
  const message = 'Incorrect email or password. Please try again.'

  const user = await User.findOne({ email: email.toLowerCase() })

  if (!user || !(await user.matchesPassword(password))) {
    throw new AuthenticationError(message)
  }

  return user
}

const signedIn = req => req.session.userId

export const ensureSignedIn = req => {
  if (!signedIn(req)) {
    throw new AuthenticationError('You must be signed in.')
  }
}

export const ensureSignedOut = req => {
  if (signedIn(req)) {
    throw new AuthenticationError('You are already signed in.')
  }
}

export const signOut = (req, res) =>
  new Promise((resolve, reject) => {
    req.session.destroy(err => {
      if (err) reject(err)

      res.clearCookie(SESS_NAME)

      resolve(true)
    })
  })

const isAdmin = req => req.session.admin

export const ensureAdmin = req => {
  if (!signedIn(req) || !isAdmin(req)) {
    return false
  }

  return true
}
