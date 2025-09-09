const firebaseConfig = {
  apiKey: "AIzaSyDnrds31zJ9YQ4ldmkPWBrlSwHo4to_BE4",
  authDomain: "jeurole-16332.firebaseapp.com",
  projectId: "jeurole-16332",
  storageBucket: "jeurole-16332.appspot.com",
  messagingSenderId: "465433430644",
  appId: "1:465433430644:web:6d242f91e2435632fd9f21",
  databaseURL: "https://jeurole-16332-default-rtdb.europe-west1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const pseudo = sessionStorage.getItem("pseudo");
function loadCharacters() {
  if (!pseudo) {
    alert("Pas de pseudo trouvé !");
    return;
  }

  const userRef = db.ref(`user/${pseudo}`);
  userRef.once('value').then(snapshot => {
    if (!snapshot.exists()) {
      alert("Utilisateur non trouvé !");
      return;
    }

    const userData = snapshot.val();
    const personnages = userData.personnages || {};
    displayFilteredCharacters(personnages);
    
    document.getElementById("applyFilters").addEventListener("click", () => {
  displayFilteredCharacters(personnages);
    });
  });
}

function displayFilteredCharacters(personnages) {
  const container = document.getElementById("exploreCharacters");
  container.innerHTML = "";

  const selectedRace = document.getElementById("raceFilter").value;
  const minLevel = parseInt(document.getElementById("levelFilter").value) || 0;

  Object.entries(personnages).forEach(([key, perso]) => {
    const race = perso.race || "";
    const niveau = parseInt(perso.niveau) || 0;

    if ((selectedRace === "" || race === selectedRace) && niveau >= minLevel) {
      const card = document.createElement("div");
      card.className = "character-card";
      card.innerHTML = `
        <h3>${perso.nom || 'Sans nom'}</h3>
        <p><strong>Race :</strong> ${race}</p>
        <p><strong>Niveau :</strong> ${niveau}</p>
        <div class="character-image"></div>
      `;
      container.appendChild(card);
    }
  });

  if (container.innerHTML === "") {
    container.innerHTML = "<p>Aucun personnage ne correspond aux filtres.</p>";
  }
}

loadCharacters();
