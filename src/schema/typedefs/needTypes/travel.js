import { gql } from "apollo-server-express";

export default gql`
  type TravelNeed {
    id: ID!
    fromLocation: Location!
    toLocation: Location!
  }

  input TravelNeedInput {
    fromLocation: LocationInput!
    toLocation: LocationInput!
  }
`;
