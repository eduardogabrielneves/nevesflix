# Nevesflix - Interface de Streaming de Filmes

Nevesflix é uma interface de front-end para uma plataforma de streaming de filmes, desenvolvida como um projeto acadêmico. A aplicação simula um ambiente completo com cadastro e login de usuários, um catálogo de filmes dinâmico com filtros e busca, e um painel administrativo para gerenciamento de filmes e usuários.

Toda a persistência de dados é feita localmente no navegador através da biblioteca **PouchDB**, eliminando a necessidade de um back-end.

![Tela Principal do Nevesflix](https://i.imgur.com/fSdUWRI.png)
*(Dica: Tire um print da sua tela de `filmes.html` e substitua o link acima para deixar seu README mais visual!)*

---

## 🚀 Funcionalidades

-   **Sistema de Autenticação:** Cadastro e login de usuários.
-   **Painel Administrativo:** Área restrita para administradores com funcionalidades de gerenciamento.
-   **Gerenciamento de Filmes (CRUD):** Administradores podem adicionar, editar e excluir filmes do catálogo.
-   **Gerenciamento de Usuários:** Administradores podem alterar senhas, planos e o status de administrador de outros usuários.
-   **Catálogo de Filmes:** Exibição dos filmes em formato de cartões, com a possibilidade de filtrar por gênero e buscar por título.
-   **Modal de Detalhes:** Ao clicar em um filme, uma janela exibe a sinopse, ano, gênero e o trailer do filme incorporado do YouTube.
-   **Persistência de Dados Local:** Utiliza PouchDB para simular um banco de dados que salva todas as informações no navegador do usuário.
-   **Design Responsivo:** A interface se adapta para uma boa experiência tanto em desktops quanto em dispositivos móveis.

---

## 🛠️ Tecnologias Utilizadas

-   **HTML5:** Estrutura semântica do projeto.
-   **CSS3:** Estilização moderna com Flexbox, Grid e Media Queries para responsividade.
-   **JavaScript (ES6+):** Manipulação dinâmica do DOM, interatividade e lógica da aplicação.
-   **PouchDB:** Biblioteca de banco de dados JavaScript que funciona offline e no navegador, usada para armazenar todos os dados de usuários e filmes.

---

## ⚙️ Como Executar o Projeto

Como este é um projeto puramente de front-end, não há necessidade de um servidor ou de instalação de dependências.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/eduardogabrielneves/nevesflix-main.git](https://github.com/eduardogabrielneves/nevesflix-main.git)
    ```

2.  **Abra o arquivo principal:**
    Navegue até a pasta do projeto e abra o arquivo `index.html` diretamente no seu navegador de preferência (Google Chrome, Firefox, etc.).

### 🔒 Criando o Usuário Administrador

O sistema não possui um usuário administrador por padrão. Para acessar as áreas de gerenciamento, você precisa criar um manualmente através do console do navegador.

**Siga os passos abaixo:**

1.  Abra o arquivo `index.html` no navegador.
2.  Abra as **Ferramentas de Desenvolvedor** (pressione `F12` ou `Ctrl+Shift+I`).
3.  Vá até a aba **"Console"**.
4.  Copie e cole o seguinte código no console e pressione `Enter`:

    ```javascript
    const db = new PouchDB('usuarios');

    db.put({
      _id: 'usuario',
      password: 'senha',
      admin: true,
      plano: null
    }).then(() => {
      console.log('Usuário "..." criado como administrador com sucesso!');
      alert('Usuário "..." criado como administrador com sucesso! Você já pode fazer login.');
    }).catch(err => {
      if (err.name === 'conflict') {
        console.log('O usuário "..." já existe.');
        alert('O usuário administrador "..." já existe. Você já pode fazer login.');
      } else {
        console.error('Erro ao criar usuário admin:', err);
      }
    });
    ```

5.  Após executar o comando, um usuário com **login `...`** e **senha `...`** será criado (ou verificado se já existe).
6.  Agora você pode fazer login com essas credenciais para acessar o painel administrativo através dos links na barra de navegação da página de filmes.

---

## 👨‍💻 Autor

Desenvolvido por **Eduardo Gabriel Neves**

-   **GitHub:** [@seu-usuario](https://github.com/eduardogabrielneves)
