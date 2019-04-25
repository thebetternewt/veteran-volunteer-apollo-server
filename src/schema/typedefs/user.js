import { gql } from 'apollo-server-express'

export default gql`
  type Address {
    street1: String
    street2: String
    city: String
    state: String
    zipcode: String
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
    age: Int! #@admin
    email: String #@admin
    phone: String #@admin
    address: Address #@admin
    avatar: String
    createdAt: String
    updatedAt: String
    admin: Boolean
    active: Boolean
    recipientProfile: RecipientProfile
    volunteerProfile: VolunteerProfile
    requestedNeeds: [Need!]!
    volunteeredNeeds: [Need!]!
  }

  extend type Query {
    me: User @auth
    user(id: ID!): User @auth
    users(limit: Int = 100): [User!]! @auth
  }

  extend type Mutation {
    signUp(
      firstName: String!
      middleName: String
      lastName: String!
      age: Int!
      email: String!
      phone: String!
      address: AddressInput!
      password: String!
    ): User @guest
    signIn(email: String!, password: String!): User @guest
    signOut: Boolean
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
      active: Boolean
    ): User! @auth
    makeAdmin(id: ID!): Boolean @admin
    deleteUser(id: ID!): Boolean @admin
    activateUser(id: ID!): Boolean @admin
    deactivateUser(id: ID!): Boolean @admin
  }
`
