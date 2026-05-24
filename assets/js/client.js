/* FZ Media - Client Portal Dashboard Logic */

let activeClientEmail = null;
let activeProjectForRevision = null;

document.addEventListener("DOMContentLoaded", () => {
    setupAuthGuard();
    setupAuthTabs();
    setupDashboardTabs();
    setupPlayheadCapture();
    setupRevisionForm();
    setupBriefForm();
    setupLogout();
    setupClientChat();
});

// 1. Client authentication login and signup guard
function setupAuthGuard() {
    const authPanel = document.getElementById("auth-panel");
    const workspacePanel = document.getElementById("workspace-panel");
    const loginForm = document.getElementById("client-login-form");
    const signupForm = document.getElementById("client-signup-form");
    const errorMsg = document.getElementById("auth-error-msg");

    if (!authPanel || !workspacePanel || !loginForm || !signupForm) return;

    // Check session persistence
    const savedEmail = sessionStorage.getItem("fzmedia_logged_client");
    if (savedEmail) {
        activeClientEmail = savedEmail;
        authPanel.style.display = "none";
        workspacePanel.style.display = "block";
        initializeWorkspace();
    }

    // Login Submission
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById("client-auth-email").value.trim();
        const passInput = document.getElementById("client-auth-pass").value.trim();
        
        const db = getDB();
        const client = db.clients.find(c => c.email === emailInput && c.password === passInput);

        if (client) {
            activeClientEmail = client.email;
            sessionStorage.setItem("fzmedia_logged_client", client.email);
            
            errorMsg.style.display = "none";
            authPanel.style.display = "none";
            workspacePanel.style.display = "block";
            initializeWorkspace();
        } else {
            errorMsg.textContent = "Incorrect email address or password. Please use client@gmail.com / client123.";
            errorMsg.style.display = "block";
        }
    });

    // Signup Submission
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("client-reg-name").value.trim();
        const company = document.getElementById("client-reg-company").value.trim();
        const email = document.getElementById("client-reg-email").value.trim();
        const pass = document.getElementById("client-reg-pass").value.trim();

        const db = getDB();
        
        // Check duplicate
        const duplicate = db.clients.find(c => c.email.toLowerCase() === email.toLowerCase());
        if (duplicate) {
            errorMsg.textContent = "This email is already registered in FZ Portal!";
            errorMsg.style.display = "block";
            return;
        }

        // Register client structure in local storage database
        const newClient = {
            email: email,
            password: pass,
            name: name,
            company: company,
            activeSub: "No Active Package",
            packageLimits: "Choose a pricing package to activate monthly deliverables",
            projects: [
                {
                    id: "cp-" + Date.now(),
                    title: `${company} Onboarding Brief Setup`,
                    status: "In Queue",
                    progress: 10,
                    deliveryDate: "Awaiting Package Selection",
                    videoUrl: "assets/videos/solo showreel.mp4",
                    revisions: [],
                    obsStream: {
                        active: false,
                        server: "rtmp://live.framezonemedia.com/live",
                        key: "fz_live_" + name.replace(/\s+/g, '_').toLowerCase()
                    }
                }
            ],
            briefs: []
        };

        db.clients.push(newClient);
        
        // Log in Admin brief logs
        db.inbox.push({
            id: "inq-" + Date.now(),
            name: name,
            email: email,
            brand: company,
            service: "New Client Account",
            assetsLink: "",
            details: `A new client registered an account. Brand: ${company}. Awaiting package selection/onboarding.`,
            scheduledCall: "Registered Online",
            dateReceived: new Date().toLocaleDateString()
        });

        saveDB(db);

        activeClientEmail = email;
        sessionStorage.setItem("fzmedia_logged_client", email);

        errorMsg.style.display = "none";
        authPanel.style.display = "none";
        workspacePanel.style.display = "block";
        
        initializeWorkspace();
        alert(`Welcome, ${name}! Your FZ Media Client Portal workspace is active. Let's create beautiful contents!`);
    });
}

// 2. Auth tabs toggling (Login vs Signup)
function setupAuthTabs() {
    const loginTab = document.getElementById("toggle-login-tab");
    const signupTab = document.getElementById("toggle-signup-tab");
    const loginForm = document.getElementById("client-login-form");
    const signupForm = document.getElementById("client-signup-form");
    const errorMsg = document.getElementById("auth-error-msg");

    if (!loginTab || !signupTab || !loginForm || !signupForm) return;

    loginTab.addEventListener("click", () => {
        loginTab.classList.add("active");
        signupTab.classList.remove("active");
        
        loginForm.style.display = "block";
        signupForm.style.display = "none";
        if (errorMsg) errorMsg.style.display = "none";
    });

    signupTab.addEventListener("click", () => {
        signupTab.classList.add("active");
        loginTab.classList.remove("active");

        signupForm.style.display = "block";
        loginForm.style.display = "none";
        if (errorMsg) errorMsg.style.display = "none";
    });
}

