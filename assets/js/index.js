var map = L.map('map').setView([
    7.9465, -1.0232
], 7); // Set center and zoom level

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);

var sidebar = document.getElementById('sidebar');
var searchInput = document.getElementById('searchInput');
var jsonData = []; // Array to store JSON data

fetch('data/ngo_data/csvjson.json').then(response => response.json()).then(data => {
    jsonData = data; // Store JSON data
});

fetch('data/map_data/ghana_regions.geojson').then(response => response.json()).then(data => {
    L.geoJSON(data, {
        onEachFeature: function (feature, layer) {
            layer.on('click', function (e) {
                var districtName = feature.properties.region;
                displayDistrictInfo(districtName);
            });
            // layer.bindPopup('REGION: ' + feature.properties.region + '<br>CAPITAL: ' + feature.properties.capital);

            layer.on({
                mouseover: function(e) {
                    var region = feature.properties.region;
                    var capital = feature.properties.capital;
                    layer.bindPopup('REGION: ' + region + '<br>CAPITAL: ' + capital).openPopup();
                },
                mouseout: function(e) {
                    layer.closePopup();
                }
        });}
    }).addTo(map);
    

});

function filterResults() {
    var searchString = searchInput.value.toLowerCase();
    sidebar.innerHTML = ''; // Clear sidebar
    var matchingProjects = jsonData.filter(project => {
        return project["Name of Project"].toLowerCase().includes(searchString) || project["Description"].toLowerCase().includes(searchString) || project["Region"].toLowerCase().includes(searchString) || project["District"].toLowerCase().includes(searchString);
    });

    // Display matching projects in the sidebar
    matchingProjects.forEach(project => {
        sidebar.innerHTML += `<div class="ui segment"><h3 class="ui header">${project["Name of Project"]}</h3><p>Description: ${project["Description"]}</p><p>Region: ${project["Region"]}</p><a href="details.html?projectId=${project["UID"]}" class="read-more-link">Read more</a>
        </div>`;
    });
}

function searchOnEnter(event) {
    if (event.key === 'Enter') {
        filterResults();
    }
}

function displayDistrictInfo(districtName) { // Check if the district exists in the JSON data

    var districtData = jsonData.filter(project => project["Region"].toLowerCase().includes(districtName.toLowerCase()));
    sidebar.innerHTML = '';
    // Clear sidebar
    // Display matching projects in the sidebar
    districtData.forEach(project => {
        sidebar.innerHTML += `<div class="ui segment"><h3 class="ui header">${project["Name of Project"]}</h3><p>Description: ${project["Description"]}</p><p>Region: ${project["Region"]}</p><a href="details.html?projectId=${project["UID"]}" class="read-more-link">Read more</a>
        </div>`;
    });
}



