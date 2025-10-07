// URL do CSV publicado do Google Sheets
const CSV_URL_ORIGINAL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vScvFUk8IBaOUAlGWC3l8Emtsvev281hcnNoGm_1hCRKLMbb4XmLFsc6x7NySS8Rlds6x5Narz-Lfm9/pub?gid=0&single=true&output=csv';

// Lista de proxies CORS para tentar (em ordem de preferência)
const PROXIES = [
    '/.netlify/functions/csv-proxy', // Netlify Function (melhor opção)
    `https://api.allorigins.win/raw?url=${encodeURIComponent(CSV_URL_ORIGINAL)}`,
    `https://cors-anywhere.herokuapp.com/${CSV_URL_ORIGINAL}`,
    `https://thingproxy.freeboard.io/fetch/${CSV_URL_ORIGINAL}`,
    `https://corsproxy.io/?${encodeURIComponent(CSV_URL_ORIGINAL)}`
];

// Cria card do coordenador
function criarCardCoordenador(membro) {
    const linksSociais = criarLinksSociais(membro);
    return `
        <div class="membro-card-especial">
            <div class="badge-coordenador">Coordenador</div>
            <div class="membro-foto-grande">
                <img src="membros/${membro.ImagemURL}" alt="${membro.Nome}" class="foto-coordenador-real" onerror="this.src='membros/placeholder.jpg'">
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
                <img src="membros/${membro.ImagemURL}" alt="${membro.Nome}" onerror="this.src='membros/placeholder.jpg'">
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
    if (membro.Email) links.push(`<a href="mailto:${membro.Email}" class="btn-social btn-email" title="Email" aria-label="Email"><svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/></svg></a>`);
    if (membro.LinkLinkedin) links.push(`<a href="${membro.LinkLinkedin}" class="btn-social btn-linkedin" target="_blank" rel="noopener" title="LinkedIn" aria-label="LinkedIn"><svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg></a>`);
    if (membro.LinkGithub) links.push(`<a href="${membro.LinkGithub}" class="btn-social btn-github" target="_blank" rel="noopener" title="GitHub" aria-label="GitHub"><svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg></a>`);
    if (membro.LinkInstagram) links.push(`<a href="${membro.LinkInstagram}" class="btn-social btn-instagram" target="_blank" rel="noopener" title="Instagram" aria-label="Instagram"><svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/></svg></a>`);
    if (membro.LinkLattes) links.push(`<a href="${membro.LinkLattes}" class="btn-social btn-lattes" target="_blank" rel="noopener" title="Lattes" aria-label="Lattes"><svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8.05 9.6c.336 0 .504-.24.554-.627.04-.534.198-.815.847-1.26.673-.475 1.049-1.09 1.049-1.986 0-1.325-.92-2.227-2.262-2.227-1.02 0-1.792.492-2.1 1.29A1.71 1.71 0 0 0 6 5.48c0 .393.203.64.545.64.272 0 .455-.147.564-.51.158-.592.525-.915 1.074-.915.61 0 1.03.446 1.03 1.084 0 .563-.208.885-.822 1.325-.619.433-.926.914-.926 1.64v.111c0 .428.208.745.585.745z"/><path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z"/><path d="M7.001 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0z"/></svg></a>`);
    if (membro.LinkSitePessoal) links.push(`<a href="${membro.LinkSitePessoal}" class="btn-social btn-website" target="_blank" rel="noopener" title="Site Pessoal" aria-label="Site Pessoal"><svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/></svg></a>`);
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

// Tenta carregar CSV usando diferentes proxies
function carregarMembros() {
    const container = document.getElementById('membros-container');
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
                renderizarMembros(resultado.data);
            })
            .catch(erro => {
                console.error(`✗ Netlify Function falhou:`, erro);
                setTimeout(() => tentarProxies(indiceProxy + 1), 500);
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
            console.log('Primeira linha:', resultado.data[0]);
            
            if (resultado.errors.length > 0) {
                console.warn('Avisos:', resultado.errors);
            }
            
            renderizarMembros(resultado.data);
        },
        error: function(erro, arquivo) {
            console.error(`✗ Proxy ${indiceProxy + 1} falhou:`, erro);
            
            // Tenta próximo proxy
            setTimeout(() => tentarProxies(indiceProxy + 1), 500);
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
            console.log('Primeiros 200 caracteres:', csvTexto.substring(0, 200));
            
            const resultado = Papa.parse(csvTexto, {
                header: true,
                skipEmptyLines: true
            });
            
            console.log('Dados parseados:', resultado.data);
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
