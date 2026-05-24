/* FZ Media - Global State Engine & Persistent Database */

// 1. Initial Seeding Setup
const DEFAULT_BRAND_DATA = {
    settings: {
        agencyName: "FZ Media",
        agencyFullName: "Frame Zone Media",
        logoPath: "assets/img/logo/FZ logo.png",
        logoIconPath: "assets/img/logo/FZ logo 1.png",
        primaryColorH: 267,
        primaryColorS: 90,
        primaryColorL: 61,
        secondaryColorH: 185,
        secondaryColorS: 90,
        secondaryColorL: 50,
        ctaLink: "contact.html",
        adminCredentials: {
            email: "framezonem@gmail.com",
            passwordHash: "RnptZWRpYUAxMjM=" // Base64 for Fzmedia@123
        },
        socialLinks: {
            facebook: "https://www.facebook.com/FZoneM",
            instagram: "https://www.instagram.com/frame.zone.media/",
            linkedin: "https://www.linkedin.com/in/fz-media/",
            fiverr: "https://www.fiverr.com/fz_media",
            upwork: "https://www.upwork.com/freelancers/~0142030ef402084057?mp_source=share",
            whatsapp: "https://wa.me/8801635333356"
        },
        heroVideo: {
            title: "Watch FZ Showreel",
            description: "Targeted VSL templates, product focus, and Call to Actions",
            videoUrl: "assets/videos/solo showreel.mp4",
            thumbnailUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=1000&q=80"
        },
        calculator: {
            basePricePerMinute: 10,
            basicLabel: "Basic cuts & music",
            standardLabel: "Standard text & SFX",
            standardMultiplier: 20,
            premiumLabel: "Premium AE & Grading",
            premiumMultiplier: 50
        }
    },
    navLinks: [
        { text: "Home", url: "index.html" },
        { text: "About", url: "about.html" },
        { text: "Services", url: "services.html" },
        { text: "Portfolio", url: "work.html" },
        { text: "Contact", url: "contact.html" }
    ],
    team: [
        {
            id: "team-1",
            name: "Protik Hasan",
            role: "Founder",
            title: "Motion & SaaS Expert",
            experience: "5+ Years",
            image: "assets/img/team/Protik.png",
            skills: "Adobe After Effects, Cinema 4D, 2D/3D Animation, SaaS Promo Videos, Explainer Visuals"
        },
        {
            id: "team-2",
            name: "Rifat Khan",
            role: "Manager",
            title: "Professional Video Editor",
            experience: "5+ Years",
            image: "assets/img/team/Protik 2.png",
            skills: "Adobe Premiere Pro, Cinematic Cuts, Sound Design, Color Grading, Client Coordination"
        },
        {
            id: "team-3",
            name: "Toimur Khan",
            role: "Member",
            title: "Graphics Designer Expert",
            experience: "3+ Years",
            image: "",
            skills: "Photoshop, Illustrator, Vector Art, Brand Identity, Title Typography Design"
        },
        {
            id: "team-4",
            name: "Rajib Islam",
            role: "Member",
            title: "Cinematographer",
            experience: "4+ Years",
            image: "",
            skills: "Drone Piloting, Camera Movements, Stabilizing, Lighting, Action Sequence Shooting"
        }
    ],
    services: [
        {
            id: "srv-1",
            name: "Podcast Editing",
            subtitle: "Turn your podcast into polished ready-to-stream visual content for maximum listener retention.",
            packages: [
                {
                    name: "Basic",
                    price: 40,
                    delivery: "2-Day Delivery",
                    revisions: "1 Revision",
                    features: ["Edit up to 60 min episode", "Clean intro/outro assembly", "Noise, hum & pop removal", "Speakers volume leveling", "Ready-to-upload master file"]
                },
                {
                    name: "Advanced",
                    price: 65,
                    delivery: "2-Day Delivery",
                    revisions: "2 Revisions",
                    features: ["All Basic features included", "Filler word removal (ums, ahs, pauses)", "Tighter pacing & pacing cleanup", "Awkward silence trimming", "High retention audio mastering"]
                },
                {
                    name: "Premium Growth",
                    price: 100,
                    delivery: "3-Day Delivery",
                    revisions: "3 Revisions",
                    features: ["All Advanced features included", "4 short social media clips (Shorts/TikTok)", "1 branded audiogram video file", "Interactive captioning & subtitles", "Animated waveform for visual punch"]
                }
            ]
        },
        {
            id: "srv-2",
            name: "Cinematic Video Editing",
            subtitle: "Corporate promos, social media hooks, event highlights, and highly engaging YouTube contents.",
            packages: [
                {
                    name: "Basic",
                    price: 25,
                    delivery: "3-Day Delivery",
                    revisions: "2 Revisions",
                    features: ["Up to 15 mins raw footage", "2 min final runtime edit", "Simple music & transition syncing", "Title card templates", "Standard HD rendering"]
                },
                {
                    name: "Standard+",
                    price: 70,
                    delivery: "4-Day Delivery",
                    revisions: "3 Revisions",
                    features: ["Up to 15 mins raw footage", "5 min final runtime edit", "Motion graphics integration", "Custom sound effects design", "Sleek animated text layers"]
                },
                {
                    name: "Premium",
                    price: 150,
                    delivery: "4-Day Delivery",
                    revisions: "3 Revisions",
                    features: ["Up to 15 mins raw footage", "10 min final runtime edit", "Full color correction & cinematic grading", "Accurate manual subtitles (.SRT)", "Premium visual effects overlays", "Full 4K Ultra HD render"]
                }
            ]
        },
        {
            id: "srv-3",
            name: "Motion Graphics (AE)",
            subtitle: "Custom-crafted visual animations designed and stylized directly in Adobe After Effects.",
            packages: [
                {
                    name: "Short Video",
                    price: 30,
                    delivery: "2-Day Delivery",
                    revisions: "1 Revision",
                    features: ["Up to 15 seconds runtime", "High impact vector animation", "Modern sound effects design", "Custom brand color matching", "100% Satisfaction guarantee"]
                },
                {
                    name: "Medium Length",
                    price: 50,
                    delivery: "2-Day Delivery",
                    revisions: "2 Revisions",
                    features: ["Up to 30 seconds runtime", "Smooth keyframe kinetic transitions", "Intros/Outros logo animations", "Interactive UI/Website mockups", "Professional audio mix integration"]
                },
                {
                    name: "Long Video",
                    price: 90,
                    delivery: "4-Day Delivery",
                    revisions: "3 Revisions",
                    features: ["Up to 60 seconds full animation", "Premium detailed character/SaaS overlays", "Custom kinetic typography design", "After Effects master files delivered", "VIP direct support feedback"]
                }
            ]
        },
        {
            id: "srv-4",
            name: "Real Estate Drone Editing",
            subtitle: "High-end real estate drone footage stabilizing, location tracking, and property boundaries marking.",
            packages: [
                {
                    name: "Basic",
                    price: 35,
                    delivery: "2-Day Delivery",
                    revisions: "1 Revision",
                    features: ["30-sec HD promo video editing", "Pro drone footage stabilization", "Color correction filter (LUTS)", "Cinematic license-free music", "Basic text slide overlays"]
                },
                {
                    name: "Standard",
                    price: 55,
                    delivery: "3-Day Delivery",
                    revisions: "2 Revisions",
                    features: ["60-sec HD promo video editing", "Interactive 3D location tracking pins", "Animated site boundary markings", "Professional sound design & master", "Sleek contact call-to-action slides"]
                },
                {
                    name: "Premium",
                    price: 120,
                    delivery: "4-Day Delivery",
                    revisions: "3 Revisions",
                    features: ["60-sec 4K UHD premium rendering", "Google Earth customized flyover map", "Detailed surrounding points of interest highlights", "Premium cinematic color grading", "Free matching thumbnail layout"]
                }
            ]
        }
    ],
    portfolioTabs: ["All", "YouTube Videos", "Shorts & Reels", "SaaS Videos", "Ad Creatives & VSL"],
    portfolio: [
        {
            id: "port-1",
            title: "The Solo Content Creator Showreel",
            category: "YouTube Videos",
            videoUrl: "assets/videos/solo showreel.mp4",
            thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
            likes: 124
        },
        {
            id: "port-2",
            title: "Kinetic Typography Logo Reveal V4",
            category: "Ad Creatives & VSL",
            videoUrl: "assets/videos/logo animation.mp4",
            thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
            likes: 98
        },
        {
            id: "port-3",
            title: "Real Estate Property Drone Highlighting",
            category: "Shorts & Reels",
            videoUrl: "assets/videos/Social Proof.mp4", // fallback local file
            thumbnail: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80",
            likes: 156
        },
        {
            id: "port-4",
            title: "Corporate SaaS Promotion & Ad Edit",
            category: "SaaS Videos",
            videoUrl: "assets/videos/VID 1.mp4",
            thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
            likes: 210
        },
        {
            id: "port-5",
            title: "Cinematic Typographic Storytelling V2",
            category: "YouTube Videos",
            videoUrl: "assets/videos/Typo Graphy 1.mp4",
            thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
            likes: 85
        },
        {
            id: "port-6",
            title: "Client Testimonial Speech Integration",
            category: "Ad Creatives & VSL",
            videoUrl: "assets/videos/Social Proof.mp4",
            thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
            likes: 142
        }
    ],
    clients: [
        {
            email: "client@gmail.com",
            password: "client123",
            name: "John Doe",
            company: "Apex Tech Inc.",
            activeSub: "Premium Growth Podcast Editing",
            packageLimits: "2 of 4 Video Drafts remaining this month",
            projects: [
                {
                    id: "cp-1",
                    title: "Apex Podcast Episode 12 - Marketing Hacks",
                    status: "First Cut Editing",
                    progress: 60,
                    deliveryDate: "May 27, 2026",
                    videoUrl: "assets/videos/VID 1.mp4",
                    revisions: [
                        { time: "00:15", text: "Please fade the background music here so speakers are louder", resolved: false }
                    ],
                    obsStream: {
                        active: false,
                        server: "rtmp://live.framezonemedia.com/live",
                        key: "fz_live_apex_ep12"
                    }
                },
                {
                    id: "cp-2",
                    title: "Apex Promo Teaser - Product Launch 9:16",
                    status: "Delivered",
                    progress: 100,
                    deliveryDate: "May 20, 2026",
                    videoUrl: "assets/videos/Social Proof.mp4",
                    revisions: [],
                    obsStream: {
                        active: false,
                        server: "rtmp://live.framezonemedia.com/live",
                        key: "fz_live_apex_promo"
                    }
                }
            ],
            briefs: []
        }
    ],
    inbox: [],
    testimonials: [
        {
            id: "test-1",
            name: "Nick Barner",
            role: "Content Creator",
            text: "Honestly, FZ Media are the absolute best in the game. The rapid turnarounds and dynamic revisions are unmatched, and I highly recommend them for any scaling venture.",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
            videoUrl: "assets/videos/Social Proof.mp4",
            rating: 5,
            audioUrl: "",
            attachUrl: ""
        },
        {
            id: "test-2",
            name: "Spencer Pawliw",
            role: "Skool Games Winner",
            text: "I have nothing but great things to say about their workflow. FZ Media definitely helped me kickstart everything that I've done successfully on YouTube and TikTok.",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
            videoUrl: "assets/videos/solo showreel.mp4",
            rating: 5,
            audioUrl: "",
            attachUrl: ""
        },
        {
            id: "test-3",
            name: "Josh Faulkner",
            role: "Ed-tech Entrepreneur",
            text: "Frame Zone Media is the most reliable visual editing partner you could ever ask for to manage your brand creation. Transparent timelines, outstanding motions.",
            avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
            videoUrl: "assets/videos/Typo Graphy 1.mp4",
            rating: 5,
            audioUrl: "",
            attachUrl: ""
        }
    ]
};

