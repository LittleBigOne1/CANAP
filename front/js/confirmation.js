let orderId = new URLSearchParams(document.location.search).get('commande');
// fontion d'affichage du numero de commande et de suppression du localStorage
function orderIdDisplay(){

    if (orderId != null) {
      document.querySelector(
        '#orderId'
      ).innerHTML = `<br>${orderId}<br>Merci pour votre achat`;
      console.log("valeur de l'orderId venant de l'url: " + orderId);
      localStorage.clear();
    }
    else {
        document.querySelector(
            '#orderId'
          ).innerHTML = '<h3>Connexion impossible</h3>'

    }
}
orderIdDisplay();