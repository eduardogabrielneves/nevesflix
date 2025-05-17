function filterMovies() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const movieCards = document.querySelectorAll('.movie-card');

    movieCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();

        if (title.includes(searchQuery)) {
            card.style.display = '';  
        } else {
            card.style.display = 'none'; 
        }
    });
}
