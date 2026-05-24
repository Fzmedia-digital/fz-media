/* FZ Media - Executive Admin Controller Logic */

let activeEditingServiceIdx = 0;

document.addEventListener("DOMContentLoaded", () => {
    setupAdminGuard();
    setupResetAndLogout();
    setupBrandingForm();
    setupColorSliders();
    setupTeamRosterCRUD();
    setupPortfolioCRUD();
    setupCategoryManagerModal();
    setupServicesPackagesManager();
    setupOBSStreamController();
    setupInboxesReviewer();
    setupTestimonialsCRUD();
    setupAdminChat();
    setupClientsDatabaseManager();
});

// 1. Admin Authorization guard
function setupAdminGuard() {
    const authPanel = document.getElementById("admin-auth-panel");
    const workspace = document.getElementById("admin-workspace");
    const loginForm = document.getElementById("admin-login-form");
    const errorAlert = document.getElementById("admin-auth-error");

    if (!authPanel || !workspace || !loginForm) return;

    const sessionActive = sessionStorage.getItem("fzmedia_admin_session");
    if (sessionActive === "active") {
        authPanel.style.display = "none";
        workspace.style.display = "block";
        initializeAdminWorkspace();
    }

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const email = document.getElementById("admin-email").value.trim();
        const pass = document.getElementById("admin-pass").value.trim();
        const db = getDB();

        // 3. Obscured Base64 validation security (Fzmedia@123 -> RnptZWRpYUAxMjM=)
        if (email === db.settings.adminCredentials.email && btoa(pass) === db.settings.adminCredentials.passwordHash) {
            sessionStorage.setItem("fzmedia_admin_session", "active");
            errorAlert.style.display = "none";
            authPanel.style.display = "none";
            workspace.style.display = "block";
            initializeAdminWorkspace();
        } else {
            errorAlert.textContent = "Incorrect executive credentials. Verify authorization and try again.";
            errorAlert.style.display = "block";
        }
    });
}

function setupResetAndLogout() {
    const logoutBtn = document.getElementById("admin-logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("fzmedia_admin_session");
            window.location.reload();
        });
    }

    const resetBtn = document.getElementById("admin-reset-btn");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            if (confirm("WARNING: This will wipe all custom revisions, briefs, colors, and roster additions and restore the original seeded FZ Media content. Are you sure?")) {
                localStorage.removeItem("fzmedia_db");
                sessionStorage.removeItem("fzmedia_logged_client");
                alert("Database reset successfully!");
                window.location.reload();
            }
        });
    }
}

// 2. Initialize Admin Dashboard Workspace Controls
function initializeAdminWorkspace() {
    const tabs = document.querySelectorAll(".dash-tab");
    const contents = document.querySelectorAll(".dash-tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            if (tab.classList.contains("active")) return;

            const targetId = tab.getAttribute("data-target");
            const targetContent = document.getElementById(targetId);
            const activeContent = document.querySelector(".dash-tab-content.active");

            // Deactivate all tab buttons first to give instant feedback
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            if (activeContent && activeContent !== targetContent) {
                // Add leaving animation to currently active settings section
                activeContent.classList.add("leaving");
                activeContent.classList.remove("active");

                // After exit animation finishes (0.18s / 180ms), swap sections with the pop-up enter animation
                setTimeout(() => {
                    activeContent.classList.remove("leaving");
                    contents.forEach(c => c.classList.remove("active"));
                    if (targetContent) {
                        targetContent.classList.add("active");
                    }
                }, 180);
            } else {
                contents.forEach(c => c.classList.remove("active"));
                if (targetContent) {
                    targetContent.classList.add("active");
                }
            }
        });
    });

    populateBrandingFields();
    populateColorSliders();
    renderRosterList();
    populateCategoryDropdowns();
    renderPortfolioList();
    renderAdminTestimonialsList();
    renderServiceTiersNavigation();
    loadServiceIntoEditor(0, true);
    calculateAnalytics();
    populateOBSProjectDropdown();
    renderInboxes();
    renderAdminChatClientsSidebar();
    renderClientsDatabaseList();
}

// 3. Dynamic Analytics calculations
function calculateAnalytics() {
    const db = getDB();
    
    // Count active clients
    const activeClientsCount = db.clients.length;
    document.getElementById("stat-active-clients").textContent = activeClientsCount;

    // Count active projects & pending revisions
    let activeProjectsCount = 0;
    let pendingRevisionsCount = 0;
    let totalRevenue = 0;

    db.clients.forEach(client => {
        activeProjectsCount += client.projects.length;
        
        client.projects.forEach(proj => {
            if (proj.revisions) {
                pendingRevisionsCount += proj.revisions.filter(r => !r.resolved).length;
            }
        });

        // Sum subscription package revenues
        if (client.activeSub && client.activeSub !== "No Active Package") {
            // Find price in db
            db.services.forEach(srv => {
                srv.packages.forEach(pkg => {
                    if (client.activeSub.includes(pkg.name) && client.activeSub.includes(srv.name)) {
                        totalRevenue += pkg.price;
                    }
                });
            });
        }
    });

    document.getElementById("stat-active-projects").textContent = activeProjectsCount;
    document.getElementById("stat-pending-revisions").textContent = pendingRevisionsCount;
    document.getElementById("stat-revenue").textContent = "$" + (totalRevenue || 1240); // fallback default
}

