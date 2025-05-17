const db = new PouchDB('usuarios');

async function cadastrarUsuario(username, password) {
    try {
        const user = {
            _id: username,
            password: password
        };
        await db.put(user);
        console.log('Usuário cadastrado!');
    } catch (err) {
        if (err.name === 'conflict') {
            console.log('Usuário já existe.');
        } else {
            console.error(err);
        }
    }
}

async function validarLogin(username, password) {
  try {
    const user = await db.get(username);
    if (user.password === password) {
      sessionStorage.setItem('usuarioLogado', username);
      sessionStorage.setItem('adminLogado', user.admin ? 'true' : 'false');
      return true;
    } else {
      return false;
    }
  } catch (err) {
    if (err.status === 404) return false;
    console.error(err);
    return false;
  }
}



document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const username = this.querySelector('input[type="text"]').value;
    const password = this.querySelector('input[type="password"]').value;

    const valido = await validarLogin(username, password);

    if (valido) {
        window.location.href = '../html/filmes.html';
    } else {
        alert('Usuário ou senha inválidos');
    }
});