// 2. Database Fetch & Load
function getDB() {
    let db = localStorage.getItem("fzmedia_db");
    if (!db) {
        localStorage.setItem("fzmedia_db", JSON.stringify(DEFAULT_BRAND_DATA));
        return DEFAULT_BRAND_DATA;
    }
    
    let parsed;
    try {
        parsed = JSON.parse(db);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            throw new Error("Invalid database root format");
        }
    } catch(e) {
        console.error("Corrupted database detected in localStorage, re-seeding factory defaults", e);
        localStorage.setItem("fzmedia_db", JSON.stringify(DEFAULT_BRAND_DATA));
        return DEFAULT_BRAND_DATA;
    }
    
    // Deep self-healing merge helper to safely populate nested missing collections/keys
    function deepMerge(target, source) {
        let changed = false;
        for (let key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
                    target[key] = JSON.parse(JSON.stringify(source[key]));
                    changed = true;
                } else {
                    if (deepMerge(target[key], source[key])) {
                        changed = true;
                    }
                }
            } else {
                if (target[key] === undefined || target[key] === null || (Array.isArray(source[key]) && (!Array.isArray(target[key]) || target[key].length === 0))) {
                    target[key] = JSON.parse(JSON.stringify(source[key]));
                    changed = true;
                }
            }
        }
        return changed;
    }

    const needsSave = deepMerge(parsed, DEFAULT_BRAND_DATA);

    if (needsSave) {
        localStorage.setItem("fzmedia_db", JSON.stringify(parsed));
    }

    return parsed;
}

