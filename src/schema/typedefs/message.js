import { gql } from 'apollo-server-express'

export default gql`
  type Message {
    id: ID!
    sender: User!
    recipient: User!
    associatedNeed: Need
    message: String!
    read: Boolean!
  }

  extend type Query {
    message(id: ID!): Message @auth
    messages(all: Boolean = false): [Message!]! @auth
  }

  extend type Mutation {
    createMessage(
      recipient: ID!
      associatedNeed: ID
      message: String!
    ): Message @auth
    markMessageRead(messageId: ID!): Message @auth
    deleteMessage(messageId: ID!): Boolean @auth # TODO: Check if user owns message
  }
`
