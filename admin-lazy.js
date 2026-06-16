// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyBntoxvT-xyEMAmXinu6HTa6-YRTOBN3CA",
    authDomain: "mahesh-consultant.firebaseapp.com",
    databaseURL: "https://mahesh-consultant-default-rtdb.firebaseio.com",
    projectId: "mahesh-consultant",
    storageBucket: "mahesh-consultant.firebasestorage.app",
    messagingSenderId: "768691619020",
    appId: "1:768691619020:web:af1f0cfa55a9ebe448ae69",
    measurementId: "G-FXSZT0PF18"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();
const db = firebase.firestore();

// --- Global States ---
let currentActiveTab = 'applications';
let currentActiveUniPane = 'bharath';
let localApplications = [];
let localLeads = [];

// --- Default Global Fee Configurations for Fallback/Reset ---
const initialMgrFeeData = {
    "DS & AI(IBM)": { "Slot A": { i: 135000, ii: 100000, schlI: null, schlII: null }, "Slot B": { i: 125000, ii: 90000, schlI: null, schlII: null } },
    "CFIS": { "Slot A": { i: 110000, ii: 75000, schlI: null, schlII: null }, "Slot B": { i: null, ii: null, schlI: null, schlII: null } },
    "CSE": { "Slot A": { i: 135000, ii: 100000, schlI: 94500, schlII: 70000 }, "Slot B": { i: 125000, ii: 80000, schlI: 87500, schlII: 56000 } },
    "CSE - AI": { "Slot A": { i: 135000, ii: 100000, schlI: 94500, schlII: 70000 }, "Slot B": { i: 125000, ii: 80000, schlI: 87500, schlII: 56000 } },
    "CSE - DS": { "Slot A": { i: null, ii: null, schlI: null, schlII: null }, "Slot B": { i: 80000, ii: 70000, schlI: 56000, schlII: 49000 } },
    "AI&ML": { "Slot A": { i: 100000, ii: 85000, schlI: 70000, schlII: 59500 }, "Slot B": { i: 85000, ii: 75000, schlI: 59500, schlII: 52500 } },
    "CSE-CYBER SECURITY": { "Slot A": { i: 108000, ii: 98000, schlI: 75600, schlII: 68600 }, "Slot B": { i: null, ii: null, schlI: null, schlII: null } },
    "CSE- BUSINESS SYSTEM": { "Slot A": { i: 110000, ii: 75000, schlI: 77000, schlII: 52500 }, "Slot B": { i: 100000, ii: 65000, schlI: 70000, schlII: 45500 } },
    "IT": { "Slot A": { i: 110000, ii: 75000, schlI: 77000, schlII: 52500 }, "Slot B": { i: 95000, ii: 70000, schlI: 66500, schlII: 49000 } },
    "CHEMICAL": { "Slot A": { i: 80000, ii: 50000, schlI: 56000, schlII: 35000 }, "Slot B": { i: null, ii: null, schlI: null, schlII: null } },
    "IT (CYBER PHYSICAL SYSTEM WITH IMARTICUS LEARNING)": { "Slot A": { i: 110000, ii: 75000, schlI: 77000, schlII: 52500 }, "Slot B": { i: 100000, ii: 65000, schlI: 70000, schlII: 45500 } },
    "ECE": { "Slot A": { i: 100000, ii: 75000, schlI: 70000, schlII: 52500 }, "Slot B": { i: 80000, ii: 65000, schlI: 56000, schlII: 45500 } },
    "EEE": { "Slot A": { i: 80000, ii: 50000, schlI: 56000, schlII: 35000 }, "Slot B": { i: null, ii: null, schlI: null, schlII: null } },
    "CIVIL": { "Slot A": { i: 80000, ii: 50000, schlI: 56000, schlII: 35000 }, "Slot B": { i: null, ii: null, schlI: null, schlII: null } },
    "BIO-TECH": { "Slot A": { i: 85000, ii: 70000, schlI: 59500, schlII: 49000 }, "Slot B": { i: 75000, ii: 65000, schlI: 52500, schlII: 45500 } },
    "BIO- MEDICAL": { "Slot A": { i: 85000, ii: 70000, schlI: 59500, schlII: 49000 }, "Slot B": { i: null, ii: null, schlI: null, schlII: null } },
    "MECH": { "Slot A": { i: 85000, ii: 60000, schlI: 59500, schlII: 42000 }, "Slot B": { i: null, ii: null, schlI: null, schlII: null } },
    "CSE(HONS)AI & ML": { "Slot A": { i: 90000, ii: 65000, schlI: null, schlII: null }, "Slot B": { i: 80000, ii: 55000, schlI: null, schlII: null } },
    "CSE(HONS)QUANTUM COMPUTING": { "Slot A": { i: 90000, ii: 65000, schlI: null, schlII: null }, "Slot B": { i: 80000, ii: 55000, schlI: null, schlII: null } },
    "CSE(HONS)CYBER SECURITY": { "Slot A": { i: 90000, ii: 65000, schlI: null, schlII: null }, "Slot B": { i: 80000, ii: 55000, schlI: null, schlII: null } },
    "MECH(HONS)ROBOTICS": { "Slot A": { i: 90000, ii: 65000, schlI: null, schlII: null }, "Slot B": { i: 80000, ii: 55000, schlI: null, schlII: null } },
    "BIO-TECH(HONS)NUTRITION TECHNOLOGY": { "Slot A": { i: 90000, ii: 65000, schlI: null, schlII: null }, "Slot B": { i: 80000, ii: 55000, schlI: null, schlII: null } },
    "ECE-(HONS)IOT&AI(IBM)": { "Slot A": { i: 90000, ii: 65000, schlI: null, schlII: null }, "Slot B": { i: 80000, ii: 55000, schlI: null, schlII: null } },
    "ECE-(HONS)AI&ML(IMARTICUS LEARNING)": { "Slot A": { i: 90000, ii: 65000, schlI: null, schlII: null }, "Slot B": { i: 80000, ii: 55000, schlI: null, schlII: null } },
    "ECE(HONS)CYBER SECURITY": { "Slot A": { i: 90000, ii: 65000, schlI: null, schlII: null }, "Slot B": { i: 80000, ii: 55000, schlI: null, schlII: null } }
};

