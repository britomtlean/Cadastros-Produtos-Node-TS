
function mostrarSecao(secaoId) {
    document.querySelectorAll('section').forEach( //seleciona todas as section 
        sec => sec.classList.remove('active')); // remove a classe active de todos os elementos
    document.getElementById(secaoId).classList.add('active'); // seleciona o elemento pelo valor do id e adiciona a classe active

    if (secaoId === 'cardapio') carregarProdutos();
    if (secaoId === 'editar') carregarProdutosEdicao();
    if (secaoId === 'cadastrar') carregarProdutosInserir();
}

// 📦 Carregar produtos para visualização
async function carregarProdutos() {
    try {
        const res = await fetch('https://gestao-de-produtos.up.railway.app/api/produtos'); // URL completa se o front não estiver no mesmo servidor
        if (!res.ok) throw new Error('Erro ao carregar produtos');
        console.log(res.json())
        
        const produtos = await res.json();
        const container = document.getElementById('produtos-container');
        container.innerHTML = '';

        produtos.forEach(prod => {
            const div = document.createElement('div');
            div.classList.add('produto');

            // Verifica se há imagem cadastrada
            const imgSrc = prod.imagem_produtos 
                ? `/imagens/${prod.imagem_produtos}` 
                : '/imagens/placeholder.png'; // imagem padrão caso não exista

            div.innerHTML = `
                <img src="${imgSrc}" alt="${prod.produto_produtos}" />
                <h3>${prod.produto_produtos}</h3>
                <p>${prod.descricao_produtos}</p>
                <p>💰 Preço: R$ ${Number(prod.valor_produtos).toFixed(2)}</p>
                <p>📦 Estoque: ${prod.estoque_produtos}</p>
            `;
            container.appendChild(div);
        });

    } catch (err) {
        console.error('Erro ao carregar produtos:', err);
    }
}


// 📦 Carregar produtos para edição
async function carregarProdutosEdicao() {
    try {
        const res = await fetch('/api/produtos');
        const produtos = await res.json();

        const container = document.getElementById('produtos-editar');
        container.innerHTML = '';
        produtos.forEach(prod => {
            const div = document.createElement('div');
            div.classList.add('produto');
            div.innerHTML = `
            <img src="/imagens/${prod.imagem_produtos}" alt="${prod.produto_produtos}" />
            <h3>${prod.produto_produtos}</h3>
            <p>${prod.descricao_produtos}</p>
            <p>Preço: R$ ${prod.valor_produtos.toFixed(2)}</p>
            <p>Estoque: ${prod.estoque_produtos}</p>
            <div class="edit-buttons">
              <button class="edit" onclick="editarProduto(${prod.id_produtos})">Editar</button>
              <button class="delete" onclick="deletarProduto(${prod.id_produtos})">Excluir</button>
            </div>
          `;
            container.appendChild(div);
        });
    } catch (err) {
        console.error(err);
    }
}

