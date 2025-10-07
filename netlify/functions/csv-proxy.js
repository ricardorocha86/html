exports.handler = async (event, context) => {
    // Permite CORS para qualquer origem
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Lida com preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // URL da planilha Google Sheets
    const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vScvFUk8IBaOUAlGWC3l8Emtsvev281hcnNoGm_1hCRKLMbb4XmLFsc6x7NySS8Rlds6x5Narz-Lfm9/pub?gid=0&single=true&output=csv';

    try {
        // Busca dados do Google Sheets
        const response = await fetch(SHEETS_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const csvData = await response.text();
        
        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Content-Type': 'text/csv'
            },
            body: csvData
        };

    } catch (error) {
        console.error('Erro ao buscar CSV:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Erro ao carregar dados da planilha',
                message: error.message
            })
        };
    }
};
