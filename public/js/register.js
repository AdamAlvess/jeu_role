async function register(pseudo, email, password, firstname, lastname) {
  const userRef = db.ref(`user/${pseudo}`);
  const snapshot = await userRef.once('value');

  if (snapshot.exists()) {
    alert("Ce pseudo est déjà pris, choisis-en un autre !");
    return false;
  }

  const userData = {
    firstname,
    lastname,
    email,
    password, // À ne pas faire en prod ! Stocker en clair c'est dangereux.
    dateInscription: Date.now()
  };

  await userRef.set(userData);
  alert("Inscription réussie !");
  return true;
}

document.getElementById('registerBtn').addEventListener('click', async () => {
  const firstname = document.getElementById('firstname').value.trim();
  const lastname = document.getElementById('lastname').value.trim();
  const pseudo = document.getElementById('pseudo').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!firstname || !lastname || !pseudo || !email || !password) {
    alert("Merci de remplir tous les champs !");
    return;
  }

  try {
    const userRef = db.ref(`user/${pseudo}`);
    const snapshot = await userRef.once('value');

    if (snapshot.exists()) {
      alert("Ce pseudo est déjà pris, choisis-en un autre !");
      return;
    }

    const userData = {
      firstname,
      lastname,
      email,
      password,  // pas sécurisé en clair, mais OK pour démo simple
      dateInscription: Date.now()
    };

    await userRef.set(userData);
    // Rediriger vers login ou home directement avec le pseudo
    sessionStorage.setItem("pseudo", pseudo);
    window.location.href = '/home.html';


  } catch (error) {
    console.error(error);
    alert("Erreur lors de l'inscription.");
  }
});
