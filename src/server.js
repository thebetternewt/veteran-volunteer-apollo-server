import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import express from 'express';
import session from 'express-session';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import Redis from 'ioredis';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { FRONTEND_URL, IN_PROD, PORT, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, SESS_LIFETIME, SESS_NAME, SESS_SECRET } from './config';
import { User } from './models';
import { resolvers, typeDefs } from './schema';
import schemaDirectives from './schema/directives';

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    })

    const app = express()
    app.disable('x-powered-by')

    const corsOptions = {
      origin: FRONTEND_URL,
      credentials: true,
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    }

    const storeParams = IN_PROD
      ? { client: new Redis(process.env.REDIS_URL) }
      : {
          host: REDIS_HOST,
          port: REDIS_PORT,
          pass: REDIS_PASSWORD,
        }

    // Connect Redis
    const RedisStore = connectRedis(session)
    const store = new RedisStore({client: })

    app.use(
      session({
        store,
        name: SESS_NAME,
        resave: false,
        saveUninitialized: false,
        secret: SESS_SECRET,
        cookie: {
          maxAge: SESS_LIFETIME,
          sameSite: true,
          secure: IN_PROD,
        },
      })
    )

    // Initialize GraphQL Voyager
    app.use(
      '/voyager',
      voyagerMiddleware({
        endpointUrl: '/graphql',
      })
    )

    // TODO: Disable playground in production (uncomment code below and update in server constructor)
    // const playground = IN_PROD
    //   ? false
    //   : {
    //       settings: {
    //         'editor.cursorShape': 'block',
    //       },
    //     }

    const schema = makeExecutableSchema({
      typeDefs,
      schemaDirectives,
      resolvers,
      resolverValidationOptions: {
        requireResolversForResolveType: false,
      },
    })

    const server = new ApolloServer({
      schema,
      introspection: true,
      playground: {
        settings: {
          'editor.cursorShape': 'block',
          'request.credentials': 'include',
        },
      },
      context: async ({ req, res }) => {
        console.log('request...')
        return { req, res }
      },
    })

    server.applyMiddleware({ app, cors: corsOptions })

    app.listen({ port: PORT }, () =>
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      )
    )
  } catch (err) {
    console.error(err)
  }
}

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

main()

export { mongoose };
