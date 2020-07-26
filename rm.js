function init (mapDivId) {
    const orsToken = '5b3ce3597851110001cf6248b6254554dbfc488a8585d67081a4000f';
    let startMarker = null;
    let finishMarker = null;
    let clickPos = null;
    let map = null;
    let buttonPopup = null;
    let route = null;
    const startIcon = L.icon ({
        iconUrl: 'res/start.png',
        iconSize: [25, 41],
        iconAnchor: [12, 40],
    });
    const finishIcon = L.icon ({
        iconUrl: 'res/finish.png',
        iconSize: [25, 41],
        iconAnchor: [12, 40],
    });

    const setBeginPoint = event => {
        if (clickPos) {
            if (route)
                route.remove ();

            if (startMarker) {
                startMarker.setLatLng (clickPos);
            } else {            
                startMarker = L.marker (clickPos, { icon: startIcon, })
                .addTo (map);
            }
        }

        if (buttonPopup)
            map.closePopup (buttonPopup);
    };
    const setEndPoint = event => {
        if (clickPos) {
            if (route)
                route.remove ();
                
            if (finishMarker) {
                finishMarker.setLatLng (clickPos);
            } else {            
                finishMarker = L.marker (clickPos, { icon: finishIcon, })
                .addTo (map);
            }
        }

        if (buttonPopup)
            map.closePopup (buttonPopup);
    };
    const requestRoute = () => {
        if (!startMarker) {
            alert ('Please specify where are you going to start from'); return;
        }
        if (!finishMarker) {
            alert ('Please specify where are you going to start to'); return;
        }

        const startPos = startMarker.getLatLng ();
        const finishPos = finishMarker.getLatLng ();
        const buildPos = pos => { return `${pos.lng},${pos.lat}`; };

        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${orsToken}&start=${buildPos (startPos)}&end=${buildPos (finishPos)}`;

        Request.fetchGet (url)
        .then (response => {
            if (response.ok) {
                response.json ().then (data => {
                    if (data.features && data.features.length > 0) {
                        showRoute (data.features [0].geometry.coordinates);
                        showSummary (data.features [0]);
                    }
                });
            }
        });
    };
    const showRoute = waypoints => {
        if (route)
            route.remove ();

        route = L.polyline (waypoints.map (pos => {
            return [pos[1], pos[0]];
        }), { color: 'red', }).addTo (map);

        map.fitBounds (route.getBounds ());

        if (buttonPopup)
            map.closePopup (buttonPopup);
    };
    const showSummary = data => {
        const summary = data.properties.summary;
        const distance = summary.distance * 0.001;
        const duration = Math.round (summary.duration);
        const durationHr = Math.round (duration / 100);
        const durationMin = duration % 100;
        alert (`Trip distance ${distance.toFixed (1)}; expected duration ${durationHr}:${Math.round (durationMin * 0.6)}`);
    };

    if (!mapDivId) mapDivId = "map";

    let mapDiv = document.getElementById (mapDivId);

    if (!mapDiv) {
        mapDiv = document.createElement (mapDivId);

        mapDivId.className = 'map';

        document.getElementsByClassName ('body')[0].appendChild (mapDiv);
    }

    map = L.map (mapDivId)
        .setView([60, 30.5], 12);

    L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'osm/streets-v11',
        tileSize: 256,
        zoomOffset: 0,
    }).addTo (map);

    map.on ('click', event => {
        const makeButton = (id, text) => {
            return `<button id="${id}" class="mapButton">${text}</button>`;
        };

        buttonPopup = L.popup ({ maxHeight: 400, })
            .setLatLng (event.latlng)
            .setContent (`
                ${makeButton ('setFrom', 'Trip from here')}<br/>
                ${makeButton ('setTo', 'Trip to here')}<br/>
                ${makeButton ('buildRoute', 'Build the route')}
            `)
            .openOn(map);

        document.getElementById ('setFrom').onclick = setBeginPoint;
        document.getElementById ('setTo').onclick = setEndPoint;
        document.getElementById ('buildRoute').onclick = requestRoute;

        clickPos = event.latlng;
    });
}