function saveDB(data) {
    localStorage.setItem("fzmedia_db", JSON.stringify(data));
}

// 3. Inject CSS Theme Colors & Premium Layout Styles Dynamically
function injectTheme() {
    const data = getDB();
    const s = data.settings;
    
    document.documentElement.style.setProperty('--accent-primary-h', s.primaryColorH);
    document.documentElement.style.setProperty('--accent-primary-s', s.primaryColorS + '%');
    document.documentElement.style.setProperty('--accent-primary-l', s.primaryColorL + '%');

    document.documentElement.style.setProperty('--accent-secondary-h', s.secondaryColorH);
    document.documentElement.style.setProperty('--accent-secondary-s', s.secondaryColorS + '%');
    document.documentElement.style.setProperty('--accent-secondary-l', s.secondaryColorL + '%');

    // Dynamic Multi-Page Layout Themes Engine [NEW]
    const activeTheme = s.theme || "default";
    
    // Remove existing layout classes
    document.body.classList.remove("theme-liquid", "theme-saas");
    
    if (activeTheme === "liquid") {
        document.body.classList.add("theme-liquid");
        
        // Inject organic moving background blobs for Liquid Theme
        if (!document.querySelector(".liquid-bg-blob")) {
            const blob1 = document.createElement("div");
            blob1.className = "liquid-bg-blob blob-1";
            const blob2 = document.createElement("div");
            blob2.className = "liquid-bg-blob blob-2";
            document.body.appendChild(blob1);
            document.body.appendChild(blob2);
        }
    } else {
        // Clear any blobs if not active
        document.querySelectorAll(".liquid-bg-blob").forEach(el => el.remove());
        
        if (activeTheme === "saas") {
            document.body.classList.add("theme-saas");
        }
    }
}

