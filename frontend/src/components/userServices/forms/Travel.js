import React from 'react'
import PlaceSearchField from '../../common/forms/PlaceSearchField'

const TravelForm = ({ form, serviceDetails, setServiceDetails }) => {
  const dataSource = []
  const { getFieldDecorator, getFieldsError } = form
  return (
    <>
      <PlaceSearchField
        form={form}
        fieldname="details.toLocation"
        label="Where are you going?"
        setLocationState={location =>
          setServiceDetails({ ...serviceDetails, toLocation: location })
        }
      />
    </>
  )
}

export default TravelForm
