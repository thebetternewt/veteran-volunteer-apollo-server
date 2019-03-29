import { SchemaDirectiveVisitor } from 'apollo-server-express'
import { defaultFieldResolver } from 'graphql'
import { ensureAdmin } from '../../auth'

class AdminDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = function(...args) {
      const [, , context] = args

      if (!ensureAdmin(context.req)) return null

      return resolve.apply(this, args)
    }
  }
}

export default AdminDirective
