const db = new PouchDB('usuarios');

async function cadastrarUsuario(username, password) {
    try {
        const user = {
            _id: username,
            password: password
        };
        await db.put(user);
        alert('Usuário cadastrado com sucesso!');
        window.location.href = '../index.html';  
    } catch (err) {
        if (err.name === 'conflict') {
            alert('Usuário já existe, escolha outro nome.');
        } else {
            console.error(err);
            alert('Erro ao cadastrar usuário.');
        }
    }
}

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = this.querySelector('input[type="text"]').value.trim();
    const password = this.querySelector('input[type="password"]').value.trim();

    if (username && password) {
        cadastrarUsuario(username, password);
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});


