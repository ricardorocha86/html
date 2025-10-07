// Filtro de projetos com select
const filtroSelect = document.getElementById('filtroSelect');
const projetoCards = document.querySelectorAll('.projeto-card-grid');

if (filtroSelect) {
    filtroSelect.addEventListener('change', () => {
        const filtroAtual = filtroSelect.value;
        
        projetoCards.forEach(card => {
            if (filtroAtual === 'todos') {
                card.style.display = 'block';
            } else {
                if (card.dataset.status === filtroAtual) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    });
}

