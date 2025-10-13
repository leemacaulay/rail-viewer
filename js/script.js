let allLinks = [];

function renderLinks(filter = '') {
 const list = document.getElementById('link-list');
 list.innerHTML = '';

 const lowerFilter = filter.toLowerCase();

 allLinks
    .filter(link => 
        link.title.toLowerCase().includes(lowerFilter) ||
        link.subtitle?.toLowerCase().includes(lowerFilter)
    )
    .forEach(link => {
        const item = document.createElement('div');
        item.className = 'link-item';


        // Highlight if exact match
            if (link.title.toLowerCase() === lowerFilter) {
                item.classList.add('highlight');
            }

        item.innerHTML = `
            <a href="https://${link.url}" target="_blank">
              <div class="img-wrapper">
                <img src="${link.image}" alt="${link.title}">
              </div>
             <div class="title">${link.title}</div>
             <div class="subtitle">${link.subtitle || ''}</div>
            </a>
            <footer class="app-link">
                <a href="bbcsounds://${link.url}">
                    <span class="id-small">&#9608;</span>
                    <span class="id-normal">&#9608;</span>
                    <span class="id-large">&#9608;</span> 
                </a>
            </footer>
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

document.getElementById('randomBtn').addEventListener('click', () => {
    if (allLinks.length === 0) return;

    const randomLink = allLinks[Math.floor(Math.random() * allLinks.length)];
    
    // Set the search box values to the random link's title
    const searchInput = document.getElementById('search');
    searchInput.value = randomLink.title;

    renderLinks(randomLink.title);
});

document.getElementById('clearSearch').addEventListener('click', () => {
  const searchInput = document.getElementById('search');
  searchInput.value = '';
  renderLinks(); // Reset the list
});
