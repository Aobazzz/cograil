const items = [
  {
    id: "WORK-127",
    title: "Bind Gerrit patch review to artifact changes",
    type: "Review",
    owner: "Maya Chen",
    actor: "agent:coda",
    state: "In review",
    stateClass: "review",
    risk: "High",
    riskClass: "risk-high",
    gate: "3/5",
    score: 61,
    change: "CHG-044",
    attention: "Maya",
    updated: "12m",
    view: ["all", "reviews"],
    requirements: [
      ["Owner approval", "Waiting", "wait"],
      ["Patch-set diff rendered", "Passed", "pass"],
      ["Context provenance", "Passed", "pass"],
      ["Security review", "Waiting", "wait"],
      ["Protected target", "Blocked", "fail"]
    ],
    timeline: [
      ["Context pack compiled", "14:08", "done"],
      ["Agent produced patch set 3", "14:19", "done"],
      ["Review opened", "14:24", "done"],
      ["Human gate requested", "14:31", "current"]
    ],
    patches: [
      ["Patch set 3", "agent:coda, validation green"],
      ["Patch set 2", "Maya requested context trace"],
      ["Patch set 1", "initial review mapping"]
    ]
  },
  {
    id: "WORK-131",
    title: "Generate context-pack trust tiers for imported Redmine issues",
    type: "Context",
    owner: "agent:forge",
    actor: "Forge Squad",
    state: "Running",
    stateClass: "running",
    risk: "Medium",
    riskClass: "risk-medium",
    gate: "2/4",
    score: 48,
    change: "RUN-219",
    attention: "Forge",
    updated: "18m",
    view: ["all", "agents"],
    requirements: [
      ["Resource pointers", "Passed", "pass"],
      ["PII redaction", "Running", "wait"],
      ["Prompt injection scan", "Waiting", "wait"],
      ["Reviewer sample", "Waiting", "wait"]
    ],
    timeline: [
      ["Issue import read", "13:52", "done"],
      ["Resource graph built", "13:58", "done"],
      ["Trust scoring", "14:12", "current"]
    ],
    patches: [
      ["Run attempt 2", "retry after missing wiki source"],
      ["Run attempt 1", "blocked by stale file pointer"]
    ]
  },
  {
    id: "WORK-146",
    title: "Approve agent-authored release note package",
    type: "Release",
    owner: "Noah Patel",
    actor: "agent:scribe",
    state: "Blocked",
    stateClass: "blocked",
    risk: "High",
    riskClass: "risk-high",
    gate: "4/6",
    score: 67,
    change: "REL-012",
    attention: "Noah",
    updated: "27m",
    view: ["all", "blocked", "reviews"],
    requirements: [
      ["Docs approval", "Passed", "pass"],
      ["Pipeline evidence", "Passed", "pass"],
      ["Customer-visible copy", "Waiting", "wait"],
      ["Freeze window", "Blocked", "fail"],
      ["Rollback link", "Passed", "pass"],
      ["Security finding", "Waiting", "wait"]
    ],
    timeline: [
      ["Release bundle assembled", "12:41", "done"],
      ["Preview rendered", "12:44", "done"],
      ["Freeze conflict found", "12:50", "current"]
    ],
    patches: [
      ["Package candidate 4", "blocked by freeze window"],
      ["Package candidate 3", "copy edits accepted"],
      ["Package candidate 2", "security appendix added"]
    ]
  },
  {
    id: "WORK-153",
    title: "Promote repeated review feedback into skill evolution proposal",
    type: "Evolution",
    owner: "Iris Morgan",
    actor: "agent:scribe",
    state: "Ready",
    stateClass: "ready",
    risk: "Medium",
    riskClass: "risk-medium",
    gate: "5/5",
    score: 100,
    change: "EVO-008",
    attention: "Iris",
    updated: "41m",
    view: ["all", "reviews"],
    requirements: [
      ["Failure examples", "Passed", "pass"],
      ["Replay fixtures", "Passed", "pass"],
      ["Skill lint", "Passed", "pass"],
      ["Owner approval", "Passed", "pass"],
      ["Canary plan", "Passed", "pass"]
    ],
    timeline: [
      ["Feedback clustered", "11:37", "done"],
      ["Skill proposal drafted", "11:45", "done"],
      ["Regression replay passed", "12:10", "done"]
    ],
    patches: [
      ["Proposal 2", "approved for canary"],
      ["Proposal 1", "requested narrower examples"]
    ]
  },
  {
    id: "WORK-162",
    title: "Investigate GitLab pipeline evidence mismatch",
    type: "Pipeline",
    owner: "agent:scope",
    actor: "Scope Runtime",
    state: "Blocked",
    stateClass: "blocked",
    risk: "Low",
    riskClass: "risk-low",
    gate: "1/3",
    score: 34,
    change: "PIPE-331",
    attention: "Ops",
    updated: "1h",
    view: ["all", "blocked", "agents"],
    requirements: [
      ["External object synced", "Passed", "pass"],
      ["Job log fetched", "Blocked", "fail"],
      ["Human retry approval", "Waiting", "wait"]
    ],
    timeline: [
      ["Pipeline mirror checked", "10:58", "done"],
      ["External log request failed", "11:03", "current"]
    ],
    patches: [
      ["Evidence pull 1", "GitLab token scope denied"]
    ]
  }
];

const queueTable = document.querySelector("#queueTable");
const detailContent = document.querySelector("#detailContent");
const searchInput = document.querySelector("#searchInput");
const commandButton = document.querySelector("#commandButton");
const commandOverlay = document.querySelector("#commandOverlay");
const commandInput = document.querySelector("#commandInput");
const toast = document.querySelector("#toast");

