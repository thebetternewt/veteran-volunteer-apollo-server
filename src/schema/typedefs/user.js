const { gql } = require('apollo-server-express')

module.exports = gql`
  type User {
    id: ID!
    firstName: String!
    middleName: String
    lastName: String!
    age: Int!
    email: String!
    avatar: String
    admin: Boolean
    active: Boolean!
    createdAt: String
    updatedAt: String
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
      password: String
      admin: Boolean
      active: Boolean
    ): User!
    deleteUser(id: ID!): String!
  }
`
