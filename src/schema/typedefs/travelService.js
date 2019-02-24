import { gql } from 'apollo-server-express'

export default gql`
  type Location {
    lat: Float!
    lng: Float!
  }

  type TravelService {
    id: ID!
    fromName: String!
    fromLocation: Location!
    toName: String!
    toLocation: Location!
  }

  input LocationInput {
    lat: Float
    lng: Float
  }

  input TravelServiceInput {
    fromName: String!
    fromLocation: LocationInput!
    toName: String!
    toLocation: LocationInput!
  }
`