// 4. Branding configs CRUD
function setupBrandingForm() {
    const form = document.getElementById("admin-branding-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const db = getDB();
        db.settings.agencyName = document.getElementById("cfg-agency-name").value.trim();
        db.settings.agencyFullName = document.getElementById("cfg-agency-fullname").value.trim();
        db.settings.logoPath = document.getElementById("cfg-logo-path").value.trim();
        db.settings.logoIconPath = document.getElementById("cfg-logo-icon").value.trim();
        db.settings.theme = document.getElementById("cfg-theme-select").value;

        saveDB(db);
        injectTheme();
        injectLayouts();
        alert("Branding configurations saved and applied successfully across all pages!");
    });
}

function populateBrandingFields() {
    const db = getDB();
    const s = db.settings;

    document.getElementById("cfg-agency-name").value = s.agencyName;
    document.getElementById("cfg-agency-fullname").value = s.agencyFullName;
    document.getElementById("cfg-logo-path").value = s.logoPath;
    document.getElementById("cfg-logo-icon").value = s.logoIconPath;
    document.getElementById("cfg-theme-select").value = s.theme || "default";
}

// 5. Color pickers sliders customizer
function setupColorSliders() {
    const priSlider = document.getElementById("hue-primary-slider");
    const secSlider = document.getElementById("hue-secondary-slider");
    
    const priBadge = document.getElementById("primary-hue-val");
    const secBadge = document.getElementById("secondary-hue-val");

    if (!priSlider || !secSlider) return;

    function handleHueChange(isPrimary) {
        const db = getDB();
        if (isPrimary) {
            const val = priSlider.value;
            priBadge.textContent = val;
            db.settings.primaryColorH = parseInt(val, 10);
        } else {
            const val = secSlider.value;
            secBadge.textContent = val;
            db.settings.secondaryColorH = parseInt(val, 10);
        }
        saveDB(db);
        injectTheme();
    }

    priSlider.addEventListener("input", () => handleHueChange(true));
    secSlider.addEventListener("input", () => handleHueChange(false));
}

function populateColorSliders() {
    const db = getDB();
    const s = db.settings;

    const priSlider = document.getElementById("hue-primary-slider");
    const secSlider = document.getElementById("hue-secondary-slider");
    
    if (priSlider) priSlider.value = s.primaryColorH;
    if (secSlider) secSlider.value = s.secondaryColorH;

    const priBadge = document.getElementById("primary-hue-val");
    const secBadge = document.getElementById("secondary-hue-val");

    if (priBadge) priBadge.textContent = s.primaryColorH;
    if (secBadge) secBadge.textContent = s.secondaryColorH;
}

// 6. Team Roster CRUD Manager
function setupTeamRosterCRUD() {
    const form = document.getElementById("admin-team-form");
    const clearBtn = document.getElementById("tm-clear-btn");

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const db = getDB();
        const editId = document.getElementById("team-member-edit-id").value;
        
        const memberData = {
            id: editId || "team-" + Date.now(),
            name: document.getElementById("tm-name").value.trim(),
            role: document.getElementById("tm-role").value.trim(),
            experience: document.getElementById("tm-experience").value.trim(),
            title: document.getElementById("tm-title").value.trim(),
            image: document.getElementById("tm-image").value.trim(),
            skills: document.getElementById("tm-skills").value.trim()
        };

        if (editId) {
            const idx = db.team.findIndex(m => m.id === editId);
            if (idx !== -1) db.team[idx] = memberData;
        } else {
            db.team.push(memberData);
        }

        saveDB(db);
        renderRosterList();
        clearTeamForm();
        alert("Roster member saved successfully!");
    });

    if (clearBtn) clearBtn.addEventListener("click", clearTeamForm);
}

function clearTeamForm() {
    const form = document.getElementById("admin-team-form");
    if (form) form.reset();
    
    document.getElementById("team-member-edit-id").value = "";
    document.getElementById("team-form-headline").textContent = "Add / Edit Team Member";
}