const initialGanpatFeeData = {
    set1: [
        "B. Tech. CSE with IBM", "B. Tech. CSE (AI&ML) with IBM", "B. Tech. CSE (Cyber Security) with IBM", "B. Tech. CSE (Big Data and Analytics) with IBM"
    ],
    set2: [
        "B. Tech. CSBS with TCS", "B. Tech. ECE (VLSI System Design) with E-Info Chips", "B. Tech. Civil with L&T Edutech", 
        "B. Tech. Computer Engineering", "B. Tech. CE Artificial Intelligence", "B. Tech. IT", "B. Tech. Automobile", 
        "B. Tech. Biomedical", "B. Tech. EEE", "B. Tech. Mechanical", "B. Tech. Mechatronics", "B. Tech. Petrochemical", 
        "B. Tech. Biotechnology", "B. Tech. Chemical", "B. Tech. Agricultural Engineering", "B. Tech. Food Technology"
    ]
};

const initialBharathFeeData = {
    cse: { "90": 125000, "70": 150000, "60": 175000, "50": 200000, "below": 225000 },
    cse_spec: { "90": 150000, "70": 175000, "60": 200000, "50": 225000, "below": 250000 },
    other: {
        "Information Technology": 100000,
        "Electronics & Communication Engineering": 125000,
        "Aeronautical Engineering": 100000,
        "Aerospace Engineering": 100000,
        "Industrial Biotechnology": 100000,
        "Biotechnology (Agricultural)": 100000,
        "Bio medical Engineering": 100000,
        "Biotechnology (Genetic)": 100000,
        "Mechanical Engineering": 75000,
        "Mechatronics Engineering": 75000,
        "Electrical & Electronics Engineering": 75000,
        "Civil Engineering": 75000,
        "Automobile Engineering": 75000,
        "B Arch": 125000,
        "B Design": 125000
    },
    whatsapp: "+917397549343"
};

const initialDsuFeeData = {
    groupA_full: 225000,
    groupA_90: 100000,
    groupA_80: 120000,
    groupA_70: 140000,
    groupA_below: 160000,
    groupB_fee: 100000,
    hostel_common: 85000,
    hostel_common_ac: 95000,
    hostel_attached: 120000,
    hostel_attached_ac: 150000,
    one_time_app: 1500,
    one_time_adm: 10000,
    one_time_est: 5000,
    one_time_reg: 6000
};

const initialKalasalingamFeeData = {
    eng_group1_tuition: 195000,
    eng_group1_misc: 12000,
    eng_group2_tuition: 160000,
    eng_group2_misc: 12000,
    eng_group3_tuition: 100000,
    eng_group3_misc: 12000,
    barch_tuition: 100000,
    barch_misc: 12000,
    ship_tuition: 60000,
    ship_misc: 5000,
    nursing_tuition: 125000,
    nursing_misc: 12000,
    physio_tuition: 100000,
    physio_misc: 12000,
    allied_y1_3_tuition: 90000,
    allied_y4_tuition: 30000,
    allied_misc: 12000,
    agri_tuition: 120000,
    agri_misc: 12000,
    law_5yr_tuition: 150000,
    law_5yr_misc: 12000,
    law_3yr_tuition: 200000,
    law_3yr_misc: 0,
    forensic_ug_tuition: 120000,
    forensic_ug_misc: 12000,
    forensic_pg_tuition: 70000,
    forensic_pg_misc: 5000,
    arts_group1_tuition: 60000,
    arts_group1_misc: 5000,
    arts_group2_tuition: 45000,
    arts_group2_misc: 5000,
    viscom_tuition: 30000,
    viscom_misc: 5000,
    arts_group3_tuition: 20000,
    arts_group3_misc: 5000,
    catering_tuition: 30000,
    catering_uniform: 10000,
    catering_misc: 5000,
    mtech_tuition: 70000,
    mtech_misc: 12000,
    mba_mca_tuition: 150000,
    mba_mca_misc: 12000,
    pg_arts_tuition: 40000,
    pg_arts_misc: 5000,
    msc_cs_ds_tuition: 60000,
    msc_cs_ds_misc: 5000,
    bed_ship_tuition: 45000,
    bed_ship_misc: 5000,
    aero_aviation_tuition: 90000,
    aero_aviation_misc: 5000,
    bba_aviation_tuition: 70000,
    bba_aviation_misc: 5000,
    mba_aviation_tuition: 150000,
    mba_aviation_misc: 12000,
    app_domestic: 600,
    app_nri: 50
};

const defaultGlobalFeeData = {
    bharath: initialBharathFeeData,
    mgr: initialMgrFeeData,
    ganpat: { set1Yearly75: 250000, set1YearlyBelow: 275000, set2Yearly75: 225000, set2YearlyBelow: 250000 },
    dsu: initialDsuFeeData,
    kalasalingam: initialKalasalingamFeeData
};

let activeGlobalFeeData = JSON.parse(JSON.stringify(defaultGlobalFeeData));

// --- Authentication Check Check ---
auth.onAuthStateChanged((user) => {
    const loader = document.getElementById('authLoader');
    const loginBox = document.getElementById('loginContainer');
    const dashboardBox = document.getElementById('dashboardContainer');
    const adminEmailDisplay = document.getElementById('adminEmail');
    
    if (user) {
        // Logged in
        adminEmailDisplay.textContent = user.email;
        loginBox.style.display = 'none';
        dashboardBox.style.display = 'flex';
        
        // Fetch dynamic config data
        initializeDatabaseListeners();
        
        // Hide loader
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 300);
        }, 500);
    } else {
        // Not logged in
        loginBox.style.display = 'flex';
        dashboardBox.style.display = 'none';
        adminEmailDisplay.textContent = '-';
        
        // Hide loader
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 300);
        }, 500);
    }
});

