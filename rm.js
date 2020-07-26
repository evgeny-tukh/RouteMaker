function init (mapDivId) {
    let startMarker = null;
    let finishMarker = null;
    let clickPos = null;
    let map = null;
    let buttonPopup = null;
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

        clickPos = event.latlng;
    });
}