// 3. Initialize Workspace
function initializeWorkspace() {
    const db = getDB();
    const client = db.clients.find(c => c.email === activeClientEmail);
    if (!client) return;

    // Set header welcome texts
    const firstName = client.name ? client.name.trim().split(/\s+/)[0] : "Client";
    document.getElementById("client-welcome-name").textContent = firstName;
    document.getElementById("client-company-badge").textContent = client.company;
    document.getElementById("client-active-sub").textContent = client.activeSub;
    document.getElementById("client-sub-limits").textContent = client.packageLimits;

    // Render active deliverables
    renderActiveDeliverables(client);

    // Set default project for revision if present
    if (client.projects.length > 0) {
        loadProjectIntoRevision(client.projects[0]);
    }

    // Render support chat logs
    renderChatMessages(client);
}

// 4. Render client dynamic deliverables
function renderActiveDeliverables(client) {
    const container = document.getElementById("active-projects-container");
    if (!container) return;

    if (client.projects.length === 0) {
        container.innerHTML = `
            <div class="glass-card" style="grid-column: span 2; text-align: center; padding: 40px;">
                <p style="font-size: 1.1rem; color: var(--text-muted);">No active deliverables at this time.</p>
                <a href="services.html" class="btn-primary" style="margin-top: 16px;">View Pricing & Packages</a>
            </div>
        `;
        return;
    }

    container.innerHTML = client.projects.map(proj => {
        let badgeClass = "status-queue";
        if (proj.status === "First Cut Editing") badgeClass = "status-edit";
        if (proj.status === "Awaiting Review") badgeClass = "status-review";
        if (proj.status === "Delivered") badgeClass = "status-delivered";

        // Check if OBS livestream is active from editors!
        let obsMarkup = "";
        if (proj.obsStream && proj.obsStream.active) {
            obsMarkup = `
                <div class="glass-card" style="grid-column: span 2; margin-top: 20px; border-color: #ef4444; background: rgba(239, 68, 68, 0.03); padding: 24px; position: relative;">
                    <div style="position: absolute; top: 16px; right: 24px; display: inline-flex; align-items: center; gap: 6px;">
                        <span style="width: 10px; height: 10px; background: #ef4444; border-radius: 50%; display: inline-block; animation: pulse-badge 1.5s infinite;"></span>
                        <span style="font-size: 0.72rem; font-weight: 800; color: #f87171; text-transform: uppercase; letter-spacing: 0.05em;">OBS Live Session Online</span>
                    </div>
                    
                    <h4 style="font-size: 1.15rem; color: var(--text-primary); margin-bottom: 8px;">🔴 FZ Editor Live Stream Active</h4>
                    <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 20px; max-width: 80%;">Your editor has started a live streaming session! copy the OBS Server and Stream Key credentials below to pull the direct high-quality video feed inside your VLC media player, web browser RTMP tools, or direct streams receiver.</p>
                    
                    <div class="obs-credentials-container" style="display: flex; gap: 16px; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 250px;">
                            <label class="form-label" style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">OBS RTMP Server URL</label>
                            <div class="copy-input-flex" style="display: flex; gap: 8px; margin-top: 4px;">
                                <input type="text" class="form-control" style="font-size: 0.82rem; padding: 6px 12px; background: rgba(0,0,0,0.3);" value="${proj.obsStream.server}" readonly id="obs-srv-${proj.id}">
                                <button class="btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="copyOBSValue('obs-srv-${proj.id}', this)">Copy</button>
                            </div>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <label class="form-label" style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">OBS Stream Key</label>
                            <div class="copy-input-flex" style="display: flex; gap: 8px; margin-top: 4px;">
                                <input type="text" class="form-control" style="font-size: 0.82rem; padding: 6px 12px; background: rgba(0,0,0,0.3);" value="${proj.obsStream.key}" readonly id="obs-key-${proj.id}">
                                <button class="btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;" onclick="copyOBSValue('obs-key-${proj.id}', this)">Copy</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="glass-card client-project-card" style="grid-column: span 2; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div class="project-card-header">
                        <div>
                            <span class="project-badge ${badgeClass}">${proj.status}</span>
                            <h3 style="margin-top: 10px;">${proj.title}</h3>
                        </div>
                    </div>
                    
                    <div class="project-progress-row">
                        <div class="progress-label-flex">
                            <span>Production Progress</span>
                            <span>${proj.progress}%</span>
                        </div>
                        <div class="progress-track">
                            <div class="progress-fill" style="width: ${proj.progress}%;"></div>
                        </div>
                    </div>
                </div>
                
                <div class="project-card-footer" style="margin-top: 16px;">
                    <div class="delivery-tag">Target Delivery: <strong>${proj.deliveryDate}</strong></div>
                    <button class="btn-primary" style="padding: 8px 16px; font-size: 0.82rem;" onclick="openProjectInRevision('${proj.id}')">
                        Open Frame Review 🎬
                    </button>
                </div>
                
                ${obsMarkup}
            </div>
        `;
    }).join("");
}

// Copy OBS fields trigger
window.copyOBSValue = function(id, btn) {
    const input = document.getElementById(id);
    if (input) {
        input.select();
        document.execCommand("copy");
        btn.textContent = "Copied!";
        setTimeout(() => btn.textContent = "Copy", 1500);
    }
};

// 5. Tab selection logic
function setupDashboardTabs() {
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
}

// 6. Load specific project in the dynamic revision player
window.openProjectInRevision = function(projId) {
    const db = getDB();
    const client = db.clients.find(c => c.email === activeClientEmail);
    const proj = client.projects.find(p => p.id === projId);

    if (proj) {
        loadProjectIntoRevision(proj);
        
        const tabs = document.querySelectorAll(".dash-tab");
        const contents = document.querySelectorAll(".dash-tab-content");
        
        tabs.forEach(t => t.classList.remove("active"));
        contents.forEach(c => c.classList.remove("active"));

        const targetTab = Array.from(tabs).find(t => t.getAttribute("data-target") === "dash-revision-hub");
        if (targetTab) targetTab.classList.add("active");
        
        document.getElementById("dash-revision-hub").classList.add("active");
    }
};

function loadProjectIntoRevision(proj) {
    activeProjectForRevision = proj.id;
    
    document.getElementById("active-revision-project-title").textContent = proj.title;
    
    const player = document.getElementById("draft-video-player");
    if (player) {
        player.src = proj.videoUrl;
        player.load();
    }

    renderRevisionsTimeline(proj);
}

// Render revision comments checklist
function renderRevisionsTimeline(proj) {
    const feed = document.getElementById("feedback-checklist-feed");
    if (!feed) return;

    if (!proj.revisions || proj.revisions.length === 0) {
        feed.innerHTML = `
            <div class="no-revisions-msg">
                <span style="font-size: 2.2rem;">🎬</span>
                <p style="margin-top: 12px;">No frame revision requests logged yet.</p>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Pause the draft video at any time, write your suggestion, and hit submit to log the first one!</p>
            </div>
        `;
        return;
    }

    feed.innerHTML = proj.revisions.map((rev, idx) => {
        let statusMarkup = rev.resolved ? 
            `<span class="feedback-status-badge resolved" style="color: #4ade80;">✓ Completed</span>` : 
            `<span class="feedback-status-badge pending" style="color: var(--accent-primary);">● Editorial Queue</span>`;

        return `
            <div class="feedback-timeline-item" onclick="scrubToTimestamp('${rev.time}')">
                <div class="feedback-item-header">
                    <span class="feedback-time-stamp">⏱ ${rev.time}</span>
                    ${statusMarkup}
                </div>
                <p class="feedback-item-text">"${rev.text}"</p>
            </div>
        `;
    }).join("");
}

// 7. Playhead time capture dynamics
function setupPlayheadCapture() {
    const player = document.getElementById("draft-video-player");
    const badge = document.getElementById("current-playhead-badge");
    const captureBtn = document.getElementById("capture-time-btn");

    if (!player || !badge) return;

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    player.addEventListener("timeupdate", () => {
        badge.textContent = formatTime(player.currentTime);
    });

    if (captureBtn) {
        captureBtn.addEventListener("click", () => {
            badge.textContent = formatTime(player.currentTime);
        });
    }
}

// Jumps video playhead
window.scrubToTimestamp = function(timeStr) {
    const player = document.getElementById("draft-video-player");
    if (!player) return;

    const parts = timeStr.split(":");
    if (parts.length === 2) {
        const min = parseInt(parts[0], 10);
        const sec = parseInt(parts[1], 10);
        player.currentTime = (min * 60) + sec;
        player.play().catch(e => console.log("Interrupted"));
    }
};

// 8. Feedback Form Submission
function setupRevisionForm() {
    const form = document.getElementById("timestamp-feedback-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!activeProjectForRevision) {
            alert("No active draft project loaded for feedback!");
            return;
        }

        const timeStamp = document.getElementById("current-playhead-badge").textContent;
        const textValue = document.getElementById("feedback-text").value.trim();

        const db = getDB();
        const client = db.clients.find(c => c.email === activeClientEmail);
        const proj = client.projects.find(p => p.id === activeProjectForRevision);

        if (proj) {
            if (!proj.revisions) proj.revisions = [];
            
            proj.revisions.push({
                time: timeStamp,
                text: textValue,
                resolved: false
            });

            saveDB(db);
            renderRevisionsTimeline(proj);

            document.getElementById("feedback-text").value = "";
            alert(`Logged your revision request at frame time ${timeStamp}!`);
        }
    });
}

