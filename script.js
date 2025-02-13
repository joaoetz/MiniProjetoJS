const apiUrl = "http://localhost:3000/locais";

document.getElementById("localForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const id = document.getElementById("localId").value;
    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;
    const foto = document.getElementById("foto").value;

    const local = { titulo, descricao, foto };
    
    if (id) {
        await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(local)
        });
    } else {
        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(local)
        });
    }
    carregarLocais();
    this.reset();
});

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
    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    carregarLocais();
}

carregarLocais();