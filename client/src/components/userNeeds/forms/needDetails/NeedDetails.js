import React from 'react'
import TravelDetailsForm from './TravelDetails'
import ChildcareDetailsForm from './ChildcareDetails'
import HomeMaintenanceDetailsForm from './HomeMaintenanceDetails'

const NeedDetails = ({ needType, form, needDetails, setNeedDetails }) => {
  switch (needType) {
    case 'TRAVEL':
      return (
        <TravelDetailsForm
          form={form}
          needDetails={needDetails}
          setNeedDetails={setNeedDetails}
        />
      )

    case 'CHILDCARE':
      return (
        <ChildcareDetailsForm
          form={form}
          needDetails={needDetails}
          setNeedDetails={setNeedDetails}
        />
      )

    case 'HOME_MAINTENANCE':
      return (
        <HomeMaintenanceDetailsForm
          form={form}
          needDetails={needDetails}
          setNeedDetails={setNeedDetails}
        />
      )

    default:
      return null
  }
}

export default NeedDetails
