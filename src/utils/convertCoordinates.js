export const geoObjToArray = object => [object.lng, object.lat]

export const geoArrayToObj = coordinatesArray => ({
  lng: coordinatesArray[0],
  lat: coordinatesArray[1],
})
