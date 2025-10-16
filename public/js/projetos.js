// URL do CSV publicado do Google Sheets
const CSV_URL_ORIGINAL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vScvFUk8IBaOUAlGWC3l8Emtsvev281hcnNoGm_1hCRKLMbb4XmLFsc6x7NySS8Rlds6x5Narz-Lfm9/pub?gid=2004408230&single=true&output=csv';

// Cache config
const CACHE_KEY = 'enialabs_projetos_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Lista de proxies CORS
const PROXIES = [
    '/.netlify/functions/csv-proxy',
    `https://api.allorigins.win/raw?url=${encodeURIComponent(CSV_URL_ORIGINAL)}`,
    `https://corsproxy.io/?${encodeURIComponent(CSV_URL_ORIGINAL)}`
];

// Mapeia status para formato do filtro
function mapearStatus(status) {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('finalizado')) return 'finalizados';
    if (statusLower.includes('andamento')) return 'andamento';
    if (statusLower.includes('iniciar')) return 'iniciar';
    return 'todos';
}

// Mapeia status para badge
function criarBadgeStatus(status) {
    const statusNormalizado = mapearStatus(status);
    const labels = {
        finalizados: 'Finalizado',
        andamento: 'Em Andamento',
        iniciar: 'Pronto para Iniciar'
    };
    return `<span class="badge-status ${statusNormalizado}">${labels[statusNormalizado] || status}</span>`;
}

// Cria links de ações (GitHub e WebApp)
function criarLinksAcoes(projeto) {
    const links = [];
    if (projeto.LinkWebApp) {
        links.push(`<a href="${projeto.LinkWebApp}" class="btn-projeto btn-webapp" target="_blank" rel="noopener" title="Ver WebApp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            WebApp
        </a>`);
    }
    if (projeto.LinkGitHub) {
        links.push(`<a href="${projeto.LinkGitHub}" class="btn-projeto btn-github" target="_blank" rel="noopener" title="Ver no GitHub">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
        </a>`);
    }
    return links.length > 0 ? `<div class="projeto-acoes">${links.join('')}</div>` : '';
}

// Cria badges de tags
function criarBadgesTags(tags) {
    if (!tags || tags === 'N/A') return '<span class="tag-badge">N/A</span>';
    const tagsArray = tags.split(',').map(t => t.trim());
    return tagsArray.map(tag => `<span class="tag-badge">${tag}</span>`).join('');
}

// Cria card de projeto
function criarCardProjeto(projeto) {
    const statusNormalizado = mapearStatus(projeto.Status);
    const imagemPath = projeto.Imagem ? `images/projetos/${projeto.Imagem}` : '';
    const linksAcoes = criarLinksAcoes(projeto);
    const descricaoCompleta = projeto['Descrição'] || projeto.Descricao || '';
    const descricaoTruncada = descricaoCompleta.length > 50 ? descricaoCompleta.substring(0, 50) : descricaoCompleta;
    const precisaTruncar = descricaoCompleta.length > 50;
    
    return `
        <div class="projeto-card-grid" data-status="${statusNormalizado}">
            <div class="projeto-img">
                ${imagemPath ? 
                    `<img src="${imagemPath}" alt="${projeto.TituloDoProjeto}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'img-placeholder\\'>IMG</div>${criarBadgeStatus(projeto.Status)}'">` :
                    '<div class="img-placeholder">IMG</div>'
                }
                ${criarBadgeStatus(projeto.Status)}
            </div>
            <div class="projeto-body">
                <h3>${projeto.TituloDoProjeto}</h3>
                <div class="descricao-container ${precisaTruncar ? 'truncada' : ''}" onclick="toggleDescricao(this)">
                    <p class="descricao-texto">
                        <span class="texto-curto">${descricaoTruncada}${precisaTruncar ? '...' : ''}</span>
                        <span class="texto-completo" style="display: none;">${descricaoCompleta}</span>
                        ${precisaTruncar ? '<span class="ver-mais">ver mais</span>' : ''}
                    </p>
                </div>
                <div class="projeto-meta-grid">
                    <div class="meta-item tags-container">
                        ${criarBadgesTags(projeto.Tags)}
                    </div>
                    <div class="meta-item pessoas-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <span class="pessoas-nomes">${projeto.PessoasEnvolvidas || 'N/A'}</span>
                    </div>
                </div>
                ${linksAcoes}
            </div>
        </div>
    `;
}

// Renderiza projetos na página
function renderizarProjetos(projetos) {
    const container = document.getElementById('projetos-container');
    let html = '';
    
    projetos.forEach(projeto => {
        if (projeto.TituloDoProjeto && projeto.TituloDoProjeto.trim()) { // ignora linhas vazias
            html += criarCardProjeto(projeto);
        }
    });
    
    if (!html) {
        container.innerHTML = '<p style="color: orange; text-align: center;">Nenhum projeto encontrado na planilha.</p>';
    } else {
        container.innerHTML = html;
        console.log(`✓ ${projetos.length} projetos carregados do Google Sheets`);
        
        // Reaplica o filtro após renderizar
        const filtroSelect = document.getElementById('filtroSelect');
        if (filtroSelect) {
            aplicarFiltro(filtroSelect.value);
        }
    }
}

// Aplica filtro de status
function aplicarFiltro(filtroAtual) {
    const projetoCards = document.querySelectorAll('.projeto-card-grid');
        projetoCards.forEach(card => {
            if (filtroAtual === 'todos') {
                card.style.display = 'block';
            } else {
            card.style.display = card.dataset.status === filtroAtual ? 'block' : 'none';
        }
    });
}

// Verifica cache
function obterCache() {
    try {
        const cache = localStorage.getItem(CACHE_KEY);
        if (cache) {
            const { dados, timestamp } = JSON.parse(cache);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return dados;
            }
        }
    } catch (e) {
        console.warn('Erro ao ler cache:', e);
    }
    return null;
}

