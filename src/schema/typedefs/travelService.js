import { gql } from 'apollo-server-express'

export default gql`
  type Location {
    address: String!
    lat: Float!
    lng: Float!
  }

  type TravelService {
    id: ID!
    fromLocation: Location!
    toLocation: Location!
  }

  input LocationInput {
    address: String!
    lat: Float!
    lng: Float!
  }

  input TravelServiceInput {
    fromLocation: LocationInput!
    toLocation: LocationInput!
  }
`
