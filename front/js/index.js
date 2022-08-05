fetch('http://localhost:3000/api/products')
  .then ((res) => {
    //console.log(res.ok)
    if (res.ok) {
      return res.json();
    }
  })
  .then((products) => {
    //console.table(products);
    allKanaps(products)
  })
  .catch((err) => {
    document.querySelector('.titles').innerHTML = '<h1>erreur 404</h1>'
    console.log('erreur 404' + err);
  });

  function allKanaps(index) {
    let zoneArticle = document.querySelector('#items');
    for (let article of index) {
      console.table(article)
      zoneArticle.innerHTML += `<a href='./product.html?_id=${article._id}'>
      <article>
        <img src='${article.imageUrl}' alt='${article.altTxt}'>
        <h3 class='productName'>${article.name}</h3>
        <p class='productDescription'>${article.description}</p>
      </article>
    </a>`;
    }
  }