function renderRosterList() {
    const container = document.getElementById("admin-roster-list-container");
    if (!container) return;

    const db = getDB();
    
    container.innerHTML = db.team.map(m => {
        let avatarMarkup = m.image ? 
            `<img src="${m.image}" alt="${m.name}" class="admin-row-avatar">` : 
            `<div class="admin-row-avatar-placeholder"><span>${m.name[0]}</span></div>`;

        return `
            <div class="admin-data-row">
                <div class="admin-data-details">
                    ${avatarMarkup}
                    <div class="admin-row-meta">
                        <h4>${m.name} <span style="font-size: 0.72rem; color: var(--accent-secondary); margin-left: 6px;">${m.experience}</span></h4>
                        <p>${m.role} • ${m.title}</p>
                    </div>
                </div>
                <div class="admin-row-actions">
                    <button class="btn-row-action" onclick="editTeamMember('${m.id}')">Edit</button>
                    <button class="btn-row-action delete" onclick="deleteTeamMember('${m.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join("");
}

window.editTeamMember = function(id) {
    const db = getDB();
    const m = db.team.find(t => t.id === id);
    if (!m) return;

    document.getElementById("team-member-edit-id").value = m.id;
    document.getElementById("tm-name").value = m.name;
    document.getElementById("tm-role").value = m.role;
    document.getElementById("tm-experience").value = m.experience;
    document.getElementById("tm-title").value = m.title;
    document.getElementById("tm-image").value = m.image || "";
    document.getElementById("tm-skills").value = m.skills;

    document.getElementById("team-form-headline").textContent = `Editing: ${m.name}`;
    document.getElementById("admin-team-form").scrollIntoView({ behavior: 'smooth' });
};

window.deleteTeamMember = function(id) {
    if (confirm("Are you sure you want to remove this team member from the roster?")) {
        const db = getDB();
        db.team = db.team.filter(t => t.id !== id);
        saveDB(db);
        renderRosterList();
        clearTeamForm();
    }
};

// 7. Portfolio Showcase Video CRUD Manager
function setupPortfolioCRUD() {
    const form = document.getElementById("admin-portfolio-form");
    const clearBtn = document.getElementById("port-clear-btn");

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const db = getDB();
        const editId = document.getElementById("port-edit-id").value;

        const portData = {
            id: editId || "port-" + Date.now(),
            title: document.getElementById("port-title").value.trim(),
            category: document.getElementById("port-category-select").value,
            videoUrl: document.getElementById("port-video-url").value.trim(),
            thumbnail: document.getElementById("port-thumb").value.trim(),
            likes: 0
        };

        if (editId) {
            const idx = db.portfolio.findIndex(p => p.id === editId);
            if (idx !== -1) db.portfolio[idx] = portData;
        } else {
            db.portfolio.push(portData);
        }

        saveDB(db);
        renderPortfolioList();
        clearPortfolioForm();
        alert("Showcase video project saved successfully!");
    });

    if (clearBtn) clearBtn.addEventListener("click", clearPortfolioForm);
}

function clearPortfolioForm() {
    const form = document.getElementById("admin-portfolio-form");
    if (form) form.reset();

    document.getElementById("port-edit-id").value = "";
    document.getElementById("portfolio-form-headline").textContent = "Add / Edit Video Project";
}

function renderPortfolioList() {
    const container = document.getElementById("admin-portfolio-list-container");
    if (!container) return;

    const db = getDB();

    container.innerHTML = db.portfolio.map(p => `
        <div class="admin-data-row">
            <div class="admin-data-details" style="max-width: 70%;">
                <img src="${p.thumbnail}" alt="" style="width: 70px; aspect-ratio: 16/9; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color);">
                <div class="admin-row-meta">
                    <h4 style="font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;">${p.title}</h4>
                    <p style="color: var(--accent-secondary); font-weight: 700; font-size: 0.75rem; text-transform: uppercase;">${p.category} • ❤️ ${p.likes || 0}</p>
                </div>
            </div>
            <div class="admin-row-actions">
                <button class="btn-row-action" onclick="editPortfolioItem('${p.id}')">Edit</button>
                <button class="btn-row-action delete" onclick="deletePortfolioItem('${p.id}')">Delete</button>
            </div>
        </div>
    `).join("");
}

window.editPortfolioItem = function(id) {
    const db = getDB();
    const p = db.portfolio.find(item => item.id === id);
    if (!p) return;

    document.getElementById("port-edit-id").value = p.id;
    document.getElementById("port-title").value = p.title;
    document.getElementById("port-category-select").value = p.category;
    document.getElementById("port-video-url").value = p.videoUrl;
    document.getElementById("port-thumb").value = p.thumbnail;

    document.getElementById("portfolio-form-headline").textContent = `Editing Project Link`;
    document.getElementById("admin-portfolio-form").scrollIntoView({ behavior: 'smooth' });
};

window.deletePortfolioItem = function(id) {
    if (confirm("Are you sure you want to remove this video from your showcase portfolio?")) {
        const db = getDB();
        db.portfolio = db.portfolio.filter(item => item.id !== id);
        saveDB(db);
        renderPortfolioList();
        clearPortfolioForm();
    }
};

function populateCategoryDropdowns() {
    const select = document.getElementById("port-category-select");
    if (!select) return;

    const db = getDB();
    const activeCategories = db.portfolioTabs.filter(tab => tab !== "All");
    select.innerHTML = activeCategories.map(tab => `<option value="${tab}">${tab}</option>`).join("");
}

// 8. Dynamic Category Tabs Manager Dialog Modal
function setupCategoryManagerModal() {
    const modal = document.getElementById("category-modal");
    const openBtn = document.getElementById("manage-categories-btn");
    const closeBtn = document.getElementById("close-category-modal-btn");
    const addForm = document.getElementById("add-category-tag-form");

    if (!modal || !openBtn || !closeBtn || !addForm) return;

    openBtn.addEventListener("click", () => {
        renderModalTags();
        modal.classList.add("open");
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("open");
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("open");
    });

    addForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const input = document.getElementById("new-tag-input");
        const val = input.value.trim();

        if (val) {
            const db = getDB();
            if (db.portfolioTabs.map(t => t.toLowerCase()).includes(val.toLowerCase())) {
                alert("Category tag already exists!");
                return;
            }

            db.portfolioTabs.push(val);
            saveDB(db);
            
            input.value = "";
            renderModalTags();
            populateCategoryDropdowns();
            alert(`Category tag "${val}" added successfully!`);
        }
    });
}

function renderModalTags() {
    const wrapper = document.getElementById("active-tabs-list-wrapper");
    if (!wrapper) return;

    const db = getDB();
    
    wrapper.innerHTML = db.portfolioTabs.map(tab => {
        let deleteBtn = tab === "All" ? 
            `<span style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">Locked</span>` : 
            `<button class="btn-row-action delete" style="padding: 4px 8px; font-size: 0.75rem;" onclick="deleteCategoryTag('${tab}')">Delete</button>`;

        return `
            <div class="category-modal-tag-item">
                <span style="font-weight: 700; font-size: 0.95rem;">${tab}</span>
                ${deleteBtn}
            </div>
        `;
    }).join("");
}