// --- Form Authentication Handler ---
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value;
    const errBanner = document.getElementById('loginError');
    
    errBanner.style.display = 'none';
    errBanner.textContent = '';
    
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
            return auth.signInWithEmailAndPassword(email, pass);
        })
        .then(() => {
            sessionStorage.setItem('adminSession', 'true');
            showToast('Welcome back, Administrator!', 'success');
        })
        .catch((err) => {
            console.error("Login Authentication Error:", err);
            let displayMsg = "Invalid Credentials";
            if (err.code === "auth/unauthorized-domain") {
                displayMsg = "Unauthorized Domain: This domain/IP must be added to the Firebase Console -> Authentication -> Settings -> Authorized Domains.";
            } else if (err.code === "auth/network-request-failed") {
                displayMsg = "Network Error: Please check your internet connection and try again.";
            } else if (err.message) {
                displayMsg = err.message;
            }
            errBanner.textContent = displayMsg;
            errBanner.style.display = 'block';
            showToast(displayMsg, 'error');
            document.getElementById('loginPassword').value = '';
        });
}

function handleLogout() {
    if (confirm('Are you sure you want to end your administration session?')) {
        auth.signOut().then(() => {
            sessionStorage.removeItem('adminSession');
            showToast('Logged out successfully.', 'success');
            // Force refresh fields
            document.getElementById('loginForm').reset();
        });
    }
}

// --- Database Integration & Tab Routing ---
function initializeDatabaseListeners() {
    // Applications listener
    db.collection('applications').onSnapshot((snapshot) => {
        localApplications = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data) {
                data.docId = doc.id;
                localApplications.push(data);
            }
        });
        // Sort applications by date descending or ID
        localApplications.sort((a, b) => b.id - a.id);
        renderApplications();
    }, (err) => {
        console.error("Firestore Applications listen failed: ", err);
    });

    // Leads listener
    database.ref('collectedLeads').on('value', (snapshot) => {
        localLeads = [];
        snapshot.forEach(child => {
            const data = child.val();
            if (data) {
                localLeads.push(data);
            }
        });
        // Sort leads by timestamp descending
        localLeads.sort((a, b) => b.timestamp - a.timestamp);
        renderLeads();
    });

    // Fee configs listener
    database.ref('adminFeeData').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Safety merge configurations to ensure we don't crash on incomplete data
            const mergedData = JSON.parse(JSON.stringify(defaultGlobalFeeData));
            if (data.bharath) mergedData.bharath = data.bharath;
            if (data.mgr) mergedData.mgr = data.mgr;
            if (data.ganpat) mergedData.ganpat = data.ganpat;
            if (data.dsu) mergedData.dsu = data.dsu;
            if (data.kalasalingam) mergedData.kalasalingam = data.kalasalingam;
            activeGlobalFeeData = mergedData;
        } else {
            activeGlobalFeeData = JSON.parse(JSON.stringify(defaultGlobalFeeData));
        }
        populateFeeConfigInputs();
    });

    // WhatsApp settings Firestore listener
    db.collection('settings').doc('whatsapp').onSnapshot((doc) => {
        let doubtNum = "917397549343";
        let docNum = "919440662754";
        if (doc.exists) {
            const data = doc.data();
            doubtNum = data.doubtNum || doubtNum;
            docNum = data.docNum || docNum;
        }
        const doubtInput = document.getElementById('settingDoubtNum');
        const docInput = document.getElementById('settingDocNum');
        if (doubtInput) doubtInput.value = doubtNum;
        if (docInput) docInput.value = docNum;
    }, (err) => {
        console.error("Error listening to WhatsApp settings:", err);
    });
}

function saveWhatsAppSettings(e) {
    if (e) e.preventDefault();
    const doubtNum = document.getElementById('settingDoubtNum').value.trim();
    const docNum = document.getElementById('settingDocNum').value.trim();
    
    db.collection('settings').doc('whatsapp').set({
        doubtNum: doubtNum,
        docNum: docNum
    }).then(() => {
        showToast("WhatsApp settings saved successfully!", "success");
    }).catch(err => {
        console.error("Error saving WhatsApp settings:", err);
        showToast("Failed to save settings: " + err.message, "error");
    });
}

