import { gql } from 'apollo-server-express'

export default gql`
  type HomeMaintenanceNeed {
    id: ID!
    maintenanceType: String!
    equipmentSupplied: Boolean
    partsSupplied: String
    description: String!
  }

  input HomeMaintenanceNeedInput {
    maintenanceType: String!
    equipmentSupplied: Boolean
    partsSupplied: String
    description: String!
  }
`