window.deleteCategoryTag = function(tabName) {
    if (confirm(`Are you sure you want to remove the category tab "${tabName}"?`)) {
        const db = getDB();
        db.portfolioTabs = db.portfolioTabs.filter(t => t !== tabName);
        saveDB(db);
        renderModalTags();
        populateCategoryDropdowns();
    }
};

// 9. Services Pricing Packages Tiers controller
function setupServicesPackagesManager() {
    const form = document.getElementById("admin-service-package-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const db = getDB();
        const srvIdx = parseInt(document.getElementById("srv-edit-idx").value, 10);
        const srv = db.services[srvIdx];

        if (srv) {
            srv.subtitle = document.getElementById("srv-edit-sub").value.trim();
            
            srv.packages[0].price = parseInt(document.getElementById("srv-t0-price").value, 10);
            srv.packages[0].delivery = document.getElementById("srv-t0-delivery").value.trim();
            srv.packages[0].revisions = document.getElementById("srv-t0-revisions").value.trim();

            srv.packages[1].price = parseInt(document.getElementById("srv-t1-price").value, 10);
            srv.packages[1].delivery = document.getElementById("srv-t1-delivery").value.trim();
            srv.packages[1].revisions = document.getElementById("srv-t1-revisions").value.trim();

            srv.packages[2].price = parseInt(document.getElementById("srv-t2-price").value, 10);
            srv.packages[2].delivery = document.getElementById("srv-t2-delivery").value.trim();
            srv.packages[2].revisions = document.getElementById("srv-t2-revisions").value.trim();

            saveDB(db);
            renderServiceTiersNavigation();
            loadServiceIntoEditor(srvIdx);
            calculateAnalytics(); // update price total
            alert(`Service Packages for "${srv.name}" updated successfully!`);
        }
    });
}

function renderServiceTiersNavigation() {
    const nav = document.getElementById("admin-service-tabs-list");
    if (!nav) return;

    const db = getDB();
    
    nav.innerHTML = db.services.map((srv, idx) => {
        let activeClass = idx === activeEditingServiceIdx ? "active" : "";
        return `
            <button class="service-nav-btn ${activeClass}" onclick="loadServiceIntoEditor(${idx})">
                <span>${srv.name}</span>
                <span>➔</span>
            </button>
        `;
    }).join("");
}

window.loadServiceIntoEditor = function(idx, preventScroll = false) {
    activeEditingServiceIdx = idx;
    renderServiceTiersNavigation();

    const db = getDB();
    const srv = db.services[idx];

    if (srv) {
        document.getElementById("srv-editor-title-heading").textContent = srv.name;
        document.getElementById("srv-edit-idx").value = idx;
        document.getElementById("srv-edit-name").value = srv.name;
        document.getElementById("srv-edit-sub").value = srv.subtitle;

        document.getElementById("tier-0-lbl").textContent = `Tier 1 (${srv.packages[0].name})`;
        document.getElementById("tier-1-lbl").textContent = `Tier 2 (${srv.packages[1].name})`;
        document.getElementById("tier-2-lbl").textContent = `Tier 3 (${srv.packages[2].name})`;

        document.getElementById("srv-t0-price").value = srv.packages[0].price;
        document.getElementById("srv-t0-delivery").value = srv.packages[0].delivery;
        document.getElementById("srv-t0-revisions").value = srv.packages[0].revisions;

        document.getElementById("srv-t1-price").value = srv.packages[1].price;
        document.getElementById("srv-t1-delivery").value = srv.packages[1].delivery;
        document.getElementById("srv-t1-revisions").value = srv.packages[1].revisions;

        document.getElementById("srv-t2-price").value = srv.packages[2].price;
        document.getElementById("srv-t2-delivery").value = srv.packages[2].delivery;
        document.getElementById("srv-t2-revisions").value = srv.packages[2].revisions;
        
        if (!preventScroll) {
            document.getElementById("srv-package-editor-card").scrollIntoView({ behavior: 'smooth' });
        }
    }
};