// 9. Submit Intake Brief Form
function setupBriefForm() {
    const form = document.getElementById("client-brief-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("brief-title").value.trim();
        const platform = document.getElementById("brief-platform").value;
        const pacing = document.getElementById("brief-pacing").value;
        const footageUrl = document.getElementById("brief-footage").value.trim();
        const details = document.getElementById("brief-details").value.trim();

        const db = getDB();
        const client = db.clients.find(c => c.email === activeClientEmail);

        if (client) {
            const newBriefProj = {
                id: "cp-" + Date.now(),
                title: title,
                status: "In Queue",
                progress: 0,
                deliveryDate: "Awaiting Schedule",
                videoUrl: "assets/videos/solo showreel.mp4",
                revisions: [],
                obsStream: {
                    active: false,
                    server: "rtmp://live.framezonemedia.com/live",
                    key: "fz_live_" + client.name.replace(/\s+/g, '_').toLowerCase()
                },
                metadata: {
                    platform: platform,
                    pacing: pacing,
                    footageUrl: footageUrl,
                    details: details
                }
            };

            client.projects.push(newBriefProj);
            
            db.inbox.push({
                id: "inq-" + Date.now(),
                name: client.name,
                email: client.email,
                brand: client.company,
                service: platform + " Editing",
                assetsLink: footageUrl,
                details: `Project: ${title}. Pacing: ${pacing}. Direct Guidelines: ${details}`,
                scheduledCall: "Awaiting Assignment",
                dateReceived: new Date().toLocaleDateString()
            });

            saveDB(db);

            renderActiveDeliverables(client);

            form.reset();
            alert("Success! Your video brief has been sent to our editor queue. Rifat Khan will review assets and schedule delivery!");

            const tabs = document.querySelectorAll(".dash-tab");
            const contents = document.querySelectorAll(".dash-tab-content");
            
            tabs.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            const targetTab = Array.from(tabs).find(t => t.getAttribute("data-target") === "dash-active-projects");
            if (targetTab) targetTab.classList.add("active");
            
            document.getElementById("dash-active-projects").classList.add("active");
        }
    });
}

