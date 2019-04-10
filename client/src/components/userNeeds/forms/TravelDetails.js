import React from 'react';
import PlaceSearchField from '../../common/forms/PlaceSearchField';

const TravelForm = ({ form, needDetails, setNeedDetails }) => (
    <PlaceSearchField
      form={form}
      fieldname="details.toLocation"
      label="Where are you going?"
      setLocationState={location =>
        setNeedDetails({ ...needDetails, toLocation: location })
      }
    />
  )


export default TravelForm
