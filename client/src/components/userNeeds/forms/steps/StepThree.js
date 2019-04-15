import React from 'react'
import NeedDetails from '../needDetails/NeedDetails'

const NeedDetailsForm = props => {
  const { form, needType, needDetails, setNeedDetails } = props

  const { getFieldValue } = form

  return (
    <>
      <h2>{needType.label} Details</h2>
      <NeedDetails
        form={form}
        needType={getFieldValue('needType')}
        needDetails={needDetails}
        setNeedDetails={setNeedDetails}
      />
    </>
  )
}

export default NeedDetailsForm