// --- View tabs controller ---
function switchTab(tabId) {
    currentActiveTab = tabId;
    
    // Toggle sidebar button styles
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.tab === tabId);
    });

    // Toggle main views
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${tabId}`);
    });
}

// --- Applications View Renderer ---
function renderApplications() {
    const body = document.getElementById('applicationsBody');
    const filter = document.getElementById('appUniFilter').value;
    body.innerHTML = '';
    
    let filtered = localApplications;
    if (filter !== 'all') {
        let targetUniName = '';
        if (filter === 'bharath') targetUniName = 'Bharath University';
        else if (filter === 'mgr') targetUniName = 'Mgr University';
        else if (filter === 'ganpat') targetUniName = 'Ganpat University';
        else if (filter === 'dsu') targetUniName = 'Dhanalakshmi Srinivasan University';
        else if (filter === 'kalasalingam') targetUniName = 'Kalasalingam Academy of Research and Education (Deemed to be University)';
        
        filtered = localApplications.filter(app => app.university === targetUniName);
    }

    if (filtered.length === 0) {
        body.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No applications submitted for this filter.</td></tr>';
        return;
    }

    filtered.forEach(app => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span style="font-weight: bold; color: var(--primary-accent, #60a5fa);">${app.appId || 'N/A'}</span></td>
            <td style="font-weight: 600;">${app.name}</td>
            <td><span style="font-size: 0.85rem; color: var(--text-muted);"><i class="fa-solid fa-graduation-cap" style="color: var(--primary-accent); margin-right: 4px;"></i>${app.university || 'Bharath University'}</span></td>
            <td><span style="background: rgba(59, 130, 246, 0.1); color: #93c5fd; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">${app.stream || 'MPC'}</span></td>
            <td><span style="font-size: 0.85rem; color: var(--text-muted);">${app.date || '-'}</span></td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-primary" onclick="openDetailsModal('${app.docId}')" style="padding: 0.4rem 0.75rem; font-size: 0.8rem;"><i class="fa-solid fa-circle-info"></i> View Details</button>
                    <button class="btn btn-danger" onclick="deleteApplication('${app.docId}')" style="padding: 0.4rem 0.6rem; font-size: 0.8rem; width: auto; background: var(--danger-color);" title="Delete Application"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;
        body.appendChild(tr);
    });
}

// --- Leads View Renderer ---
function renderLeads() {
    const body = document.getElementById('leadsBody');
    const search = document.getElementById('leadSearchInput').value.toLowerCase().trim();
    body.innerHTML = '';

    let filtered = localLeads;
    if (search) {
        filtered = localLeads.filter(lead => {
            const nameMatch = lead.name && lead.name.toLowerCase().includes(search);
            const phoneMatch = lead.phone && lead.phone.includes(search);
            return nameMatch || phoneMatch;
        });
    }

    if (filtered.length === 0) {
        body.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No matching leads captured.</td></tr>';
        return;
    }

    filtered.forEach(lead => {
        const dateStr = lead.timestamp ? new Date(lead.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ' ' + new Date(lead.timestamp).toLocaleDateString() : '-';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 600;">${lead.name || 'Anonymous'}</td>
            <td><span style="color: #67e8f9;"><i class="fa-solid fa-phone" style="font-size: 0.8rem; margin-right: 4px;"></i>${lead.phone || '-'}</span></td>
            <td><span style="font-size: 0.85rem; color: var(--text-muted);">${lead.university || '-'}</span></td>
            <td><span style="font-size: 0.85rem; color: var(--text-muted);">${lead.course || '-'}</span></td>
            <td><strong style="color: var(--success-color);">${lead.percentage ? parseFloat(lead.percentage).toFixed(2) + '%' : '-'}</strong></td>
            <td>
                <button class="btn btn-danger" onclick="deleteLead('${lead.phone || lead.timestamp}')" style="padding: 0.4rem 0.6rem; font-size: 0.8rem; width: auto; background: var(--danger-color);" title="Delete Lead"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        body.appendChild(tr);
    });
}

// --- Application Operations ---
function openDetailsModal(docId) {
    db.collection('applications').doc(docId).get().then(doc => {
        const app = doc.data();
        if (!app) {
            showToast('Application record not found.', 'error');
            return;
        }

        document.getElementById('modalStudentName').textContent = `${app.name}'s B.Tech Application`;
        document.getElementById('modalAppId').value = docId;
        document.getElementById('modalRemark1').value = app.remark1 || '';
        document.getElementById('modalRemark2').value = app.remark2 || '';

        const detailsGrid = document.getElementById('modalDetailsGrid');
        detailsGrid.innerHTML = '';
        
        const fields = [
            { k: 'appId', l: 'Application ID' },
            { k: 'name', l: 'Name' },
            { k: 'fname', l: "Father's Name" },
            { k: 'mname', l: "Mother's Name" },
            { k: 'blood', l: 'Blood Group' },
            { k: 'dob', l: 'Date of Birth' },
            { k: 'stream', l: 'Specialization/Stream' },
            { k: 'scontact', l: 'Student Phone' },
            { k: 'pcontact', l: 'Parent Phone' },
            { k: 'email', l: 'Email Address' },
            { k: 'aadhar', l: 'Aadhar Card Number' },
            { k: 'community', l: 'Community' },
            { k: 'pincode', l: 'Pincode' },
            { k: 'address', l: 'Residential Address' },
            { k: 'totalFee', l: 'Estimated Total Fee (₹)' },
            { k: 'university', l: 'University Choice' },
            { k: 'date', l: 'Submitted Date' }
        ];

        fields.forEach(f => {
            const div = document.createElement('div');
            div.className = 'details-field';
            div.innerHTML = `
                <div class="details-label">${f.l}</div>
                <div class="details-value">${app[f.k] || '-'}</div>
            `;
            detailsGrid.appendChild(div);
        });

        // Render uploaded certificates
        const certsGrid = document.getElementById('modalCertsGrid');
        certsGrid.innerHTML = '';

        const certs = [
            { key: 'cert_aadhar', label: 'Aadhar Card' },
            { key: 'cert_ssc', label: 'SSC (10th) Memo' },
            { key: 'cert_inter', label: 'Inter (12th) Memo' }
        ];

        certs.forEach(c => {
            const fileData = app[c.key];
            const card = document.createElement('div');
            card.className = 'cert-card';

            if (fileData) {
                const isPDF = fileData.startsWith('data:application/pdf') || fileData.toLowerCase().includes('.pdf') || fileData.toLowerCase().includes('pdf') || fileData.toLowerCase().includes('%2fpdf');
                
                if (isPDF) {
                    card.innerHTML = `
                        <p>${c.label}</p>
                        <div class="cert-placeholder pdf">
                            <i class="fa-solid fa-file-pdf"></i>
                            <span>PDF Document</span>
                        </div>
                        <a href="${fileData}" target="_blank" class="btn btn-primary" style="padding: 0.5rem; font-size: 0.8rem;"><i class="fa-solid fa-download"></i> View / Download PDF</a>
                    `;
                } else {
                    card.innerHTML = `
                        <p>${c.label}</p>
                        <img src="${fileData}" class="cert-preview" alt="${c.label}" onclick="window.open('${fileData}', '_blank')">
                        <a href="${fileData}" target="_blank" class="btn btn-primary" style="padding: 0.5rem; font-size: 0.8rem;"><i class="fa-solid fa-download"></i> View / Download Image</a>
                    `;
                }
            } else {
                card.innerHTML = `
                    <p>${c.label}</p>
                    <div class="cert-placeholder">
                        <i class="fa-solid fa-file-excel" style="color: var(--text-muted);"></i>
                        <span>No file uploaded</span>
                    </div>
                    <button class="btn btn-secondary" style="padding: 0.5rem; font-size: 0.8rem;" disabled><i class="fa-solid fa-ban"></i> Unavailable</button>
                `;
            }
            certsGrid.appendChild(card);
        });

        document.getElementById('detailsModal').style.display = 'flex';
    });
}

function closeDetailsModal() {
    document.getElementById('detailsModal').style.display = 'none';
    document.getElementById('remarkSaveSuccess').style.display = 'none';
}

