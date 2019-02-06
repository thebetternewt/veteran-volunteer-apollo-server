import { gql } from 'apollo-server-express'

export default gql`
  type RecipientProfile {
    id: ID!
    user: User!
    branch: String
    deployed: Boolean!
    location: [Float]
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    recipientProfile(id: ID!): RecipientProfile
    recipientProfiles: [RecipientProfile!]!
  }

  extend type Mutation {
    createRecipientProfile(
      branch: String
      deployed: Boolean
      lat: Float
      long: Float
    ): RecipientProfile
  }
`
