document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO HTML E BANCO DE DADOS ---
    const db = new PouchDB('usuarios');
    const formCadastro = document.getElementById('formCadastro');
    const tabelaUsuariosBody = document.querySelector('#tabelaUsuarios tbody');

    // --- FUNÇÕES ---

    /**
     * Carrega todos os usuários do banco de dados e os exibe na tabela.
     */
    async function carregarUsuarios() {
        try {
            const result = await db.allDocs({ include_docs: true });
            tabelaUsuariosBody.innerHTML = ''; // Limpa a tabela

            result.rows.forEach(item => {
                const doc = item.doc;

                const tr = document.createElement('tr');

                // Coluna: Nome de Usuário (ID)
                tr.innerHTML += `<td>${doc._id}</td>`;

                // Coluna: Senha (com input para edição)
                const tdSenha = document.createElement('td');
                const inputSenha = document.createElement('input');
                inputSenha.type = 'text';
                inputSenha.value = doc.password || '';
                tdSenha.appendChild(inputSenha);
                tr.appendChild(tdSenha);

                // Coluna: Plano (com select para edição)
                const tdPlano = document.createElement('td');
                const selectPlano = document.createElement('select');
                ['', 'Básico', 'Intermediário', 'Premium'].forEach(plano => {
                    const option = document.createElement('option');
                    option.value = plano;
                    option.textContent = plano || 'Sem plano';
                    if (doc.plano === plano) option.selected = true;
                    selectPlano.appendChild(option);
                });
                tdPlano.appendChild(selectPlano);
                tr.appendChild(tdPlano);

                // Coluna: Admin (com checkbox)
                const tdAdmin = document.createElement('td');
                const inputAdmin = document.createElement('input');
                inputAdmin.type = 'checkbox';
                inputAdmin.checked = doc.admin === true;
                tdAdmin.appendChild(inputAdmin);
                tr.appendChild(tdAdmin);

                // Coluna: Ações (botões de Salvar e Excluir)
                const tdAcoes = document.createElement('td');
                
                const btnSalvar = document.createElement('button');
                btnSalvar.textContent = 'Salvar';
                btnSalvar.className = 'btn-save';
                btnSalvar.onclick = async () => {
                    // Atualiza o documento com os novos valores
                    doc.password = inputSenha.value.trim();
                    doc.plano = selectPlano.value || null;
                    doc.admin = inputAdmin.checked;
                    try {
                        await db.put(doc);
                        alert(`Usuário ${doc._id} atualizado com sucesso!`);
                    } catch (err) {
                        alert('Erro ao salvar: ' + err.message);
                    }
                };

                const btnExcluir = document.createElement('button');
                btnExcluir.textContent = 'Excluir';
                btnExcluir.className = 'btn-delete';
                btnExcluir.onclick = async () => {
                    if (confirm(`Confirma exclusão do usuário ${doc._id}?`)) {
                        try {
                            await db.remove(doc);
                            await carregarUsuarios(); // Recarrega a lista
                        } catch (err) {
                            alert('Erro ao excluir: ' + err.message);
                        }
                    }
                };
                
                tdAcoes.appendChild(btnSalvar);
                tdAcoes.appendChild(btnExcluir);
                tr.appendChild(tdAcoes);

                tabelaUsuariosBody.appendChild(tr);
            });
        } catch (err) {
            console.error('Erro ao carregar usuários:', err);
        }
    }

    // --- EVENT LISTENERS ---

    // Evento para cadastrar um novo usuário pelo formulário da página
    formCadastro.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usuario = document.getElementById('inputUsuario').value.trim();
        const senha = document.getElementById('inputSenha').value.trim();
        const plano = document.getElementById('inputPlano').value || null;

        if (!usuario || !senha) {
            alert('Preencha pelo menos o usuário e a senha.');
            return;
        }

        try {
            await db.put({
                _id: usuario,
                password: senha,
                plano: plano,
                admin: false // Novos usuários nunca são criados como admin por padrão
            });
            alert(`Usuário ${usuario} criado com sucesso!`);
            formCadastro.reset();
            await carregarUsuarios(); // Atualiza a tabela
        } catch (err) {
            if (err.name === 'conflict') {
                alert('Usuário já existe!');
            } else {
                alert('Erro ao criar usuário: ' + err.message);
            }
        }
    });

    // --- INICIALIZAÇÃO ---

    // Roda quando a página carrega
    window.onload = () => {
        // Proteção de rota: verifica se o usuário é admin
        const isAdmin = sessionStorage.getItem('adminLogado') === 'true';
        if (!isAdmin) {
            alert('Acesso negado. Você não é administrador.');
            window.location.href = 'filmes.html'; // Redireciona se não for admin
            return;
        }
        carregarUsuarios();
    };
});