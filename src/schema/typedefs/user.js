import { gql } from 'apollo-server-express'

export default gql`
  type Address {
    street1: String!
    street2: String
    city: String!
    state: String!
    zipcode: String!
  }

  input AddressInput {
    street1: String!
    street2: String
    city: String!
    state: String!
    zipcode: String!
  }

  type User {
    id: ID!
    firstName: String
    middleName: String
    lastName: String
    fullName: String
    age: Int!
    email: String
    phone: String
    address: Address
    avatar: String
    admin: Boolean
    active: Boolean!
    createdAt: String
    updatedAt: String
    recipientProfile: RecipientProfile
    volunteerProfile: RecipientProfile
    requestedServices: [Service!]!
  }

  extend type Query {
    me: User
    user(id: ID!): User
    users(limit: Int): [User!]!
  }

  extend type Mutation {
    signup(
      firstName: String!
      middleName: String
      lastName: String!
      age: Int!
      email: String!
      phone: String!
      address: AddressInput!
      password: String!
    ): User
    login(email: String!, password: String!): String
    updateUser(
      id: ID!
      firstName: String
      middleName: String
      lastName: String
      age: Int
      email: String
      phone: String
      address: AddressInput
      password: String
      admin: Boolean
      active: Boolean
    ): User!
    deleteUser(id: ID!): String!
  }
`
