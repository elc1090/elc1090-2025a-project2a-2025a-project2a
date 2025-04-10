// Obtém o formulário de entrada do nome de usuário do GitHub
const gitHubForm = document.getElementById('gitHubForm');

// Escuta por envios no formulário de nome de usuário do GitHub
gitHubForm.addEventListener('submit', (e) => {
    // Previne a ação padrão de envio do formulário
    e.preventDefault();

    // Obtém o campo de entrada do nome de usuário do GitHub no DOM
    let usernameInput = document.getElementById('usernameInput');
    // Obtém o campo de limite de repositórios
    let limitInput = document.getElementById('limitInput');

    // Obtém os valores dos campos
    let gitHubUsername = usernameInput.value;
    let reposLimit = parseInt(limitInput.value) || 0; // Converte para número, 0 significa sem limite

    // Executa a função da API do GitHub, passando o nome de usuário do GitHub
    requestUserRepos(gitHubUsername)
        .then(response => response.json())
        .then(data => {
            let ul = document.getElementById('userRepos');
            ul.innerHTML = ''; // Limpa a lista antes de adicionar novos itens

            if (data.message === "Not Found") {
                let li = document.createElement('li');
                li.classList.add('list-group-item');
                li.innerHTML = `<p><strong>Não existe conta com o usuário:</strong> ${gitHubUsername}</p>`;
                ul.appendChild(li);
            } else {
                // Aplica o limite se foi especificado
                const reposToShow = reposLimit > 0 ? data.slice(0, reposLimit) : data;
                
                if (reposToShow.length === 0) {
                    let li = document.createElement('li');
                    li.classList.add('list-group-item');
                    li.innerHTML = `<p><strong>Nenhum repositório encontrado para o usuário:</strong> ${gitHubUsername}</p>`;
                    ul.appendChild(li);
                } else {
                    reposToShow.forEach(repo => {
                        let li = document.createElement('li');
                        li.classList.add('list-group-item');
                        li.innerHTML = `
                            <p><strong>Repositório:</strong> ${repo.name}</p>
                            <p><strong>Descrição:</strong> ${repo.description || 'Sem descrição'}</p>
                            <p><strong>URL:</strong> <a href="${repo.html_url}">${repo.html_url}</a></p>
                        `;
                        ul.appendChild(li);
                    });
                }
            }
        })
});

function requestUserRepos(username) {
    // cria uma variável para conter a `Promise` retornada de `fetch`
    return Promise.resolve(fetch(`https://api.github.com/users/${username}/repos`));
}