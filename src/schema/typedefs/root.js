import { gql } from "apollo-server-express";

export default gql`
  directive @auth on FIELD_DEFINITION
  directive @guest on FIELD_DEFINITION
  directive @admin on FIELD_DEFINITION

  type Location {
    address: String!
    lat: Float!
    lng: Float!
  }

  input LocationInput {
    address: String!
    lat: Float!
    lng: Float!
  }

  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
`;
