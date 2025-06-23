let allLinks = [];

function renderLinks(filter = '') {
 const list = document.getElementById('link-list');
 list.innerHTML = '';

 allLinks
    .filter(link => link.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach(link => {
        const item = document.createElement('div');
        item.className = 'link-item';
        item.innerHTML = `
            <a href="${link.url}" target="_blank">
              <div class="img-wrapper">
                    <img src="${link.image}" alt="${link.title}">
              </div>
                    <div class="title">${link.title}</div>
                </a>
            `;
    list.appendChild(item);
        });
}

document.getElementById('search').addEventListener('input', (e) => {
    renderLinks(e.target.value);
});

renderLinks();

// Load CSV from a static file
Papa.parse('data/links.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
        allLinks = results.data;
        renderLinks();
    }
});