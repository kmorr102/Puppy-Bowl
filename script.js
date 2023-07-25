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
// Initialize an empty string to store the HTML for player cards
// Iterate through the playerList array
// For each player, create an HTML string representing the player card
// Append the player card HTML string to the playerContainerHTML
// Update the playerContainer's innerHTML with the playerContainerHTML
    try {
        let playerContainerHTML = '';
        playerList.forEach((player) => {
            playerContainerHTML += `
                <div class="player-card">
                    <h2>${player.name}</h2>
                    <p>Position: ${player.position}</p>
                    <p>Jersey Number: ${player.jerseyNumber}</p>
                    <button onclick="fetchSinglePlayer(${player.id})">See details</button>
                    <button onclick="removePlayer(${player.id})">Remove from roster</button>
                </div>
            `;
        });
        playerContainer.innerHTML = playerContainerHTML;
// Handle errors if there are issues rendering players
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};
// Function to render the form to add a new player
const renderNewPlayerForm = () => {
// Create an HTML string for the new player form
// Update the newPlayerFormContainer's innerHTML with the formHTML
// Add an event listener to the form submission
// When the form is submitted, prevent the default form submission behavior
// Get the form input values for the new player from the form fields
// Create a new player object using the form input values
// Call the addNewPlayer function with the new player object
// Fetch all players again using fetchAllPlayers
// Render all players with the updated player list using renderAllPlayers
// Reset the form fields to clear the inputs
    try {
        const formHTML = `
            <form id="new-player-form">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
                <label for="position">Position:</label>
                <input type="text" id="position" name="position" required>
                <label for="jerseyNumber">Jersey Number:</label>
                <input type="number" id="jerseyNumber" name="jerseyNumber" required>
                <button type="submit">Add New Player</button>
            </form>
        `;
        newPlayerFormContainer.innerHTML = formHTML;
        // Add event listener to the form submission
        const form = document.getElementById('new-player-form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const newPlayerObj = {
                name: form.name.value,
                position: form.position.value,
                jerseyNumber: form.jerseyNumber.value,
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