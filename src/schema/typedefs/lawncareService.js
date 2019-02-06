import { gql } from 'apollo-server-express'

export default gql`
  type LawncareService {
    id: ID!
    equipmentNeeded: Boolean!
    description: String
  }

  extend type Query {
    lawncareService(id: ID!): LawncareService
    lawncareServices: [LawncareService!]!
  }

  extend type Mutation {
    createLawncareService(
      equipmentNeeded: Boolean
      description: String
      serviceId: String!
    ): LawncareService
  }
`
