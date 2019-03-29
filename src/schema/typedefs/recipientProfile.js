import { gql } from 'apollo-server-express'

export default gql`
  type RecipientProfile {
    id: ID!
    user: User!
    allowPhoneContact: Boolean!
    allowEmailContact: Boolean!
    location: Location
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    recipientProfile(id: ID!): RecipientProfile @auth
    recipientProfiles: [RecipientProfile!]! @auth
  }

  extend type Mutation {
    createRecipientProfile(
      allowPhoneContact: Boolean
      allowEmailContact: Boolean
      location: LocationInput
    ): RecipientProfile @auth
    updateRecipientProfile(
      allowPhoneContact: Boolean
      allowEmailContact: Boolean
      location: LocationInput
    ): RecipientProfile @auth
  }
`
