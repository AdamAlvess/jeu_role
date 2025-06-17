async function loadUserInfo() {
  const pseudo = sessionStorage.getItem("pseudo");
  if (!pseudo) {
    alert("Aucun utilisateur connecté");
    return;
  }

  const userRef = ref(db, `user/${pseudo}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    alert("Utilisateur introuvable");
    return;
  }

  const userData = snapshot.val();
  // Par exemple afficher le mail sur la page
  document.getElementById("userEmail").innerText = userData.email;
  document.getElementById("userPseudo").innerText = pseudo;
}