// Salva no cache
function salvarCache(dados) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            dados: dados,
            timestamp: Date.now()
        }));
    } catch (e) {
        console.warn('Erro ao salvar cache:', e);
    }
}

// Tenta carregar CSV usando diferentes proxies
function carregarProjetos() {
    const container = document.getElementById('projetos-container');
    
    // Tenta usar cache primeiro
    const dadosCache = obterCache();
    if (dadosCache) {
        console.log('✓ Dados carregados do cache');
        renderizarProjetos(dadosCache);
        return;
    }
    
    container.innerHTML = '<p style="text-align: center; color: #888;">Carregando projetos da planilha...</p>';
    tentarProxies(0);
}

function tentarProxies(indiceProxy) {
    if (indiceProxy >= PROXIES.length) {
        console.warn('Todos os proxies falharam, tentando método alternativo...');
        carregarProjetosAlternativo();
        return;
    }
    
    const proxyAtual = PROXIES[indiceProxy];
    console.log(`Tentando proxy ${indiceProxy + 1}/${PROXIES.length}:`, proxyAtual);
    
    // Se for Netlify Function, usa fetch direto
    if (proxyAtual.startsWith('/.netlify/functions/')) {
        fetch(proxyAtual)
            .then(resposta => {
                if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
                return resposta.text();
            })
            .then(csvTexto => {
                console.log(`✓ Netlify Function bem-sucedida!`);
                const resultado = Papa.parse(csvTexto, {
                    header: true,
                    skipEmptyLines: true
                });
                salvarCache(resultado.data);
                renderizarProjetos(resultado.data);
            })
            .catch(erro => {
                console.error(`✗ Netlify Function falhou:`, erro);
                setTimeout(() => tentarProxies(indiceProxy + 1), 200);
            });
        return;
    }
    
    // Para outros proxies, usa PapaParse
    Papa.parse(proxyAtual, {
        download: true,
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        complete: function(resultado) {
            console.log(`✓ CSV carregado com sucesso via proxy ${indiceProxy + 1}!`);
            console.log('Total de linhas:', resultado.data.length);
            
            if (resultado.errors.length > 0) {
                console.warn('Avisos:', resultado.errors);
            }
            
            salvarCache(resultado.data);
            renderizarProjetos(resultado.data);
        },
        error: function(erro) {
            console.error(`✗ Proxy ${indiceProxy + 1} falhou:`, erro);
            setTimeout(() => tentarProxies(indiceProxy + 1), 200);
        }
    });
}

// Método alternativo usando diferentes abordagens
function carregarProjetosAlternativo() {
    const container = document.getElementById('projetos-container');
    container.innerHTML = '<p style="text-align: center; color: #888;">Tentando método alternativo...</p>';
    
    console.log('Tentando métodos alternativos...');
    
    fetch(`https://corsproxy.io/?${encodeURIComponent(CSV_URL_ORIGINAL)}`)
        .then(resposta => {
            if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
            return resposta.text();
        })
        .then(csvTexto => {
            console.log('✓ Fetch alternativo bem-sucedido!');
            
            const resultado = Papa.parse(csvTexto, {
                header: true,
                skipEmptyLines: true
            });
            
            salvarCache(resultado.data);
            renderizarProjetos(resultado.data);
        })
        .catch(erro => {
            console.error('✗ Método alternativo também falhou:', erro);
            mostrarErroFinal(erro);
        });
}

function mostrarErroFinal(erro) {
    const container = document.getElementById('projetos-container');
    container.innerHTML = `
        <div style="color: red; text-align: center; padding: 20px;">
            <p><strong>Erro ao carregar projetos da planilha</strong></p>
            <p style="font-size: 0.9rem; margin-top: 10px;">${erro.message}</p>
            <div style="margin-top: 15px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px; max-width: 600px; margin-left: auto; margin-right: auto;">
                <h4 style="color: #ff6b6b; margin-bottom: 10px;">💡 Soluções:</h4>
                <ol style="text-align: left; color: #ccc; line-height: 1.6;">
                    <li><strong>Verifique a planilha:</strong> Certifique-se que está publicada como CSV</li>
                    <li><strong>Teste a URL:</strong> <a href="${CSV_URL_ORIGINAL}" target="_blank" style="color: #60a5fa;">Clique aqui para testar</a></li>
                    <li><strong>Console:</strong> Abra F12 para mais detalhes</li>
                </ol>
            </div>
        </div>
    `;
}

// Configura event listener do filtro
function configurarFiltro() {
    const filtroSelect = document.getElementById('filtroSelect');
    if (filtroSelect) {
        filtroSelect.addEventListener('change', () => {
            aplicarFiltro(filtroSelect.value);
        });
    }
}

// Toggle descrição expandida/recolhida
function toggleDescricao(elemento) {
    const truncada = elemento.classList.contains('truncada');
    if (!truncada) return; // não faz nada se não tem truncamento
    
    const textoCurto = elemento.querySelector('.texto-curto');
    const textoCompleto = elemento.querySelector('.texto-completo');
    const verMais = elemento.querySelector('.ver-mais');
    
    const expandido = elemento.classList.contains('expandido');
    
    if (expandido) {
        // recolher
        textoCurto.style.display = 'inline';
        textoCompleto.style.display = 'none';
        verMais.textContent = 'ver mais';
        elemento.classList.remove('expandido');
    } else {
        // expandir
        textoCurto.style.display = 'none';
        textoCompleto.style.display = 'inline';
        verMais.textContent = 'ver menos';
        elemento.classList.add('expandido');
    }
}

// Carrega ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarProjetos();
    configurarFiltro();
});
