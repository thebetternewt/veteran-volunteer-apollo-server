import { gql } from "apollo-server-express";

export default gql`
  enum AgeOptions {
    INFANT
    TODDLER
    CHILD
    TEENAGER
  }

  type ChildcareNeed {
    id: ID!
    age: [String!]!
  }

  input ChildcareNeedInput {
    age: [AgeOptions!]!
  }
`;
