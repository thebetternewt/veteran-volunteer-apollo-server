import React from 'react'
import { Form, AutoComplete } from 'antd'
import PlaceSearchField from '../../common/forms/PlaceSearchField'

const TravelForm = ({ form }) => {
  const dataSource = []
  const { getFieldDecorator, getFieldsError } = form
  return (
    <>
      <PlaceSearchField
        form={form}
        fieldname="details.toLocation"
        label="Where are you going?"
        setLocationState={location => console.log(location)}
      />
    </>
  )
}

export default TravelForm
