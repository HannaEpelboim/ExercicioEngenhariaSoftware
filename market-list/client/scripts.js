

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/produtos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.produtos.forEach(item => insertList(item.nome, item.quantidade, item.valor))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputProduct, inputQuantity, inputPrice) => {
  const formData = new FormData();
  formData.append('nome', inputProduct);
  formData.append('quantidade', inputQuantity);
  formData.append('valor', inputPrice);

  let url = 'http://127.0.0.1:5000/produto';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Criar config.py


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/produto?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão Editar para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButtonRefresh = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("Editar");
  span.className = "refresh";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para atualizar um item da lista de acordo com o click no botão refresh
  --------------------------------------------------------------------------------------
*/
const refreshElement = () => {
  let refresh = document.getElementsByClassName("refresh");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < refresh.length; i++) {
    refresh[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const oldName = div.getElementsByTagName('td')[0].innerHTML
      const oldQuantity = div.getElementsByTagName('td')[1].innerHTML
      const oldPrice = div.getElementsByTagName('td')[2].innerHTML
      const [newName, newQuantity, newPrice] = AtualizarDados(oldName, oldQuantity, oldPrice)
      div.getElementsByTagName('td')[0].innerHTML = newName;
      div.getElementsByTagName('td')[1].innerHTML = newQuantity;
      div.getElementsByTagName('td')[2].innerHTML = newPrice;
      updateItem(oldName, newName, newQuantity, newPrice)
      alert("Atualizado!")
    
    }
  }
}

/*Funcao para via alert perguntar se deseja atualizar*/ 
const AtualizarDados = (oldName, oldQuantity, oldPrice) => {
  let newName;
  let newQuantity;
  let newPrice;
  if (confirm("Nome atual: " + oldName + "\nDeseja mudar?")) {
    newName = prompt("Atualize o nome do produto:", oldName);
  }
  else{
    newName = oldName;
  }
  if (confirm("Quantidade atual: " + oldQuantity + "\nDeseja mudar?")) {
    newQuantity = prompt("Atualize a quantidade:", oldQuantity);
  }
  else{
    newQuantity = oldQuantity;
  }
  if (confirm("Valor atual: " + oldPrice + "\nDeseja mudar?")) {
    newPrice = prompt("Atualize o valor:", oldPrice);
  }
  else{
    newPrice = oldPrice;
  }
  
  return [newName, newQuantity, newPrice]
}

/*
  --------------------------------------------------------------------------------------
  Função para atualizar um item da lista do servidor via requisição PUT
  --------------------------------------------------------------------------------------
*/
const updateItem = (oldName, newName, newQuantity, newPrice) => {
  console.log(oldName, newName, newQuantity, newPrice)
  const formData = new FormData();
  formData.append('nome', newName);
  formData.append('quantidade', newQuantity);
  formData.append('valor', newPrice);
  let url = 'http://127.0.0.1:5000/produto?nome=' + oldName;
  fetch(url, {
    method: 'put',
    body: formData
  })  
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}




/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputProduct = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  if (inputProduct === '') {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputQuantity) || isNaN(inputPrice)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    insertList(inputProduct, inputQuantity, inputPrice)
    postItem(inputProduct, inputQuantity, inputPrice)
    alert("Item adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameProduct, quantity, price) => {
  var item = [nameProduct, quantity, price]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  insertButtonRefresh(row.insertCell(-1))
  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";

  removeElement()
  refreshElement()
}