let activeView = "all";
let selectedId = items[0].id;
let toastTimer;

function matchesItem(item, query) {
  if (!query) return true;
  const text = [
    item.id,
    item.title,
    item.type,
    item.owner,
    item.actor,
    item.state,
    item.risk,
    item.change,
    item.attention
  ].join(" ").toLowerCase();
  return text.includes(query.toLowerCase());
}

function visibleItems() {
  const query = searchInput.value.trim();
  return items.filter((item) => item.view.includes(activeView) && matchesItem(item, query));
}

function renderQueue() {
  const rows = visibleItems();

  if (!rows.length) {
    queueTable.innerHTML = '<div class="work-row empty-row"><div class="work-title"><strong>No matching work</strong><span class="work-meta">Adjust search or view</span></div></div>';
    return;
  }

  if (!rows.some((item) => item.id === selectedId)) {
    selectedId = rows[0].id;
  }

  queueTable.innerHTML = rows.map((item) => `
    <button class="work-row ${item.id === selectedId ? "active" : ""}" type="button" data-id="${item.id}">
      <span class="work-id">${item.id}</span>
      <span class="work-title">
        <strong>${item.title}</strong>
        <span class="work-meta">${item.type} &middot; ${item.change} &middot; updated ${item.updated}</span>
      </span>
      <span class="owner-stack">
        <strong>${item.owner}</strong>
        <span>${item.actor}</span>
      </span>
      <span class="status-chip ${item.stateClass}">${item.state}</span>
      <span class="risk-chip ${item.riskClass}">${item.risk}</span>
      <span class="gate-meter">
        <span class="meter-track"><span class="meter-fill" style="--score: ${item.score}%"></span></span>
        <span>${item.gate} gates</span>
      </span>
    </button>
  `).join("");

  for (const row of queueTable.querySelectorAll(".work-row[data-id]")) {
    row.addEventListener("click", () => {
      selectedId = row.dataset.id;
      renderQueue();
      renderDetail();
    });
  }
}

function renderDetail() {
  const item = items.find((entry) => entry.id === selectedId) || visibleItems()[0] || items[0];

  detailContent.innerHTML = `
    <div class="detail-head">
      <div class="detail-id">
        <span>${item.id} / ${item.change}</span>
        <span>${item.updated}</span>
      </div>
      <h2>${item.title}</h2>
      <div class="detail-actions">
        <button class="row-action approve" type="button" data-action="Approve ${item.change}">Approve</button>
        <button class="row-action change" type="button" data-action="Request changes on ${item.change}">Request changes</button>
      </div>
    </div>

    <section class="detail-section">
      <h3>Control State</h3>
      <div class="kv-grid">
        <div class="kv"><span>Owner</span><strong>${item.owner}</strong></div>
        <div class="kv"><span>Actor</span><strong>${item.actor}</strong></div>
        <div class="kv"><span>Attention</span><strong>${item.attention}</strong></div>
        <div class="kv"><span>Risk</span><strong>${item.risk}</strong></div>
      </div>
    </section>

    <section class="detail-section">
      <h3>Submit Requirements</h3>
      ${item.requirements.map(([title, state, tone]) => `
        <div class="requirement">
          <span class="req-dot ${tone}"></span>
          <strong class="req-title">${title}</strong>
          <span class="req-state">${state}</span>
        </div>
      `).join("")}
    </section>

    <section class="detail-section">
      <h3>Task Run Trail</h3>
      ${item.timeline.map(([title, time, state]) => `
        <div class="timeline-item ${state}">
          <strong>${title}</strong>
          <span class="timeline-time">${time}</span>
        </div>
      `).join("")}
    </section>

    <section class="detail-section">
      <h3>Patch Sets</h3>
      ${item.patches.map(([name, meta]) => `
        <div class="patch">
          <strong>${name}</strong>
          <span>${meta}</span>
        </div>
      `).join("")}
    </section>
  `;

  for (const button of detailContent.querySelectorAll("[data-action]")) {
    button.addEventListener("click", () => showToast(button.dataset.action));
  }
}

function setView(view) {
  activeView = view;
  for (const control of document.querySelectorAll("[data-view]")) {
    control.classList.toggle("active", control.dataset.view === view);
  }
  renderQueue();
  renderDetail();
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function openCommandPalette() {
  commandOverlay.hidden = false;
  commandInput.value = "";
  window.setTimeout(() => commandInput.focus(), 0);
}

function closeCommandPalette() {
  commandOverlay.hidden = true;
}

for (const control of document.querySelectorAll("[data-view]")) {
  control.addEventListener("click", () => setView(control.dataset.view));
}

searchInput.addEventListener("input", () => {
  renderQueue();
  renderDetail();
});

commandButton.addEventListener("click", openCommandPalette);

document.querySelector("#newWorkButton").addEventListener("click", () => showToast("Create work item"));

commandOverlay.addEventListener("click", (event) => {
  if (event.target === commandOverlay) closeCommandPalette();
});

for (const command of document.querySelectorAll("[data-command]")) {
  command.addEventListener("click", () => {
    showToast(command.dataset.command);
    closeCommandPalette();
  });
}

document.addEventListener("keydown", (event) => {
  const isCommandKey = event.ctrlKey || event.metaKey;
  if (isCommandKey && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openCommandPalette();
  }

  if (event.key === "Escape" && !commandOverlay.hidden) {
    closeCommandPalette();
  }
});

renderQueue();
renderDetail();
