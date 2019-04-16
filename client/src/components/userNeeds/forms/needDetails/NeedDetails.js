import React from 'react'
import TravelDetailsForm from './TravelDetails'
import ChildcareDetailsForm from './ChildcareDetails'
import HomeMaintenanceDetailsForm from './HomeMaintenanceDetails'
import OtherDetailsForm from './OtherDetails'

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
      return <ChildcareDetailsForm form={form} />

    case 'HOME_MAINTENANCE':
      return <HomeMaintenanceDetailsForm form={form} />

    case 'OTHER':
      return <OtherDetailsForm form={form} />

    default:
      return null
  }
}

export default NeedDetails