// 4. Inject Shared Navigation & Footer
function injectLayouts() {
    const db = getDB();
    const s = db.settings;
    
    // Inject Header if container exists
    const headerContainer = document.getElementById("global-header");
    if (headerContainer) {
        headerContainer.className = "sticky-header";
        
        let logoMarkup = "";
        if (s.logoPath) {
            logoMarkup = `<img src="${s.logoPath}" alt="${s.agencyName}" class="brand-logo-img" onerror="this.src='assets/img/logo/FZ logo 1.png'">`;
        } else {
            logoMarkup = `<span class="brand-name">${s.agencyName}</span>`;
        }

        let navLinksMarkup = db.navLinks.map(link => {
            let isActive = window.location.pathname.endsWith(link.url) ? "active" : "";
            if (window.location.pathname === "/" && link.url === "index.html") isActive = "active";
            return `<li><a href="${link.url}" class="nav-link-item ${isActive}">${link.text}</a></li>`;
        }).join("");

        headerContainer.innerHTML = `
            <div class="container">
                <div class="nav-wrapper">
                    <a href="index.html" class="brand-logo-container">
                        ${logoMarkup}
                    </a>
                    
                    <nav class="nav-menu">
                        <ul class="nav-menu-links" id="nav-menu-links">
                            ${navLinksMarkup}
                            <li><a href="client.html" class="btn-secondary" style="padding: 8px 16px; font-size: 0.88rem;">Client Portal</a></li>
                            <li><a href="admin.html" class="btn-primary" style="padding: 8px 16px; font-size: 0.88rem;">Admin</a></li>
                        </ul>
                    </nav>

                    <button class="menu-toggle-btn" id="menu-toggle-btn" aria-label="Toggle Navigation">
                        <span class="menu-toggle-bar"></span>
                        <span class="menu-toggle-bar"></span>
                        <span class="menu-toggle-bar"></span>
                    </button>
                </div>
            </div>
        `;

        // Scroll sticky nav
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                headerContainer.classList.add("scrolled");
            } else {
                headerContainer.classList.remove("scrolled");
            }
        });

        // Mobile toggle
        const toggleBtn = document.getElementById("menu-toggle-btn");
        const navMenu = document.getElementById("nav-menu-links");
        if (toggleBtn && navMenu) {
            toggleBtn.addEventListener("click", () => {
                toggleBtn.classList.toggle("open");
                navMenu.classList.toggle("open");
            });
        }
    }

    // Inject Footer if container exists
    const footerContainer = document.getElementById("global-footer");
    if (footerContainer) {
        footerContainer.className = "premium-footer";
        
        let logoMarkup = "";
        if (s.logoPath) {
            logoMarkup = `<img src="${s.logoPath}" alt="${s.agencyName}" class="brand-logo-img" style="height: 48px;" onerror="this.src='assets/img/logo/FZ logo 1.png'">`;
        } else {
            logoMarkup = `<span class="brand-name" style="font-size: 1.8rem;">${s.agencyName}</span>`;
        }

        footerContainer.innerHTML = `
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-brand-col">
                        <a href="index.html" class="brand-logo-container">
                            ${logoMarkup}
                        </a>
                        <p class="footer-description">
                            Delivering cinematic, high-retention video editing, premium motion graphics, and typography animations that scale audience reach on autopilot.
                        </p>
                        <div class="footer-social-icons">
                            <a href="${s.socialLinks.linkedin}" target="_blank" class="social-icon-btn"><i class="social-icon">IN</i></a>
                            <a href="${s.socialLinks.facebook}" target="_blank" class="social-icon-btn"><i class="social-icon">FB</i></a>
                            <a href="${s.socialLinks.instagram}" target="_blank" class="social-icon-btn"><i class="social-icon">IG</i></a>
                            <a href="${s.socialLinks.fiverr}" target="_blank" class="social-icon-btn"><i class="social-icon">FI</i></a>
                            <a href="${s.socialLinks.upwork}" target="_blank" class="social-icon-btn"><i class="social-icon">UP</i></a>
                            <a href="${s.socialLinks.whatsapp}" target="_blank" class="social-icon-btn" style="background: rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.2);"><i class="social-icon" style="color: #4ade80;">WA</i></a>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="footer-col-title">Navigation</h4>
                        <ul class="footer-links-list">
                            <li><a href="index.html" class="footer-link-item">Home</a></li>
                            <li><a href="about.html" class="footer-link-item">About Team</a></li>
                            <li><a href="services.html" class="footer-link-item">Our Services</a></li>
                            <li><a href="work.html" class="footer-link-item">Portfolio Work</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="footer-col-title">Support Hub</h4>
                        <ul class="footer-links-list">
                            <li><a href="client.html" class="footer-link-item">Client Portal</a></li>
                            <li><a href="admin.html" class="footer-link-item">Admin Board</a></li>
                            <li><a href="contact.html" class="footer-link-item">Book Discovery Call</a></li>
                            <li><a href="contact.html" class="footer-link-item">Direct Inquiry</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="footer-col-title">Contact Office</h4>
                        <ul class="footer-links-list" style="gap: 10px; color: var(--text-secondary); font-size: 0.95rem;">
                            <li>📍 Frame Zone Media</li>
                            <li>Creative Hub Workspace</li>
                            <li>Email: framezonem@gmail.com</li>
                            <li>Direct Chat: +8801635-333356</li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>&copy; ${new Date().getFullYear()} ${s.agencyFullName}. All Rights Reserved.</p>
                    <p>Designed with High-Retention Aesthetics</p>
                </div>
            </div>
        `;
    }
}

