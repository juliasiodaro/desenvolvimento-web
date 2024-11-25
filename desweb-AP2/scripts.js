// login lógica

document.getElementById("form-login")?.addEventListener("submit", async function(event) { event.preventDefault();

const password = document.getElementById("password").value;
const passwordHash = await hashPassword(password);

const correctHash = "ded6a687514227ff822d40bd397f30f5ae9132487ad6c846599131c740d784f0"

if (passwordHash === correctHash) {
    localStorage.setItem("authorized", true);
    window.location.href = "main.html";
} else {
    document.getElementById("error-message").innerText = "Senha incorreta :(";
}
});

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2,"0")).join("");
    return hashHex;
}

// filtro

document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("search-input");
    const filtroTodos = document.getElementById("filtro-todos");
    const filtroMasculino = document.getElementById("filtro-masculino");
    const filtroFeminino = document.getElementById("filtro-feminino");
    const atletasContainer = document.getElementById("atletas-container");


    filtroTodos.addEventListener("click", () => buscarAtletas("all"));
    filtroMasculino.addEventListener("click", () => buscarAtletas("masculino"));
    filtroFeminino.addEventListener("click", () => buscarAtletas("feminino"));


    searchInput.addEventListener("input", () => buscarAtletas("all", searchInput.value));

    buscarAtletas("all");
});

async function buscarAtletas(categoria, searchQuery = "") {
    const atletasContainer = document.getElementById("atletas-container");
    const url = `https://botafogo-atletas.mange.li/2024-1/${categoria === "all" ? "all" : categoria}`;

    try {
        const resposta = await fetch(url);
        const data = await resposta.json();

        if (data && Array.isArray(data)) {
            const filteredAtletas = data.filter(atleta => 
                atleta.nome.toLowerCase().includes(searchQuery.toLowerCase())
            );
            displayAtletas(filteredAtletas);
        } else {
            atletasContainer.innerHTML = "<p>Nenhum atleta encontrado.</p>";
        }
    } catch (error) {
        console.error("Erro ao carregar atletas:", error);
        atletasContainer.innerHTML = "<p>Erro ao carregar atletas.</p>";
    }
}

function displayAtletas(atletas) {
    const atletasContainer = document.getElementById("atletas-container");
    if (atletas.length === 0) {
        atletasContainer.innerHTML = "<p>Nenhum atleta encontrado.</p>";
    } else {
        atletasContainer.innerHTML = atletas.map(atleta => `
            <div class="card-atleta">
                <img src="${atleta.imagem}" alt="${atleta.nome}" />
                <h3>${atleta.nome}</h3>
                <a href="detalhes.html?id=${atleta.id}">Ver detalhes</a>
            </div>
        `).join("");
    }
}


// detalhes atleta

const atletaId = new URLSearchParams(window.location.search).get("id");
const atletaDetalhesContainer = document.getElementById("atleta-detalhes");

if (atletaId) {
    document.addEventListener("DOMContentLoaded", buscarDetalhesAtleta);
} else {
    atletaDetalhesContainer.innerHTML = `<p>ID do atleta não fornecido.</p>`;
}

async function buscarDetalhesAtleta() {
    try {
        const response = await fetch(`https://botafogo-atletas.mange.li/2024-1/${atletaId}`);
        const data = await response.json();

        if (data) {
            displayDetalhesAtleta(data);
        } else {
            atletaDetalhesContainer.innerHTML = `<p>Detalhes do atleta não encontrados.</p>`;
        }
    } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
        atletaDetalhesContainer.innerHTML = `<p>Erro ao carregar detalhes.</p>`;
    }
}


function displayDetalhesAtleta(atleta) {
    const nome = atleta.nome || "Nome não disponível";
    const imagem = atleta.imagem || "assets/placeholder.jpg";
    const posicao = atleta.posição || "Posição não informada";
    const nascimento = atleta.nascimento || "Data de nascimento não informada";
    const biografia = atleta.biografia || "Biografia não disponível";

    atletaDetalhesContainer.innerHTML = `
    <h2>${nome}</h2>
    <img src="${imagem}" alt="${nome}" />
    <p>Posição: ${posicao}</p>
    <p>Data de nascimento: ${nascimento}</p>
    <p>Biografia: ${biografia}</p>
    `;
}
