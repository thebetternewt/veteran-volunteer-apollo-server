import { Map as ArcGisMap } from '@esri/react-arcgis'
import React, { useState } from 'react'
import Marker from './Marker'
import styled from 'styled-components'
import { Icon } from 'antd'

const MapContainer = styled.div`
  width: 600px;
  height: 400px;
  max-width: 100%;
  position: relative;
`

const MapOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  pointer-events: none;

  ${({ loading }) =>
    loading &&
    `
    background-color: rgba(0, 176, 235, 0.9);
  `}
`

const Map = ({ location }) => {
  const [loading, setLoading] = useState(true)

  return (
    <MapContainer>
      <ArcGisMap
        viewProperties={{
          center: [location.lng, location.lat],
          zoom: 11,
        }}
        onLoad={() => setLoading(false)}
      >
        <Marker />
      </ArcGisMap>
      <MapOverlay loading={loading}>
        {loading && <Icon type="loading" style={{ fontSize: 60 }} />}
      </MapOverlay>{' '}
    </MapContainer>
  )
}

export default Map
