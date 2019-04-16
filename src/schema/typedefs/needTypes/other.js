import { gql } from 'apollo-server-express'

export default gql`
  type OtherNeed {
    id: ID!
    description: String!
  }

  input OtherNeedInput {
    description: String!
  }
`
