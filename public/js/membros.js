// URL do CSV publicado do Google Sheets
const CSV_URL_ORIGINAL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vScvFUk8IBaOUAlGWC3l8Emtsvev281hcnNoGm_1hCRKLMbb4XmLFsc6x7NySS8Rlds6x5Narz-Lfm9/pub?gid=0&single=true&output=csv';

// Cache config
const CACHE_KEY = 'enialabs_membros_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Lista de proxies CORS para tentar (em ordem de preferência)
const PROXIES = [
    '/.netlify/functions/csv-proxy',
    `https://api.allorigins.win/raw?url=${encodeURIComponent(CSV_URL_ORIGINAL)}`,
    `https://corsproxy.io/?${encodeURIComponent(CSV_URL_ORIGINAL)}`
];

// Cria card do coordenador
function criarCardCoordenador(membro) {
    const linksSociais = criarLinksSociais(membro);
    return `
        <div class="membro-card-especial">
            <div class="badge-coordenador">Coordenador</div>
            <div class="membro-foto-grande">
                <img src="membros/${membro.ImagemURL}" alt="${membro.Nome}" class="foto-coordenador-real" loading="lazy" onerror="this.src='membros/placeholder.jpg'">
            </div>
            <h3 class="membro-nome-destaque">${membro.Nome}</h3>
            <p class="membro-titulo">${membro['Função']}</p>
            <p class="membro-filiacao">${membro['Filiação']}</p>
            ${linksSociais ? `<div class="membro-links-sociais">${linksSociais}</div>` : ''}
        </div>
    `;
}

// Cria card de colaborador
function criarCardMembroPadrao(membro) {
    const linksSociais = criarLinksSociais(membro);
    return `
        <div class="membro-card-padrao">
            <div class="membro-foto-grande">
                <img src="membros/${membro.ImagemURL}" alt="${membro.Nome}" loading="lazy" onerror="this.src='membros/placeholder.jpg'">
            </div>
            <h3 class="membro-nome-destaque">${membro.Nome}</h3>
            <p class="membro-titulo">${membro['Função']}</p>
            <p class="membro-filiacao">${membro['Filiação']}</p>
            ${linksSociais ? `<div class="membro-links-sociais">${linksSociais}</div>` : ''}
        </div>
    `;
}

// Cria links sociais (apenas os preenchidos)
function criarLinksSociais(membro) {
    const links = [];
    if (membro.Email) links.push(`<a href="mailto:${membro.Email}" class="btn-social btn-email" title="Email" aria-label="Email"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></a>`);
    if (membro.LinkLinkedin) links.push(`<a href="${membro.LinkLinkedin}" class="btn-social btn-linkedin" target="_blank" rel="noopener" title="LinkedIn" aria-label="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>`);
    if (membro.LinkGithub) links.push(`<a href="${membro.LinkGithub}" class="btn-social btn-github" target="_blank" rel="noopener" title="GitHub" aria-label="GitHub"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>`);
    if (membro.LinkInstagram) links.push(`<a href="${membro.LinkInstagram}" class="btn-social btn-instagram" target="_blank" rel="noopener" title="Instagram" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>`);
    if (membro.LinkLattes) links.push(`<a href="${membro.LinkLattes}" class="btn-social btn-lattes" target="_blank" rel="noopener" title="Lattes" aria-label="Lattes"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10zm1-17h-2v6h-6v2h6v6h2v-6h6v-2h-6z"/></svg></a>`);
    if (membro.LinkSitePessoal) links.push(`<a href="${membro.LinkSitePessoal}" class="btn-social btn-website" target="_blank" rel="noopener" title="Site Pessoal" aria-label="Site Pessoal"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.947v1.053h-1v-.998c-1.035-.018-2.106-.265-3-.727l.455-1.644c.956.371 2.229.765 3.225.54 1.149-.26 1.385-1.442.114-2.011-.931-.434-3.778-.805-3.778-3.243 0-1.363 1.039-2.583 2.984-2.85v-1.067h1v1.018c.724.019 1.536.145 2.442.42l-.362 1.647c-.768-.27-1.616-.515-2.442-.465-1.489.087-1.62 1.376-.581 1.916 1.033.535 3.86.998 3.86 3.358 0 1.345-.974 2.631-2.917 2.053z"/></svg></a>`);
    return links.join('');
}