async function carregarProdutosInserir() {
    (function () {
        // Altere se seu backend estiver em outro host/porta
        const API_URL = "https://gestao-de-produtos.up.railway.app/api/produtos"; // ex: "http://localhost:3000/api/produtos"

        const form = document.getElementById("formProduto");
        const imagemInput = document.getElementById("imagem");
        const previewWrapper = document.getElementById("previewWrapper");
        const previewImg = document.getElementById("previewImg");
        const fileInfo = document.getElementById("fileInfo");
        const status = document.getElementById("status");
        const loading = document.getElementById("loading");
        const btnEnviar = document.getElementById("btnEnviar");

        // Valida e exibe preview quando selecionar arquivo
        imagemInput.addEventListener("change", () => {
            const file = imagemInput.files && imagemInput.files[0];
            status.style.display = "none";
            if (!file) {
                previewWrapper.style.display = "none";
                return;
            }

            // Valida tipo e tamanho (ex.: max 5MB)
            const allowed = ["image/png", "image/jpeg"];
            const maxMB = 5;
            if (!allowed.includes(file.type)) {
                showStatus("Tipo de arquivo não permitido. Use PNG ou JPG.", true);
                imagemInput.value = "";
                previewWrapper.style.display = "none";
                return;
            }
            if (file.size > maxMB * 1024 * 1024) {
                showStatus("Arquivo muito grande. Máx " + maxMB + " MB.", true);
                imagemInput.value = "";
                previewWrapper.style.display = "none";
                return;
            }

            // Preview
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImg.src = e.target.result;
                fileInfo.textContent = `${file.name} — ${(file.size / 1024 / 1024).toFixed(2)} MB`;
                previewWrapper.style.display = "flex";
            };
            reader.readAsDataURL(file);
        });

        // Envio com fetch + FormData
        form.addEventListener("submit", async (ev) => {
            ev.preventDefault();
            status.style.display = "none";

            // Coleta valores
            const produto = document.getElementById("produto").value.trim();
            const descricao = document.getElementById("descricao").value.trim();
            const valor = document.getElementById("valor").value.trim();
            const estoque = document.getElementById("estoque").value;
            const file = imagemInput.files && imagemInput.files[0];

            // Valida front-end básico
            if (!produto || !valor || !estoque || !file) {
                showStatus("Preencha todos os campos obrigatórios (*) e selecione uma imagem.", true);
                return;
            }

            // Criar FormData
            const fd = new FormData();
            fd.append("produto_produtos", produto);
            fd.append("descricao_produtos", descricao);
            fd.append("valor_produtos", valor);
            fd.append("estoque_produtos", estoque);
            fd.append("imagem", file, file.name);

            // UI de carregamento
            btnEnviar.disabled = true;
            loading.style.display = "block";

            try {
                const res = await fetch(API_URL, {
                    method: "POST",
                    body: fd
                    // Nota: não setar Content-Type — o browser define multipart/form-data com boundary automaticamente.
                });

                const json = await res.json().catch(() => null);

                if (!res.ok) {
                    const msg = (json && json.erro) || (json && json.message) || ("Erro ao enviar. Status: " + res.status);
                    showStatus(msg, true);
                } else {
                    showStatus("Produto cadastrado com sucesso!", false);
                    // mostra o objeto retornado, se houver
                    if (json && json.produto) {
                        showStatusHTML(`<strong>Produto criado:</strong><br>${escapeHTML(JSON.stringify(json.produto, null, 2))}`, false);
                    }
                    // limpa form (opcional)
                    form.reset();
                    previewWrapper.style.display = "none";
                }
            } catch (err) {
                console.error(err);
                showStatus("Erro de conexão com o servidor.", true);
            } finally {
                btnEnviar.disabled = false;
                loading.style.display = "none";
            }
        });

        function showStatus(txt, isError) {
            status.style.display = "block";
            status.className = "status";
            status.innerHTML = "";
            status.textContent = txt;
            if (isError) status.classList.add("error"); else status.classList.add("success");
        }

        function showStatusHTML(html, isError) {
            status.style.display = "block";
            status.className = "status";
            status.innerHTML = html;
            if (isError) status.classList.add("error"); else status.classList.add("success");
        }

        // simples escape para segurança ao mostrar JSON
        function escapeHTML(str) {
            return String(str).replace(/[&<>"'`=\/]/g, function (s) {
                return ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;",
                    "/": "&#x2F;",
                    "`": "&#x60;",
                    "=": "&#x3D;"
                })[s];
            });
        }
    })();
}

















// ✏️ Exemplo de funções de edição/exclusão (a implementar no backend)
function editarProduto(id) {
    alert('Implementar edição do produto ID: ' + id);
}

function deletarProduto(id) {
    if (confirm('Deseja realmente excluir o produto ID: ' + id + '?')) {
        alert('Implementar exclusão do produto ID: ' + id);
    }
}



// Inicializa com a seção Cardápio
mostrarSecao('cardapio');