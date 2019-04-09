import { gql } from 'apollo-server-express'

export default gql`
  enum RequestStatus {
    PENDING
    ACCEPTED
    REJECTED
    CANCELLED
    COMPLETED
  }

  enum UserRole {
    VOLUNTEER
    RECIPIENT
  }

  type Request {
    id: ID!
    need: Need!
    recipient: User!
    volunteer: User!
    initiator: UserRole!
    status: RequestStatus!
  }

  extend type Query {
    request(id: ID!): Request
    requests(userId: ID): [Request!]! # TODO: split into two queries for volunteers/recipients?
  }

  extend type Mutation {
    createRequest(recipient: ID, volunteer: ID!, need: ID!): Request
    updateRequestStatus(id: ID!, status: RequestStatus): Request
    deleteRequest(id: ID!): Boolean # TODO: Check if user owns request or if user is admin
  }
`