// 5. Inject Floating Glassmorphic Q&A Chatbot
function injectChatbot() {
    // Check if chatbot container already exists
    if (document.getElementById("fz-chatbot-wrapper")) return;

    const wrapper = document.createElement("div");
    wrapper.id = "fz-chatbot-wrapper";
    wrapper.style.position = "fixed";
    wrapper.style.bottom = "30px";
    wrapper.style.right = "30px";
    wrapper.style.zIndex = "9999";
    
    // Custom Chatbot inline CSS
    const style = document.createElement("style");
    style.textContent = `
        .chatbot-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
            border: 1px solid rgba(255,255,255,0.15);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 10px 30px var(--accent-primary-glow);
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
        }
        .chatbot-btn:hover {
            transform: scale(1.08) translateY(-3px);
            box-shadow: 0 15px 40px rgba(var(--accent-primary-h), var(--accent-primary-s), 50%, 0.4);
        }
        .chatbot-btn .badge-ping {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 14px;
            height: 14px;
            background: #ef4444;
            border-radius: 50%;
            border: 2px solid var(--bg-primary);
            animation: pulse-badge 1.8s infinite;
        }
        @keyframes pulse-badge {
            0% { transform: scale(0.9); opacity: 1; }
            50% { transform: scale(1.15); opacity: 0.8; }
            100% { transform: scale(0.9); opacity: 1; }
        }
        .chatbot-drawer {
            position: fixed;
            bottom: 105px;
            right: 30px;
            width: 380px;
            height: 520px;
            background: rgba(var(--bg-secondary-h), var(--bg-secondary-s), var(--bg-secondary-l), 0.85);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border: 1px solid var(--border-glow);
            border-radius: var(--radius-lg);
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 10000;
            transform: translateY(30px) scale(0.9);
            opacity: 0;
            pointer-events: none;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .chatbot-drawer.open {
            transform: translateY(0) scale(1);
            opacity: 1;
            pointer-events: auto;
        }
        .chatbot-header {
            padding: 20px;
            background: rgba(255,255,255,0.02);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .chatbot-header h3 {
            font-size: 1.15rem;
            font-family: var(--font-body);
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .chatbot-status-dot {
            width: 8px;
            height: 8px;
            background: #4ade80;
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 10px #4ade80;
        }
        .chatbot-close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--text-secondary);
            cursor: pointer;
            line-height: 0;
            transition: var(--transition-snappy);
        }
        .chatbot-close-btn:hover {
            color: var(--text-primary);
        }
        .chatbot-body {
            flex-grow: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .chat-bubble {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: var(--radius-md);
            font-size: 0.9rem;
            line-height: 1.45;
        }
        .chat-bubble.bot {
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--border-color);
            align-self: flex-start;
            border-top-left-radius: 2px;
            color: var(--text-primary);
        }
        .chat-bubble.user {
            background: var(--accent-primary);
            color: var(--text-primary);
            align-self: flex-end;
            border-top-right-radius: 2px;
            box-shadow: 0 5px 15px var(--accent-primary-glow);
        }
        .chat-options-flex {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 6px;
        }
        .chat-option-btn {
            background: rgba(255,255,255,0.02);
            border: 1px solid var(--border-color);
            padding: 8px 14px;
            border-radius: var(--radius-sm);
            color: var(--text-primary);
            font-size: 0.82rem;
            font-weight: 600;
            text-align: left;
            cursor: pointer;
            transition: var(--transition-snappy);
        }
        .chat-option-btn:hover {
            background: var(--accent-primary-glow);
            border-color: var(--accent-primary);
            color: var(--accent-primary);
            padding-left: 18px;
        }
        .chatbot-footer {
            padding: 16px;
            border-top: 1px solid var(--border-color);
            background: rgba(0,0,0,0.1);
            display: flex;
            gap: 10px;
        }
        .chatbot-input {
            flex-grow: 1;
            background: rgba(0,0,0,0.2);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            padding: 10px 14px;
            color: #fff;
            font-size: 0.88rem;
        }
        .chatbot-input:focus {
            outline: none;
            border-color: var(--accent-primary);
        }
        .chatbot-send-btn {
            background: var(--accent-primary);
            border: none;
            color: #fff;
            padding: 0 16px;
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-weight: 600;
            transition: var(--transition-snappy);
        }
        .chatbot-send-btn:hover {
            background: var(--accent-secondary);
        }
        @media (max-width: 480px) {
            .chatbot-drawer {
                width: calc(100vw - 40px);
                height: 480px;
                right: 20px;
                bottom: 95px;
            }
        }
    `;
    document.head.appendChild(style);

    wrapper.innerHTML = `
        <button class="chatbot-btn" id="fz-chatbot-btn" aria-label="Open Assistant">
            <span class="badge-ping"></span>
            <span class="chatbot-icon">💬</span>
        </button>
        
        <div class="chatbot-drawer" id="fz-chatbot-drawer">
            <div class="chatbot-header">
                <h3><span class="chatbot-status-dot"></span> FZ Virtual Director</h3>
                <button class="chatbot-close-btn" id="fz-chatbot-close">&times;</button>
            </div>
            
            <div class="chatbot-body" id="fz-chatbot-body">
                <div class="chat-bubble bot">
                    Hello! I am your <strong>FZ Virtual Director</strong>. 🎬<br><br>
                    I am here to guide you to the perfect package and help you onboarding. What is your brand's niche/industry?
                    
                    <div class="chat-options-flex">
                        <button class="chat-option-btn" onclick="botSelectNiche('YouTube Creator')">🎥 YouTube Content Creator</button>
                        <button class="chat-option-btn" onclick="botSelectNiche('SaaS or Corporate Brand')">💻 SaaS / Corporate Brand</button>
                        <button class="chat-option-btn" onclick="botSelectNiche('Real Estate Broker')">🏢 Real Estate Broker</button>
                        <button class="chat-option-btn" onclick="botSelectNiche('Podcast Host')">🎙 Podcast Host</button>
                    </div>
                </div>
            </div>
            
            <div class="chatbot-footer">
                <input type="text" class="chatbot-input" id="fz-chatbot-input" placeholder="Type a message (e.g. deadline, price)...">
                <button class="chatbot-send-btn" id="fz-chatbot-send">Send</button>
            </div>
        </div>
    `;

    document.body.appendChild(wrapper);

    // Wire up open / close triggers
    const trigger = document.getElementById("fz-chatbot-btn");
    const drawer = document.getElementById("fz-chatbot-drawer");
    const closeBtn = document.getElementById("fz-chatbot-close");
    const sendBtn = document.getElementById("fz-chatbot-send");
    const textInput = document.getElementById("fz-chatbot-input");

    if (trigger && drawer && closeBtn) {
        trigger.addEventListener("click", () => {
            drawer.classList.toggle("open");
            // Clear ping badge once opened
            const ping = trigger.querySelector(".badge-ping");
            if (ping) ping.style.display = "none";
        });
        
        closeBtn.addEventListener("click", () => {
            drawer.classList.remove("open");
        });
    }

    // Input handlers
    if (sendBtn && textInput) {
        sendBtn.addEventListener("click", handleChatbotInputSubmit);
        textInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleChatbotInputSubmit();
        });
    }
}

