const db = new PouchDB('movies');

window.onload = () => {
  const admin = sessionStorage.getItem('adminLogado');
  if (admin !== 'true') {
    const navUsuarios = document.getElementById('navUsuarios');
    if (navUsuarios) {
      navUsuarios.style.display = 'none';
    }
  }
};


document.addEventListener("DOMContentLoaded", () => {

  // Tornar cards fixos clicáveis para abrir modal
  function setupFilmesFixos() {
    document.querySelectorAll('.filme').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        openModal(card.dataset.titulo, card.dataset.descricao, card.dataset.video);
      });
    });
  }

  // Filtrar filmes por categoria
  function filtrarFilmes() {
    const categoriaSelecionada = document.getElementById('categoria').value;
    const filmes = document.querySelectorAll('.filme');

    filmes.forEach(filme => {
      const generos = filme.getAttribute('data-genero') || '';
      filme.style.display = (categoriaSelecionada === 'todas' || generos.includes(categoriaSelecionada)) ? 'block' : 'none';
    });
  }
  window.filtrarFilmes = filtrarFilmes;

  // Pesquisa em tempo real
  function setupPesquisa() {
    const campoPesquisa = document.getElementById('pesquisa');
    campoPesquisa.addEventListener('input', () => {
      const termo = campoPesquisa.value.toLowerCase();
      const filmes = document.querySelectorAll('.filme');

      filmes.forEach(filme => {
        const titulo = filme.dataset.titulo.toLowerCase();
        const descricao = filme.dataset.descricao.toLowerCase();
        filme.style.display = (titulo.includes(termo) || descricao.includes(termo)) ? 'block' : 'none';
      });
    });
  }

  // Embaralhar os cards da grid
  function embaralharMovies() {
    const movies = document.querySelectorAll(".movies-container");
    movies.forEach(movies => {
      const filmes = Array.from(movies.querySelectorAll(".filme"));
      for (let i = filmes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filmes[i], filmes[j]] = [filmes[j], filmes[i]];
      }
      movies.innerHTML = "";
      filmes.forEach(filme => movies.appendChild(filme));
    });
  }

  // Controlar header show/hide ao scroll
  function setupHeaderScroll() {
    let prevScrollPos = window.scrollY;
    const header = document.querySelector("header");

    window.addEventListener('scroll', () => {
      const currentScrollPos = window.scrollY;
      if (prevScrollPos > currentScrollPos) {
        header.style.top = "0";
      } else {
        header.style.top = "-100px";
      }
      prevScrollPos = currentScrollPos;
    });
  }

  // Função para carregar filmes adicionados do PouchDB
  async function carregarFilmesAdicionados() {
    try {
      const result = await db.allDocs({ include_docs: true });
      const movies = document.querySelector('.movies-container');

      result.rows.forEach(row => {
        const filme = row.doc;

        const divFilme = document.createElement('div');
        divFilme.classList.add('filme');
        divFilme.style.cursor = 'pointer';
        divFilme.setAttribute('data-genero', filme.genero);
        divFilme.setAttribute('data-classificacao', filme.classificacao);
        divFilme.setAttribute('data-titulo', filme.titulo);
        divFilme.setAttribute('data-descricao', `${filme.descricao}<br /><br /><strong>Classificação:</strong> ${filme.classificacao}<br /><strong>Duração:</strong> ${filme.duracao}<br /><strong>Gênero:</strong> ${filme.genero}<br /><strong>Ano:</strong> ${filme.ano}`);
        divFilme.setAttribute('data-video', filme.trailer);

    divFilme.innerHTML = `
      <img src="${filme.imagem}" alt="${filme.titulo}" />
      <div class="movie-info">
        <h3>${filme.titulo}</h3>
      </div>
    `;
    divFilme.classList.add('movie-card');


        divFilme.addEventListener('click', () => {
          openModal(
            divFilme.getAttribute('data-titulo'),
            divFilme.getAttribute('data-descricao'),
            divFilme.getAttribute('data-video')
          );
        });

        movies.appendChild(divFilme);
      });
    } catch (error) {
      console.error('Erro ao carregar filmes:', error);
    }
  }

  // Ordem das chamadas para garantir tudo funciona direitinho
  (async function iniciar() {
    setupFilmesFixos();
    setupPesquisa();
    setupHeaderScroll();
    await carregarFilmesAdicionados();
    embaralharMovies();
  })();

});