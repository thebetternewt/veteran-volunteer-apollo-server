import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express'
import { typeDefs, resolvers } from './schema'
import AuthDirective from './schema/directives/auth'
import { User } from './models'

dotenv.config()

const PORT = process.env.PORT || 4000
const IN_PROD = process.env.NODE_ENV === 'production'

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    const playground = IN_PROD
      ? false
      : {
          settings: {
            'editor.cursorShape': 'block',
          },
        }

    const corsOptions = {
      origin: IN_PROD ? process.env.FRONTEND_URL : '*',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    }

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
      resolverValidationOptions: {
        requireResolversForResolveType: false,
      },
    })

    const server = new ApolloServer({
      schema,
      schemaDirectives: {
        auth: AuthDirective,
      },
      playground,
      cors: true,
      context: async ({ req }) => {
        // get the user token from the headers
        const authorization = req.headers.authorization || ''
        const bearerLength = 'Bearer '.length
        const token = authorization.slice(bearerLength)

        // try to retrieve a user with the token
        const user = await getUser(token)

        // add the user to the context
        return { user }
      },
    })

    const app = express()
    app.use(cors(corsOptions))
    server.applyMiddleware({ app })

    app.listen({ port: PORT }, () =>
      console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
      )
    )
  })
  .catch(err => console.error(err))

const getUser = async token => {
  const { ok, result } = await new Promise(resolve =>
    jwt.verify(token, process.env.JWT_SECRET, (err, jwtResult) => {
      if (err) {
        resolve({
          ok: false,
          result: err,
        })
      } else {
        resolve({
          ok: true,
          result: jwtResult,
        })
      }
    })
  )

  if (ok) {
    const user = await User.findOne({ _id: result.id })
    return user
  }
  return null
}
