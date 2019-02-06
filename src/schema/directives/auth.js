import {
  SchemaDirectiveVisitor,
  AuthenticationError,
} from 'apollo-server-express'

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    const { role } = this.args

    field.resolve = async (...args) => {
      const [, , ctx] = args

      if (ctx.req && ctx.user) {
        if (role && !ctx.req.user.admin) {
          throw new AuthenticationError(
            'You are not authorized to view this resource.'
          )
        } else {
          const result = await resolve.apply(this, args)
          return result
        }
      } else {
        throw new AuthenticationError(
          'You must be signed in to view this resource.'
        )
      }
    }
  }
}

export default AuthDirective