// Chatbot Flow Parameters
let botState = {
    niche: "",
    assets: "",
    deadline: "",
    budget: ""
};

window.botSelectNiche = function(niche) {
    botState.niche = niche;
    appendUserBubble(niche);
    
    setTimeout(() => {
        appendBotBubble(`Awesome! A <strong>${niche}</strong> setup. What kind of raw footage assets do you typically work with?
            <div class="chat-options-flex">
                <button class="chat-option-btn" onclick="botSelectAssets('4K Camera A-Roll')">📸 High-Res Camera A-Roll</button>
                <button class="chat-option-btn" onclick="botSelectAssets('Drone raw clips')">🚁 Drone / Aerial Footage</button>
                <button class="chat-option-btn" onclick="botSelectAssets('Multi-mic audio files')">🎙 Multi-mic Podcast Audio</button>
                <button class="chat-option-btn" onclick="botSelectAssets('Screen-records & Mockups')">🖥 Screen Recordings & Mockups</button>
            </div>
        `);
    }, 600);
};

window.botSelectAssets = function(assets) {
    botState.assets = assets;
    appendUserBubble(assets);

    setTimeout(() => {
        appendBotBubble(`Understood. Raw files are mainly <strong>${assets}</strong>. What is your preferred project deadline?
            <div class="chat-options-flex">
                <button class="chat-option-btn" onclick="botSelectDeadline('ASAP 2-Day delivery')">⚡ Urgent (2-Day Delivery)</button>
                <button class="chat-option-btn" onclick="botSelectDeadline('Standard 4-Day delivery')">📅 Standard (4-Day Delivery)</button>
            </div>
        `);
    }, 600);
};

