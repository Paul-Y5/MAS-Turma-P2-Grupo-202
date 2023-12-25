$(document).ready(function () {
    var mymap = L.map('mapid').setView([0, 0], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(mymap);

    function getUserCoordinatesAndCenterMap() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(position => {
                var coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                // Center the map on the user's coordinates
                mymap.setView([coords.lat, coords.lng]);
                L.marker([coords.lat, coords.lng]).addTo(mymap)
                    .bindPopup("<p>" + 'Você está aqui' + "</p><br>");
                resolve(coords);
            }, error => {
                reject(error);
            });
        });
    }

    // Get shops from local storage
    var shops = JSON.parse(localStorage.getItem('shops'));

    // Add a marker for each shop
    shops.forEach(function (shop) {
        if (!shop.hasOwnProperty('Coords')) {
            console.warn('Shop without coordinates: ', shop);
            return;
        }

        var coordsString = shop.Coords; 
        var coordsArray = coordsString.split(','); 
        var lat = parseFloat(coordsArray[0]); 
        var lng = parseFloat(coordsArray[1]);

        if (isNaN(lat) || isNaN(lng)) {
            console.warn('Invalid coordinates for shop: ', shop);
            return;
        }

        L.marker([lat, lng]).addTo(mymap)
            .bindPopup("<b>" + shop.Name + "</b><br>" + shop.Address);
    });

    // Call the function to get user coordinates and center the map
    getUserCoordinatesAndCenterMap().then(coords => {
        console.log(`Latitude: ${coords.lat}, Longitude: ${coords.lng}`);
    }).catch(error => {
        console.error("Error getting user's location: ", error);
    });
});