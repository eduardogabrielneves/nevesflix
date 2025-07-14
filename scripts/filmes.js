document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO HTML ---
    const moviesContainer = document.querySelector('.movies-container');
    const modal = document.getElementById('filmeModal');
    const modalContent = document.querySelector('.modal-content');
    const modalCloseBtn = document.querySelector('.close-modal');
    const modalTitulo = document.getElementById('modalTitulo');
    const modalDescricao = document.getElementById('modalDescricao');
    const modalGenero = document.getElementById('modalGenero');
    const modalAno = document.getElementById('modalAno');
    const modalTrailer = document.getElementById('modalTrailer');
    const toggleDetailsBtn = document.getElementById('toggleDetailsBtn');
    const navAdminLink = document.getElementById('navUsuarios');

    // Conexão com o banco de dados de filmes
    const dbFilmes = new PouchDB('movies');

    // --- FUNÇÕES ---

    /**
     * Converte uma URL normal do YouTube para uma URL de "embed" (incorporação).
     * @param {string} url - A URL do vídeo do YouTube.
     * @returns {string} - A URL formatada para ser usada em um iframe.
     */
    function getYouTubeEmbedUrl(url) {
        let videoId = '';
        try {
            // Tenta extrair o ID do vídeo da URL
            const urlObj = new URL(url);
            if (urlObj.hostname === 'youtu.be') {
                videoId = urlObj.pathname.slice(1);
            } else {
                videoId = urlObj.searchParams.get('v');
            }
        } catch (e) {
            console.error("URL do trailer inválida:", url);
            return "";
        }
        
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return '';
    }

    /**
     * Abre o modal com os detalhes de um filme específico.
     * @param {object} filme - O objeto do filme.
     */
    function openModal(filme) {
        modalContent.classList.remove('details-visible');
        toggleDetailsBtn.textContent = 'Ver Detalhes';
        
        modalTitulo.textContent = filme.titulo;
        modalDescricao.textContent = filme.descricao;
        modalGenero.textContent = filme.genero;
        modalAno.textContent = filme.ano;
        modalTrailer.src = getYouTubeEmbedUrl(filme.trailer);
        
        modal.style.display = 'flex';
    }

    /**
     * Fecha o modal e para o vídeo do trailer.
     */
    function closeModal() {
        modal.style.display = 'none';
        modalTrailer.src = ''; // Limpa o src para parar o vídeo
    }

    /**
     * Carrega todos os filmes do banco de dados e os exibe na tela.
     */
    async function carregarFilmes() {
        try {
            const result = await dbFilmes.allDocs({ include_docs: true });
            moviesContainer.innerHTML = ''; // Limpa o container
            
            result.rows.forEach(item => {
                const filme = item.doc;
                
                const divFilme = document.createElement('div');
                divFilme.className = 'movie-card';
                divFilme.setAttribute('data-genero', filme.genero);
                divFilme.setAttribute('data-titulo', filme.titulo.toLowerCase());
                
                divFilme.innerHTML = `
                    <img src="${filme.imagem}" alt="Capa do filme ${filme.titulo}" />
                    <div class="movie-info">
                        <h3>${filme.titulo}</h3>
                    </div>
                `;
                
                divFilme.addEventListener('click', () => openModal(filme));
                moviesContainer.appendChild(divFilme);
            });
        } catch (error) {
            console.error('Erro ao carregar filmes:', error);
        }
    }

    /**
     * Filtra os filmes visíveis com base na categoria e no termo de pesquisa.
     */
    function filtrarFilmes() {
        const categoria = document.getElementById('categoria').value;
        const termoPesquisa = document.getElementById('pesquisa').value.toLowerCase();
        const filmes = document.querySelectorAll('.movie-card');

        filmes.forEach(filmeCard => {
            const generoFilme = filmeCard.getAttribute('data-genero');
            const tituloFilme = filmeCard.getAttribute('data-titulo');
            
            const matchCategoria = (categoria === 'todas' || generoFilme === categoria);
            const matchPesquisa = tituloFilme.includes(termoPesquisa);

            // O filme só é exibido se corresponder à categoria E à pesquisa
            filmeCard.style.display = (matchCategoria && matchPesquisa) ? 'flex' : 'none';
        });
    }

    // --- EVENT LISTENERS ---

    // Botão para mostrar/esconder detalhes no modal
    toggleDetailsBtn.addEventListener('click', () => {
        modalContent.classList.toggle('details-visible');
        const isVisible = modalContent.classList.contains('details-visible');
        toggleDetailsBtn.textContent = isVisible ? 'Esconder Detalhes' : 'Ver Detalhes';
    });

    // Fechar o modal
    modalCloseBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Filtros de gênero e pesquisa
    document.getElementById('categoria').addEventListener('change', filtrarFilmes);
    document.getElementById('pesquisa').addEventListener('input', filtrarFilmes);

    // --- INICIALIZAÇÃO ---

    // Verifica se o usuário é admin para mostrar o link do painel
    if (sessionStorage.getItem('adminLogado') === 'true') {
        navAdminLink.style.display = 'block';
    }

    // Carrega os filmes ao iniciar a página
    carregarFilmes();
});