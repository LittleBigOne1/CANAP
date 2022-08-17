// Création d'une' requete de GET sur l'API afin de récupérer chaque canapé du panier grâce à leur id
fetch('http://localhost:3000/api/products')
  //récupération de la réponse de requete
  .then((res) => {
    // si la réponse est bonne elle passe au format json
    if (res.ok) {
      return res.json();
    }
  })
  // puis récupération du tableau produits et mis dans la variable products
  .then((products) => {
    console.log(products);
    displayCanap(products);
  })
  //si erreur tombe dans le catch et incrémente un mesage d'erreur au DOM
  .catch((err) => {
    document.querySelector('#items').innerHTML =
      '<h3>Connexion impossible</h3>';
    //console.log('erreur' + err);
  });
// Ajout dans le DOM de chaque canapé récupéré dans à l'API
function displayCanap(products) {
  let zoneArticle = document.querySelector('#items'); //variable ciblant la zone où les articles doivent être incrémenté
  // création d'un boucle permettant de récupérer chaque canapé et de les ajouter au DOM avec un innerHTML
  for (let article of products) {
    //console.table(article)
    zoneArticle.innerHTML += `<a href='./product.html?id=${article._id}'>
      <article>
        <img src='${article.imageUrl}' alt='${article.altTxt}'>
        <h3 class='productName'>${article.name}</h3>
        <p class='productDescription'>${article.description}</p>
      </article>
    </a>`;
  }
}
