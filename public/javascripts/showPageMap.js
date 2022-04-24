 if (navigator.maxTouchPoints === 0) {
  mapboxgl.accessToken = mapToken;
  // mapboxgl.accessToken = "pk.eyJ1Ijoid2lsZHktayIsImEiOiJjbDBseGV0amEwNXNsM2Jxejk2aWFiem9pIn0.POY-m41PLobogQidu2JHQQ"

  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: "mapbox://styles/mapbox/outdoors-v11", // style URL
  center: animal.geometry.coordinates, // starting position [lng, lat]
  zoom: 3 // starting zoom
  });
  map.addControl(new mapboxgl.NavigationControl());

console.log("coordinates: ", animal.geometry.coordinates)

  new mapboxgl.Marker()
  .setLngLat(animal.geometry.coordinates)
  .setPopup(
      new mapboxgl.Popup({offset: 25})
      .setHTML(
          `<h3>${animal.title}</h3>
          <p>${animal.location}</p>`
      )
  )
  .addTo(map)
      } else {
        //mobile device without map
        const container = document.querySelector("#map");
 container.style.height = 0;
      }