// 10. Client Portal Log Out Workspace Logic
function setupLogout() {
    const logoutBtn = document.getElementById("client-logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("fzmedia_logged_client");
            activeClientEmail = null;
            // Clear session memory and redirect back to login panel
            window.location.reload();
        });
    }
}

// 11. Client Support Chat Hub [NEW]
function setupClientChat() {
    const chatForm = document.getElementById("client-chat-form");
    if (!chatForm) return;

    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const input = document.getElementById("client-chat-input");
        const msgText = input.value.trim();
        if (!msgText) return;

        const db = getDB();
        const client = db.clients.find(c => c.email === activeClientEmail);
        if (!client) return;

        client.messages = client.messages || [];
        
        client.messages.push({
            sender: "client",
            text: msgText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        saveDB(db);
        renderChatMessages(client);
        
        input.value = "";
    });
}

function renderChatMessages(client) {
    const chatContainer = document.getElementById("client-chat-messages");
    if (!chatContainer) return;

    const messages = client.messages || [];

    if (messages.length === 0) {
        chatContainer.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); margin-top: 80px;">
                <span style="font-size: 2.2rem; display: block; margin-bottom: 12px;">💬</span>
                <strong>Start a conversation!</strong>
                <p style="font-size: 0.85rem; margin-top: 4px;">Type a message below to coordinate revisions or strategy questions with Protik Hasan.</p>
            </div>
        `;
        return;
    }

    chatContainer.innerHTML = messages.map(msg => {
        const isAdmin = msg.sender === "admin";
        const align = isAdmin ? "flex-start" : "flex-end";
        const bg = isAdmin ? "rgba(255,255,255,0.04)" : "var(--accent-primary-glow)";
        const border = isAdmin ? "border-color: var(--border-color);" : "border-color: var(--accent-primary);";
        const senderName = isAdmin ? "FZ Support" : "You";
        const color = isAdmin ? "color: var(--accent-secondary);" : "color: var(--accent-primary);";

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

    // Auto scroll chat to the bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