// 10. OBS Live Stream Control Panel [NEW]
function setupOBSStreamController() {
    const form = document.getElementById("admin-obs-stream-form");
    const select = document.getElementById("obs-project-select");
    const toggle = document.getElementById("obs-active-toggle");
    const serverInput = document.getElementById("obs-server-input");
    const keyInput = document.getElementById("obs-key-input");

    if (!form || !select || !toggle) return;

    // Change event on dropdown loading details
    select.addEventListener("change", () => {
        const val = select.value;
        if (!val) return;

        const db = getDB();
        // Locate project across clients
        db.clients.forEach(client => {
            const proj = client.projects.find(p => p.id === val);
            if (proj) {
                toggle.checked = proj.obsStream ? proj.obsStream.active : false;
                serverInput.value = proj.obsStream ? proj.obsStream.server : "rtmp://live.framezonemedia.com/live";
                keyInput.value = proj.obsStream ? proj.obsStream.key : "fz_live_" + client.name.replace(/\s+/g, '_').toLowerCase();
            }
        });
    });

    // Form Submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const projId = select.value;
        const activeState = toggle.checked;
        const serverUrl = serverInput.value.trim();
        const streamKey = keyInput.value.trim();

        const db = getDB();
        let projectFound = false;

        db.clients.forEach(client => {
            const proj = client.projects.find(p => p.id === projId);
            if (proj) {
                proj.obsStream = {
                    active: activeState,
                    server: serverUrl,
                    key: streamKey
                };
                projectFound = true;
            }
        });

        if (projectFound) {
            saveDB(db);
            alert(`OBS stream parameters configured. Live status is now: ${activeState ? 'ONLINE 🔴' : 'OFFLINE ⚪'}`);
        } else {
            alert("Active project not found in database!");
        }
    });
}

function populateOBSProjectDropdown() {
    const select = document.getElementById("obs-project-select");
    if (!select) return;

    const db = getDB();
    let optionsMarkup = '<option value="">-- Choose active client project --</option>';

    db.clients.forEach(client => {
        client.projects.forEach(proj => {
            optionsMarkup += `<option value="${proj.id}">${client.name} - ${proj.title}</option>`;
        });
    });

    select.innerHTML = optionsMarkup;
}

// 11. Dynamic Client Inbox & Revisions Monitor Reviewer
function setupInboxesReviewer() {
    // Inbound briefs and revisions lists are rendered dynamically on load and tab switch.
}

function renderInboxes() {
    const db = getDB();

    const inboxFeed = document.getElementById("admin-inbox-feed");
    if (inboxFeed) {
        if (db.inbox.length === 0) {
            inboxFeed.innerHTML = `<p class="no-revisions-msg">Inbox is empty. Brief submissions appear here!</p>`;
        } else {
            inboxFeed.innerHTML = db.inbox.slice().reverse().map(item => `
                <div class="inbox-card-item">
                    <div class="inbox-card-header">
                        <div class="inbox-meta-title">
                            <h4>${item.name}</h4>
                            <p>${item.brand ? item.brand : 'Independent Creator'} • ${item.email}</p>
                        </div>
                        <span class="project-badge status-queue" style="font-size: 0.72rem;">Brief Inbound</span>
                    </div>
                    <div class="inbox-card-body">
                        <p style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Service Inquiry Details</p>
                        <p style="color: var(--text-primary); font-weight: 600; margin-bottom: 6px;">Target Class: ${item.service}</p>
                        <p style="line-height: 1.5; font-size: 0.9rem;">"${item.details}"</p>
                    </div>
                    <div class="inbox-card-footer">
                        <span>📅 Date Received: <strong style="color: var(--accent-secondary);">${item.dateReceived}</strong></span>
                        ${item.assetsLink ? `<a href="${item.assetsLink}" target="_blank" class="inbox-link-badge">Folder Footage ➔</a>` : ''}
                    </div>
                </div>
            `).join("");
        }
    }

    const revisionsMonitor = document.getElementById("admin-revisions-monitor");
    if (revisionsMonitor) {
        let allRevisions = [];

        db.clients.forEach((client, cIdx) => {
            client.projects.forEach((proj, pIdx) => {
                if (proj.revisions && proj.revisions.length > 0) {
                    proj.revisions.forEach((rev, rIdx) => {
                        allRevisions.push({
                            clientEmail: client.email,
                            clientName: client.name,
                            projId: proj.id,
                            projTitle: proj.title,
                            revIndex: rIdx,
                            revData: rev
                        });
                    });
                }
            });
        });

        if (allRevisions.length === 0) {
            revisionsMonitor.innerHTML = `<p class="no-revisions-msg">No active timestamp revision requests submitted by clients yet.</p>`;
        } else {
            revisionsMonitor.innerHTML = allRevisions.slice().reverse().map(item => {
                let r = item.revData;
                let statusClass = r.resolved ? 'status-delivered' : 'status-review';
                let statusText = r.resolved ? '✓ Resolved' : '● In Queue';
                let actionText = r.resolved ? 'Re-open Request' : 'Mark Resolved';

                return `
                    <div class="revision-monitor-card" style="border-left: 3px solid ${r.resolved ? '#22c55e' : 'var(--accent-primary)'}; background: rgba(255,255,255,0.01);">
                        <div class="revision-monitor-header">
                            <div>
                                <h4 style="font-size: 0.95rem; font-family: var(--font-body);">${item.projTitle}</h4>
                                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Client: ${item.clientName}</p>
                            </div>
                            <span class="project-badge ${statusClass}" style="font-size: 0.7rem; font-weight: 700; padding: 2px 10px;">${statusText}</span>
                        </div>
                        <div class="revision-monitor-body" style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 4px; border: 1px solid var(--border-color);">
                            <span style="font-size: 0.82rem; font-weight: 700; color: var(--accent-secondary); display: block; margin-bottom: 4px;">Time Code: ${r.time}</span>
                            <p style="font-size: 0.9rem; line-height: 1.4; font-style: italic;">"${r.text}"</p>
                        </div>
                        <div class="revision-monitor-footer">
                            <span style="font-size: 0.82rem; color: var(--text-muted);">Timestamp comments logged</span>
                            <button class="btn-row-action" style="background: ${r.resolved ? 'rgba(255,255,255,0.02)' : 'var(--accent-primary-glow)'}; border-color: ${r.resolved ? 'var(--border-color)' : 'var(--accent-primary)'}; color: ${r.resolved ? 'var(--text-secondary)' : 'var(--text-primary)'};"
                                    onclick="toggleResolveRevision('${item.clientEmail}', '${item.projId}', ${item.revIndex})">
                                ${actionText}
                            </button>
                        </div>
                    </div>
                `;
            }).join("");
        }
    }
}

