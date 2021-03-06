import { gql } from 'apollo-server-express'

export default gql`
  type LawncareNeed {
    id: ID!
    equipmentNeeded: Boolean!
    description: String!
  }

  input LawncareNeedInput {
    equipmentNeeded: Boolean!
    description: String!
  }
`
