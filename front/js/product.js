// affichage produit

const params = new URLSearchParams(document.location.search);
//console.log(document.location.search);
let id = params.get('id');
//console.log(id);
let colorChoosen;
let quantityChoosen;
// Création de la requete de GET sur l'API afin d'afficher le canapé cliqué sur précedemment grace à son id
fetch('http://localhost:3000/api/products/' + id)
  .then((res) => {
    //console.log(res.ok);
    if (res.ok) {
      return res.json();
    }
  })
  .then((product) => {
    //console.table(product);
    articleClicked(product);
  })
  .catch((err) => {
    document.querySelector('#item').innerHTML = '<h3>Connexion impossible</h3>';
    //console.log('erreur' + err);
  });
// affichage du produit choisi par l'utilisateur sur la page précédente
function articleClicked(product) {
  let zoneImg = document.querySelector('.item__img');
  let zoneTitle = document.querySelector('#title');
  let zoneColor = document.querySelector('#colors');
  let zonePrice = document.querySelector('#price');
  let zoneDescription = document.querySelector('#description');
  //console.log(zoneImg);
  zoneImg.innerHTML += `<img src='${product.imageUrl}' alt='${product.altTxt}'>`;
  zoneTitle.innerText += product.name;
  zonePrice.innerText += product.price;
  zoneDescription.innerText += product.description;

  price = product.price;
  //console.log(product.price)

  // création d'une boucle pour incrémentation des choix de couleurs disponibles
  for (color of product.colors) {
    console.log(color);
    zoneColor.innerHTML +=
      "<option value='" + color + "'>" + color + '</option>';
  }
}

let productChoice = document.querySelector('#addToCart');
// écoute le clique sur le bouton "Ajouter au panier" et si la quantité et la couleur sont valide alors création du panier dans le LS (en vérifiant si dans le LS s'il y a déja un panier et si oui si le produit y est présent)
productChoice.addEventListener('click', () => {
  let quantityInput = document.querySelector('input[id="quantity"]');
  let colorInput = document.querySelector('#colors');
  colorChoosen = colorInput.value;
  quantityChoosen = quantityInput.value;
  let objectToPush = { color: colorChoosen, quantity: quantityChoosen, id: id };
  console.log(objectToPush);
  if (
    quantityInput.value < 1 ||
    quantityInput.value > 100 ||
    quantityInput.value === undefined ||
    colorInput.value === '' ||
    colorInput.value === undefined
  ) {
    console.log(' ==> JE SUIS DANS LA CONDITION INPUT K.O');
    alert('Veuillez renseigner une couleur et/ou une quantité entre 1 et 100');
  } else {
    console.log('==> ELSE, CREATION LOCALSTORAGE');
    let clientChoice;
    if (localStorage.getItem('cart') != null) {
      clientChoice = JSON.parse(localStorage.getItem('cart'));
    } else {
      clientChoice = [];
    }
    let foundProduct = clientChoice.find(
      (p) => p.id == objectToPush.id && p.color == objectToPush.color
    );
    if (foundProduct != null) {
      let addQuantity =
        parseInt(quantityChoosen) + parseInt(foundProduct.quantity);
      foundProduct.quantity = addQuantity;
    } else {
      clientChoice.push(objectToPush);
    }

    console.log('CONSOLE.LOG OBJECTTOPUSH ==>', objectToPush);
    localStorage.setItem('cart', JSON.stringify(clientChoice));
    alert('Article(s) ajouté(s) au');
  }
});
