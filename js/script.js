const links = Array.from({ length: 40 }, (_, i) => ({
    title: `Link ${i + 1}`,
    url: `https://example.com/link${i + 1}`,
    image: `images/image${(i % 5) + 1}.jpg`
}));

const linkList = document.getElementById('link-list');

function renderLinks(filter = '') {
    linkList.innerHTML = '';
    links
        .filter(link => link.title.toLowerCase().includes(filter.toLowerCase()))
        .forEach(link => {
            const item = document.createElement('div');
            item.className = 'link-item';
            item.innerHTML = `
                <a href="${link.url}" target="_blank">
                    <img src="${link.image}" alt="${link.title}">
                    <div class="title">${link.title}</div>
                </a>
            `;
            linkList.appendChild(item);
        });
}

document.getElementById('search').addEventListener('input', (e) => {
    renderLinks(e.target.value);
});

renderLinks();