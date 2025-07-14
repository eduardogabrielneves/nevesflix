const db = new PouchDB('usuarios');

function criarAdminPadrao() {
  const adminUser = {
    _id: 'admin',
    password: 'admin',
    admin: true,
    plano: 'Premium'
  };

  db.put(adminUser).then(() => {
    console.log('Usuário "admin" criado como administrador com sucesso!');
  }).catch(err => {
    if (err.name === 'conflict') {
      console.log('Usuário administrador "admin" já existe. Nenhuma ação necessária.');
    } else {
      console.error('Ocorreu um erro ao tentar criar o usuário admin:', err);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  criarAdminPadrao();
});

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






