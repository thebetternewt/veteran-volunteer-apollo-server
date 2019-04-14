import { AutoComplete, Button, Form, Icon } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const ARCGIS_SUGGEST_BASE_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest'
const ARCGIS_FIND_ADDRESS_CANDIDATES_BASE_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates'

const SelectedLocationContainer = styled.div`
  display: flex;

  .icon-wrapper {
    margin-right: 10px;
    .icon {
      font-size: 1.5rem;
    }
  }
`

const PlaceSearchField = ({
  form,
  fieldname,
  label,
  setLocationState,
  initialValue,
}) => {
  const [searchResults, setSearchResults] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(initialValue)

  const { getFieldDecorator, getFieldValue, setFieldsValue } = form

  /**
   * Update selectedLocation state from form field value on component mount
   */
  useEffect(() => {
    const magicKey = getFieldValue(fieldname)
    if (magicKey && !selectedLocation) {
      const location = handleLocationSearchSelect(magicKey)
      setSelectedLocation(location)
    }
  }, [])

  /**
   * Query ArcGIS API for matching address candidates
   * @param {string} searchText
   * @returns {Object[]} Search suggestion Objects with names and magicKeys
   */
  const searchForLocation = async searchText => {
    const searchResults = await axios.get(ARCGIS_SUGGEST_BASE_URL, {
      params: { f: 'json', text: searchText },
    })

    const { suggestions } = searchResults.data

    setSearchResults(suggestions || [])
  }

  /**
   * Fetch location details from ArcGIS API and set state
   * @param {string} magicKey
   */
  const handleLocationSearchSelect = async magicKey => {
    // Fetch address candidate results from ArcGIS
    const searchResults = await axios.get(
      ARCGIS_FIND_ADDRESS_CANDIDATES_BASE_URL,
      {
        params: { f: 'json', magicKey },
      }
    )

    const { data } = searchResults

    if (data.candidates) {
      const location = data.candidates[0]
      setSelectedLocation(location)
      setLocationState(location)
      return
    }
  }

  const dataSource = searchResults.map(item => ({
    text: item.text,
    value: item.magicKey,
  }))

  const SelectedLocationComponent = () => (
    <SelectedLocationContainer>
      <div className="icon-wrapper">
        <Icon
          className="icon"
          type="check-circle"
          theme="twoTone"
          twoToneColor="#52c41a"
        />
      </div>
      <div>
        <p>{selectedLocation.address}</p>
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
      </div>
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
