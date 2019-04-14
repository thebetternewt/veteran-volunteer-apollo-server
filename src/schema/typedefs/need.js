import { gql } from 'apollo-server-express'

export default gql`
  union NeedDetails = TravelNeed | LawncareNeed | ChildcareNeed

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
    request: Request!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    need(id: ID!): Need @auth
    needs(
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
