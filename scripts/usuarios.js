const db = new PouchDB('usuarios');

async function carregarUsuarios() {
  try {
    const result = await db.allDocs({ include_docs: true });
    const tbody = document.querySelector('#usuariosTable tbody');
    tbody.innerHTML = '';

    result.rows.forEach(row => {
      const doc = row.doc;
      const tr = document.createElement('tr');

      const tdId = document.createElement('td');
      tdId.textContent = doc._id;
      tr.appendChild(tdId);

      const tdPassword = document.createElement('td');
      const inputPassword = document.createElement('input');
      inputPassword.type = 'text';
      inputPassword.value = doc.password || '';
      tdPassword.appendChild(inputPassword);
      tr.appendChild(tdPassword);

      const tdPlano = document.createElement('td');
      const selectPlano = document.createElement('select');
      ['','Básico','Intermediário','Premium'].forEach(plano => {
        const option = document.createElement('option');
        option.value = plano;
        option.textContent = plano || 'Sem plano';
        if (doc.plano === plano) option.selected = true;
        selectPlano.appendChild(option);
      });
      tdPlano.appendChild(selectPlano);
      tr.appendChild(tdPlano);

      const tdAdmin = document.createElement('td');
      const inputAdmin = document.createElement('input');
      inputAdmin.type = 'checkbox';
      inputAdmin.checked = doc.admin === true;
      tdAdmin.appendChild(inputAdmin);
      tr.appendChild(tdAdmin);

      const tdAcoes = document.createElement('td');

      const btnSalvar = document.createElement('button');
      btnSalvar.textContent = 'Salvar';
      btnSalvar.onclick = async () => {
        doc.password = inputPassword.value.trim();
        doc.plano = selectPlano.value || null;
        doc.admin = inputAdmin.checked;
        try {
          await db.put(doc);
          alert(`Usuário ${doc._id} atualizado com sucesso!`);
          carregarUsuarios();
        } catch (err) {
          alert('Erro ao salvar: ' + err.message);
          console.error(err);
        }
      };
      tdAcoes.appendChild(btnSalvar);

      const btnExcluir = document.createElement('button');
      btnExcluir.textContent = 'Excluir';
      btnExcluir.style.marginLeft = '10px';
      btnExcluir.onclick = async () => {
        if (confirm(`Confirma exclusão do usuário ${doc._id}?`)) {
          try {
            await db.remove(doc);
            alert(`Usuário ${doc._id} excluído.`);
            carregarUsuarios();
          } catch (err) {
            alert('Erro ao excluir: ' + err.message);
            console.error(err);
          }
        }
      };
      tdAcoes.appendChild(btnExcluir);

      tr.appendChild(tdAcoes);
      tbody.appendChild(tr);
    });
  } catch (err) {
    alert('Erro ao carregar usuários: ' + err.message);
    console.error(err);
  }
}

document.getElementById('formCadastro').addEventListener('submit', async (e) => {
  e.preventDefault();
  const usuario = document.getElementById('inputUsuario').value.trim();
  const senha = document.getElementById('inputSenha').value.trim();
  const plano = document.getElementById('inputPlano').value || null;

  if (!usuario || !senha) {
    alert('Preencha usuário e senha.');
    return;
  }

  try {
    await db.put({
      _id: usuario,
      password: senha,
      plano: plano,
      admin: false
    });
    alert(`Usuário ${usuario} criado com sucesso!`);
    document.getElementById('formCadastro').reset();
    carregarUsuarios();
  } catch (err) {
    if (err.name === 'conflict') {
      alert('Usuário já existe!');
    } else {
      alert('Erro ao criar usuário: ' + err.message);
      console.error(err);
    }
  }
});

window.onload = () => {
  const admin = sessionStorage.getItem('adminLogado');
  if (admin !== 'true') {
    alert('Acesso negado. Você não é administrador.');
    window.location.href = '../html/home.html';
    return;
  }
  carregarUsuarios();
};