window.botSelectDeadline = function(deadline) {
    botState.deadline = deadline;
    appendUserBubble(deadline);

    setTimeout(() => {
        appendBotBubble(`Got it, targeting <strong>${deadline}</strong>. Lastly, what is your estimated budget per video project?
            <div class="chat-options-flex">
                <button class="chat-option-btn" onclick="botSelectBudget('Under $50')">💵 Under $50</button>
                <button class="chat-option-btn" onclick="botSelectBudget('$50 to $100')">💳 $50 to $100</button>
                <button class="chat-option-btn" onclick="botSelectBudget('$100+')">🔥 $100+ (High-End Production)</button>
            </div>
        `);
    }, 600);
};

window.botSelectBudget = function(budget) {
    botState.budget = budget;
    appendUserBubble(budget);

    setTimeout(() => {
        // Run diagnosis recommendation
        let recommendedService = "Cinematic Video Editing";
        let recommendedPackage = "Standard+";
        let srvIndex = 1; // Default
        
        if (botState.niche.includes("Podcast") || botState.assets.includes("Podcast")) {
            recommendedService = "Podcast Editing";
            recommendedPackage = botState.budget.includes("Under") ? "Basic" : (botState.budget.includes("50") ? "Advanced" : "Premium Growth");
            srvIndex = 0;
        } else if (botState.assets.includes("Drone")) {
            recommendedService = "Real Estate Drone Editing";
            recommendedPackage = botState.budget.includes("Under") ? "Basic" : (botState.budget.includes("50") ? "Standard" : "Premium");
            srvIndex = 3;
        } else if (botState.niche.includes("SaaS") || botState.budget.includes("100")) {
            recommendedService = "Motion Graphics (AE)";
            recommendedPackage = botState.budget.includes("Under") ? "Short Video" : (botState.budget.includes("50") ? "Medium Length" : "Long Video");
            srvIndex = 2;
        } else {
            recommendedService = "Cinematic Video Editing";
            recommendedPackage = botState.budget.includes("Under") ? "Basic" : (botState.budget.includes("50") ? "Standard+" : "Premium");
            srvIndex = 1;
        }

        const db = getDB();
        const srv = db.services[srvIndex];
        const pkg = srv.packages.find(p => p.name === recommendedPackage || p.name.includes(recommendedPackage));
        const price = pkg ? pkg.price : 70;

        appendBotBubble(`🎉 Diagnosis Complete! Based on your parameters, we highly recommend our **${recommendedService} (${recommendedPackage} Tier)**. <br><br>
            <strong>Price:</strong> $${price}<br>
            <strong>Delivery:</strong> ${pkg ? pkg.delivery : '4-Day'}<br>
            <strong>Features:</strong> ${pkg ? pkg.features.slice(0, 3).join(', ') + '...' : 'Premium Grade Editing'}<br><br>
            You can proceed straight to our interactive Checkout to secure this slot immediately!<br><br>
            <a href="checkout.html?service=${encodeURIComponent(recommendedService)}&package=${encodeURIComponent(recommendedPackage)}&price=${price}" class="btn-primary" style="display: block; text-align: center; font-size: 0.85rem; padding: 10px;">Proceed to Checkout ➔</a>
        `);
    }, 850);
};

