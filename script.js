const fetchData = (playerName) => {
  fetch(
    `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${playerName}`
  )
    .then((res) => res.json())
    .then((data) => {
      // console.log(data.player);
      displayPlayer(data.player);
    });
};

document.addEventListener("DOMContentLoaded", () => {
  fetchData("k");
});

document.querySelector("#search-btn").addEventListener("click", () => {
  const playerName = document.querySelector("#player-name").value;
  fetchData(playerName);
  document.querySelector("#player-name").value = "";
});

const displayPlayer = (players) => {
  const playerContainer = document.querySelector("#players-list");
  playerContainer.innerHTML = " ";
  players.forEach((player) => {
    // console.log(player);
    const div = document.createElement("div");
    div.classList.add("player");
    div.classList.add("col-lg-4");
    div.innerHTML = `
        <div class="card mb-3 p-4">
            <div class="d-flex gap-3 align-items-center">
                <div class="col-lg-4">
                    <img src="${
                      player.strThumb ? player.strThumb : "images/no-image.png"
                    }" class="img-fluid rounded-circle" alt="Player Image">
                </div>
                <div class="col-lg-8">
                    <h5 class="card-title text-primary fw-bold">${
                      player.strPlayer
                    }</h5>
                    <div class="social-icon">
                      <a href="https://${
                        player.strFacebook
                      }" target="_blank" ><span><i class="fa-brands fa-facebook"></i></span></a>
                      <a href="https://${
                        player.strInstagram
                      }" target="_blank"><span><i class="fa-brands fa-instagram"></i></span></a>
                      <a href="https://${
                        player.strTwitter
                      }" target="_blank"><span><i class="fa-brands fa-twitter"></i></span></a>
                    </div>
                </div>
            </div>
            <div class="fw-bold">
              <p class="m-0 mt-3">Nationality: ${player.strNationality}</p>
              <p class="m-0">Team: ${player.strTeam}</p>
              <p class="m-0">Sports: ${player.strSport}</p>
              <p class="m-0">Gender: ${player.strGender}</p>
            </div>
            
            
            <div class="mt-3">
              <button class="btn btn-success" id="addGroupBtn" onclick="handleAddToGroup(event,${
                player.idPlayer
              },'${player.strPlayer}', '${
      player.strThumb ? player.strThumb : "images/no-image.png"
    }')">Add to Group</button>
              <button class="btn btn-primary" onclick="handlePlayerDetails(${
                player.idPlayer
              })">Details</button>
            </div>
        </div>
    `;
    playerContainer.appendChild(div);
  });
};

let playerList = [];
const handleAddToGroup = (e, playerId, playerName, image) => {
  let totalPlayer = parseInt(document.querySelector("#totalPlayer").innerText);
  if (totalPlayer < 11) {
    if (!playerList.includes(playerId)) {
      playerList.push(playerId);
      totalPlayer += 1;
      document.querySelector("#totalPlayer").innerText = totalPlayer;
      const itemContainer = document.querySelector(".item-container");
      const div = document.createElement("div");
      div.classList.add("item");
      div.innerHTML = `
    <img src="${image}" class="img-fluid w-25" alt="Player Image" />
    <h6 class="w-75">${playerName}</h6>
  `;
      itemContainer.appendChild(div);

      // Marked as added
      e.target.classList.remove("btn-success");
      e.target.classList.add("btn-danger");
      e.target.innerText = "Already Added";
      // End marked as read
    } else {
      alert("Already added to your group!");
    }
  } else {
    alert("Your team is full !");
  }
};

const handlePlayerDetails = (playerId) => {
  fetch(
    `https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`
  )
    .then((res) => res.json())
    .then((data) => {
      // console.log(data.players[0]);
      openModal(data.players[0]);
    });
};

const openModal = (player) => {
  const modalContainer = document.querySelector("#modalContainer");
  modalContainer.innerHTML = `
  <!-- Modal -->
  <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Player Details</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">

          <div class="d-flex gap-3">
            <img src="${
              player.strThumb ? player.strThumb : "images/no-image.png"
            }" class="img-fluid rounded-circle" style="width: 30%"/>
            <div  class="fw-bold">
              <h5>Name: ${player.strPlayer}</h5>
              <p class="m-0 mt-3">Nationality: ${player.strNationality}</p>
              <p class="m-0">Team: ${player.strTeam}</p>
              <p class="m-0">Sports: ${player.strSport}</p>
              <p class="m-0">Gender: ${player.strGender}</p>
            </div>
          </div>
          <p class="mt-2">${
            player.strDescriptionEN ? player.strDescriptionEN.slice(0, 400) : ""
          }</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  `;

  myModal = new bootstrap.Modal("#myModal");
  myModal.show();
};
