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


function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function seededShuffle(array, seed) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(seed + i) * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getDailyLink(testDate = null) {
    if (allLinks.length === 0) return null;

    const date = testDate || new Date();
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

    // Generate today's shuffled list
    const todayShuffled = seededShuffle(allLinks, seed);

    // Generate top picks from the past 7 days
    const recentPicks = new Set();
    const recentPickList = [];

    for (let i = 1; i <= 7; i++) {
        const pastDate = new Date(date);
        pastDate.setDate(date.getDate() - i);
        const pastSeed = pastDate.getFullYear() * 10000 + (pastDate.getMonth() + 1) * 100 + pastDate.getDate();
        const pastShuffled = seededShuffle(allLinks, pastSeed);
        if (pastShuffled.length > 0) {
            const pick = pastShuffled[0];
            recentPicks.add(pick.url);
            recentPickList.push({
                date: pastDate.toDateString(),
                title: pick.title,
                url: pick.url
            });
        }
    }

    // Log recent picks
    console.log("Recent 7 Daily Picks:");
    recentPickList.forEach(pick => {
        console.log(`${pick.date}: ${pick.title} (${pick.url})`);
    });

    // Find the first link in today's shuffle that hasn't appeared in the last 7 days
    for (let link of todayShuffled) {
        if (!recentPicks.has(link.url)) {
            return link;
        }
    }

    // Fallback: if all links were used in the last 7 days, return the first one
    return todayShuffled[0];
}

function renderRecentPicks(date, allLinks) {
    const container = document.getElementById('recent-picks');
    const recentPickList = [];

    for (let i = 1; i <= 7; i++) {
        const pastDate = new Date(date);
        pastDate.setDate(date.getDate() - i);
        const pastSeed = pastDate.getFullYear() * 10000 + (pastDate.getMonth() + 1) * 100 + pastDate.getDate();
        const pastShuffled = seededShuffle(allLinks, pastSeed);
        if (pastShuffled.length > 0) {
            const pick = pastShuffled[0];
            recentPickList.push({
                date: pastDate.toDateString(),
                title: pick.title,
                url: pick.url
            });
        }
    }

    // Render to the page
    container.innerHTML = `
        <h3>Recent Daily Picks</h3>
        <ul>
            ${recentPickList.map(pick => `
                <li>
                    <strong>${pick.date}:</strong>
                    <a href="https://${pick.url}"> 
                    ${pick.title.trim()}</a>
                    |
                    <a href="bbcsounds://${pick.url}">
                    app
                    </a>
                </li>
            `).join('')}
        </ul>
    `;
}

function renderDailyBanner(link) {
    const banner = document.getElementById('daily-banner');
    const today = new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    banner.innerHTML = `
        <button class="close-banner" aria-label="Close banner">&times;</button>
        <div class="banner-image">
            <a href="https://${link.url}" target="_blank">
                <img src="${link.image}" alt="${link.title}" />
            </a>
        </div>
        <div class="banner-content">
            <div class="date">Today's Pick - ${today}</div>
            <a href="https://${link.url}" target="_blank">
            <h2>${link.title}</h2>
            <p>${link.subtitle || ''}</p>
            </a>
            <a class="app-link" href="bbcsounds://${link.url}">
                    <span class="id-small">&#9608;</span>
                    <span class="id-normal">&#9608;</span>
                    <span class="id-large">&#9608;</span> 
            </a>
        </div>
    `;

    // Add event listener to close button
    const closeBtn = banner.querySelector('.close-banner');
    closeBtn.addEventListener('click', () => {
        banner.style.display = 'none';
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

        const today = new Date();
        const dailyLink = getDailyLink(today);
        if (dailyLink) {
            renderDailyBanner(dailyLink);
        }

        renderRecentPicks(today, allLinks);
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

document.getElementById('toggle-recent-picks').addEventListener('click', () => {
    const recentPicks = document.getElementById('recent-picks');
    const toggleBtn = document.getElementById('toggle-recent-picks');

    if (recentPicks.style.display === 'none') {
        recentPicks.style.display = 'block';
        toggleBtn.textContent = 'Hide Recent Picks';
    } else {
        recentPicks.style.display = 'none';
        toggleBtn.textContent = 'Show Recent Picks';
    }
});
