let orderId = new URLSearchParams(document.location.search).get('commande'); // récuperation du numéro de commande dans l'URL
// affichage du numero de commande et  suppression du localStorage
function orderIdDisplay() {
  // si numéro de commande l'implémente au DOM
  if (orderId != null) {
    document.querySelector(
      '#orderId'
    ).innerHTML = `<br>${orderId}<br>Merci pour votre achat`;
    // vide le LS
    localStorage.clear();
  }
  //sinon afficher un message d'erreur
  else {
    document.querySelector('#orderId').innerHTML =
      '<h3>Connexion impossible</h3>';
  }
}
orderIdDisplay();
