let jobs = JSON.parse(localStorage.getItem('jb_jobs')) || [
    { id: 1, title: 'Frontend Developer', company: 'TechCorp', type: 'Full-time', desc: 'Build modern UI components using JavaScript.' },
    { id: 2, title: 'Backend Engineer', company: 'DataSys', type: 'Remote', desc: 'Develop REST APIs and manage databases.' }
];

let applications = JSON.parse(localStorage.getItem('jb_apps')) || [];
let selectedJobId = null;

// DOM Elements
const jobsSection = document.getElementById('jobs-section');
const postSection = document.getElementById('post-section');
const dashboardSection = document.getElementById('dashboard-section');
const jobList = document.getElementById('job-list');
const searchInput = document.getElementById('search-input');
const typeFilter = document.getElementById('type-filter');

// Navigation
document.getElementById('nav-jobs').addEventListener('click', () => showSection('jobs'));
document.getElementById('nav-post').addEventListener('click', () => showSection('post'));
document.getElementById('nav-dashboard').addEventListener('click', () => showSection('dashboard'));

function showSection(name) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    jobsSection.classList.add('hidden');
    postSection.classList.add('hidden');
    dashboardSection.classList.add('hidden');

    if (name === 'jobs') {
        jobsSection.classList.remove('hidden');
        document.getElementById('nav-jobs').classList.add('active');
        renderJobs();
    } else if (name === 'post') {
        postSection.classList.remove('hidden');
        document.getElementById('nav-post').classList.add('active');
    } else {
        dashboardSection.classList.remove('hidden');
        document.getElementById('nav-dashboard').classList.add('active');
        renderApplications();
    }
}

// Render Jobs
function renderJobs() {
    const search = searchInput.value.toLowerCase();
    const type = typeFilter.value;

    const filtered = jobs.filter(j => 
        (j.title.toLowerCase().includes(search) || j.company.toLowerCase().includes(search)) &&
        (type === 'All' || j.type === type)
    );

    jobList.innerHTML = filtered.length ? '' : '<p>No jobs found.</p>';
    filtered.forEach(j => {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div>
                <h3>${j.title}</h3>
                <p class="company-name">${j.company} • <span class="job-badge">${j.type}</span></p>
            </div>
            <button class="btn-primary" onclick="openJobModal(${j.id})">View Details</button>
        `;
        jobList.appendChild(card);
    });
}

searchInput.addEventListener('input', renderJobs);
typeFilter.addEventListener('change', renderJobs);

// Modal & Apply Logic
const modal = document.getElementById('job-modal');
document.getElementById('close-modal').onclick = () => modal.classList.add('hidden');

function openJobModal(id) {
    const job = jobs.find(j => j.id === id);
    selectedJobId = id;
    document.getElementById('modal-title').textContent = job.title;
    document.getElementById('modal-company').textContent = job.company;
    document.getElementById('modal-type').textContent = job.type;
    document.getElementById('modal-desc').textContent = job.desc;
    modal.classList.remove('hidden');
}

document.getElementById('apply-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const job = jobs.find(j => j.id === selectedJobId);
    applications.push({
        id: Date.now(),
        jobTitle: job.title,
        company: job.company,
        name: document.getElementById('applicant-name').value,
        resume: document.getElementById('applicant-resume').value,
        status: 'Submitted'
    });
    localStorage.setItem('jb_apps', JSON.stringify(applications));
    modal.classList.add('hidden');
    alert('Application Submitted Successfully!');
    e.target.reset();
});

// Post Job Logic
document.getElementById('post-job-form').addEventListener('submit', (e) => {
    e.preventDefault();
    jobs.push({
        id: Date.now(),
        title: document.getElementById('job-title-input').value,
        company: document.getElementById('company-input').value,
        type: document.getElementById('job-type-input').value,
        desc: document.getElementById('job-desc-input').value
    });
    localStorage.setItem('jb_jobs', JSON.stringify(jobs));
    e.target.reset();
    showSection('jobs');
});

// Render Applications
function renderApplications() {
    const list = document.getElementById('applications-list');
    list.innerHTML = applications.length ? '' : '<p>No applications submitted yet.</p>';
    applications.forEach(a => {
        const item = document.createElement('div');
        item.className = 'job-card';
        item.innerHTML = `
            <div>
                <h3>${a.jobTitle}</h3>
                <p>${a.company} | Applicant: <strong>${a.name}</strong></p>
            </div>
            <span class="job-badge">${a.status}</span>
        `;
        list.appendChild(item);
    });
}

// Initial Call
renderJobs();