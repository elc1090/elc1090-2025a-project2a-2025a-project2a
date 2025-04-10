// Obtém o formulário de entrada do nome de usuário do GitHub
const gitHubForm = document.getElementById("gitHubForm");

// Escuta por envios no formulário de nome de usuário do GitHub
gitHubForm.addEventListener("submit", (e) => {
  // Previne a ação padrão de envio do formulário
  e.preventDefault();

  // Obtém o campo de entrada do nome de usuário do GitHub no DOM
  let usernameInput = document.getElementById("usernameInput");

  // Obtém o valor do campo de entrada do nome de usuário do GitHub
  let gitHubUsername = usernameInput.value;

  // Executa a função da API do GitHub, passando o nome de usuário do GitHub
  requestUserRepos(gitHubUsername)
    .then((response) => response.json()) // converte a resposta em json
    .then((data) => {
      // atualiza o html com os dados do github
      for (let i in data) {
        // Obtém a ul com o id userRepos

        if (data.message === "Not Found") {
          let ul = document.getElementById("userRepos");

          // Cria variável que criará li's para serem adicionadas à ul
          let li = document.createElement("li");

          // Adiciona a classe de item de lista do Bootstrap a cada li
          li.classList.add("list-group-item");
          // Cria a marcação html para cada li
          li.innerHTML = `
                <p><strong>Não existe conta com o usuário:</strong> ${gitHubUsername}</p>`;
          // Adiciona cada li à ul
          ul.appendChild(li);
        } else {
          let ul = document.getElementById("userRepos");

          // Cria variável que criará li's para serem adicionadas à ul
          let li = document.createElement("li");

          // Adiciona a classe de item de lista do Bootstrap a cada li
          li.classList.add("list-group-item");

          // Cria a marcação html para cada li
          li.innerHTML = `
                <p><strong>Repositório:</strong> ${data[i].name}</p>
                <p><strong>Descrição:</strong> ${data[i].description}</p>
                <p><strong>URL:</strong> <a href="${data[i].html_url}">${data[i].html_url}</a></p>
            `;

          // Adiciona cada li à ul
          ul.appendChild(li);
        }
      }
    });
});

function requestUserRepos(username) {
  // cria uma variável para conter a `Promise` retornada de `fetch`
  return Promise.resolve(
    fetch(`https://api.github.com/users/${username}/repos`)
  );
}
