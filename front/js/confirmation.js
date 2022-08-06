let orderId = new URLSearchParams(document.location.search).get('commande');
// fontion d'affichage du numero de commande et de suppression du localStorage
function orderIdDisplay(){

    if (orderId != null) {
      document.querySelector(
        '#orderId'
      ).innerHTML = `<br>${orderId}<br>Merci pour votre achat`;
      console.log("valeur de l'orderId venant de l'url: " + orderId);
      localStorage.clear();
      // valeur du numero de commande
      //réinitialisation du numero de commande
    }
}
orderIdDisplay();