// Renderiza membros na página
function renderizarMembros(membros) {
    const container = document.getElementById('membros-container');
    let html = '';
    
    membros.forEach(membro => {
        if (membro.Nome && membro.Nome.trim()) { // ignora linhas vazias
            if (membro['Função'] === 'Coordenador') {
                html += criarCardCoordenador(membro);
            } else if (membro['Função'] === 'Colaborador') {
                html += criarCardMembroPadrao(membro);
            }
        }
    });
    
    if (!html) {
        container.innerHTML = '<p style="color: orange; text-align: center;">Nenhum membro encontrado na planilha.</p>';
    } else {
        container.innerHTML = html;
        console.log(`✓ ${membros.length} membros carregados do Google Sheets`);
    }
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
function carregarMembros() {
    const container = document.getElementById('membros-container');
    
    // Tenta usar cache primeiro
    const dadosCache = obterCache();
    if (dadosCache) {
        console.log('✓ Dados carregados do cache');
        renderizarMembros(dadosCache);
        return;
    }
    
    container.innerHTML = '<p style="text-align: center; color: #888;">Carregando membros da planilha...</p>';
    tentarProxies(0);
}

function tentarProxies(indiceProxy) {
    if (indiceProxy >= PROXIES.length) {
        // Todos os proxies falharam, tenta método alternativo
        console.warn('Todos os proxies falharam, tentando método alternativo...');
        carregarMembrosAlternativo();
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
                renderizarMembros(resultado.data);
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
            renderizarMembros(resultado.data);
        },
        error: function(erro, arquivo) {
            console.error(`✗ Proxy ${indiceProxy + 1} falhou:`, erro);
            setTimeout(() => tentarProxies(indiceProxy + 1), 200);
        }
    });
}

// Método alternativo usando diferentes abordagens
function carregarMembrosAlternativo() {
    const container = document.getElementById('membros-container');
    container.innerHTML = '<p style="text-align: center; color: #888;">Tentando método alternativo...</p>';
    
    console.log('Tentando métodos alternativos...');
    
    // Método 1: Fetch com proxy diferente
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
            renderizarMembros(resultado.data);
        })
        .catch(erro => {
            console.error('✗ Método alternativo também falhou:', erro);
            mostrarErroFinal(erro);
        });
}

function mostrarErroFinal(erro) {
    const container = document.getElementById('membros-container');
    container.innerHTML = `
        <div style="color: red; text-align: center; padding: 20px;">
            <p><strong>Erro ao carregar membros da planilha</strong></p>
            <p style="font-size: 0.9rem; margin-top: 10px;">${erro.message}</p>
            <div style="margin-top: 15px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px; max-width: 600px; margin-left: auto; margin-right: auto;">
                <h4 style="color: #ff6b6b; margin-bottom: 10px;">💡 Soluções:</h4>
                <ol style="text-align: left; color: #ccc; line-height: 1.6;">
                    <li><strong>Verifique a planilha:</strong> Certifique-se que está publicada como CSV</li>
                    <li><strong>Teste a URL:</strong> <a href="${CSV_URL_ORIGINAL}" target="_blank" style="color: #60a5fa;">Clique aqui para testar</a></li>
                    <li><strong>Proxy temporário:</strong> Tente acessar <a href="https://cors-anywhere.herokuapp.com/" target="_blank" style="color: #60a5fa;">cors-anywhere.herokuapp.com</a> e clique em "Request temporary access"</li>
                    <li><strong>Console:</strong> Abra F12 para mais detalhes</li>
                </ol>
            </div>
            <details style="margin-top: 15px; text-align: left; max-width: 600px; margin-left: auto; margin-right: auto;">
                <summary style="cursor: pointer; color: #888;">Detalhes técnicos</summary>
                <div style="background: rgba(0,0,0,0.2); padding: 10px; margin-top: 10px; border-radius: 5px; font-size: 0.8rem;">
                    <p><strong>URL Original:</strong><br><code style="word-break: break-all;">${CSV_URL_ORIGINAL}</code></p>
                    <p style="margin-top: 10px;"><strong>Proxies testados:</strong> ${PROXIES.length}</p>
                    <p style="margin-top: 10px;">Erro: ${erro.message}</p>
                </div>
            </details>
        </div>
    `;
}

// Carrega ao iniciar a página
document.addEventListener('DOMContentLoaded', carregarMembros);