function saveModalRemarks() {
    const docId = document.getElementById('modalAppId').value;
    const remark1 = document.getElementById('modalRemark1').value.trim();
    const remark2 = document.getElementById('modalRemark2').value.trim();

    db.collection('applications').doc(docId).update({
        remark1: remark1,
        remark2: remark2
    }).then(() => {
        const msg = document.getElementById('remarkSaveSuccess');
        msg.style.display = 'inline-block';
        setTimeout(() => msg.style.display = 'none', 3000);
        showToast('Remarks saved successfully.', 'success');
    }).catch((err) => {
        showToast('Failed to save remarks: ' + err.message, 'error');
    });
}

function deleteApplication(docId) {
    if (confirm('Are you sure you want to permanently delete this student application? This action cannot be undone.')) {
        db.collection('applications').doc(docId).delete().then(() => {
            showToast('Application deleted successfully.', 'success');
        }).catch((err) => {
            showToast('Failed to delete application: ' + err.message, 'error');
        });
    }
}

// --- Lead Operations ---
function deleteLead(key) {
    if (confirm('Are you sure you want to permanently delete this lead? This action cannot be undone.')) {
        database.ref('collectedLeads/' + key).remove().then(() => {
            showToast('Lead record deleted.', 'success');
        }).catch((err) => {
            showToast('Failed to delete lead: ' + err.message, 'error');
        });
    }
}

