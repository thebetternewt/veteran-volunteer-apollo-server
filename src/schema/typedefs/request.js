import { gql } from 'apollo-server-express'

export default gql`
  enum RequestStatus {
    PENDING
    ACCEPTED
    REJECTED
  }

  enum UserRole {
    VOLUNTEER
    RECIPIENT
  }

  type Request {
    id: ID!
    service: Service!
    recipient: User!
    volunteer: User!
    initiator: UserRole!
    status: RequestStatus!
  }

  extend type Query {
    request(id: ID!): Request
    requests(userId: ID!): [Request!]! # TODO: split into two queries for volunteers/recipients?
  }

  extend type Mutation {
    createRequest(
      service: ID!
      recipient: ID!
      volunteer: ID!
      status: RequestStatus!
    ): Request
    updateRequestStatus(id: ID!, status: RequestStatus): Request
    deleteRequest(id: ID!): Boolean # TODO: Check if user owns request or if user is admin
  }
`