// Création de la requete de GET sur l'API afin de récupérer chaque canapé du panier grâce à leur id
fetch('http://localhost:3000/api/products')
  .then((res) => {
    //console.log(res.ok)
    if (res.ok) {
      return res.json();
    }
  })
  .then((products) => {
    console.log(products);
    allKanaps(products);
  })
  .catch((err) => {
    document.querySelector('#items').innerHTML =
      '<h3>Connexion impossible</h3>';
    //console.log('erreur' + err);
  });
// Ajout dans le DOM de chaque canapé récupérer grâce à l'API
function allKanaps(products) {
  let zoneArticle = document.querySelector('#items');
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
