const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('projectId');

var page = document.getElementById('page');
var searchString = projectId;
var jsonData = []; // Array to store JSON data

fetch('data/ngo_data/csvjson.json')
    .then(response => response.json())
    .then(data => {
        jsonData = data; // Store JSON data
        console.log(jsonData);
        page.innerHTML = ''; // Clear page

        var matchingProject = jsonData.find(project => project["UID"] == searchString);


        if (matchingProject) {
            page.innerHTML += `
                <div class="ui segment">
                    <h3 class="ui header">${matchingProject["Name of Project"]}</h3>
                    <p>Description: ${matchingProject["Description"]}</p>
                    <p>Region: ${matchingProject["Region"]}</p>
                    <p>District: ${matchingProject["District"]}</p>
                    <p>Sponsor-Full: ${matchingProject["Sponsor-Full"]}</p>
                    <p>System: ${matchingProject["System"]}</p>
                    <p>ImplementingAgencies: ${matchingProject["ImplementingAgencies"]}</p>
                    <p>Year Approved: ${matchingProject["Year Approved"]}</p>
                    <p>Year Completed: ${matchingProject["Year Completed"]}</p>
                    <p>Link: <a href= "${matchingProject["Link"]}">${matchingProject["Link"]}</a></p>
                    <p>CSA Technology: ${matchingProject["CSA Technology"]}</p>
                    <p>Beneficiaries: ${matchingProject["Beneficiaries"]}</p>
                    


                </div>`;
        } else {
            page.innerHTML = '<p>No project found with the specified ID.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching JSON data:', error);
    });
