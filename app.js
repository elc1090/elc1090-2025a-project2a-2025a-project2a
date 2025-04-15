document.getElementById('commitForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const username = document.getElementById('usernameInput').value.trim();
    const repo = document.getElementById('repoInput').value.trim();
    const commitList = document.getElementById('commitList');
  
    commitList.innerHTML = '';
  
    fetch(`https://api.github.com/repos/${username}/${repo}/commits`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Não foi possível encontrar os commits');
        }
        return response.json();
      })
      .then(data => {
        if (data.length === 0) {
          commitList.innerHTML = '<li>Nenhum commit encontrado nesse repositório.</li>';
          return;
        }
  
        data.forEach(commit => {
          const li = document.createElement('li');
          li.innerHTML = `
            <p><strong>Mensagem:</strong> ${commit.commit.message}</p>
            <p><strong>Data:</strong> ${new Date(commit.commit.author.date).toLocaleString()}</p>
          `;
          commitList.appendChild(li);
        });
      })
      .catch(error => {
        commitList.innerHTML = `<li>Erro: ${error.message}</li>`;
      });
  });
  