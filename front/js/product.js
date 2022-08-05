// affichage produit

const params = new URLSearchParams(document.location.search);
//console.log(document.location.search);
let id = params.get('id');
//console.log(id);
let colorChoosen;
let quantityChoosen;

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

  for (color of product.colors) {
    //console.log('color');
    zoneColor.innerHTML +=
      "<option value='" + color + "'>" + color + '</option>';
  }
}

let productChoice = document.querySelector('#addToCart');
productChoice.addEventListener('click', () => {
  let quantityInput = document.querySelector('input[id="quantity"]');
  let colorInput = document.querySelector('#colors');
  colorChoosen = colorInput.value;
  quantityChoosen = quantityInput.value;
  let objectToPush = { color: colorChoosen, quantity: quantityChoosen, id: id };
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
    /* if (
        objectToPush.id == clientChoice.id &&
        objectToPush.color == clientChoice.color
      ) {
      }*/

    console.log('CONSOLE.LOG OBJECTTOPUSH ==>', objectToPush);
    localStorage.setItem('cart', JSON.stringify(clientChoice));
    document.querySelector('#addToCart').style.color = 'rgb(0, 205, 0)';
    document.querySelector('#addToCart').textContent = 'Produit ajouté !';
  }
});
