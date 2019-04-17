import { gql } from 'apollo-server-express'

export default gql`
  union NeedDetails =
      TravelNeed
    | LawncareNeed
    | ChildcareNeed
    | HomeMaintenanceNeed
    | OtherNeed

  enum NeedType {
    TRAVEL
    LAWNCARE
    CHILDCARE
    HOME_MAINTENANCE
    OTHER
  }

  type Need {
    id: ID!
    title: String!
    date: String!
    needType: String!
    needDetails: NeedDetails
    notes: String
    location: Location!
    recipient: User!
    volunteer: User
    requests: [Request!]
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    need(id: ID!): Need @auth
    needs(
      currentUser: Boolean
      needType: NeedType
      location: LocationInput
      """
      Radius in miles
      """
      range: Int
    ): [Need!]! @auth
  }

  extend type Mutation {
    createNeed(
      needType: NeedType!
      title: String!
      date: String!
      notes: String
      location: LocationInput!
      travelNeedDetails: TravelNeedInput
      childcareNeedDetails: ChildcareNeedInput
      homeMaintenanceNeedDetails: HomeMaintenanceNeedInput
      otherNeedDetails: OtherNeedInput
    ): Need @auth
    assignVolunteer(needId: ID!, volunteerId: ID!): Need @auth
  }

  input NeedInput {
    needType: NeedType!
    title: String!
    date: String!
    notes: String
    location: LocationInput!
    travelNeedDetails: TravelNeedInput
    childcareNeedDetails: ChildcareNeedInput
  }
`
