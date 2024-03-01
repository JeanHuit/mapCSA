var map = L.map('map').setView([
    7.9465, -1.0232
], 7); // Set center and zoom level

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);



var sidebar = document.getElementById('sidebar');
var searchInput = document.getElementById('searchInput');
var jsonData = []; // Array to store JSON data
var index;

var cachedIndex = localStorage.getItem('lunrIndex');


fetch('data/ngo_data/csvjson.json').then(response => response.json()).then(data => {
    jsonData = data; // Store JSON data

    // Adds caching ability
    if (!cachedIndex) {
        index = lunr(function () {
            this.ref('UID');
            this.field('Name of Project');
            this.field('Description');
            this.field('Sponsor-Full');
            this.field('Sponsor-Abb');
            this.field('System');
            this.field('CSA Technology');
            this.field('subcategory');


            // Add documents to the index
            jsonData.forEach(function (doc) {
                this.add(doc);
            }, this);
        });

        // Cache the index in local storage
        localStorage.setItem('lunrIndex', JSON.stringify(index));
    }
    else {
        // If the index exists in the cache, parse it
        index = lunr.Index.load(JSON.parse(cachedIndex));
    }


});

fetch('data/map_data/ghana_regions.geojson').then(response => response.json()).then(data => {
    L.geoJSON(data, {
        onEachFeature: function (feature, layer) {
            layer.on('click', function (e) {
                var districtName = feature.properties.region;
                displayDistrictInfo(districtName);
            });
            // layer.bindPopup('REGION: ' + feature.properties.region + '<br>CAPITAL: ' + feature.properties.capital);
            var regionName = feature.properties.region;
            console.log(regionName);
            var regionProjectsCount = 0; // Initialize the project count for this region

            // Check if the region name contains "Region", if not, append it
            if (regionName.toLowerCase() !== "greater accra") {
                regionName += " Region";
            }
            // Calculate the total number of projects in this region
            jsonData.forEach(project => {
                if (project["Region"].toLowerCase() == regionName.toLowerCase()) {
                    regionProjectsCount++;
                }
            });

            layer.on({
                mouseover: function (e) {
                    var region = feature.properties.region;
                    var capital = feature.properties.capital;
                    layer.bindPopup('Region: ' + region + '<br>Capital: ' + capital + '<br>Total Projects: ' + regionProjectsCount).openPopup();
                },
                mouseout: function (e) {
                    layer.closePopup();
                }
            });
        }
    }).addTo(map);


});

function filterResults() {
    var searchString = searchInput.value.toLowerCase();
    sidebar.innerHTML = ''; // Clear sidebar

    var searchResults = index.search(searchString);

    searchResults.forEach(function (result) {
        var matchingProject = jsonData.find(project => project["UID"] == result.ref); // Find matching project
        if (matchingProject) {
            sidebar.innerHTML += `<div class="ui segment"><h3 class="ui header">${matchingProject["Name of Project"]}</h3><p>Description: ${matchingProject["Description"]}</p><p>Region: ${matchingProject["Region"]}</p><a href="details.html?projectId=${matchingProject["UID"]}" class="read-more-link">Read more</a></div>`;
        }
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
    if (districtData.length > 0) {
        districtData.forEach(project => {
            sidebar.innerHTML += `<div class="ui segment"><h3 class="ui header">${project["Name of Project"]}</h3><p>Description: ${project["Description"]}</p><p>Region: ${project["Region"]}</p><a href="details.html?projectId=${project["UID"]}" class="read-more-link">Read more</a>
            </div>`;
        });

    }
    else {
        sidebar.innerHTML += `<div class="ui segment"><p>No data in selected region</p></div>`;
    }

}



