const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
const cohortName = '2305-FTB-ET-WEB-PT';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL);
        const playersData = await response.json();
        return playersData.data.players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`);
        const playerData = await response.json();
        return playerData.data.player; // Return the player object from the response data
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
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
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`, {
            method: 'DELETE',
        });
        const removedPlayer = await response.json();
        console.log(removedPlayer);
        return removedPlayer;
    } catch (err) {
        console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
    }
};

const renderAllPlayers = async () => {
    try {
        const players = await fetchAllPlayers();
        playerContainer.innerHTML = '';

        players.forEach((player) => {
            const playerElement = document.createElement('div');
            playerElement.classList.add('player-card');
            playerElement.innerHTML = `
                <h4>${player.id}</h4>
                <h3>Name: ${player.name}</h3>
                <p>Breed: ${player.breed}</p>
                <p>Status: ${player.status}</p>
                <img src="${player.imageUrl}" alt="${player.name}" width="150">
                <button class="detail-button" data-id="${player.id}">See details</button>
                <button class="delete-button" data-id="${player.id}">Remove from roster</button>
            `;

            const detailButton = playerElement.querySelector('.detail-button');
            detailButton.addEventListener('click', async () => {
                const playerId = detailButton.getAttribute('data-id');
                const playerDetails = await fetchSinglePlayer(playerId);
                renderSinglePlayerDetails(playerDetails);
            });

            const deleteButton = playerElement.querySelector('.delete-button');
            deleteButton.addEventListener('click', async () => {
                const playerId = deleteButton.getAttribute('data-id');
                await removePlayer(playerId);
                const updatedPlayers = await fetchAllPlayers();
                renderAllPlayers(updatedPlayers);
            });

            playerContainer.appendChild(playerElement);
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

const renderNewPlayerForm = () => {
    try {
        const formHTML = `
            <form id="new-player-form">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
                <label for="breed">Breed:</label>
                <input type="text" id="breed" name="breed" required>
                <label for="status">Status:</label>
                <input type="text" id="status" name="status" required>
                <label for="imageUrl">Image URL:</label>
                <input type="text" id="imageUrl" name="imageUrl" required>
                <button type="submit">Add New Player</button>
            </form>
        `;

        newPlayerFormContainer.innerHTML = formHTML;

        const form = document.getElementById('new-player-form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const newPlayerObj = {
                name: form.name.value,
                breed: form.breed.value,
                status: form.status.value,
                imageUrl: form.imageUrl.value,
            };
            await addNewPlayer(newPlayerObj);
            const updatedPlayers = await fetchAllPlayers();
            renderAllPlayers(updatedPlayers);
            form.reset();
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
};

const renderSinglePlayerDetails = async (player) => {
    try {
        const playerDetails = await fetchSinglePlayer(player.id);
        const detailsContainer = document.createElement('div');
        detailsContainer.innerHTML = `
            <h3>Player Details</h3>
            <p>Name: ${playerDetails.name}</p>
            <p>Breed: ${playerDetails.breed}</p>
            <p>Status: ${playerDetails.status}</p>
            <img src="${playerDetails.imageUrl}" alt="${playerDetails.name}" width="200">
        `;

        playerContainer.innerHTML = '';
        playerContainer.appendChild(detailsContainer);
    } catch (err) {
        console.error('Uh oh, trouble fetching player details!', err);
    }
};

const init = async () => {
    renderAllPlayers();
    renderNewPlayerForm();
};

init();
