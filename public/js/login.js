async function login(pseudo, password) {
  const userRef = db.ref(`user/${pseudo}`);
  const snapshot = await userRef.once('value');

  if (!snapshot.exists()) {
    alert("Pseudo inconnu !");
    return false;
  }

  const userData = snapshot.val();

  if (userData.password !== password) {
    alert("Mot de passe incorrect !");
    return false;
  }

  // Ici tu peux rediriger vers ta page home, par ex :
  sessionStorage.setItem("pseudo", pseudo);
  window.location.href = '/home.html';


  return true;
}

document.getElementById('loginBtn').addEventListener('click', async () => {
  const pseudo = document.getElementById('pseudo').value.trim();
  const password = document.getElementById('password').value;

  if (!pseudo || !password) {
    alert('Merci de remplir tous les champs.');
    return;
  }

  await login(pseudo, password);
});
