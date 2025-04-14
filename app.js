const gitHubForm = document.getElementById('gitHubForm');

gitHubForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let usernameInput = document.getElementById('usernameInput');
    let limitInput = document.getElementById('limitInput');

    let gitHubUsername = usernameInput.value;
    let reposLimit = parseInt(limitInput.value) || 0;

    requestUserRepos(gitHubUsername)
        .then(response => response.json())
        .then(data => {
            let ul = document.getElementById('userRepos');
            ul.innerHTML = '';

            if (data.message === "Not Found") {
                let li = document.createElement('li');
                li.classList.add('list-group-item');
                li.innerHTML = `<p><strong>Não existe conta com o usuário:</strong> ${gitHubUsername}</p>`;
                ul.appendChild(li);
            } else {
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
                            <p><strong>URL:</strong> <a href="${repo.html_url}" target="_blank">${repo.html_url}</a></p>
                            <button class="btn btn-sm btn-info fetch-commits" 
                                    data-owner="${gitHubUsername}" 
                                    data-repo="${repo.name}">
                                Ver últimos commits
                            </button>
                            <div class="commits-container mt-2" id="commits-${repo.name}" style="display: none;"></div>
                        `;
                        ul.appendChild(li);
                    });
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// Event listener para os botões de commits (delegado ao document)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('fetch-commits')) {
        const owner = e.target.getAttribute('data-owner');
        const repo = e.target.getAttribute('data-repo');
        const commitsContainer = document.getElementById(`commits-${repo}`);
        
        if (commitsContainer.style.display === 'none') {
            e.target.disabled = true;
            e.target.textContent = 'Carregando...';
            
            fetchRepoCommits(owner, repo)
                .then(commits => {
                    commitsContainer.innerHTML = '';
                    if (!commits || commits.length === 0) {
                        commitsContainer.innerHTML = '<p>Nenhum commit encontrado.</p>';
                    } else {
                        commits.slice(0, 5).forEach(commit => { // Mostra apenas 5 commits
                            const commitDiv = document.createElement('div');
                            commitDiv.classList.add('commit', 'mb-2', 'p-2', 'border');
                            commitDiv.innerHTML = `
                                <p><strong>Mensagem:</strong> ${commit.commit.message.split('\n')[0]}</p>
                                <p><strong>Data:</strong> ${new Date(commit.commit.author.date).toLocaleString()}</p>
                            `;
                            commitsContainer.appendChild(commitDiv);
                        });
                    }
                    commitsContainer.style.display = 'block';
                    e.target.textContent = 'Ocultar commits';
                })
                .catch(error => {
                    commitsContainer.innerHTML = `<p>Erro ao buscar commits: ${error.message}</p>`;
                    commitsContainer.style.display = 'block';
                    e.target.textContent = 'Tentar novamente';
                })
                .finally(() => {
                    e.target.disabled = false;
                });
        } else {
            commitsContainer.style.display = 'none';
            e.target.textContent = 'Ver últimos commits';
        }
    }
});

function requestUserRepos(username) {
    return fetch(`https://api.github.com/users/${username}/repos`);
}

function fetchRepoCommits(owner, repo) {
    return fetch(`https://api.github.com/repos/${owner}/${repo}/commits`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
}