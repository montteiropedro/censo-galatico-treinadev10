const ul = document.getElementById('planet-list--ul');
const planetListPrevious = document.getElementById('planet-list--previous');
const planetListNext = document.getElementById('planet-list--next');

window.onload = async event => {
  if (!localStorage.getItem('planetList')) {
    try {
      const response = await fetch('https://swapi.dev/api/planets/?format=json').then(res => res.json());
      localStorage.setItem('previousPageEndpoint', JSON.stringify(response.previous));
      localStorage.setItem('nextPageEndpoint', JSON.stringify(response.next));
      localStorage.setItem('planetList', JSON.stringify(response.results));
    } catch (error) {
      console.error('Ocorreu algum erro ao chamar/configurar os dados da API')
    }
  }

  planetList = JSON.parse(localStorage.getItem('planetList'));
  planetList.forEach((planet, index) => {
    const li = document.createElement('li');

    li.innerHTML = `
      <button id="${index}" class="planet-list--btn">
        ${planet.name}
      </button>
    `;

    ul.appendChild(li);
  });

  const previousPageEndpoint = JSON.parse(localStorage.getItem('previousPageEndpoint'));
  if (previousPageEndpoint) {
    planetListPrevious.onclick = async event => {
      const response = await fetch(previousPageEndpoint).then(res => res.json());
      localStorage.setItem('previousPageEndpoint', JSON.stringify(response.previous));
      localStorage.setItem('nextPageEndpoint', JSON.stringify(response.next));
      localStorage.setItem('planetList', JSON.stringify(response.results));

      location.reload();
    }
  } else {
    planetListPrevious.setAttribute('disabled', '');
  }

  const nextPageEndpoint = JSON.parse(localStorage.getItem('nextPageEndpoint'));
  if (nextPageEndpoint) {
    planetListNext.onclick = async event => {
      const response = await fetch(nextPageEndpoint).then(res => res.json());
      localStorage.setItem('previousPageEndpoint', JSON.stringify(response.previous));
      localStorage.setItem('nextPageEndpoint', JSON.stringify(response.next));
      localStorage.setItem('planetList', JSON.stringify(response.results));

      location.reload();
    }
  } else {
    planetListNext.setAttribute('disabled', '');
  }

  const planetButtons = document.querySelectorAll('.planet-list--btn');

  planetButtons.forEach(button => {
    button.onclick = async event => {
      const section = document.getElementById('planet-info');
      const planetInfo = planetList[button.id]

      section.innerHTML = `
        <div class="planet-info--card">
          <h2>${planetInfo.name}</h2>

          <p><strong>Clima:</strong> ${planetInfo.climate}</p>
          <p><strong>População:</strong> ${planetInfo.population}</p>
          <p><strong>Terreno:</strong> ${planetInfo.terrain}</p>

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

      const tableBody = document.getElementById('residents-info--tbody');
      if (planetInfo.residents.length) {
        planetInfo.residents.map(async resident => {
          await fetch(resident).then(res => res.json()).then(data => {
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
        const tr = document.createElement('tr');

        tr.innerHTML = `
          <tr>
            <td colspan="2">Habitantes famosos não encontrados.</td>
          </tr>
        `;

        tableBody.appendChild(tr);
      }
    }
  });
}
