import { AutoComplete, Form } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'

const ARCGIS_SUGGEST_BASE_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest'
const ARCGIS_FIND_ADDRESS_CANDIDATES_BASE_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates'

const PlaceSearchField = ({ form, fieldname, label }) => {
  const [searchResults, setSearchResults] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)

  const searchForLocation = async searchText => {
    // Fetch suggest results from ArcGIS
    const searchResults = await axios.get(ARCGIS_SUGGEST_BASE_URL, {
      params: { f: 'json', text: searchText },
    })

    const { suggestions } = searchResults.data

    setSearchResults(suggestions || [])
  }

  const handleLocationSearchSelect = async magicKey => {
    console.log('magicKey', magicKey)

    // Fetch address candidate results from ArcGIS
    const searchResults = await axios.get(
      ARCGIS_FIND_ADDRESS_CANDIDATES_BASE_URL,
      {
        params: { f: 'json', magicKey },
      }
    )

    const { data } = searchResults
    console.log('selected data', data)

    if (data.candidates) {
      setSelectedLocation(data.candidates[0])
    }
  }

  const dataSource = searchResults.map(item => ({
    text: item.text,
    value: item.magicKey,
  }))

  const { getFieldDecorator, getFieldError } = form
  console.log(form)

  return (
    <Form.Item label={label || 'Location'} colon={false}>
      {getFieldDecorator(fieldname, {
        rules: [
          {
            required: true,
            message: 'Please select a location.',
          },
        ],
      })(
        <AutoComplete
          dataSource={dataSource}
          onChange={searchForLocation}
          placeholder="Search for a location..."
          onSelect={magicKey => handleLocationSearchSelect(magicKey)}
        />
      )}
    </Form.Item>
  )
}

export default PlaceSearchField
