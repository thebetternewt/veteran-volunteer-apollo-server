import { gql } from "apollo-server-express";

export default gql`
  type LawncareNeed {
    id: ID!
    equipmentNeeded: Boolean!
    description: String
  }

  input LawncareNeedInput {
    equipmentNeeded: Boolean!
    description: String!
  }

  # extend type Query {
  #   lawncareNeed(id: ID!): LawncareNeed
  #   lawncareNeeds: [LawncareNeed!]!
  # }

  # extend type Mutation {
  #   createLawncareNeed(
  #     equipmentNeeded: Boolean
  #     description: String
  #     serviceId: String!
  #   ): LawncareNeed
  # }
`;
