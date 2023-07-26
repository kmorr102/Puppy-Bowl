const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2305-FTB-ET-WEB-PT';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/2305-FTB-ET-WEB-PT/players`;
// Function to fetch all players from the API
const fetchAllPlayers = async () => {
// Make a fetch request to the API
// Parse the response JSON data and return the array of players
    try {
        const response = await fetch(APIURL);
        const playersData = await response.json();
        return playersData.data.players;
// Handle errors if the fetch request fails
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};
// Function to fetch a single player's details by playerId from the API
const fetchSinglePlayer = async (playerId) => {
// Make a fetch request to the API to get the player details by playerId
// Parse the response JSON data and return the player object
    try {
        const response = await fetch(`${APIURL}/${playerId}`);
        const player = await response.json();
        console.log(player);
        return player;
// Handle errors if the fetch request fails
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};
// Function to add a new player to the API
const addNewPlayer = async (playerObj) => {
// Make a POST fetch request to the API with the new player object as the body
// Parse the response JSON data and return the new player object
    try {
        const response = await fetch(APIURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerObj),
        });
        const newPlayer = await response.json();
        console.log(newPlayer);
        return newPlayer;
// Handle errors if the fetch request fails
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};
// Function to remove a player from the API by playerId
const removePlayer = async (playerId) => {
// Make a DELETE fetch request to the API to remove the player by playerId
// Parse the response JSON data and return the removed player object
    try {
        const response = await fetch(`${APIURL}/${playerId}`, {
            method: 'DELETE',
        });
        const removedPlayer = await response.json();
        console.log(removedPlayer);
        return removedPlayer;
// Handle errors if the fetch request fails
    } catch (err) {
        console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
    }
};
// Function to render all players to the DOM
const renderAllPlayers = (playerList) => {
    try {
        playerContainer.innerHTML = '';
        playerList.forEach((player) => {
            const playerElement= document.createAttribute('div')
            playerElement.classlist.add('player-card')
            playerElement.innerHTML = `
                    <h4>${player.id}</h4>
                    <p>${player.name}</p>
                    <p>${player.breed}</p>
                    <p>${player.status}</p>
                    <p>${player.imageUrl}</p>
                    <button class= "detail-button" data-id="${player.id}">See details</button>
                    <button class= "delete-button"data-id="${player.id})">Remove from roster</button>
                </div>
            `;
            const detailButton=playerContainer.querySelector("detail-button");
               detailButton.addEventListener('click'),(event)=>{
                event.preventDefault();
               fetchSinglePlayer(player);
               }
        });
        playerContainer.appendChild=playerElement;

    } catch (err) {
        console.error('Uh oh, trouble rendering players!');
    }
};
const renderNewPlayerForm = () => {
    try {
        const formHTML = `
        <form id="new-player-form">
        <label for="playerId">Player ID:</label>
        <input type="text" id="playerId" name="playerId" required>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        <label for="breed">Breed:</label>
        <input type="text" id="breed" name="breed" required>
        <label for="position">Position:</label>
        <input type="text" id="position" name="position" required>
        <label for="imageUrl">Image URL:</label>
        <input type="text" id="imageUrl" name="imageUrl" required>
        <button type="submit">Add New Player</button>
    </form>
`;
        newPlayerFormContainer.innerHTML = formHTML;
        // Add event listener to the form submission
        const form = document.getElementById('new-player-form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            let newPlayerObj = {
                id: form.id.value,
                name: form.name.value,
                breed: form.breed.value,
                position: form.position.value,
                imgUrl: form.imgUrl.value,
            };
            await addNewPlayer(newPlayerObj);
            const updatedPlayers = await fetchAllPlayers();
            renderAllPlayers(updatedPlayers);
            form.reset();
        });
// Handle errors if there are issues rendering the new player form
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
};
// Function to initialize the application
// Fetch all players from the API using fetchAllPlayers
// Render all players on the webpage using renderAllPlayers
// Render the form for adding new players using renderNewPlayerForm
const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    renderNewPlayerForm();
};
init();