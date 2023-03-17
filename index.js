// let map = L.map('map').setView([4.639386,-74.082412],6)
let map = L.map('map').setView([-34.7622129,-68.7747986],7)


//Agregar tilelAyer mapa base desde openstreetmap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

document.getElementById('select-location').addEventListener('change',function(e){
  let coords = e.target.value.split(",");
  map.flyTo(coords,13);
})

//////
let markOfficial = [40.7277831,-74.0080852]

let mapTwo = L.map('map2').setView(markOfficial, 13)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mapTwo);

let marker = L.marker(markOfficial).addTo(mapTwo)

/////

const mapaTerremotos = L.map('mapa-terremotos').setView([0, 0], 1.5);

const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mapaTerremotos);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mapaTerremotos);

const api_url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson"

const getData = async (start, end) =>{
  mapaTerremotos.eachLayer((layer) => {
    layer.remove()
  })
  tiles.addTo(mapaTerremotos)

  const response = await fetch(api_url + start + end)
  const data = await response.json()

  for (let i = 0; i < data.features.length; i++) {
    let r = data.features[i].properties.mag * 1.5
    let lat = data.features[i].geometry.coordinates[1]
    let lon = data.features[i].geometry.coordinates[0]

    const circle = L.circleMarker([0, 0], {
      radius: r,
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5
    }).addTo(mapaTerremotos)

    circle.setLatLng([lat, lon])
    let dateMs = new Date(data.features[i].properties.time)
    let date = dateMs.toUTCString()

    circle.bindTooltip("<h5>"+data.features[i].properties.place+"</h5><p>Magnitud: " + data.features[i].properties.mag + "</p>" + "<p>" + date + "</p>")
  }
}

document.getElementById("btn").onclick = () => {
  let start = "&starttime=" + document.getElementById("date-start").value;
  let end = "&endtime=" + document.getElementById("date-end").value;
  getData(start, end);
}