import { gql } from 'apollo-server-express'

export default gql`
  enum AgeOptions {
    INFANT
    TODDLER
    CHILD
    TEENAGER
  }

  type ChildcareService {
    id: ID!
    age: [String!]!
  }

  input ChildcareServiceInput {
    age: [AgeOptions!]!
  }
`
