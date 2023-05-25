const ul = document.getElementById('planet-list--ul__search');
const span = document.getElementById('planet-list--count');

window.onload = async event => {
  const searchQuery = window.location.search;
  const response = await fetch(`https://swapi.dev/api/planets/${searchQuery}&format=json`).then(res => res.json());
  localStorage.setItem('searchPlanetList', JSON.stringify(response.results));

  searchPlanetList = JSON.parse(localStorage.getItem('searchPlanetList'));
  searchPlanetList.forEach((planet, index) => {
    span.innerText = searchPlanetList.length;

    const li = document.createElement('li');

    li.innerHTML = `
      <div id="planet-${index}" class="planet-info--card">
        <h2>${planet.name}</h2>

        <p><strong>Clima:</strong> ${planet.climate}</p>
        <p><strong>População:</strong> ${planet.population}</p>
        <p><strong>Terreno:</strong> ${planet.terrain}</p>

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data de Nascimento</th>
            </tr>
          </thead>
          <tbody id="residents-info--tbody"></tbody>
        <table>
      </div>
    `;

    ul.appendChild(li);

    const tr = document.createElement('tr');
    if (planet.residents.length) {
      planet.residents.map(async resident => {
        await fetch(resident).then(res => res.json()).then(data => {
          const tableBody = document.querySelector(`#planet-${index} #residents-info--tbody`);
          const tr = document.createElement('tr');

          tr.innerHTML = `
            <tr>
              <td>${data.name}</td>
              <td>${data.birth_year}</td>
            </tr>
          `;

          tableBody.appendChild(tr);
        });
      });
    } else {
      const tableBody = document.querySelector(`#planet-${index} #residents-info--tbody`);
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <tr>
          <td colspan="2">Habitantes famosos não encontrados.</td>
        </tr>
      `;

      tableBody.appendChild(tr);
    }
  });
}

window.onbeforeunload = event => {
  localStorage.removeItem('searchPlanetList');
}