// Conversational Chatbot text queries
function handleChatbotInputSubmit() {
    const input = document.getElementById("fz-chatbot-input");
    const query = input.value.trim().toLowerCase();
    if (!query) return;

    appendUserBubble(input.value);
    input.value = "";

    setTimeout(() => {
        if (query.includes("niche") || query.includes("industry")) {
            appendBotBubble("I can optimize for multiple niches! YouTube, podcasts, real estate drone tracking, and SaaS promos are our core categories. Choose your niche in our diagnosis to get packages details!");
        } else if (query.includes("budget") || query.includes("price") || query.includes("cost")) {
            appendBotBubble("Our standard packages range from $25 for Basic Video edits up to $150 for Premium. Motion animations start at $30. You can view all structures on our <a href='services.html' style='color: var(--accent-primary); font-weight: 700;'>Services Page</a>!");
        } else if (query.includes("deadline") || query.includes("time") || query.includes("fast")) {
            appendBotBubble("Speed is our key metric! Most standard packages deliver in 2-3 days, while our advanced pricing tiers include expedited turnarounds. We focus on transparent pacing.");
        } else if (query.includes("revision") || query.includes("change") || query.includes("edit")) {
            appendBotBubble("Yes! Clients get up to 3 revisions. With our high-end <strong>Frame-by-Frame Revision Hub</strong> inside the Client Portal, you can pause video drafts at exact timestamps and submit checklist requests directly to Rifat and Protik!");
        } else if (query.includes("social") || query.includes("linkedin") || query.includes("fiverr") || query.includes("upwork")) {
            appendBotBubble(`Follow our active portfolios and creative feeds:<br><br>
                🔗 <a href="https://www.linkedin.com/in/fz-media/" target="_blank" style="color: var(--accent-primary);">LinkedIn Profile</a><br>
                🔗 <a href="https://www.facebook.com/FZoneM" target="_blank" style="color: var(--accent-primary);">Facebook Page</a><br>
                🔗 <a href="https://www.instagram.com/frame.zone.media/" target="_blank" style="color: var(--accent-primary);">Instagram Feed</a><br>
                🟢 <a href="https://www.fiverr.com/fz_media" target="_blank" style="color: var(--accent-secondary);">Fiverr Gig</a><br>
                🟢 <a href="https://www.upwork.com/freelancers/~0142030ef402084057?mp_source=share" target="_blank" style="color: var(--accent-secondary);">Upwork Agency</a>
            `);
        } else {
            appendBotBubble("I am happy to help you with that! For custom briefs, raw footage links, and onboarding, please book a direct 15-minute call on our <a href='contact.html' style='color: var(--accent-primary); font-weight: 700;'>Booking Calendar</a> or drop a WhatsApp message to +8801635-333356.");
        }
    }, 600);
}

function appendUserBubble(text) {
    const body = document.getElementById("fz-chatbot-body");
    if (!body) return;

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble user";
    bubble.textContent = text;
    
    body.appendChild(bubble);
    body.scrollTop = body.scrollHeight;
}

function appendBotBubble(htmlContent) {
    const body = document.getElementById("fz-chatbot-body");
    if (!body) return;

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble bot";
    bubble.innerHTML = htmlContent;
    
    body.appendChild(bubble);
    body.scrollTop = body.scrollHeight;
}

// 6. Initial Run
document.addEventListener("DOMContentLoaded", () => {
    injectTheme();
    injectLayouts();
    injectChatbot();
});
