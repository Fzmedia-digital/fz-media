/* FZ Media - Dynamic Portfolio Showcase Logic */

let activeCategory = "All";
let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
    renderCategoryTabs();
    renderPortfolioGrid();
    setupSearch();
    setupCinemaPlayer();
    setupLikeTrigger();
});

// 1. Render Category Filter Tabs
function renderCategoryTabs() {
    const tabsContainer = document.getElementById("portfolio-tabs-list");
    if (!tabsContainer) return;

    const db = getDB();
    
    tabsContainer.innerHTML = db.portfolioTabs.map(tab => {
        let isActive = tab === activeCategory ? "active" : "";
        return `<button class="services-tab-trigger ${isActive}" onclick="filterCategory('${tab}')">${tab}</button>`;
    }).join("");
}

// 2. Setup Search Input Event
function setupSearch() {
    const searchInput = document.getElementById("portfolio-search");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderPortfolioGrid();
    });
}

// 3. Render Portfolio Cards Dynamic Logic
function renderPortfolioGrid() {
    const grid = document.getElementById("portfolio-grid");
    if (!grid) return;

    const db = getDB();
    
    // Filter portfolio items
    const filteredItems = db.portfolio.filter(item => {
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery) || item.category.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    if (filteredItems.length === 0) {
        grid.innerHTML = `
            <div class="no-results-message">
                <span style="font-size: 3rem;">🔍</span>
                <h3 style="margin-top: 16px;">No projects found</h3>
                <p style="color: var(--text-muted); margin-top: 8px;">Try adjusting your filters or search keywords.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredItems.map(item => `
        <div class="glass-card portfolio-card" data-video="${item.videoUrl}" style="animation: scaleIn 0.4s ease forwards;">
            <div class="portfolio-thumbnail-wrapper">
                <img src="${item.thumbnail}" alt="${item.title}" class="portfolio-img">
                <button class="portfolio-play-btn" aria-label="Play Portfolio Video">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </button>
            </div>
            <div class="portfolio-card-info" style="display: flex; flex-direction: column; justify-content: space-between; min-height: 100px;">
                <div>
                    <span class="portfolio-card-category">${item.category}</span>
                    <h3 style="margin-top: 4px; font-size: 1.05rem; line-height: 1.45;">${item.title}</h3>
                </div>
                <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 8px;">
                    <button class="portfolio-like-btn" data-id="${item.id}" style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 0.82rem; padding: 5px 10px; border-radius: var(--radius-sm); transition: var(--transition-snappy);" aria-label="Like project">
                        <span class="heart-icon" style="color: #ef4444; font-size: 0.9rem; transition: transform 0.2s ease; display: inline-block;">❤️</span> 
                        <span class="likes-count" style="font-weight: 700; color: var(--text-secondary);">${item.likes || 0}</span>
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

// 4. Change Category filter state
window.filterCategory = function(category) {
    activeCategory = category;
    renderCategoryTabs();
    renderPortfolioGrid();
};

// 5. Setup Portfolio Video Modal Popups
function setupCinemaPlayer() {
    const modal = document.getElementById("video-modal");
    const modalPlayer = document.getElementById("video-modal-player");
    const closeBtn = document.getElementById("video-modal-close");

    if (!modal || !modalPlayer || !closeBtn) return;

    function openPlayer(src) {
        modalPlayer.src = src;
        modalPlayer.load();
        modal.classList.add("open");
        modalPlayer.play().catch(e => console.log("Playback interrupted"));
    }

    function closePlayer() {
        modal.classList.remove("open");
        modalPlayer.pause();
        modalPlayer.src = "";
    }

    // Attach delegated click event on grid portfolio cards
    const grid = document.getElementById("portfolio-grid");
    if (grid) {
        grid.addEventListener("click", (e) => {
            // Ignore click if it was on the like button or inside it
            if (e.target.closest(".portfolio-like-btn")) {
                return;
            }
            const card = e.target.closest(".portfolio-card");
            if (card) {
                const videoSrc = card.getAttribute("data-video");
                if (videoSrc) openPlayer(videoSrc);
            }
        });
    }

    closeBtn.addEventListener("click", closePlayer);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closePlayer();
    });
}

// 6. Setup Persistent Like Trigger with Bouncing Animation
function setupLikeTrigger() {
    document.addEventListener("click", (e) => {
        const likeBtn = e.target.closest(".portfolio-like-btn");
        if (likeBtn) {
            const itemId = likeBtn.getAttribute("data-id");
            if (itemId) {
                const db = getDB();
                const item = db.portfolio.find(p => p.id === itemId);
                if (item) {
                    if (typeof item.likes === 'undefined') item.likes = 0;
                    item.likes += 1;
                    saveDB(db);
                    
                    // Update likes count in DOM immediately
                    const countEl = likeBtn.querySelector(".likes-count");
                    if (countEl) {
                        countEl.textContent = item.likes;
                    }
                    
                    // Bounce animation effect on the heart icon
                    const heart = likeBtn.querySelector(".heart-icon");
                    if (heart) {
                        heart.style.transform = "scale(1.4)";
                        setTimeout(() => {
                            heart.style.transform = "scale(1)";
                        }, 200);
                    }
                }
            }
        }
    });
}