// Toggle resolution state on revision comments (syncs both directions!)
window.toggleResolveRevision = function(clientEmail, projId, revIndex) {
    const db = getDB();
    const client = db.clients.find(c => c.email === clientEmail);
    if (!client) return;

    const proj = client.projects.find(p => p.id === projId);
    if (proj && proj.revisions && proj.revisions[revIndex]) {
        proj.revisions[revIndex].resolved = !proj.revisions[revIndex].resolved;
        
        saveDB(db);
        renderInboxes(); 
        calculateAnalytics(); // update revision counters
        alert(`Revision state successfully toggled to ${proj.revisions[revIndex].resolved ? 'Resolved' : 'In Queue'}!`);
    }
};

// 11. Testimonials & Client Reviews CRUD Manager
let activeTestimonialEditId = null;

function setupTestimonialsCRUD() {
    const form = document.getElementById("admin-testimonial-form");
    const clearBtn = document.getElementById("test-clear-btn");
    
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = document.getElementById("test-name").value.trim();
        const role = document.getElementById("test-role").value.trim();
        const rating = parseInt(document.getElementById("test-rating-select").value, 10);
        const text = document.getElementById("test-text").value.trim();
        const avatar = document.getElementById("test-avatar").value.trim();
        const audioUrl = document.getElementById("test-audio").value.trim();
        const videoUrl = document.getElementById("test-video").value.trim();
        const attachUrl = document.getElementById("test-attach").value.trim();

        const db = getDB();
        db.testimonials = db.testimonials || [];

        if (activeTestimonialEditId) {
            // Edit existing
            const testimonial = db.testimonials.find(t => t.id === activeTestimonialEditId);
            if (testimonial) {
                testimonial.name = name;
                testimonial.role = role;
                testimonial.rating = rating;
                testimonial.text = text;
                testimonial.avatar = avatar;
                testimonial.audioUrl = audioUrl;
                testimonial.videoUrl = videoUrl;
                testimonial.attachUrl = attachUrl;
                alert("Client review successfully modified!");
            }
            activeTestimonialEditId = null;
            document.getElementById("testimonial-form-headline").textContent = "Add / Edit Client Review";
        } else {
            // Create new
            const newTestimonial = {
                id: "test-" + Date.now(),
                name: name,
                role: role,
                rating: rating,
                text: text,
                avatar: avatar,
                audioUrl: audioUrl,
                videoUrl: videoUrl,
                attachUrl: attachUrl
            };
            db.testimonials.push(newTestimonial);
            alert("Client review successfully published to dynamic showcase slider!");
        }

        saveDB(db);
        renderAdminTestimonialsList();
        form.reset();
    });

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            form.reset();
            activeTestimonialEditId = null;
            document.getElementById("testimonial-form-headline").textContent = "Add / Edit Client Review";
        });
    }
}

