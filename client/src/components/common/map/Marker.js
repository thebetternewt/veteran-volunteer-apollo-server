import { loadModules } from '@esri/react-arcgis'
import { useEffect } from 'react'
import locationMarker from '../../../images/map-marker.png'

const Marker = ({ view }) => {
  let marker

  const addMarker = async () => {
    const [Graphic, Point] = await loadModules([
      'esri/Graphic',
      'esri/geometry/Point',
    ])

    const point = new Point(view.center)

    marker = new Graphic({
      geometry: point,
      symbol: {
        type: 'picture-marker',
        url: locationMarker,
        width: '28px',
        height: '42px',
      },
    })

    view.graphics.add(marker)
  }

  const removeMarker = () => view.graphics.remove(marker)

  useEffect(() => {
    addMarker()
    return removeMarker()
  })

  return null
}

export default Marker
