let orderId = new URLSearchParams(document.location.search).get('commande');
// affichage du numero de commande et  suppression du localStorage
function orderIdDisplay(){
    // si numéro de commande l'incrémenter au DOM 
    if (orderId != null) {
      document.querySelector(
        '#orderId'
      ).innerHTML = `<br>${orderId}<br>Merci pour votre achat`;
      console.log("valeur de l'orderId venant de l'url: " + orderId);
      // vide le LS
      localStorage.clear();
    }
    //sinon afficher une erreur
    else {
        document.querySelector(
            '#orderId'
          ).innerHTML = '<h3>Connexion impossible</h3>'

    }
}
orderIdDisplay();