import { AutoComplete, Button, Form, Icon } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'
import styled from 'styled-components'

const ARCGIS_SUGGEST_BASE_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest'
const ARCGIS_FIND_ADDRESS_CANDIDATES_BASE_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates'

const SelectedLocationContainer = styled.div`
  display: flex;
  align-items: center;

  svg {
    font-size: 1.5rem;
    margin-right: 10px;
  }

  .change-location-btn {
    margin-left: 1rem;
  }
`

const PlaceSearchField = ({ form, fieldname, label, setLocationState }) => {
  const [searchResults, setSearchResults] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [error, setError] = useState(null)

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
      const location = data.candidates[0]
      setSelectedLocation(location)
      setLocationState(location)
      setError(null)
      return
    }

    // TODO: Pass this error to parent form component.
    setError('Unable to find matching location.')
  }

  const dataSource = searchResults.map(item => ({
    text: item.text,
    value: item.magicKey,
  }))

  const {
    getFieldDecorator,
    getFieldError,
    getFieldValue,
    setFieldsValue,
  } = form

  const SelectedLocationComponent = () => (
    <SelectedLocationContainer>
      <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
      {selectedLocation.address}
      <Button
        size="small"
        type="danger"
        ghost
        className="change-location-btn"
        onClick={() => {
          setSelectedLocation(null)
          setFieldsValue({ [fieldname]: null })
        }}
      >
        change
      </Button>
    </SelectedLocationContainer>
  )

  return (
    <Form.Item label={label || 'Location'} colon={false}>
      {selectedLocation ? (
        <SelectedLocationComponent />
      ) : (
        getFieldDecorator(fieldname, {
          preserve: true,
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
        )
      )}
    </Form.Item>
  )
}

export default PlaceSearchField
