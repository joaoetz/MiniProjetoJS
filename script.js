const apiUrl = "http://localhost:3000/locais";

document.getElementById("localForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const id = document.getElementById("localId").value;
    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const foto = document.getElementById("foto").value;

    let local = { titulo, descricao, foto };

    if (id) {
        // Converte o ID para número antes de editar
        local.id = Number(id);

        await fetch(`${apiUrl}/${local.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(local)
        });
    } else {
        // Gera um novo ID numérico antes de adicionar
        local.id = await gerarIdNumerico();

        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(local)
        });
    }

    carregarLocais();
    this.reset();
});

// Função para gerar um ID numérico sempre crescente
async function gerarIdNumerico() {
    const response = await fetch(apiUrl);
    const locais = await response.json();

    if (locais.length === 0) {
        return 1; // Se não houver locais, começa do 1
    }

    const maxId = Math.max(...locais.map(l => Number(l.id))); // Encontra o maior ID numérico
    return maxId + 1;
}

async function carregarLocais() {
    const response = await fetch(apiUrl);
    const locais = await response.json();
    const locaisDiv = document.getElementById("locais");
    locaisDiv.innerHTML = "";

    locais.forEach(local => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h3>${local.titulo}</h3>
            <p>${local.descricao}</p>
            <img src="${local.foto}" alt="Imagem do local">
            <button onclick="editarLocal(${local.id}, '${local.titulo}', '${local.descricao}', '${local.foto}')">Editar</button>
            <button onclick="excluirLocal(${local.id})">Excluir</button>
        `;
        locaisDiv.appendChild(div);
    });
}

function editarLocal(id, titulo, descricao, foto) {
    document.getElementById("localId").value = id;
    document.getElementById("titulo").value = titulo;
    document.getElementById("descricao").value = descricao;
    document.getElementById("foto").value = foto;
}

async function excluirLocal(id) {
    await fetch(`${apiUrl}/${Number(id)}`, { method: "DELETE" }); // Converte ID para número
    carregarLocais();
}

carregarLocais();