function renderAdminTestimonialsList() {
    const container = document.getElementById("admin-testimonials-list-container");
    if (!container) return;

    const db = getDB();
    const testimonials = db.testimonials || [];

    if (testimonials.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 40px 0;">
                <p>No active showcase testimonials. Add your first client review above!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = testimonials.map(t => {
        let stars = "";
        const rating = t.rating || 5;
        for (let i = 0; i < rating; i++) stars += "★";

        let proofBadges = [];
        if (t.audioUrl) proofBadges.push("🎵 Audio");
        if (t.videoUrl) proofBadges.push("🎬 Video");
        if (t.attachUrl) proofBadges.push("🔗 Link");
        const proofsText = proofBadges.length > 0 ? `Proof attachments: ${proofBadges.join(", ")}` : "No proof attachments";

        return `
            <div class="admin-data-row">
                <div class="admin-data-details" style="align-items: flex-start; flex-direction: column; gap: 4px; width: 100%;">
                    <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                        <h4 style="font-weight: 700; font-size: 1.05rem;">${t.name} <span style="font-size: 0.8rem; font-weight: 400; color: var(--text-secondary);">(${t.role})</span></h4>
                        <span style="color: #fbbf24; font-weight: 700;">${stars}</span>
                    </div>
                    <p style="font-style: italic; font-size: 0.88rem; line-height: 1.4; color: var(--text-primary); margin-top: 4px;">"${t.text.substring(0, 100)}${t.text.length > 100 ? '...' : ''}"</p>
                    <span style="font-size: 0.72rem; color: var(--accent-secondary); font-weight: 600; margin-top: 4px;">${proofsText}</span>
                </div>
                <div class="admin-row-actions">
                    <button class="btn-row-action" onclick="editTestimonial('${t.id}')">Edit</button>
                    <button class="btn-row-action delete" onclick="deleteTestimonial('${t.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join("");
}

window.editTestimonial = function(id) {
    const db = getDB();
    const t = db.testimonials.find(item => item.id === id);
    if (!t) return;

    activeTestimonialEditId = t.id;
    document.getElementById("testimonial-form-headline").textContent = `Edit Review: ${t.name}`;
    document.getElementById("test-name").value = t.name;
    document.getElementById("test-role").value = t.role;
    document.getElementById("test-rating-select").value = t.rating || 5;
    document.getElementById("test-text").value = t.text;
    document.getElementById("test-avatar").value = t.avatar || "";
    document.getElementById("test-audio").value = t.audioUrl || "";
    document.getElementById("test-video").value = t.videoUrl || "";
    document.getElementById("test-attach").value = t.attachUrl || "";

    const activeTab = document.querySelector(".dash-tab[data-target='admin-testimonials']");
    if (activeTab) activeTab.click();
};

window.deleteTestimonial = function(id) {
    if (confirm("Are you sure you want to permanently delete this client review from the dynamic showcase slider?")) {
        const db = getDB();
        db.testimonials = db.testimonials.filter(t => t.id !== id);
        saveDB(db);
        renderAdminTestimonialsList();
        alert("Client review deleted successfully!");
    }
};

// 12. Support Chat Hub Manager
let activeChatClientEmail = null;

function setupAdminChat() {
    const chatForm = document.getElementById("admin-chat-form");
    if (!chatForm) return;

    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const input = document.getElementById("admin-chat-input");
        const msgText = input.value.trim();
        if (!msgText || !activeChatClientEmail) return;

        const db = getDB();
        const client = db.clients.find(c => c.email === activeChatClientEmail);
        if (!client) return;

        client.messages = client.messages || [];
        
        client.messages.push({
            sender: "admin",
            text: msgText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        saveDB(db);
        renderAdminChatLog(client);
        
        input.value = "";
    });
}

function renderAdminChatClientsSidebar() {
    const container = document.getElementById("admin-chat-clients-list");
    if (!container) return;

    const db = getDB();
    const clients = db.clients || [];

    if (clients.length === 0) {
        container.innerHTML = `<div style="padding: 16px; color: var(--text-muted); font-size: 0.85rem;">No active clients registered.</div>`;
        return;
    }

    container.innerHTML = clients.map(c => {
        const isActive = c.email === activeChatClientEmail ? "active" : "";
        const unreadCount = c.messages ? c.messages.filter(m => m.sender === "client").length : 0;
        const subLabel = c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1].text.substring(0, 20) + "..." : "No messages yet";
        
        return `
            <div class="service-nav-btn ${isActive}" style="border: none; border-bottom: 1px solid var(--border-color); border-radius: 0; padding: 14px 16px; width: 100%; justify-content: flex-start; gap: 8px;" onclick="selectAdminChatClient('${c.email}')">
                <div style="text-align: left; flex-grow: 1;">
                    <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-primary);">${c.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${c.company}</div>
                    <div style="font-size: 0.72rem; color: var(--accent-secondary); margin-top: 4px; font-style: italic;">${subLabel}</div>
                </div>
                ${unreadCount > 0 ? `<span style="background: var(--accent-primary); color: #fff; font-size: 0.7rem; font-weight: 800; padding: 2px 6px; border-radius: 10px;">${unreadCount}</span>` : ""}
            </div>
        `;
    }).join("");
}

window.selectAdminChatClient = function(email) {
    activeChatClientEmail = email;
    renderAdminChatClientsSidebar();

    const db = getDB();
    const client = db.clients.find(c => c.email === email);
    if (!client) return;

    // Enable chat form inputs
    const input = document.getElementById("admin-chat-input");
    const btn = document.getElementById("admin-chat-send-btn");
    if (input && btn) {
        input.disabled = false;
        btn.disabled = false;
        input.placeholder = `Reply to ${client.name}...`;
    }

    // Set title header
    const title = document.getElementById("admin-chat-active-title");
    if (title) {
        title.innerHTML = `💬 Live Support: ${client.name} <span style="font-weight: 400; color: var(--text-muted); font-size: 0.85rem;">(${client.company})</span>`;
    }

    renderAdminChatLog(client);
};

function renderAdminChatLog(client) {
    const container = document.getElementById("admin-chat-messages");
    if (!container) return;

    const messages = client.messages || [];

    if (messages.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); margin-top: 100px;">
                <span style="font-size: 2.2rem; display: block; margin-bottom: 12px;">💬</span>
                <strong>No messages yet</strong>
                <p style="font-size: 0.85rem; margin-top: 4px;">Type a message below to welcome ${client.name} and kickstart their video deliverables support!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = messages.map(msg => {
        const isClient = msg.sender === "client";
        const align = isClient ? "flex-start" : "flex-end";
        const bg = isClient ? "rgba(255,255,255,0.04)" : "var(--accent-primary-glow)";
        const border = isClient ? "border-color: var(--border-color);" : "border-color: var(--accent-primary);";
        const senderName = isClient ? client.name : "You (Support)";
        const color = isClient ? "color: var(--accent-secondary);" : "color: var(--accent-primary);";

        return `
            <div style="align-self: ${align}; max-width: 75%; background: ${bg}; border: 1px solid; ${border} padding: 12px 18px; border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); margin-bottom: 4px;">
                <div style="display: flex; justify-content: space-between; gap: 20px; font-size: 0.72rem; font-weight: 700; ${color}">
                    <span>${senderName}</span>
                    <span style="color: var(--text-muted);">${msg.timestamp || ''}</span>
                </div>
                <div style="font-size: 0.9rem; line-height: 1.45; color: var(--text-primary); word-break: break-word;">${msg.text}</div>
            </div>
        `;
    }).join("");

    container.scrollTop = container.scrollHeight;
}

// 13. Client Accounts Roster Manager (Manual Deletion)
function setupClientsDatabaseManager() {
    // Renderer triggers direct callbacks
}

function renderClientsDatabaseList() {
    const container = document.getElementById("admin-clients-database-list");
    if (!container) return;

    const db = getDB();
    const clients = db.clients || [];

    if (clients.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 30px 0;">
                <p>No active registered client portal accounts found in fzmedia_db.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = clients.map(c => {
        const activeSub = c.activeSub || "No Active Package";
        const projectsCount = c.projects ? c.projects.length : 0;
        
        return `
            <div class="admin-data-row" style="border-color: rgba(255,255,255,0.05); background: rgba(0,0,0,0.1);">
                <div class="admin-data-details" style="flex-grow: 1;">
                    <div class="admin-row-avatar-placeholder">${c.name.charAt(0)}</div>
                    <div class="admin-row-meta">
                        <h4 style="font-weight: 700; font-size: 1.05rem;">${c.name} <span style="font-size: 0.8rem; font-weight: 400; color: var(--text-secondary);">(${c.email})</span></h4>
                        <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 3px;">
                            Brand Name: <strong>${c.company}</strong> | Monthly Suite: <span style="color: var(--accent-primary); font-weight: 700;">${activeSub}</span> | Deliverables: <strong>${projectsCount} projects</strong>
                        </p>
                    </div>
                </div>
                <div class="admin-row-actions">
                    <button class="btn-row-action delete" style="padding: 8px 16px; font-weight: 700; border-color: rgba(239,68,68,0.5); background: rgba(239,68,68,0.1);" onclick="deleteClientAccount('${c.email}')">
                        Wipe Client Account 🗑
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

window.deleteClientAccount = function(email) {
    if (confirm(`CRITICAL WARNING: Are you sure you want to permanently delete the client account linked to "${email}"?\n\nThis will wipe all active draftProgress charts, Intake briefs, OBS Stream setups, and direct conversation messages! This action cannot be undone.`)) {
        const db = getDB();
        db.clients = db.clients.filter(c => c.email !== email);
        saveDB(db);

        // Update all related dynamic UI panels instantly
        renderClientsDatabaseList();
        calculateAnalytics();
        renderAdminChatClientsSidebar();

        // Clear chat area if we were actively chatting with the wiped client
        if (activeChatClientEmail === email) {
            activeChatClientEmail = null;
            const title = document.getElementById("admin-chat-active-title");
            if (title) title.textContent = "Select a client conversation to begin messaging...";
            
            const messagesContainer = document.getElementById("admin-chat-messages");
            if (messagesContainer) messagesContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); margin-top: 100px; font-size: 0.95rem;">Select a conversation from the active dialogs list.</div>`;
            
            const input = document.getElementById("admin-chat-input");
            const btn = document.getElementById("admin-chat-send-btn");
            if (input && btn) {
                input.disabled = true;
                btn.disabled = true;
                input.placeholder = "Select conversation first...";
                input.value = "";
            }
        }

        alert("Success! Client workspace account and all associated records have been permanently wiped from fzmedia_db.");
    }
};