function exportLeadsToCSV() {
    if (localLeads.length === 0) {
        showToast('No leads available to export.', 'error');
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Student Name,Phone Number,University Preference,Course preference,Marks Percentage,Captured Date/Time\r\n";

    localLeads.forEach(lead => {
        const dateStr = lead.timestamp ? new Date(lead.timestamp).toLocaleDateString() + ' ' + new Date(lead.timestamp).toLocaleTimeString() : '';
        const name = (lead.name || 'Anonymous').replace(/"/g, '""');
        const phone = lead.phone || '';
        const uni = (lead.university || '').replace(/"/g, '""');
        const course = (lead.course || '').replace(/"/g, '""');
        const percentage = lead.percentage || '';

        csvContent += `"${name}","${phone}","${uni}","${course}","${percentage}","${dateStr}"\r\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `disha_collected_leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Exported successfully.', 'success');
}

// --- Fee Config University Tabs ---
function switchUniPane(uniId) {
    currentActiveUniPane = uniId;
    document.querySelectorAll('.uni-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.uni === uniId);
    });
    document.querySelectorAll('.uni-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === `pane-${uniId}`);
    });
}

// --- Populate inputs with Fee Config values ---
function populateFeeConfigInputs() {
    // 1. BHARATH
    const bh = activeGlobalFeeData.bharath;
    if (bh) {
        if (bh.cse) {
            document.getElementById('bh_cse_90').value = bh.cse["90"] || '';
            document.getElementById('bh_cse_70').value = bh.cse["70"] || '';
            document.getElementById('bh_cse_60').value = bh.cse["60"] || '';
            document.getElementById('bh_cse_50').value = bh.cse["50"] || '';
            document.getElementById('bh_cse_below').value = bh.cse["below"] || '';
        }
        if (bh.cse_spec) {
            document.getElementById('bh_csespec_90').value = bh.cse_spec["90"] || '';
            document.getElementById('bh_csespec_70').value = bh.cse_spec["70"] || '';
            document.getElementById('bh_csespec_60').value = bh.cse_spec["60"] || '';
            document.getElementById('bh_csespec_50').value = bh.cse_spec["50"] || '';
            document.getElementById('bh_csespec_below').value = bh.cse_spec["below"] || '';
        }

        // Render other dynamic branch inputs
        const bhOtherContainer = document.getElementById('bharathOtherContainer');
        bhOtherContainer.innerHTML = '';
        if (bh.other) {
            Object.keys(bh.other).forEach(branch => {
                const sanitizedId = 'bh_other_' + branch.replace(/[^a-zA-Z0-9]/g, '_');
                const div = document.createElement('div');
                div.className = 'form-group';
                div.innerHTML = `
                    <label>${branch} Flat Fee (₹)</label>
                    <input type="number" class="bh-other-input" data-branch="${branch}" id="${sanitizedId}" value="${bh.other[branch] || ''}" required>
                `;
                bhOtherContainer.appendChild(div);
            });
        }
    }

    // 2. MGR
    const mgr = activeGlobalFeeData.mgr;
    const mgrContainer = document.getElementById('mgrConfigContainer');
    mgrContainer.innerHTML = '';
    if (mgr) {
        Object.keys(mgr).forEach(course => {
            const block = document.createElement('div');
            block.className = 'fee-slab-group';
            const sanitizedCourseId = course.replace(/[^a-zA-Z0-9]/g, '_');
            
            const getMgrVal = (slotName, fieldName) => {
                return (mgr[course] && mgr[course][slotName] && mgr[course][slotName][fieldName] !== null && mgr[course][slotName][fieldName] !== undefined) 
                    ? mgr[course][slotName][fieldName] 
                    : '';
            };

            block.innerHTML = `
                <div class="fee-slab-title">${course} Configuration</div>
                <h4 style="margin-bottom: 0.5rem; font-size: 0.85rem; color: #60a5fa; text-transform: uppercase;">Slot A</h4>
                <div class="form-grid" style="margin-bottom: 1rem;">
                    <div class="form-group">
                        <label>Sem 1 Fee (₹)</label>
                        <input type="number" class="mgr-input" data-course="${course}" data-slot="Slot A" data-field="i" id="mgr_sem1_a_${sanitizedCourseId}" value="${getMgrVal("Slot A", "i")}">
                    </div>
                    <div class="form-group">
                        <label>Sem 2 Fee (₹)</label>
                        <input type="number" class="mgr-input" data-course="${course}" data-slot="Slot A" data-field="ii" id="mgr_sem2_a_${sanitizedCourseId}" value="${getMgrVal("Slot A", "ii")}">
                    </div>
                    <div class="form-group">
                        <label>Scholarship Sem 1 (₹)</label>
                        <input type="number" class="mgr-input" data-course="${course}" data-slot="Slot A" data-field="schlI" id="mgr_sch1_a_${sanitizedCourseId}" value="${getMgrVal("Slot A", "schlI")}">
                    </div>
                    <div class="form-group">
                        <label>Scholarship Sem 2 (₹)</label>
                        <input type="number" class="mgr-input" data-course="${course}" data-slot="Slot A" data-field="schlII" id="mgr_sch2_a_${sanitizedCourseId}" value="${getMgrVal("Slot A", "schlII")}">
                    </div>
                </div>
                <h4 style="margin-bottom: 0.5rem; font-size: 0.85rem; color: #34d399; text-transform: uppercase;">Slot B</h4>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Sem 1 Fee (₹)</label>
                        <input type="number" class="mgr-input" data-course="${course}" data-slot="Slot B" data-field="i" id="mgr_sem1_b_${sanitizedCourseId}" value="${getMgrVal("Slot B", "i")}">
                    </div>
                    <div class="form-group">
                        <label>Sem 2 Fee (₹)</label>
                        <input type="number" class="mgr-input" data-course="${course}" data-slot="Slot B" data-field="ii" id="mgr_sem2_b_${sanitizedCourseId}" value="${getMgrVal("Slot B", "ii")}">
                    </div>
                    <div class="form-group">
                        <label>Scholarship Sem 1 (₹)</label>
                        <input type="number" class="mgr-input" data-course="${course}" data-slot="Slot B" data-field="schlI" id="mgr_sch1_b_${sanitizedCourseId}" value="${getMgrVal("Slot B", "schlI")}">
                    </div>
                    <div class="form-group">
                        <label>Scholarship Sem 2 (₹)</label>
                        <input type="number" class="mgr-input" data-course="${course}" data-slot="Slot B" data-field="schlII" id="mgr_sch2_b_${sanitizedCourseId}" value="${getMgrVal("Slot B", "schlII")}">
                    </div>
                </div>
            `;
            mgrContainer.appendChild(block);
        });
    }

    // 3. GANPAT
    const gp = activeGlobalFeeData.ganpat;
    if (gp) {
        document.getElementById('gp_set1_75').value = gp.set1Yearly75 || '';
        document.getElementById('gp_set1_below').value = gp.set1YearlyBelow || '';
        document.getElementById('gp_set2_75').value = gp.set2Yearly75 || '';
        document.getElementById('gp_set2_below').value = gp.set2YearlyBelow || '';
    }

    // 4. DSU
    const dsu = activeGlobalFeeData.dsu;
    if (dsu) {
        document.getElementById('dsu_groupA_full').value = dsu.groupA_full || '';
        document.getElementById('dsu_groupA_90').value = dsu.groupA_90 || '';
        document.getElementById('dsu_groupA_80').value = dsu.groupA_80 || '';
        document.getElementById('dsu_groupA_70').value = dsu.groupA_70 || '';
        document.getElementById('dsu_groupA_below').value = dsu.groupA_below || '';
        document.getElementById('dsu_groupB').value = dsu.groupB_fee || '';
        document.getElementById('dsu_one_app').value = dsu.one_time_app || '';
        document.getElementById('dsu_one_adm').value = dsu.one_time_adm || '';
        document.getElementById('dsu_one_est').value = dsu.one_time_est || '';
        document.getElementById('dsu_one_reg').value = dsu.one_time_reg || '';
        document.getElementById('dsu_hostel_common').value = dsu.hostel_common || '';
        document.getElementById('dsu_hostel_common_ac').value = dsu.hostel_common_ac || '';
        document.getElementById('dsu_hostel_attached').value = dsu.hostel_attached || '';
        document.getElementById('dsu_hostel_attached_ac').value = dsu.hostel_attached_ac || '';
    }

    // 5. KALASALINGAM
    const ks = activeGlobalFeeData.kalasalingam;
    if (ks) {
        document.getElementById('ks_g1_t').value = ks.eng_group1_tuition || '';
        document.getElementById('ks_g1_m').value = ks.eng_group1_misc || '';
        document.getElementById('ks_g2_t').value = ks.eng_group2_tuition || '';
        document.getElementById('ks_g2_m').value = ks.eng_group2_misc || '';
        document.getElementById('ks_g3_t').value = ks.eng_group3_tuition || '';
        document.getElementById('ks_g3_m').value = ks.eng_group3_misc || '';
        document.getElementById('ks_barch_t').value = ks.barch_tuition || '';
        document.getElementById('ks_barch_m').value = ks.barch_misc || '';
        document.getElementById('ks_ship_t').value = ks.ship_tuition || '';
        document.getElementById('ks_ship_m').value = ks.ship_misc || '';
        document.getElementById('ks_nursing_t').value = ks.nursing_tuition || '';
        document.getElementById('ks_nursing_m').value = ks.nursing_misc || '';
        document.getElementById('ks_physio_t').value = ks.physio_tuition || '';
        document.getElementById('ks_physio_m').value = ks.physio_misc || '';
        document.getElementById('ks_allied1_3_t').value = ks.allied_y1_3_tuition || '';
        document.getElementById('ks_allied4_t').value = ks.allied_y4_tuition || '';
        document.getElementById('ks_allied_m').value = ks.allied_misc || '';
        document.getElementById('ks_agri_t').value = ks.agri_tuition || '';
        document.getElementById('ks_agri_m').value = ks.agri_misc || '';
        document.getElementById('ks_law5_t').value = ks.law_5yr_tuition || '';
        document.getElementById('ks_law5_m').value = ks.law_5yr_misc || '';
        document.getElementById('ks_law3_t').value = ks.law_3yr_tuition || '';
        document.getElementById('ks_law3_m').value = ks.law_3yr_misc || '';
        document.getElementById('ks_forensic_ug_t').value = ks.forensic_ug_tuition || '';
        document.getElementById('ks_forensic_ug_m').value = ks.forensic_ug_misc || '';
        document.getElementById('ks_forensic_pg_t').value = ks.forensic_pg_tuition || '';
        document.getElementById('ks_forensic_pg_m').value = ks.forensic_pg_misc || '';
        document.getElementById('ks_arts1_t').value = ks.arts_group1_tuition || '';
        document.getElementById('ks_arts1_m').value = ks.arts_group1_misc || '';
        document.getElementById('ks_arts2_t').value = ks.arts_group2_tuition || '';
        document.getElementById('ks_arts2_m').value = ks.arts_group2_misc || '';
        document.getElementById('ks_viscom_t').value = ks.viscom_tuition || '';
        document.getElementById('ks_viscom_m').value = ks.viscom_misc || '';
        document.getElementById('ks_arts3_t').value = ks.arts_group3_tuition || '';
        document.getElementById('ks_arts3_m').value = ks.arts_group3_misc || '';
        document.getElementById('ks_catering_t').value = ks.catering_tuition || '';
        document.getElementById('ks_catering_kit').value = ks.catering_uniform || '';
        document.getElementById('ks_catering_m').value = ks.catering_misc || '';
        document.getElementById('ks_mtech_t').value = ks.mtech_tuition || '';
        document.getElementById('ks_mtech_m').value = ks.mtech_misc || '';
        document.getElementById('ks_mbamca_t').value = ks.mba_mca_tuition || '';
        document.getElementById('ks_mbamca_m').value = ks.mba_mca_misc || '';
        document.getElementById('ks_pgarts_t').value = ks.pg_arts_tuition || '';
        document.getElementById('ks_pgarts_m').value = ks.pg_arts_misc || '';
        document.getElementById('ks_msc_csds_t').value = ks.msc_cs_ds_tuition || '';
        document.getElementById('ks_msc_csds_m').value = ks.msc_cs_ds_misc || '';
        document.getElementById('ks_bed_t').value = ks.bed_ship_tuition || '';
        document.getElementById('ks_bed_m').value = ks.bed_ship_misc || '';
        document.getElementById('ks_aero_t').value = ks.aero_aviation_tuition || '';
        document.getElementById('ks_aero_m').value = ks.aero_aviation_misc || '';
        document.getElementById('ks_bba_t').value = ks.bba_aviation_tuition || '';
        document.getElementById('ks_bba_m').value = ks.bba_aviation_misc || '';
        document.getElementById('ks_mba_av_t').value = ks.mba_aviation_tuition || '';
        document.getElementById('ks_mba_av_m').value = ks.mba_aviation_misc || '';
        document.getElementById('ks_app_processing').value = ks.app_domestic || '';
    }
}

// --- Save Fee Configurations Handler ---
function saveFeeConfigs(e) {
    e.preventDefault();
    
    // Build fresh configs from inputs
    // 1. BHARATH
    const bh = activeGlobalFeeData.bharath || {};
    bh.cse = {
        "90": parseInt(document.getElementById('bh_cse_90').value),
        "70": parseInt(document.getElementById('bh_cse_70').value),
        "60": parseInt(document.getElementById('bh_cse_60').value),
        "50": parseInt(document.getElementById('bh_cse_50').value),
        "below": parseInt(document.getElementById('bh_cse_below').value)
    };
    bh.cse_spec = {
        "90": parseInt(document.getElementById('bh_csespec_90').value),
        "70": parseInt(document.getElementById('bh_csespec_70').value),
        "60": parseInt(document.getElementById('bh_csespec_60').value),
        "50": parseInt(document.getElementById('bh_csespec_50').value),
        "below": parseInt(document.getElementById('bh_csespec_below').value)
    };
    // Other dynamic programs
    bh.other = {};
    document.querySelectorAll('.bh-other-input').forEach(input => {
        const branch = input.dataset.branch;
        bh.other[branch] = parseInt(input.value);
    });

    // 2. MGR
    const mgr = activeGlobalFeeData.mgr || {};
    document.querySelectorAll('.mgr-input').forEach(input => {
        const course = input.dataset.course;
        const slot = input.dataset.slot;
        const field = input.dataset.field;
        const val = input.value !== "" ? parseInt(input.value) : null;
        
        if (!mgr[course]) mgr[course] = { "Slot A": {}, "Slot B": {} };
        mgr[course][slot][field] = val;
    });

    // 3. GANPAT
    const gp = activeGlobalFeeData.ganpat || {};
    gp.set1Yearly75 = parseInt(document.getElementById('gp_set1_75').value);
    gp.set1YearlyBelow = parseInt(document.getElementById('gp_set1_below').value);
    gp.set2Yearly75 = parseInt(document.getElementById('gp_set2_75').value);
    gp.set2YearlyBelow = parseInt(document.getElementById('gp_set2_below').value);

    // 4. DSU
    const dsu = activeGlobalFeeData.dsu || {};
    dsu.groupA_full = parseInt(document.getElementById('dsu_groupA_full').value);
    dsu.groupA_90 = parseInt(document.getElementById('dsu_groupA_90').value);
    dsu.groupA_80 = parseInt(document.getElementById('dsu_groupA_80').value);
    dsu.groupA_70 = parseInt(document.getElementById('dsu_groupA_70').value);
    dsu.groupA_below = parseInt(document.getElementById('dsu_groupA_below').value);
    dsu.groupB_fee = parseInt(document.getElementById('dsu_groupB').value);
    dsu.one_time_app = parseInt(document.getElementById('dsu_one_app').value);
    dsu.one_time_adm = parseInt(document.getElementById('dsu_one_adm').value);
    dsu.one_time_est = parseInt(document.getElementById('dsu_one_est').value);
    dsu.one_time_reg = parseInt(document.getElementById('dsu_one_reg').value);
    dsu.hostel_common = parseInt(document.getElementById('dsu_hostel_common').value);
    dsu.hostel_common_ac = parseInt(document.getElementById('dsu_hostel_common_ac').value);
    dsu.hostel_attached = parseInt(document.getElementById('dsu_hostel_attached').value);
    dsu.hostel_attached_ac = parseInt(document.getElementById('dsu_hostel_attached_ac').value);

    // 5. KALASALINGAM
    const ks = activeGlobalFeeData.kalasalingam || {};
    ks.eng_group1_tuition = parseInt(document.getElementById('ks_g1_t').value);
    ks.eng_group1_misc = parseInt(document.getElementById('ks_g1_m').value);
    ks.eng_group2_tuition = parseInt(document.getElementById('ks_g2_t').value);
    ks.eng_group2_misc = parseInt(document.getElementById('ks_g2_m').value);
    ks.eng_group3_tuition = parseInt(document.getElementById('ks_g3_t').value);
    ks.eng_group3_misc = parseInt(document.getElementById('ks_g3_m').value);
    ks.barch_tuition = parseInt(document.getElementById('ks_barch_t').value);
    ks.barch_misc = parseInt(document.getElementById('ks_barch_m').value);
    ks.ship_tuition = parseInt(document.getElementById('ks_ship_t').value);
    ks.ship_misc = parseInt(document.getElementById('ks_ship_m').value);
    ks.nursing_tuition = parseInt(document.getElementById('ks_nursing_t').value);
    ks.nursing_misc = parseInt(document.getElementById('ks_nursing_m').value);
    ks.physio_tuition = parseInt(document.getElementById('ks_physio_t').value);
    ks.physio_misc = parseInt(document.getElementById('ks_physio_m').value);
    ks.allied_y1_3_tuition = parseInt(document.getElementById('ks_allied1_3_t').value);
    ks.allied_y4_tuition = parseInt(document.getElementById('ks_allied4_t').value);
    ks.allied_misc = parseInt(document.getElementById('ks_allied_m').value);
    ks.agri_tuition = parseInt(document.getElementById('ks_agri_t').value);
    ks.agri_misc = parseInt(document.getElementById('ks_agri_m').value);
    ks.law_5yr_tuition = parseInt(document.getElementById('ks_law5_t').value);
    ks.law_5yr_misc = parseInt(document.getElementById('ks_law5_m').value);
    ks.law_3yr_tuition = parseInt(document.getElementById('ks_law3_t').value);
    ks.law_3yr_misc = parseInt(document.getElementById('ks_law3_m').value);
    ks.forensic_ug_tuition = parseInt(document.getElementById('ks_forensic_ug_t').value);
    ks.forensic_ug_misc = parseInt(document.getElementById('ks_forensic_ug_m').value);
    ks.forensic_pg_tuition = parseInt(document.getElementById('ks_forensic_pg_t').value);
    ks.forensic_pg_misc = parseInt(document.getElementById('ks_forensic_pg_m').value);
    ks.arts_group1_tuition = parseInt(document.getElementById('ks_arts1_t').value);
    ks.arts_group1_misc = parseInt(document.getElementById('ks_arts1_m').value);
    ks.arts_group2_tuition = parseInt(document.getElementById('ks_arts2_t').value);
    ks.arts_group2_misc = parseInt(document.getElementById('ks_arts2_m').value);
    ks.viscom_tuition = parseInt(document.getElementById('ks_viscom_t').value);
    ks.viscom_misc = parseInt(document.getElementById('ks_viscom_m').value);
    ks.arts_group3_tuition = parseInt(document.getElementById('ks_arts3_t').value);
    ks.arts_group3_misc = parseInt(document.getElementById('ks_arts3_m').value);
    ks.catering_tuition = parseInt(document.getElementById('ks_catering_t').value);
    ks.catering_uniform = parseInt(document.getElementById('ks_catering_kit').value);
    ks.catering_misc = parseInt(document.getElementById('ks_catering_m').value);
    ks.mtech_tuition = parseInt(document.getElementById('ks_mtech_t').value);
    ks.mtech_misc = parseInt(document.getElementById('ks_mtech_m').value);
    ks.mba_mca_tuition = parseInt(document.getElementById('ks_mbamca_t').value);
    ks.mba_mca_misc = parseInt(document.getElementById('ks_mbamca_m').value);
    ks.pg_arts_tuition = parseInt(document.getElementById('ks_pgarts_t').value);
    ks.pg_arts_misc = parseInt(document.getElementById('ks_pgarts_m').value);
    ks.msc_cs_ds_tuition = parseInt(document.getElementById('ks_msc_csds_t').value);
    ks.msc_cs_ds_misc = parseInt(document.getElementById('ks_msc_csds_m').value);
    ks.bed_ship_tuition = parseInt(document.getElementById('ks_bed_t').value);
    ks.bed_ship_misc = parseInt(document.getElementById('ks_bed_m').value);
    ks.aero_aviation_tuition = parseInt(document.getElementById('ks_aero_t').value);
    ks.aero_aviation_misc = parseInt(document.getElementById('ks_aero_m').value);
    ks.bba_aviation_tuition = parseInt(document.getElementById('ks_bba_t').value);
    ks.bba_aviation_misc = parseInt(document.getElementById('ks_bba_m').value);
    ks.mba_aviation_tuition = parseInt(document.getElementById('ks_mba_av_t').value);
    ks.mba_aviation_misc = parseInt(document.getElementById('ks_mba_av_m').value);
    ks.app_domestic = parseInt(document.getElementById('ks_app_processing').value);

    // Sync structural wrapper references
    activeGlobalFeeData.bharath = bh;
    activeGlobalFeeData.mgr = mgr;
    activeGlobalFeeData.ganpat = gp;
    activeGlobalFeeData.dsu = dsu;
    activeGlobalFeeData.kalasalingam = ks;

    // Upload configs to Firebase
    database.ref('adminFeeData').set(activeGlobalFeeData)
        .then(() => {
            showToast('Fee configurations saved successfully.', 'success');
        })
        .catch((err) => {
            showToast('Failed to save configurations: ' + err.message, 'error');
        });
}

function resetToDefaults() {
    if (confirm('Are you sure you want to revert ALL fee configurations back to their original codebase default parameters? This will overwrite the live database entries.')) {
        activeGlobalFeeData = JSON.parse(JSON.stringify(defaultGlobalFeeData));
        database.ref('adminFeeData').set(activeGlobalFeeData)
            .then(() => {
                showToast('Restored all values to default.', 'success');
                populateFeeConfigInputs();
            })
            .catch((err) => {
                showToast('Failed to restore values: ' + err.message, 'error');
            });
    }
}

// --- Global Toast Notification Alert Helper ---
function showToast(message, type = 'info') {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    toastMsg.textContent = message;
    
    // Remove previous classes
    toast.className = 'toast';
    
    if (type === 'success') {
        toast.classList.add('success');
        toastIcon.className = 'fa-solid fa-circle-check';
    } else if (type === 'error') {
        toast.classList.add('error');
        toastIcon.className = 'fa-solid fa-triangle-exclamation';
    } else {
        toastIcon.className = 'fa-solid fa-circle-info';
    }

    // Render toast visible
    toast.classList.add('show');
    
    // Auto hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}
