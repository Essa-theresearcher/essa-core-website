(function () {
  function setText(selector, text) {
    var el = document.querySelector(selector);
    if (el) el.textContent = text;
  }
  function setHtml(selector, html) {
    var el = document.querySelector(selector);
    if (el) el.innerHTML = html;
  }
  function setInputPlaceholder(selector, placeholder) {
    var el = document.querySelector(selector);
    if (el) el.placeholder = placeholder;
  }
  function setInputValue(selector, value) {
    var el = document.querySelector(selector);
    if (el) el.value = value;
  }
  function setModalTitle(id, title) {
    var wrap = document.querySelector("#" + id + " .modal-title");
    if (!wrap) return;
    var closeBtn = wrap.querySelector(".modal-close");
    wrap.innerHTML = title + (closeBtn ? " " + closeBtn.outerHTML : "");
    var btn = wrap.querySelector(".modal-close");
    if (btn) btn.setAttribute("onclick", "closeModal('" + id + "')");
  }
  function replaceSearchData(entries) {
    if (typeof window.doSearch !== "function") return;
    window.doSearch = function (val) {
      var results = document.getElementById("search-results");
      if (!val.trim()) {
        results.innerHTML = '<div style="text-align:center;color:var(--muted);padding:40px;font-size:13px">Type to search across all records</div>';
        return;
      }
      var matches = entries.filter(function (d) {
        return (d.ref + d.detail + d.type).toLowerCase().includes(val.toLowerCase());
      });
      if (!matches.length) {
        results.innerHTML = '<div style="text-align:center;color:var(--muted);padding:40px;font-size:13px">No results found</div>';
        return;
      }
      results.innerHTML = '<div class="table-wrap"><table><thead><tr><th>TYPE</th><th>REFERENCE</th><th>DETAIL</th></tr></thead><tbody>' +
        matches.map(function (m) {
          return '<tr><td><span class="badge badge-blue">' + m.type + '</span></td><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">' + m.ref + '</td><td style="color:var(--muted);font-size:12px">' + m.detail + "</td></tr>";
        }).join("") + "</tbody></table></div>";
    };
  }

  var file = location.pathname.split("/").pop();
  var key = file.replace("mvp-", "").replace(".html", "").replace(/-/g, "_");
  var configs = {
    workshop_garage: { name: "Workshop Pro", sub: "MANAGEMENT SYSTEM", open: "Open Workshop Pro", org: "Juma Motors", role: "OWNER" },
    school_management: { name: "Management System", sub: "MVP DEMO", open: "Open MVP", org: "Organization", role: "ADMIN" },
    construction_inventory: { name: "BuildStock", sub: "CONSTRUCTION INVENTORY MVP", open: "Open Inventory MVP", org: "Nexus Build Ltd", role: "OPERATIONS" },
    hospital_management: { name: "MediFlow", sub: "HOSPITAL MANAGEMENT MVP", open: "Open Hospital MVP", org: "St. Mary Hospital", role: "ADMIN" },
    hr_payroll: { name: "PeoplePay", sub: "HR & PAYROLL MVP", open: "Open HR MVP", org: "BluePeak Group", role: "HR ADMIN" },
    agri_supply_chain: { name: "AgriChain", sub: "AGRI SUPPLY CHAIN MVP", open: "Open Agri MVP", org: "GreenFields Coop", role: "COOP ADMIN" },
    property_management: { name: "PropDesk", sub: "PROPERTY MANAGEMENT MVP", open: "Open Property MVP", org: "UrbanNest Properties", role: "PROPERTY ADMIN" },
    booking_platform: { name: "BookFlow", sub: "BOOKING PLATFORM MVP", open: "Open Booking MVP", org: "SwiftReserve", role: "BOOKING ADMIN" },
    crm: { name: "ClientPulse", sub: "CRM MVP", open: "Open CRM MVP", org: "GrowthDesk", role: "SALES ADMIN" },
    analytics: { name: "MetricHub", sub: "ANALYTICS MVP", open: "Open Analytics MVP", org: "InsightWorks", role: "DATA ADMIN" },
    team_collaboration: { name: "TeamSync", sub: "TEAM COLLABORATION MVP", open: "Open Team MVP", org: "SprintForge", role: "TEAM ADMIN" }
  };
  var cfg = configs[key] || configs.workshop_garage;

  function relabelNavigation(labels) {
    var spans = document.querySelectorAll(".nav-item span");
    spans.forEach(function (s, i) { if (labels[i]) s.textContent = labels[i]; });
    document.querySelectorAll(".nav-item").forEach(function (item) {
      item.addEventListener("click", function () {
        var title = item.querySelector("span");
        if (title) setText("#page-title", title.textContent);
      });
    });
  }
  function relabelNavSections(labels) {
    var sectionLabels = document.querySelectorAll(".nav-label");
    sectionLabels.forEach(function (s, i) {
      if (labels[i]) s.textContent = labels[i];
    });
  }

  function updateCommonUi() {
    document.title = cfg.name + " MVP";
    setText(".logo-text", cfg.name);
    setText(".logo-sub", cfg.sub);
    setText(".otv-meta", cfg.sub + " · CONFIDENTIAL DEMO");
    setText(".otv-p", "This " + cfg.name + " demo is private. It opens one-time for 10 minutes and locks permanently when you leave.");
    setText("#otv-open-btn", cfg.open);
    setText(".user-name", cfg.org);
    setText(".user-role", cfg.role);
    setText("#page-title", "Overview");
  }

  function patchDomainSections(domain) {
    setHtml("#dashboard-jobs", domain.dashboardRows);
    setHtml("#sec-service-mgmt .table-wrap tbody", domain.serviceRows);
    setHtml("#sec-pending-jobs .table-wrap tbody", domain.pendingRows);
    setHtml("#sec-cashiering .table-wrap tbody", domain.cashRows);
    setHtml("#sec-direct-sales .table-wrap tbody", domain.directRows);
    setHtml("#sec-quotations .table-wrap tbody", domain.quoteRows);
    setHtml("#sec-stock .table-wrap tbody", domain.stockRows);
    setHtml("#sec-imports .table-wrap tbody", domain.importRows);
    setHtml("#sec-vehicles .card table tbody", domain.vehicleRows);
    setHtml("#sec-customers .table-wrap tbody", domain.customerRows);
    setHtml("#sec-accounts .table-wrap tbody", domain.accountRows);
    setHtml("#sec-reports .card .card-title", domain.reportTitle);
    setText("#page-title", (domain.nav && domain.nav[0]) || "Overview");
    replaceSearchData(domain.searchData);
    patchSharedWorkshopLeftovers(domain);
    if (domain.modalPatch) domain.modalPatch();
  }

  function applyLightTheme() {
    var root = document.documentElement;
    root.style.setProperty("--bg", "#F6F7F9");
    root.style.setProperty("--s1", "#FFFFFF");
    root.style.setProperty("--s2", "#F3F5F8");
    root.style.setProperty("--s3", "#E9EDF3");
    root.style.setProperty("--border", "rgba(24,39,75,0.10)");
    root.style.setProperty("--border2", "rgba(24,39,75,0.18)");
    root.style.setProperty("--accent", "#3563E9");
    root.style.setProperty("--accent2", "#E9573F");
    root.style.setProperty("--accent3", "#7C6FFF");
    root.style.setProperty("--text", "#111827");
    root.style.setProperty("--muted", "#5B6475");
    root.style.setProperty("--muted2", "#7D8796");
    root.style.setProperty("--green", "#0E9F6E");
    root.style.setProperty("--red", "#E9573F");
    root.style.setProperty("--blue", "#3563E9");
    root.style.setProperty("--yellow", "#D97706");
    document.body.style.background = "var(--bg)";
  }

  function patchSharedWorkshopLeftovers(domain) {
    if (domain.statsGridHtml) {
      setHtml("#sec-dashboard .stats-grid", domain.statsGridHtml);
    }
    if (domain.breakdownCardHtml) {
      setHtml("#sec-dashboard .grid-2 > div:nth-child(2)", domain.breakdownCardHtml);
    }
    if (domain.settingsServiceRows) {
      setHtml("#sec-settings .card:nth-child(2) .table-wrap tbody", domain.settingsServiceRows);
    }
    if (domain.reportPreviewHtml) {
      setHtml("#sec-reports .card:last-child", domain.reportPreviewHtml);
    }
    if (domain.jobServiceOptions) {
      setHtml("#job-modal .line-item-row:not(.line-item-header) select", domain.jobServiceOptions);
    }
  }

  var domainData = {
    school_management: {
      nav: ["School Overview", "Admissions", "Pending Students", "Fee Desk", "Walk-ins", "Fee Quotes", "Learning Materials", "Exam Imports", "School Transport", "Guardians", "Staff Accounts", "Finance", "Reports", "Search", "Settings"],
      navSections: ["ACADEMICS", "STUDENT SERVICES", "SCHOOL ADMIN"],
      statsGridHtml: '<div class="stat-card"><div class="stat-value up">KSh 155,400</div><div class="stat-label">Today\'s Collections</div><div class="stat-change up">↑ 9% vs yesterday</div></div><div class="stat-card"><div class="stat-value" style="color:var(--blue)">1,248</div><div class="stat-label">Students Present</div><div class="stat-change up">↑ 22 from yesterday</div></div><div class="stat-card"><div class="stat-value" style="color:var(--yellow)">87%</div><div class="stat-label">Attendance Rate</div><div class="stat-change down">⚠ Form 3 below target</div></div><div class="stat-card"><div class="stat-value up">KSh 1.32M</div><div class="stat-label">Month Net Balance</div><div class="stat-change up">↑ On track</div></div>',
      dashboardRows: '<tr><td>ADM-219</td><td>New Enrollment</td><td>Registrar</td><td><span class="badge badge-green">Completed</span></td><td style="font-family:\'DM Mono\',monospace">Form 2</td></tr><tr><td>EXM-84</td><td>Exam Upload</td><td>Exams Office</td><td><span class="badge badge-orange">Pending</span></td><td style="font-family:\'DM Mono\',monospace">Mid-Term</td></tr><tr><td>FEE-551</td><td>Fee Posting</td><td>Bursar</td><td><span class="badge badge-blue">Review</span></td><td style="font-family:\'DM Mono\',monospace">KSh 32,000</td></tr>',
      serviceRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#STD-001</td><td>03 May 2026</td><td>SJ-1023</td><td>Amani N.</td><td>Enrollment + Class Setup</td><td style="font-family:\'DM Mono\',monospace">Form 2</td><td>Registrar</td><td><span class="badge badge-green">Done</span></td><td><button class="btn btn-ghost btn-sm">View Profile</button></td></tr>',
      pendingRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#PEND-11</td><td>SJ-1028</td><td>Joy M.</td><td>Class Allocation</td><td>09:30 AM</td><td>Admin</td><td>Awaiting KCPE slip</td><td><button class="btn btn-primary btn-sm">Approve</button></td></tr>',
      cashRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#FEE-311</td><td>SJ-1022</td><td>Parent - Peter O.</td><td>Term 2 Fees</td><td style="font-family:\'DM Mono\',monospace">KSh 24,500</td><td><select style="background:var(--s2);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:4px 8px;font-size:12px;"><option>M-Pesa</option><option>Cash</option><option>Bank</option></select></td><td><button class="btn btn-primary btn-sm">Collect</button></td></tr>',
      directRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#PAY-12</td><td>03 May</td><td>Exam Fee</td><td>1</td><td style="font-family:\'DM Mono\',monospace">2,000</td><td style="font-family:\'DM Mono\',monospace">2,000</td><td>Walk-in Parent</td><td><span class="badge badge-green">M-Pesa</span></td></tr>',
      quoteRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#QF-03</td><td>03 May</td><td>Faith M.</td><td>SJ-1024</td><td>Term + Uniform</td><td style="font-family:\'DM Mono\',monospace">58,000</td><td><span class="badge badge-yellow">Sent</span></td><td><button class="btn btn-primary btn-sm">Convert</button></td></tr>',
      stockRows: '<tr><td>Math Textbooks G7</td><td>Books</td><td><div style="font-family:\'DM Mono\',monospace">124</div><div class="stock-bar"><div class="stock-fill" style="width:62%;background:var(--green)"></div></div></td><td style="font-family:\'DM Mono\',monospace">50</td><td style="font-family:\'DM Mono\',monospace">450</td><td style="font-family:\'DM Mono\',monospace">700</td><td style="font-family:\'DM Mono\',monospace;color:var(--green)">+35%</td><td><span class="badge badge-green">OK</span></td></tr>',
      importRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#INT-06</td><td>Bookline Distributors</td><td style="font-family:\'DM Mono\',monospace">900 units</td><td style="font-family:\'DM Mono\',monospace">KSh 390,000</td><td style="font-family:\'DM Mono\',monospace">KSh 8,000</td><td style="font-family:\'DM Mono\',monospace">KSh 3,000</td><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">KSh 445/unit</td><td><span class="badge badge-green">Received</span></td></tr>',
      vehicleRows: '<tr><td>03 May</td><td>🚌 Bus KCB 223A</td><td>West Route</td><td style="font-family:\'DM Mono\',monospace">5,200</td><td style="font-family:\'DM Mono\',monospace">38 students</td><td style="font-family:\'DM Mono\',monospace">14,400</td><td style="font-family:\'DM Mono\',monospace;color:var(--green)">+9,200</td></tr>',
      customerRows: '<tr><td>Guardian Record</td><td>0712 345 678</td><td>SJ-1023</td><td>Form 2</td><td>03 May 2026</td><td style="color:var(--yellow)">03 Aug 2026</td><td style="font-family:\'DM Mono\',monospace">KSh 92,400</td><td><button class="btn btn-ghost btn-sm">View Ledger</button></td></tr>',
      accountRows: '<tr><td>Mercy K.</td><td>Bursar</td><td>0701 222 410</td><td>Fees + receipts</td><td>Today 08:20</td><td><span class="badge badge-green">Active</span></td><td><button class="btn btn-ghost btn-sm">Edit</button></td></tr>',
      reportTitle: "Automated Parent Communication Preview",
      searchData: [{ type: "Student", ref: "SJ-1023", detail: "Amani N. - Form 2 - Fees KSh 24,500" }, { type: "Invoice", ref: "#FEE-311", detail: "Term 2 Fees - Pending" }],
      breakdownCardHtml: '<div class="card"><div class="card-title">Revenue Breakdown</div><div class="pl-row"><span class="pl-label">Tuition Collections</span><span class="pl-val up">KSh 118,400</span></div><div class="pl-row"><span class="pl-label">Exam / Activity Fees</span><span class="pl-val up">KSh 22,800</span></div><div class="pl-row"><span class="pl-label">Uniform & Materials</span><span class="pl-val up">KSh 14,200</span></div><div class="pl-row total"><span>Total</span><span class="pl-val up">KSh 155,400</span></div></div><div class="card"><div class="card-title">⚠ Follow-ups</div><div class="pl-row"><span class="pl-label">Fee defaulters</span><span class="pl-val down">12 accounts</span></div><div class="pl-row"><span class="pl-label">Missing report cards</span><span class="pl-val down">7 students</span></div><div class="pl-row"><span class="pl-label">Admission docs pending</span><span class="pl-val" style="color:var(--yellow)">9 students</span></div></div>',
      settingsServiceRows: '<tr><td>Student Enrollment</td><td>Admissions</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Fee Posting</td><td>Finance</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Exam Result Entry</td><td>Academics</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Parent Reminders</td><td>Communication</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr>',
      reportPreviewHtml: '<div class="card"><div class="card-title">Automated Daily Summary</div><div style="background:var(--s2);border-radius:10px;padding:16px;font-family:\'DM Mono\',monospace;font-size:12px;line-height:1.9;color:var(--text)">📄 *Management System Daily Summary*<br>📅 Date: 03 May 2026<br>─<br>🆕 New enrollments: *6*<br>💰 Fees collected: *KSh 155,400*<br>📝 Records updated: *42*<br>⚠ Follow-ups: *12*<br>─<br>✅ Operations active.</div><button class="btn btn-primary" style="margin-top:14px" onclick="sendWhatsApp()">📱 Send Now to Admin</button></div>',
      jobServiceOptions: '<option>Student Enrollment</option><option>Fee Posting</option><option>Exam Record Entry</option><option>Transfer Processing</option>',
      modalPatch: function () {
        setModalTitle("job-modal", "New Student Admission");
        setInputPlaceholder("#jc-plate", "Student Adm No. e.g. SJ-1102");
        setInputPlaceholder("#job-modal .form-grid .field:nth-child(2) input", "Student full name");
        setInputPlaceholder("#job-modal .form-grid .field:nth-child(3) input", "Class e.g. Grade 7");
        setInputPlaceholder("#job-modal .form-grid .field:nth-child(4) input", "Parent phone");
        setModalTitle("sale-modal", "Record School Payment");
        setModalTitle("quote-modal", "New Fee Quotation");
        setModalTitle("customer-modal", "Add Parent / Guardian");
        setModalTitle("import-modal", "Import Term Data Batch");
      }
    },
    construction_inventory: {
      nav: ["Overview", "Material Requests", "Pending Requisitions", "Issue Desk", "Walk-in Issues", "Cost Quotes", "Stock Rooms", "Inbound Lots", "Fleet", "Suppliers", "User Accounts", "Costing", "Reports", "Search", "Settings"],
      dashboardRows: '<tr><td>REQ-192</td><td>Steel Rebar Request</td><td>Procurement</td><td><span class="badge badge-orange">Pending</span></td><td style="font-family:\'DM Mono\',monospace">12mm</td></tr><tr><td>ISS-77</td><td>Cement Issue</td><td>Store Lead</td><td><span class="badge badge-green">Completed</span></td><td style="font-family:\'DM Mono\',monospace">240 bags</td></tr>',
      serviceRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#MR-122</td><td>03 May</td><td>SITE-04</td><td>Foreman Sam</td><td>Concrete Mix Inputs</td><td style="font-family:\'DM Mono\',monospace">KSh 340K</td><td>Stores</td><td><span class="badge badge-green">Issued</span></td><td><button class="btn btn-ghost btn-sm">Slip</button></td></tr>',
      pendingRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#RQ-87</td><td>SITE-08</td><td>Rebar 12mm</td><td>Structural</td><td>10:00 AM</td><td>Engineer</td><td>Basement slab</td><td><button class="btn btn-primary btn-sm">Approve</button></td></tr>',
      cashRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#PO-771</td><td>Supplier A</td><td>Cement OPC</td><td>300 bags</td><td style="font-family:\'DM Mono\',monospace">KSh 258,000</td><td><select style="background:var(--s2);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:4px 8px;font-size:12px;"><option>Bank</option><option>Cash</option></select></td><td><button class="btn btn-primary btn-sm">Settle</button></td></tr>',
      directRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#IS-11</td><td>03 May</td><td>PPE Gloves</td><td>30</td><td style="font-family:\'DM Mono\',monospace">220</td><td style="font-family:\'DM Mono\',monospace">6,600</td><td>Site Walk-in</td><td><span class="badge badge-blue">Issue</span></td></tr>',
      quoteRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#CQ-06</td><td>03 May</td><td>Site 12</td><td>Foundation Kit</td><td>Rebar + Cement</td><td style="font-family:\'DM Mono\',monospace">1.2M</td><td><span class="badge badge-yellow">Sent</span></td><td><button class="btn btn-primary btn-sm">Approve</button></td></tr>',
      stockRows: '<tr><td>Cement OPC 50kg</td><td>Bulk</td><td><div style="font-family:\'DM Mono\',monospace">680</div><div class="stock-bar"><div class="stock-fill" style="width:68%;background:var(--green)"></div></div></td><td style="font-family:\'DM Mono\',monospace">300</td><td style="font-family:\'DM Mono\',monospace">720</td><td style="font-family:\'DM Mono\',monospace">860</td><td style="font-family:\'DM Mono\',monospace;color:var(--green)">+19%</td><td><span class="badge badge-green">Healthy</span></td></tr>',
      importRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#LOT-199</td><td>Mombasa Depot</td><td style="font-family:\'DM Mono\',monospace">2,000 units</td><td style="font-family:\'DM Mono\',monospace">KSh 1.8M</td><td style="font-family:\'DM Mono\',monospace">62,000</td><td style="font-family:\'DM Mono\',monospace">20,000</td><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">KSh 920/u</td><td><span class="badge badge-yellow">Transit</span></td></tr>',
      vehicleRows: '<tr><td>03 May</td><td>🚛 Truck KCF 112M</td><td>Mombasa -> Nairobi</td><td style="font-family:\'DM Mono\',monospace">18,400</td><td style="font-family:\'DM Mono\',monospace">20T</td><td style="font-family:\'DM Mono\',monospace">84,000</td><td style="font-family:\'DM Mono\',monospace;color:var(--green)">+65,600</td></tr>',
      customerRows: '<tr><td>Prime Structures Ltd</td><td>0722 111 222</td><td>SITE-04</td><td>Main Contractor</td><td>03 May</td><td style="color:var(--yellow)">05 May</td><td style="font-family:\'DM Mono\',monospace">KSh 2.8M</td><td><button class="btn btn-ghost btn-sm">View Orders</button></td></tr>',
      accountRows: '<tr><td>Paul M.</td><td>Storekeeper</td><td>0733 666 111</td><td>Stock + issue</td><td>Today 07:55</td><td><span class="badge badge-green">Active</span></td><td><button class="btn btn-ghost btn-sm">Edit</button></td></tr>',
      reportTitle: "Automated Site Materials Summary",
      searchData: [{ type: "Request", ref: "REQ-192", detail: "Steel Rebar 12mm - Pending" }, { type: "Lot", ref: "LOT-199", detail: "Inbound 2,000 units - Transit" }],
      breakdownCardHtml: '<div class="card"><div class="card-title">Cost Breakdown</div><div class="pl-row"><span class="pl-label">Material issues</span><span class="pl-val up">KSh 428,400</span></div><div class="pl-row"><span class="pl-label">Inter-site transfers</span><span class="pl-val up">KSh 112,800</span></div><div class="pl-row"><span class="pl-label">Walk-in site issues</span><span class="pl-val up">KSh 37,000</span></div><div class="pl-row total"><span>Total</span><span class="pl-val up">KSh 578,200</span></div></div><div class="card"><div class="card-title">⚠ Stock Alerts</div><div class="pl-row"><span class="pl-label">Rebar 12mm</span><span class="pl-val down">55 units left</span></div><div class="pl-row"><span class="pl-label">Safety helmets</span><span class="pl-val down">24 pcs left</span></div><div class="pl-row"><span class="pl-label">Cement OPC</span><span class="pl-val" style="color:var(--yellow)">680 bags</span></div></div>',
      settingsServiceRows: '<tr><td>Material Request</td><td>Operations</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Issue Slip Processing</td><td>Stores</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Supplier Costing</td><td>Procurement</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Site Transfer</td><td>Logistics</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr>',
      reportPreviewHtml: '<div class="card"><div class="card-title">Automated Site Materials Summary</div><div style="background:var(--s2);border-radius:10px;padding:16px;font-family:\'DM Mono\',monospace;font-size:12px;line-height:1.9;color:var(--text)">🏗 *BuildStock Daily Report*<br>📅 Date: 03 May 2026<br>─<br>📦 Material issues: *17*<br>💵 Material value moved: *KSh 578,200*<br>🚚 Inter-site transfers: *5*<br>⚠ Critical low stock: *2 items*<br>─<br>✅ Procurement + stores synchronized.</div><button class="btn btn-primary" style="margin-top:14px" onclick="sendWhatsApp()">📱 Send Now to Operations Lead</button></div>',
      jobServiceOptions: '<option>Material Request</option><option>Issue Slip</option><option>Site Transfer</option><option>Supplier Reorder</option>',
      modalPatch: function () {
        setModalTitle("job-modal", "New Material Request");
        setInputPlaceholder("#jc-plate", "Site Code e.g. SITE-04");
        setInputPlaceholder("#job-modal .form-grid .field:nth-child(2) input", "Requester name");
        setInputPlaceholder("#job-modal .form-grid .field:nth-child(3) input", "Material category");
        setInputPlaceholder("#job-modal .form-grid .field:nth-child(4) input", "Requester phone");
        setModalTitle("sale-modal", "Record Material Issue");
        setModalTitle("quote-modal", "New Cost Quote");
        setModalTitle("customer-modal", "Add Supplier");
        setModalTitle("import-modal", "New Inbound Shipment");
      }
    },
    hospital_management: {
      nav: ["Overview", "Clinical Queue", "Pending Cases", "Billing Desk", "Walk-in Billing", "Treatment Plans", "Pharmacy", "Lab Orders", "Ambulance", "Patients", "User Accounts", "P&L", "Reports", "Search", "Settings"],
      dashboardRows: '<tr><td>OPD-301</td><td>Outpatient Visit</td><td>Dr. Asha</td><td><span class="badge badge-green">Closed</span></td><td style="font-family:\'DM Mono\',monospace">KSh 3,200</td></tr><tr><td>RX-811</td><td>Prescription Fill</td><td>Pharmacy</td><td><span class="badge badge-blue">Dispensed</span></td><td style="font-family:\'DM Mono\',monospace">4 meds</td></tr>',
      serviceRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#CASE-203</td><td>03 May</td><td>PT-0102</td><td>Jane W.</td><td>Consult + Labs</td><td style="font-family:\'DM Mono\',monospace">KSh 7,800</td><td>Dr. Asha</td><td><span class="badge badge-green">Done</span></td><td><button class="btn btn-ghost btn-sm">EMR</button></td></tr>',
      pendingRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#CASE-204</td><td>PT-0107</td><td>David K.</td><td>Ward Review</td><td>11:30 AM</td><td>Nurse</td><td>Awaiting labs</td><td><button class="btn btn-primary btn-sm">Close Case</button></td></tr>',
      cashRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#INV-1102</td><td>PT-0102</td><td>Jane W.</td><td>Consult + Lab</td><td style="font-family:\'DM Mono\',monospace">KSh 7,800</td><td><select style="background:var(--s2);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:4px 8px;font-size:12px;"><option>Insurance</option><option>M-Pesa</option><option>Cash</option></select></td><td><button class="btn btn-primary btn-sm">Collect</button></td></tr>',
      directRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#BIL-09</td><td>03 May</td><td>Injection Service</td><td>1</td><td style="font-family:\'DM Mono\',monospace">1,200</td><td style="font-family:\'DM Mono\',monospace">1,200</td><td>Walk-in</td><td><span class="badge badge-green">Cash</span></td></tr>',
      quoteRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#TP-11</td><td>03 May</td><td>Jane W.</td><td>PT-0102</td><td>3-day treatment plan</td><td style="font-family:\'DM Mono\',monospace">19,500</td><td><span class="badge badge-yellow">Sent</span></td><td><button class="btn btn-primary btn-sm">Approve</button></td></tr>',
      stockRows: '<tr><td>Amoxicillin 500mg</td><td>Pharmacy</td><td><div style="font-family:\'DM Mono\',monospace">240</div><div class="stock-bar"><div class="stock-fill" style="width:54%;background:var(--green)"></div></div></td><td style="font-family:\'DM Mono\',monospace">100</td><td style="font-family:\'DM Mono\',monospace">18</td><td style="font-family:\'DM Mono\',monospace">40</td><td style="font-family:\'DM Mono\',monospace;color:var(--green)">+55%</td><td><span class="badge badge-green">OK</span></td></tr>',
      importRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#LAB-38</td><td>MedSupply Kenya</td><td style="font-family:\'DM Mono\',monospace">480 units</td><td style="font-family:\'DM Mono\',monospace">KSh 390,000</td><td style="font-family:\'DM Mono\',monospace">12,000</td><td style="font-family:\'DM Mono\',monospace">5,200</td><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">KSh 847/u</td><td><span class="badge badge-green">Received</span></td></tr>',
      vehicleRows: '<tr><td>03 May</td><td>🚑 Ambulance KDG 334M</td><td>CBD -> St. Mary</td><td style="font-family:\'DM Mono\',monospace">3,100</td><td style="font-family:\'DM Mono\',monospace">2 transfers</td><td style="font-family:\'DM Mono\',monospace">11,000</td><td style="font-family:\'DM Mono\',monospace;color:var(--green)">+7,900</td></tr>',
      customerRows: '<tr><td>Jane W.</td><td>0712 999 201</td><td>PT-0102</td><td>Female 34</td><td>03 May 2026</td><td style="color:var(--yellow)">04 May 2026</td><td style="font-family:\'DM Mono\',monospace">KSh 8,600</td><td><button class="btn btn-ghost btn-sm">Open EMR</button></td></tr>',
      accountRows: '<tr><td>Dr. Asha</td><td>Consultant</td><td>0700 123 456</td><td>Clinical + notes</td><td>Today 09:10</td><td><span class="badge badge-green">Active</span></td><td><button class="btn btn-ghost btn-sm">Edit</button></td></tr>',
      reportTitle: "Automated Clinical Daily Summary",
      searchData: [{ type: "Patient", ref: "PT-0102", detail: "Jane W. - OPD + Labs - KSh 7,800" }, { type: "Invoice", ref: "INV-1102", detail: "Pending insurance claim" }],
      breakdownCardHtml: '<div class="card"><div class="card-title">Revenue Breakdown</div><div class="pl-row"><span class="pl-label">Consultations</span><span class="pl-val up">KSh 88,400</span></div><div class="pl-row"><span class="pl-label">Laboratory</span><span class="pl-val up">KSh 42,800</span></div><div class="pl-row"><span class="pl-label">Pharmacy</span><span class="pl-val up">KSh 64,200</span></div><div class="pl-row total"><span>Total</span><span class="pl-val up">KSh 195,400</span></div></div><div class="card"><div class="card-title">⚠ Clinical Alerts</div><div class="pl-row"><span class="pl-label">Pending lab results</span><span class="pl-val down">14 tests</span></div><div class="pl-row"><span class="pl-label">Awaiting discharge billing</span><span class="pl-val down">5 patients</span></div><div class="pl-row"><span class="pl-label">Critical meds low</span><span class="pl-val" style="color:var(--yellow)">3 SKUs</span></div></div>',
      settingsServiceRows: '<tr><td>Outpatient Consultation</td><td>Clinical</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Lab Orders</td><td>Diagnostics</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Prescription Billing</td><td>Pharmacy</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Inpatient Admission</td><td>Ward Ops</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr>',
      reportPreviewHtml: '<div class="card"><div class="card-title">Automated Clinical Daily Summary</div><div style="background:var(--s2);border-radius:10px;padding:16px;font-family:\'DM Mono\',monospace;font-size:12px;line-height:1.9;color:var(--text)">🏥 *MediFlow Daily Report*<br>📅 Date: 03 May 2026<br>─<br>🩺 Consultations: *42*<br>🧪 Lab requests: *27*<br>💊 Prescriptions dispensed: *68*<br>💰 Revenue: *KSh 195,400*<br>─<br>✅ Clinical + billing operations stable.</div><button class="btn btn-primary" style="margin-top:14px" onclick="sendWhatsApp()">📱 Send Now to Hospital Admin</button></div>',
      jobServiceOptions: '<option>Consultation Case</option><option>Lab Order</option><option>Pharmacy Dispense</option><option>Admission Setup</option>',
      modalPatch: function () {
        setModalTitle("job-modal", "New Clinical Case");
        setInputPlaceholder("#jc-plate", "Patient ID e.g. PT-0108");
        setInputPlaceholder("#job-modal .form-grid .field:nth-child(2) input", "Patient name");
        setInputPlaceholder("#job-modal .form-grid .field:nth-child(3) input", "Department / Clinic");
        setInputPlaceholder("#job-modal .form-grid .field:nth-child(4) input", "Patient phone");
        setModalTitle("sale-modal", "Record Walk-in Billing");
        setModalTitle("quote-modal", "New Treatment Plan");
        setModalTitle("customer-modal", "Add Patient");
        setModalTitle("import-modal", "New Lab / Pharmacy Supply Batch");
      }
    },
    hr_payroll: {
      nav: ["Overview", "Employee Ops", "Pending Approvals", "Payroll Desk", "Adjustments", "Comp Quotes", "Master Data", "Tax Imports", "Field Teams", "Employees", "User Accounts", "P&L", "Reports", "Search", "Settings"],
      dashboardRows: '<tr><td>EMP-208</td><td>New Hire Onboarding</td><td>HR Officer</td><td><span class="badge badge-green">Done</span></td><td style="font-family:\'DM Mono\',monospace">Sales</td></tr><tr><td>PAY-05</td><td>Payroll Batch</td><td>Payroll Lead</td><td><span class="badge badge-blue">Processing</span></td><td style="font-family:\'DM Mono\',monospace">May 2026</td></tr>',
      serviceRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#EMP-514</td><td>03 May</td><td>E-101</td><td>Lorna K.</td><td>Contract Renewal</td><td style="font-family:\'DM Mono\',monospace">12 months</td><td>HR Officer</td><td><span class="badge badge-green">Done</span></td><td><button class="btn btn-ghost btn-sm">View</button></td></tr>',
      pendingRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#LEV-77</td><td>E-203</td><td>Samuel O.</td><td>Leave Request</td><td>09:50 AM</td><td>HR Manager</td><td>5 business days</td><td><button class="btn btn-primary btn-sm">Approve</button></td></tr>',
      cashRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#PAY-2026-05</td><td>E-101</td><td>Lorna K.</td><td>Monthly Salary</td><td style="font-family:\'DM Mono\',monospace">KSh 128,000</td><td><select style="background:var(--s2);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:4px 8px;font-size:12px;"><option>Bank Transfer</option><option>M-Pesa</option></select></td><td><button class="btn btn-primary btn-sm">Process</button></td></tr>',
      directRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#ADJ-22</td><td>03 May</td><td>Transport Allowance</td><td>1</td><td style="font-family:\'DM Mono\',monospace">6,000</td><td style="font-family:\'DM Mono\',monospace">6,000</td><td>E-311</td><td><span class="badge badge-blue">Adjustment</span></td></tr>',
      quoteRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#COMP-10</td><td>03 May</td><td>New Hire Package</td><td>E-901</td><td>Salary + Benefits</td><td style="font-family:\'DM Mono\',monospace">KSh 210,000</td><td><span class="badge badge-yellow">Draft</span></td><td><button class="btn btn-primary btn-sm">Approve</button></td></tr>',
      stockRows: '<tr><td>Laptop Assets</td><td>HR Assets</td><td><div style="font-family:\'DM Mono\',monospace">42</div><div class="stock-bar"><div class="stock-fill" style="width:60%;background:var(--green)"></div></div></td><td style="font-family:\'DM Mono\',monospace">20</td><td style="font-family:\'DM Mono\',monospace">58,000</td><td style="font-family:\'DM Mono\',monospace">N/A</td><td style="font-family:\'DM Mono\',monospace;color:var(--green)">Tracked</td><td><span class="badge badge-green">OK</span></td></tr>',
      importRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#TAX-05</td><td>KRA Import</td><td style="font-family:\'DM Mono\',monospace">311 employees</td><td style="font-family:\'DM Mono\',monospace">KSh 0</td><td style="font-family:\'DM Mono\',monospace">--</td><td style="font-family:\'DM Mono\',monospace">--</td><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">NSSF/NHIF Sync</td><td><span class="badge badge-green">Completed</span></td></tr>',
      vehicleRows: '<tr><td>03 May</td><td>🚐 Staff Shuttle A</td><td>Westlands -> HQ</td><td style="font-family:\'DM Mono\',monospace">2,100</td><td style="font-family:\'DM Mono\',monospace">28 staff</td><td style="font-family:\'DM Mono\',monospace">Internal</td><td style="font-family:\'DM Mono\',monospace;color:var(--yellow)">Utilized</td></tr>',
      customerRows: '<tr><td>Lorna K.</td><td>0712 442 119</td><td>E-101</td><td>HR Officer</td><td>03 May 2026</td><td style="color:var(--yellow)">01 Jun 2026</td><td style="font-family:\'DM Mono\',monospace">KSh 128,000</td><td><button class="btn btn-ghost btn-sm">Profile</button></td></tr>',
      accountRows: '<tr><td>Samuel O.</td><td>Finance Lead</td><td>0700 222 410</td><td>Payroll, approvals</td><td>Today 08:20</td><td><span class="badge badge-green">Active</span></td><td><button class="btn btn-ghost btn-sm">Edit</button></td></tr>',
      reportTitle: "Automated Payroll Summary",
      searchData: [{ type: "Employee", ref: "E-101", detail: "Lorna K. - Payroll active" }, { type: "Run", ref: "PAY-2026-05", detail: "Monthly payroll batch processing" }],
      breakdownCardHtml: '<div class="card"><div class="card-title">Payroll Breakdown</div><div class="pl-row"><span class="pl-label">Base salaries</span><span class="pl-val up">KSh 1,920,000</span></div><div class="pl-row"><span class="pl-label">Allowances</span><span class="pl-val up">KSh 340,000</span></div><div class="pl-row"><span class="pl-label">Adjustments</span><span class="pl-val up">KSh 54,000</span></div><div class="pl-row total"><span>Total</span><span class="pl-val up">KSh 2,314,000</span></div></div><div class="card"><div class="card-title">⚠ Payroll Alerts</div><div class="pl-row"><span class="pl-label">Pending approvals</span><span class="pl-val down">9 requests</span></div><div class="pl-row"><span class="pl-label">Missing bank details</span><span class="pl-val down">4 employees</span></div><div class="pl-row"><span class="pl-label">Unsubmitted timesheets</span><span class="pl-val" style="color:var(--yellow)">11 employees</span></div></div>',
      settingsServiceRows: '<tr><td>Onboarding Workflow</td><td>HR Core</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Leave Approval</td><td>Workforce</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Payroll Run</td><td>Finance</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Payslip Dispatch</td><td>Employee Ops</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr>',
      reportPreviewHtml: '<div class="card"><div class="card-title">Automated Payroll Summary</div><div style="background:var(--s2);border-radius:10px;padding:16px;font-family:\'DM Mono\',monospace;font-size:12px;line-height:1.9;color:var(--text)">👥 *PeoplePay Daily Summary*<br>📅 Date: 03 May 2026<br>─<br>🆕 Onboarding tasks closed: *8*<br>🗂 Leave approvals: *13*<br>💰 Payroll batch status: *Processing*<br>📄 Payslips queued: *311*<br>─<br>✅ HR + payroll operations on track.</div><button class="btn btn-primary" style="margin-top:14px" onclick="sendWhatsApp()">📱 Send Now to HR Lead</button></div>',
      jobServiceOptions: '<option>Onboarding Workflow</option><option>Leave Approval</option><option>Payroll Entry</option><option>Payslip Dispatch</option>',
      modalPatch: function () {
        setModalTitle("job-modal", "New Employee Workflow");
        setInputPlaceholder("#jc-plate", "Employee ID e.g. E-110");
        setInputPlaceholder("#job-modal .form-grid .field:nth-child(2) input", "Employee name");
        setInputPlaceholder("#job-modal .form-grid .field:nth-child(3) input", "Department / Role");
        setInputPlaceholder("#job-modal .form-grid .field:nth-child(4) input", "Employee phone");
        setModalTitle("sale-modal", "Record Payroll Adjustment");
        setModalTitle("quote-modal", "New Compensation Proposal");
        setModalTitle("customer-modal", "Add Employee");
        setModalTitle("import-modal", "Import Statutory Payroll Data");
      }
    },
    agri_supply_chain: {
      nav: ["Overview", "Intake Ops", "Pending Lots", "Payout Desk", "Spot Purchases", "Buying Quotes", "Warehouse", "Origin Lots", "Logistics", "Farmers", "User Accounts", "P&L", "Reports", "Search", "Settings"],
      dashboardRows: '<tr><td>IN-1002</td><td>Produce Intake</td><td>Weighbridge</td><td><span class="badge badge-green">Verified</span></td><td style="font-family:\'DM Mono\',monospace">2.4T</td></tr><tr><td>PY-61</td><td>Farmer Payout</td><td>Finance</td><td><span class="badge badge-orange">Queued</span></td><td style="font-family:\'DM Mono\',monospace">KSh 84,000</td></tr>',
      serviceRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#LOT-061</td><td>03 May</td><td>F-228</td><td>Mary K.</td><td>Maize Intake + Grade</td><td style="font-family:\'DM Mono\',monospace">1,200 KG</td><td>Field Officer</td><td><span class="badge badge-green">Accepted</span></td><td><button class="btn btn-ghost btn-sm">Details</button></td></tr>',
      pendingRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#LOT-062</td><td>F-334</td><td>John P.</td><td>Beans Grade</td><td>10:30 AM</td><td>Inspector</td><td>Moisture check</td><td><button class="btn btn-primary btn-sm">Finalize</button></td></tr>',
      cashRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#PY-61</td><td>F-228</td><td>Mary K.</td><td>Lot #061</td><td style="font-family:\'DM Mono\',monospace">KSh 84,000</td><td><select style="background:var(--s2);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:4px 8px;font-size:12px;"><option>M-Pesa</option><option>Bank</option></select></td><td><button class="btn btn-primary btn-sm">Pay</button></td></tr>',
      directRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#SP-14</td><td>03 May</td><td>Spot Buy Maize</td><td>300 KG</td><td style="font-family:\'DM Mono\',monospace">52</td><td style="font-family:\'DM Mono\',monospace">15,600</td><td>Field Market</td><td><span class="badge badge-blue">Open</span></td></tr>',
      quoteRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#BQ-09</td><td>03 May</td><td>Nairobi Buyer</td><td>B2B-31</td><td>Maize Grade A</td><td style="font-family:\'DM Mono\',monospace">2.4M</td><td><span class="badge badge-yellow">Sent</span></td><td><button class="btn btn-primary btn-sm">Confirm</button></td></tr>',
      stockRows: '<tr><td>Maize Grade A</td><td>Warehouse</td><td><div style="font-family:\'DM Mono\',monospace">22T</div><div class="stock-bar"><div class="stock-fill" style="width:72%;background:var(--green)"></div></div></td><td style="font-family:\'DM Mono\',monospace">8T</td><td style="font-family:\'DM Mono\',monospace">55/kg</td><td style="font-family:\'DM Mono\',monospace">78/kg</td><td style="font-family:\'DM Mono\',monospace;color:var(--green)">+29%</td><td><span class="badge badge-green">Healthy</span></td></tr>',
      importRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#LOT-001</td><td>Kiambu Cluster</td><td style="font-family:\'DM Mono\',monospace">1,200 KG</td><td style="font-family:\'DM Mono\',monospace">KSh 96,000</td><td style="font-family:\'DM Mono\',monospace">KSh 5,400</td><td style="font-family:\'DM Mono\',monospace">KSh 2,800</td><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">KSh 87/KG</td><td><span class="badge badge-green">Settled</span></td></tr>',
      vehicleRows: '<tr><td>03 May</td><td>🚛 Truck KCH 781Q</td><td>Nakuru -> Nairobi</td><td style="font-family:\'DM Mono\',monospace">7,900</td><td style="font-family:\'DM Mono\',monospace">9T</td><td style="font-family:\'DM Mono\',monospace">62,000</td><td style="font-family:\'DM Mono\',monospace;color:var(--green)">+54,100</td></tr>',
      customerRows: '<tr><td>Farmer Mary K.</td><td>0711 888 201</td><td>F-228</td><td>Maize Grower</td><td>03 May</td><td style="color:var(--yellow)">06 May</td><td style="font-family:\'DM Mono\',monospace">KSh 190,000</td><td><button class="btn btn-ghost btn-sm">Profile</button></td></tr>',
      accountRows: '<tr><td>Kelvin O.</td><td>Field Officer</td><td>0701 444 111</td><td>Intake + grade</td><td>Today 08:01</td><td><span class="badge badge-green">Active</span></td><td><button class="btn btn-ghost btn-sm">Edit</button></td></tr>',
      reportTitle: "Automated Farm-to-Market Summary",
      searchData: [{ type: "Lot", ref: "LOT-061", detail: "Maize intake 1,200KG - accepted" }, { type: "Payout", ref: "PY-61", detail: "Mary K. KSh 84,000 queued" }],
      breakdownCardHtml: '<div class="card"><div class="card-title">Flow Breakdown</div><div class="pl-row"><span class="pl-label">Produce intake</span><span class="pl-val up">KSh 284,000</span></div><div class="pl-row"><span class="pl-label">Dispatch value</span><span class="pl-val up">KSh 362,800</span></div><div class="pl-row"><span class="pl-label">Spot buys</span><span class="pl-val up">KSh 47,000</span></div><div class="pl-row total"><span>Total</span><span class="pl-val up">KSh 693,800</span></div></div><div class="card"><div class="card-title">⚠ Operations Alerts</div><div class="pl-row"><span class="pl-label">Pending lot grading</span><span class="pl-val down">6 lots</span></div><div class="pl-row"><span class="pl-label">Payouts queued</span><span class="pl-val down">11 farmers</span></div><div class="pl-row"><span class="pl-label">Dispatch delays</span><span class="pl-val" style="color:var(--yellow)">2 routes</span></div></div>',
      settingsServiceRows: '<tr><td>Produce Intake</td><td>Field Ops</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Quality Grading</td><td>QA</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Farmer Payout</td><td>Finance</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Dispatch Planning</td><td>Logistics</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr>',
      reportPreviewHtml: '<div class="card"><div class="card-title">Automated Farm-to-Market Summary</div><div style="background:var(--s2);border-radius:10px;padding:16px;font-family:\'DM Mono\',monospace;font-size:12px;line-height:1.9;color:var(--text)">🌾 *AgriChain Daily Report*<br>📅 Date: 03 May 2026<br>─<br>📥 Intake lots: *18*<br>🏷 Graded lots: *16*<br>💸 Farmer payouts queued: *11*<br>🚚 Dispatches: *9*<br>─<br>✅ Supply chain running smoothly.</div><button class="btn btn-primary" style="margin-top:14px" onclick="sendWhatsApp()">📱 Send Now to Coop Admin</button></div>',
      jobServiceOptions: '<option>Produce Intake</option><option>Quality Grading</option><option>Payout Processing</option><option>Dispatch Planning</option>',
      modalPatch: function () {
        setModalTitle("job-modal", "New Intake Record");
        setInputPlaceholder("#jc-plate", "Farmer ID e.g. F-228");
        setInputPlaceholder("#job-modal .form-grid .field:nth-child(2) input", "Farmer name");
        setInputPlaceholder("#job-modal .form-grid .field:nth-child(3) input", "Produce type");
        setInputPlaceholder("#job-modal .form-grid .field:nth-child(4) input", "Farmer phone");
        setModalTitle("sale-modal", "Record Spot Purchase");
        setModalTitle("quote-modal", "New Buyer Quote");
        setModalTitle("customer-modal", "Add Farmer Profile");
        setModalTitle("import-modal", "New Produce Lot");
      }
    },
    property_management: {
      nav: ["Overview", "Tenant Ops", "Pending Leases", "Rent Desk", "Walk-in Payments", "Lease Quotes", "Units", "Move-in Imports", "Maintenance Fleet", "Tenants", "User Accounts", "P&L", "Reports", "Search", "Settings"],
      dashboardRows: '<tr><td>LSE-219</td><td>Lease Renewal</td><td>Leasing Officer</td><td><span class="badge badge-green">Completed</span></td><td style="font-family:\'DM Mono\',monospace">Apt B12</td></tr><tr><td>RNT-84</td><td>Rent Posting</td><td>Finance</td><td><span class="badge badge-orange">Pending</span></td><td style="font-family:\'DM Mono\',monospace">KSh 65,000</td></tr>',
      serviceRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#TEN-001</td><td>03 May</td><td>UT-1204</td><td>Kevin M.</td><td>New Lease + Deposit</td><td style="font-family:\'DM Mono\',monospace">KSh 130,000</td><td>Leasing</td><td><span class="badge badge-green">Done</span></td><td><button class="btn btn-ghost btn-sm">View File</button></td></tr>',
      pendingRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#PEND-31</td><td>UT-0902</td><td>Aisha N.</td><td>Lease Approval</td><td>10:15 AM</td><td>Manager</td><td>Awaiting ID copy</td><td><button class="btn btn-primary btn-sm">Approve</button></td></tr>',
      cashRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#RENT-311</td><td>UT-1204</td><td>Kevin M.</td><td>May Rent</td><td style="font-family:\'DM Mono\',monospace">KSh 65,000</td><td><select style="background:var(--s2);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:4px 8px;font-size:12px;"><option>M-Pesa</option><option>Bank</option><option>Cash</option></select></td><td><button class="btn btn-primary btn-sm">Collect</button></td></tr>',
      directRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#FEE-12</td><td>03 May</td><td>Parking Fee</td><td>1</td><td style="font-family:\'DM Mono\',monospace">5,000</td><td style="font-family:\'DM Mono\',monospace">5,000</td><td>Walk-in Tenant</td><td><span class="badge badge-green">M-Pesa</span></td></tr>',
      quoteRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#Q-03</td><td>03 May</td><td>Unit B14</td><td>Applicant: Diana K.</td><td>Lease + Service Charge</td><td style="font-family:\'DM Mono\',monospace">72,000</td><td><span class="badge badge-yellow">Sent</span></td><td><button class="btn btn-primary btn-sm">Convert</button></td></tr>',
      stockRows: '<tr><td>Apartment Units</td><td>Residential</td><td><div style="font-family:\'DM Mono\',monospace">42 occupied / 60</div><div class="stock-bar"><div class="stock-fill" style="width:70%;background:var(--green)"></div></div></td><td style="font-family:\'DM Mono\',monospace">50%</td><td style="font-family:\'DM Mono\',monospace">N/A</td><td style="font-family:\'DM Mono\',monospace">N/A</td><td style="font-family:\'DM Mono\',monospace;color:var(--green)">Occupancy +70%</td><td><span class="badge badge-green">Healthy</span></td></tr>',
      importRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#MV-006</td><td>UrbanNest Tower</td><td style="font-family:\'DM Mono\',monospace">8 tenants</td><td style="font-family:\'DM Mono\',monospace">KSh 520,000</td><td style="font-family:\'DM Mono\',monospace">KSh 12,000</td><td style="font-family:\'DM Mono\',monospace">KSh 3,800</td><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">KSh 65,000 avg</td><td><span class="badge badge-green">Filed</span></td></tr>',
      vehicleRows: '<tr><td>03 May</td><td>🚚 Service Van KDL 445R</td><td>Tower A -> Tower C</td><td style="font-family:\'DM Mono\',monospace">2,400</td><td style="font-family:\'DM Mono\',monospace">5 tickets</td><td style="font-family:\'DM Mono\',monospace">Internal</td><td style="font-family:\'DM Mono\',monospace;color:var(--yellow)">Operational</td></tr>',
      customerRows: '<tr><td>Kevin M.</td><td>0712 334 112</td><td>UT-1204</td><td>Apartment B12</td><td>03 May 2026</td><td style="color:var(--yellow)">05 Jun 2026</td><td style="font-family:\'DM Mono\',monospace">KSh 195,000</td><td><button class="btn btn-ghost btn-sm">View Ledger</button></td></tr>',
      accountRows: '<tr><td>Leah O.</td><td>Property Manager</td><td>0700 111 991</td><td>Leasing + rent</td><td>Today 08:11</td><td><span class="badge badge-green">Active</span></td><td><button class="btn btn-ghost btn-sm">Edit</button></td></tr>',
      reportTitle: "Automated Property Operations Summary",
      searchData: [{ type: "Tenant", ref: "UT-1204", detail: "Kevin M. - May rent pending" }, { type: "Lease", ref: "LSE-219", detail: "Lease renewal completed" }],
      breakdownCardHtml: '<div class="card"><div class="card-title">Revenue Breakdown</div><div class="pl-row"><span class="pl-label">Monthly Rent</span><span class="pl-val up">KSh 1,240,000</span></div><div class="pl-row"><span class="pl-label">Service Charge</span><span class="pl-val up">KSh 280,000</span></div><div class="pl-row"><span class="pl-label">Parking/Utilities</span><span class="pl-val up">KSh 96,000</span></div><div class="pl-row total"><span>Total</span><span class="pl-val up">KSh 1,616,000</span></div></div><div class="card"><div class="card-title">⚠ Property Alerts</div><div class="pl-row"><span class="pl-label">Rent arrears</span><span class="pl-val down">14 tenants</span></div><div class="pl-row"><span class="pl-label">Open maintenance tickets</span><span class="pl-val down">9 tickets</span></div><div class="pl-row"><span class="pl-label">Vacant units</span><span class="pl-val" style="color:var(--yellow)">18 units</span></div></div>',
      settingsServiceRows: '<tr><td>Lease Onboarding</td><td>Leasing</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Rent Collection</td><td>Finance</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Maintenance Dispatch</td><td>Operations</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Tenant Ledger</td><td>Accounts</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr>',
      reportPreviewHtml: '<div class="card"><div class="card-title">Automated Property Operations Summary</div><div style="background:var(--s2);border-radius:10px;padding:16px;font-family:\'DM Mono\',monospace;font-size:12px;line-height:1.9;color:var(--text)">🏢 *PropDesk Daily Summary*<br>📅 Date: 03 May 2026<br>─<br>🧾 Rent postings: *42*<br>💰 Collections today: *KSh 486,000*<br>🛠 Maintenance tickets closed: *7*<br>🏠 Occupancy: *70%*<br>─<br>✅ Leasing + finance aligned.</div><button class="btn btn-primary" style="margin-top:14px" onclick="sendWhatsApp()">📱 Send Now to Property Admin</button></div>',
      jobServiceOptions: '<option>Lease Onboarding</option><option>Rent Posting</option><option>Maintenance Ticket</option><option>Unit Handover</option>',
      modalPatch: function () {
        setModalTitle("job-modal", "New Tenant Workflow");
        setInputPlaceholder("#jc-plate", "Unit No. e.g. UT-1204");
        setInputPlaceholder("#job-modal .form-grid .field:nth-child(2) input", "Tenant name");
        setInputPlaceholder("#job-modal .form-grid .field:nth-child(3) input", "Property / Unit");
        setInputPlaceholder("#job-modal .form-grid .field:nth-child(4) input", "Tenant phone");
        setModalTitle("sale-modal", "Record Tenant Charge");
        setModalTitle("quote-modal", "New Lease Quotation");
        setModalTitle("customer-modal", "Add Tenant Profile");
        setModalTitle("import-modal", "New Move-in Batch");
      }
    },
    booking_platform: {
      nav: ["Overview", "Booking Ops", "Pending Bookings", "Payments Desk", "Walk-ins", "Quotes", "Availability", "Channel Imports", "Resource Fleet", "Customers", "User Accounts", "P&L", "Reports", "Search", "Settings"],
      dashboardRows: '<tr><td>BKG-501</td><td>New Reservation</td><td>Agent</td><td><span class="badge badge-green">Confirmed</span></td><td style="font-family:\'DM Mono\',monospace">KSh 18,500</td></tr><tr><td>BKG-502</td><td>Reschedule Request</td><td>Support</td><td><span class="badge badge-orange">Pending</span></td><td style="font-family:\'DM Mono\',monospace">2 pax</td></tr>',
      serviceRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#BK-103</td><td>03 May</td><td>REF-8831</td><td>Nancy W.</td><td>City Tour Package</td><td style="font-family:\'DM Mono\',monospace">KSh 24,000</td><td>Bookings</td><td><span class="badge badge-green">Done</span></td><td><button class="btn btn-ghost btn-sm">Voucher</button></td></tr>',
      pendingRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#PD-29</td><td>REF-9002</td><td>Ali M.</td><td>Date Change</td><td>10:20 AM</td><td>Support</td><td>Awaiting slot</td><td><button class="btn btn-primary btn-sm">Confirm</button></td></tr>',
      cashRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#INV-992</td><td>REF-8831</td><td>Nancy W.</td><td>Tour Booking</td><td style="font-family:\'DM Mono\',monospace">KSh 24,000</td><td><select style="background:var(--s2);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:4px 8px;font-size:12px;"><option>M-Pesa</option><option>Card</option><option>Bank</option></select></td><td><button class="btn btn-primary btn-sm">Collect</button></td></tr>',
      directRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#WKB-12</td><td>03 May</td><td>Walk-in Booking</td><td>1</td><td style="font-family:\'DM Mono\',monospace">6,500</td><td style="font-family:\'DM Mono\',monospace">6,500</td><td>Desk Client</td><td><span class="badge badge-green">Cash</span></td></tr>',
      quoteRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#QBK-07</td><td>03 May</td><td>Corporate Group</td><td>REF-C77</td><td>Weekend Package</td><td style="font-family:\'DM Mono\',monospace">180,000</td><td><span class="badge badge-yellow">Sent</span></td><td><button class="btn btn-primary btn-sm">Convert</button></td></tr>',
      stockRows: '<tr><td>Available Slots</td><td>Calendar</td><td><div style="font-family:\'DM Mono\',monospace">72 / 100</div><div class="stock-bar"><div class="stock-fill" style="width:72%;background:var(--green)"></div></div></td><td style="font-family:\'DM Mono\',monospace">40%</td><td style="font-family:\'DM Mono\',monospace">N/A</td><td style="font-family:\'DM Mono\',monospace">N/A</td><td style="font-family:\'DM Mono\',monospace;color:var(--green)">Healthy load</td><td><span class="badge badge-green">Open</span></td></tr>',
      importRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#CH-11</td><td>Partner Channel</td><td style="font-family:\'DM Mono\',monospace">28 bookings</td><td style="font-family:\'DM Mono\',monospace">KSh 460,000</td><td style="font-family:\'DM Mono\',monospace">KSh 12,000</td><td style="font-family:\'DM Mono\',monospace">KSh 4,000</td><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">KSh 16,430 avg</td><td><span class="badge badge-green">Synced</span></td></tr>',
      vehicleRows: '<tr><td>03 May</td><td>🚌 Shuttle KDS 112Q</td><td>CBD Loop</td><td style="font-family:\'DM Mono\',monospace">3,400</td><td style="font-family:\'DM Mono\',monospace">18 pax</td><td style="font-family:\'DM Mono\',monospace">32,000</td><td style="font-family:\'DM Mono\',monospace;color:var(--green)">+28,600</td></tr>',
      customerRows: '<tr><td>Nancy W.</td><td>0712 777 101</td><td>REF-8831</td><td>City Tour</td><td>03 May 2026</td><td style="color:var(--yellow)">10 May 2026</td><td style="font-family:\'DM Mono\',monospace">KSh 24,000</td><td><button class="btn btn-ghost btn-sm">Profile</button></td></tr>',
      accountRows: '<tr><td>Brian K.</td><td>Booking Lead</td><td>0700 900 117</td><td>Bookings + support</td><td>Today 08:44</td><td><span class="badge badge-green">Active</span></td><td><button class="btn btn-ghost btn-sm">Edit</button></td></tr>',
      reportTitle: "Automated Booking Operations Summary",
      searchData: [{ type: "Booking", ref: "BKG-501", detail: "Confirmed reservation KSh 18,500" }, { type: "Quote", ref: "QBK-07", detail: "Corporate group pending" }],
      breakdownCardHtml: '<div class="card"><div class="card-title">Revenue Breakdown</div><div class="pl-row"><span class="pl-label">Online bookings</span><span class="pl-val up">KSh 286,000</span></div><div class="pl-row"><span class="pl-label">Walk-ins</span><span class="pl-val up">KSh 64,200</span></div><div class="pl-row"><span class="pl-label">Partner channels</span><span class="pl-val up">KSh 110,400</span></div><div class="pl-row total"><span>Total</span><span class="pl-val up">KSh 460,600</span></div></div><div class="card"><div class="card-title">⚠ Booking Alerts</div><div class="pl-row"><span class="pl-label">Unconfirmed holds</span><span class="pl-val down">8 bookings</span></div><div class="pl-row"><span class="pl-label">Overlapping slots</span><span class="pl-val down">3 conflicts</span></div><div class="pl-row"><span class="pl-label">No-show risk</span><span class="pl-val" style="color:var(--yellow)">5 bookings</span></div></div>',
      settingsServiceRows: '<tr><td>Reservation Creation</td><td>Bookings</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Schedule Management</td><td>Calendar</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Payment Capture</td><td>Finance</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Voucher Dispatch</td><td>Fulfilment</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr>',
      reportPreviewHtml: '<div class="card"><div class="card-title">Automated Booking Operations Summary</div><div style="background:var(--s2);border-radius:10px;padding:16px;font-family:\'DM Mono\',monospace;font-size:12px;line-height:1.9;color:var(--text)">📅 *Booking Platform Daily*<br>📅 Date: 03 May 2026<br>─<br>🧾 New bookings: *22*<br>✅ Confirmed: *17*<br>💰 Collected: *KSh 460,600*<br>⚠ Pending confirmations: *8*<br>─<br>✅ Schedule healthy.</div><button class="btn btn-primary" style="margin-top:14px" onclick="sendWhatsApp()">📱 Send Now</button></div>',
      jobServiceOptions: '<option>Reservation</option><option>Reschedule</option><option>Payment Follow-up</option><option>Voucher Dispatch</option>',
      modalPatch: function () { setModalTitle("job-modal", "New Booking Workflow"); setInputPlaceholder("#jc-plate", "Booking Ref e.g. BKG-503"); setModalTitle("sale-modal", "Record Walk-in Booking"); setModalTitle("quote-modal", "New Booking Quote"); setModalTitle("customer-modal", "Add Customer Profile"); setModalTitle("import-modal", "Import Channel Bookings"); }
    },
    crm: {
      nav: ["Overview", "Lead Ops", "Pending Leads", "Deals Desk", "Walk-in Leads", "Proposal Quotes", "Pipelines", "Lead Imports", "Field Team", "Contacts", "User Accounts", "P&L", "Reports", "Search", "Settings"],
      dashboardRows: '<tr><td>LED-201</td><td>New Lead</td><td>SDR</td><td><span class="badge badge-green">Qualified</span></td><td style="font-family:\'DM Mono\',monospace">B2B</td></tr><tr><td>DL-44</td><td>Deal Follow-up</td><td>AE</td><td><span class="badge badge-orange">Pending</span></td><td style="font-family:\'DM Mono\',monospace">KSh 420K</td></tr>',
      serviceRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#CRM-101</td><td>03 May</td><td>LED-201</td><td>Nova Tech</td><td>Discovery Call</td><td style="font-family:\'DM Mono\',monospace">Deal 420K</td><td>AE Team</td><td><span class="badge badge-green">Done</span></td><td><button class="btn btn-ghost btn-sm">Open Deal</button></td></tr>',
      pendingRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#PND-19</td><td>LED-223</td><td>HealthPlus</td><td>Proposal Review</td><td>11:00 AM</td><td>Sales Lead</td><td>Awaiting budget</td><td><button class="btn btn-primary btn-sm">Advance</button></td></tr>',
      cashRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#DL-44</td><td>Nova Tech</td><td>Enterprise Plan</td><td>Milestone 1</td><td style="font-family:\'DM Mono\',monospace">KSh 210,000</td><td><select style="background:var(--s2);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:4px 8px;font-size:12px;"><option>Bank</option><option>M-Pesa</option></select></td><td><button class="btn btn-primary btn-sm">Log Payment</button></td></tr>',
      directRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#WL-02</td><td>03 May</td><td>Walk-in Lead</td><td>1</td><td style="font-family:\'DM Mono\',monospace">N/A</td><td style="font-family:\'DM Mono\',monospace">N/A</td><td>Front Desk</td><td><span class="badge badge-blue">Captured</span></td></tr>',
      quoteRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#PR-12</td><td>03 May</td><td>HealthPlus</td><td>LED-223</td><td>CRM + Support</td><td style="font-family:\'DM Mono\',monospace">680,000</td><td><span class="badge badge-yellow">Sent</span></td><td><button class="btn btn-primary btn-sm">Convert</button></td></tr>',
      stockRows: '<tr><td>Qualified Leads</td><td>Pipeline</td><td><div style="font-family:\'DM Mono\',monospace">84</div><div class="stock-bar"><div class="stock-fill" style="width:66%;background:var(--green)"></div></div></td><td style="font-family:\'DM Mono\',monospace">40</td><td style="font-family:\'DM Mono\',monospace">N/A</td><td style="font-family:\'DM Mono\',monospace">N/A</td><td style="font-family:\'DM Mono\',monospace;color:var(--green)">Healthy</td><td><span class="badge badge-green">Active</span></td></tr>',
      importRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#IMP-CRM1</td><td>Campaign Upload</td><td style="font-family:\'DM Mono\',monospace">340 leads</td><td style="font-family:\'DM Mono\',monospace">KSh 0</td><td style="font-family:\'DM Mono\',monospace">--</td><td style="font-family:\'DM Mono\',monospace">--</td><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">Lead batch</td><td><span class="badge badge-green">Imported</span></td></tr>',
      vehicleRows: '<tr><td>03 May</td><td>🚗 Field Car KDM 771K</td><td>Westlands Visits</td><td style="font-family:\'DM Mono\',monospace">2,200</td><td style="font-family:\'DM Mono\',monospace">6 meetings</td><td style="font-family:\'DM Mono\',monospace">Potential 1.2M</td><td style="font-family:\'DM Mono\',monospace;color:var(--yellow)">Pipeline</td></tr>',
      customerRows: '<tr><td>Nova Tech Ltd</td><td>0722 880 110</td><td>LED-201</td><td>Enterprise</td><td>03 May 2026</td><td style="color:var(--yellow)">07 May 2026</td><td style="font-family:\'DM Mono\',monospace">KSh 420,000</td><td><button class="btn btn-ghost btn-sm">Timeline</button></td></tr>',
      accountRows: '<tr><td>Diana R.</td><td>Sales Lead</td><td>0700 770 211</td><td>Deals + pipeline</td><td>Today 08:03</td><td><span class="badge badge-green">Active</span></td><td><button class="btn btn-ghost btn-sm">Edit</button></td></tr>',
      reportTitle: "Automated CRM Daily Summary",
      searchData: [{ type: "Lead", ref: "LED-201", detail: "Nova Tech - Qualified" }, { type: "Deal", ref: "DL-44", detail: "Milestone payment due" }],
      breakdownCardHtml: '<div class="card"><div class="card-title">Pipeline Breakdown</div><div class="pl-row"><span class="pl-label">Qualified leads</span><span class="pl-val up">84</span></div><div class="pl-row"><span class="pl-label">Open deals</span><span class="pl-val up">29</span></div><div class="pl-row"><span class="pl-label">Won this month</span><span class="pl-val up">9</span></div><div class="pl-row total"><span>Pipeline Value</span><span class="pl-val up">KSh 8.4M</span></div></div><div class="card"><div class="card-title">⚠ CRM Alerts</div><div class="pl-row"><span class="pl-label">Stale leads</span><span class="pl-val down">11</span></div><div class="pl-row"><span class="pl-label">Overdue follow-ups</span><span class="pl-val down">7</span></div><div class="pl-row"><span class="pl-label">Contracts pending</span><span class="pl-val" style="color:var(--yellow)">4</span></div></div>',
      settingsServiceRows: '<tr><td>Lead Capture</td><td>Inbound</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Deal Tracking</td><td>Sales</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Task Follow-up</td><td>Ops</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Proposal Management</td><td>Sales</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr>',
      reportPreviewHtml: '<div class="card"><div class="card-title">Automated CRM Daily Summary</div><div style="background:var(--s2);border-radius:10px;padding:16px;font-family:\'DM Mono\',monospace;font-size:12px;line-height:1.9;color:var(--text)">📈 *CRM Daily*<br>🧲 New leads: *34*<br>✅ Qualified: *18*<br>🤝 Deals advanced: *7*<br>💰 Pipeline value: *KSh 8.4M*<br>⚠ Overdue follow-ups: *7*</div><button class="btn btn-primary" style="margin-top:14px" onclick="sendWhatsApp()">📱 Send Now</button></div>',
      jobServiceOptions: '<option>Lead Qualification</option><option>Deal Follow-up</option><option>Proposal Draft</option><option>Contract Handoff</option>',
      modalPatch: function () { setModalTitle("job-modal", "New CRM Workflow"); setInputPlaceholder("#jc-plate", "Lead ID e.g. LED-225"); setModalTitle("sale-modal", "Record Deal Payment"); setModalTitle("quote-modal", "New Proposal"); setModalTitle("customer-modal", "Add Contact"); setModalTitle("import-modal", "Import Lead Batch"); }
    },
    analytics: {
      nav: ["Overview", "Data Ops", "Pending Pipelines", "Billing Desk", "Ad-hoc Runs", "Estimate Quotes", "Datasets", "Source Imports", "Ingestion Fleet", "Stakeholders", "User Accounts", "P&L", "Reports", "Search", "Settings"],
      dashboardRows: '<tr><td>RUN-901</td><td>Daily ETL</td><td>Data Eng</td><td><span class="badge badge-green">Succeeded</span></td><td style="font-family:\'DM Mono\',monospace">14m</td></tr><tr><td>ALRT-21</td><td>Anomaly Spike</td><td>Analytics</td><td><span class="badge badge-orange">Investigating</span></td><td style="font-family:\'DM Mono\',monospace">+18%</td></tr>',
      serviceRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#JOB-301</td><td>03 May</td><td>PIPE-08</td><td>Revenue Model</td><td>Backfill + Validate</td><td style="font-family:\'DM Mono\',monospace">3.2M rows</td><td>Data Team</td><td><span class="badge badge-green">Done</span></td><td><button class="btn btn-ghost btn-sm">View Run</button></td></tr>',
      pendingRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#PD-55</td><td>PIPE-10</td><td>Churn Model</td><td>Feature Refresh</td><td>10:40 AM</td><td>ML Eng</td><td>Awaiting source</td><td><button class="btn btn-primary btn-sm">Retry</button></td></tr>',
      cashRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#INV-AN7</td><td>Client A</td><td>Analytics Subscription</td><td>May Cycle</td><td style="font-family:\'DM Mono\',monospace">KSh 420,000</td><td><select style="background:var(--s2);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:4px 8px;font-size:12px;"><option>Bank</option><option>Card</option></select></td><td><button class="btn btn-primary btn-sm">Log</button></td></tr>',
      directRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#ADH-02</td><td>03 May</td><td>Ad-hoc Report</td><td>1</td><td style="font-family:\'DM Mono\',monospace">35,000</td><td style="font-family:\'DM Mono\',monospace">35,000</td><td>Ops Team</td><td><span class="badge badge-blue">Delivered</span></td></tr>',
      quoteRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#EST-12</td><td>03 May</td><td>Client B</td><td>AN-44</td><td>BI + Forecast Pack</td><td style="font-family:\'DM Mono\',monospace">780,000</td><td><span class="badge badge-yellow">Sent</span></td><td><button class="btn btn-primary btn-sm">Approve</button></td></tr>',
      stockRows: '<tr><td>Data Pipelines</td><td>Platform</td><td><div style="font-family:\'DM Mono\',monospace">19 active</div><div class="stock-bar"><div class="stock-fill" style="width:76%;background:var(--green)"></div></div></td><td style="font-family:\'DM Mono\',monospace">10</td><td style="font-family:\'DM Mono\',monospace">N/A</td><td style="font-family:\'DM Mono\',monospace">N/A</td><td style="font-family:\'DM Mono\',monospace;color:var(--green)">Stable</td><td><span class="badge badge-green">Healthy</span></td></tr>',
      importRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#SRC-03</td><td>Warehouse Sync</td><td style="font-family:\'DM Mono\',monospace">11 tables</td><td style="font-family:\'DM Mono\',monospace">KSh 0</td><td style="font-family:\'DM Mono\',monospace">--</td><td style="font-family:\'DM Mono\',monospace">--</td><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">2.1 GB</td><td><span class="badge badge-green">Loaded</span></td></tr>',
      vehicleRows: '<tr><td>03 May</td><td>🛰 Batch Runner</td><td>Night Window</td><td style="font-family:\'DM Mono\',monospace">3 hrs</td><td style="font-family:\'DM Mono\',monospace">19 jobs</td><td style="font-family:\'DM Mono\',monospace">SLA 99.2%</td><td style="font-family:\'DM Mono\',monospace;color:var(--green)">On target</td></tr>',
      customerRows: '<tr><td>Client A</td><td>0719 001 112</td><td>AN-07</td><td>Subscription</td><td>03 May 2026</td><td style="color:var(--yellow)">06 May 2026</td><td style="font-family:\'DM Mono\',monospace">KSh 420,000</td><td><button class="btn btn-ghost btn-sm">Account</button></td></tr>',
      accountRows: '<tr><td>Nora P.</td><td>Data Lead</td><td>0700 112 993</td><td>Pipelines + QA</td><td>Today 08:28</td><td><span class="badge badge-green">Active</span></td><td><button class="btn btn-ghost btn-sm">Edit</button></td></tr>',
      reportTitle: "Automated Analytics Daily Summary",
      searchData: [{ type: "Run", ref: "RUN-901", detail: "Daily ETL succeeded in 14m" }, { type: "Alert", ref: "ALRT-21", detail: "Anomaly +18%" }],
      breakdownCardHtml: '<div class="card"><div class="card-title">Usage Breakdown</div><div class="pl-row"><span class="pl-label">Scheduled runs</span><span class="pl-val up">87</span></div><div class="pl-row"><span class="pl-label">Ad-hoc queries</span><span class="pl-val up">34</span></div><div class="pl-row"><span class="pl-label">Dashboards served</span><span class="pl-val up">122</span></div><div class="pl-row total"><span>SLA</span><span class="pl-val up">99.2%</span></div></div><div class="card"><div class="card-title">⚠ Data Alerts</div><div class="pl-row"><span class="pl-label">Failed tasks</span><span class="pl-val down">2</span></div><div class="pl-row"><span class="pl-label">Late pipelines</span><span class="pl-val down">3</span></div><div class="pl-row"><span class="pl-label">Schema drift</span><span class="pl-val" style="color:var(--yellow)">1 source</span></div></div>',
      settingsServiceRows: '<tr><td>Pipeline Scheduling</td><td>ETL</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Anomaly Monitoring</td><td>Observability</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Dashboard Delivery</td><td>BI</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Report Exports</td><td>Analytics</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr>',
      reportPreviewHtml: '<div class="card"><div class="card-title">Automated Analytics Daily Summary</div><div style="background:var(--s2);border-radius:10px;padding:16px;font-family:\'DM Mono\',monospace;font-size:12px;line-height:1.9;color:var(--text)">📊 *Analytics Daily*<br>✅ Successful runs: *87*<br>⚠ Failed tasks: *2*<br>📈 Dashboards refreshed: *122*<br>⏱ SLA: *99.2%*</div><button class="btn btn-primary" style="margin-top:14px" onclick="sendWhatsApp()">📱 Send Now</button></div>',
      jobServiceOptions: '<option>ETL Run</option><option>Backfill</option><option>Anomaly Review</option><option>Dashboard Refresh</option>',
      modalPatch: function () { setModalTitle("job-modal", "New Analytics Workflow"); setInputPlaceholder("#jc-plate", "Pipeline ID e.g. PIPE-11"); setModalTitle("sale-modal", "Record Ad-hoc Billing"); setModalTitle("quote-modal", "New Analytics Estimate"); setModalTitle("customer-modal", "Add Stakeholder"); setModalTitle("import-modal", "Import Data Source"); }
    },
    team_collaboration: {
      nav: ["Overview", "Task Ops", "Pending Reviews", "Billing Desk", "Quick Actions", "Proposal Quotes", "Projects", "Backlog Imports", "Sprint Board", "Members", "User Accounts", "P&L", "Reports", "Search", "Settings"],
      dashboardRows: '<tr><td>TSK-771</td><td>Task Completed</td><td>Frontend</td><td><span class="badge badge-green">Done</span></td><td style="font-family:\'DM Mono\',monospace">UI Revamp</td></tr><tr><td>RVW-09</td><td>PR Review</td><td>Backend</td><td><span class="badge badge-orange">Pending</span></td><td style="font-family:\'DM Mono\',monospace">#482</td></tr>',
      serviceRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#COL-101</td><td>03 May</td><td>PRJ-44</td><td>Mobile App</td><td>Sprint Planning</td><td style="font-family:\'DM Mono\',monospace">Sprint 12</td><td>Team Lead</td><td><span class="badge badge-green">Done</span></td><td><button class="btn btn-ghost btn-sm">Open Board</button></td></tr>',
      pendingRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#PND-58</td><td>PRJ-44</td><td>API Integration</td><td>Code Review</td><td>12:10 PM</td><td>Reviewer</td><td>Awaiting approval</td><td><button class="btn btn-primary btn-sm">Approve</button></td></tr>',
      cashRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#INV-T12</td><td>Client Retainer</td><td>Team Collaboration</td><td>May Sprint</td><td style="font-family:\'DM Mono\',monospace">KSh 320,000</td><td><select style="background:var(--s2);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:4px 8px;font-size:12px;"><option>Bank</option><option>Card</option></select></td><td><button class="btn btn-primary btn-sm">Log</button></td></tr>',
      directRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#QAK-02</td><td>03 May</td><td>Quick Support Task</td><td>1</td><td style="font-family:\'DM Mono\',monospace">15,000</td><td style="font-family:\'DM Mono\',monospace">15,000</td><td>Ops</td><td><span class="badge badge-blue">Done</span></td></tr>',
      quoteRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#QP-19</td><td>03 May</td><td>Client C</td><td>PRJ-NEW</td><td>6-week sprint pack</td><td style="font-family:\'DM Mono\',monospace">540,000</td><td><span class="badge badge-yellow">Sent</span></td><td><button class="btn btn-primary btn-sm">Convert</button></td></tr>',
      stockRows: '<tr><td>Open Tasks</td><td>Backlog</td><td><div style="font-family:\'DM Mono\',monospace">132</div><div class="stock-bar"><div class="stock-fill" style="width:64%;background:var(--green)"></div></div></td><td style="font-family:\'DM Mono\',monospace">80</td><td style="font-family:\'DM Mono\',monospace">N/A</td><td style="font-family:\'DM Mono\',monospace">N/A</td><td style="font-family:\'DM Mono\',monospace;color:var(--green)">Flowing</td><td><span class="badge badge-green">Active</span></td></tr>',
      importRows: '<tr><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">#IMP-BK2</td><td>Legacy Backlog</td><td style="font-family:\'DM Mono\',monospace">76 tasks</td><td style="font-family:\'DM Mono\',monospace">KSh 0</td><td style="font-family:\'DM Mono\',monospace">--</td><td style="font-family:\'DM Mono\',monospace">--</td><td style="font-family:\'DM Mono\',monospace;color:var(--accent)">Task import</td><td><span class="badge badge-green">Loaded</span></td></tr>',
      vehicleRows: '<tr><td>03 May</td><td>🧩 Sprint Board</td><td>Sprint 12</td><td style="font-family:\'DM Mono\',monospace">5 blockers</td><td style="font-family:\'DM Mono\',monospace">32 completed</td><td style="font-family:\'DM Mono\',monospace">Velocity 38</td><td style="font-family:\'DM Mono\',monospace;color:var(--green)">On pace</td></tr>',
      customerRows: '<tr><td>Client C Team</td><td>0710 430 118</td><td>PRJ-44</td><td>Mobile App</td><td>03 May 2026</td><td style="color:var(--yellow)">06 May 2026</td><td style="font-family:\'DM Mono\',monospace">KSh 320,000</td><td><button class="btn btn-ghost btn-sm">Workspace</button></td></tr>',
      accountRows: '<tr><td>Janet M.</td><td>Project Lead</td><td>0701 220 901</td><td>Sprint + reviews</td><td>Today 08:18</td><td><span class="badge badge-green">Active</span></td><td><button class="btn btn-ghost btn-sm">Edit</button></td></tr>',
      reportTitle: "Automated Team Collaboration Summary",
      searchData: [{ type: "Task", ref: "TSK-771", detail: "UI Revamp done" }, { type: "Review", ref: "RVW-09", detail: "PR #482 pending" }],
      breakdownCardHtml: '<div class="card"><div class="card-title">Work Breakdown</div><div class="pl-row"><span class="pl-label">Tasks completed</span><span class="pl-val up">32</span></div><div class="pl-row"><span class="pl-label">In review</span><span class="pl-val up">14</span></div><div class="pl-row"><span class="pl-label">Blocked</span><span class="pl-val down">5</span></div><div class="pl-row total"><span>Sprint Velocity</span><span class="pl-val up">38</span></div></div><div class="card"><div class="card-title">⚠ Team Alerts</div><div class="pl-row"><span class="pl-label">Overdue tasks</span><span class="pl-val down">9</span></div><div class="pl-row"><span class="pl-label">Pending reviews</span><span class="pl-val down">14</span></div><div class="pl-row"><span class="pl-label">Blocked cards</span><span class="pl-val" style="color:var(--yellow)">5</span></div></div>',
      settingsServiceRows: '<tr><td>Sprint Planning</td><td>Project Ops</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Task Assignment</td><td>Workflow</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Code Review</td><td>Engineering</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr><tr><td>Status Reporting</td><td>Management</td><td style="font-family:\'DM Mono\',monospace">Enabled</td></tr>',
      reportPreviewHtml: '<div class="card"><div class="card-title">Automated Team Collaboration Summary</div><div style="background:var(--s2);border-radius:10px;padding:16px;font-family:\'DM Mono\',monospace;font-size:12px;line-height:1.9;color:var(--text)">👥 *Team Collaboration Daily*<br>✅ Tasks completed: *32*<br>🔍 Pending reviews: *14*<br>🚧 Blockers: *5*<br>⚡ Velocity: *38*</div><button class="btn btn-primary" style="margin-top:14px" onclick="sendWhatsApp()">📱 Send Now</button></div>',
      jobServiceOptions: '<option>Sprint Task</option><option>Code Review</option><option>Bug Triage</option><option>Standup Follow-up</option>',
      modalPatch: function () { setModalTitle("job-modal", "New Collaboration Workflow"); setInputPlaceholder("#jc-plate", "Task ID e.g. TSK-772"); setModalTitle("sale-modal", "Record Quick Support"); setModalTitle("quote-modal", "New Sprint Quote"); setModalTitle("customer-modal", "Add Team / Client Contact"); setModalTitle("import-modal", "Import Backlog Batch"); }
    }
  };

  window.addEventListener("DOMContentLoaded", function () {
    applyLightTheme();
    updateCommonUi();
    var domain = domainData[key];
    if (!domain) {
      relabelNavigation(["Dashboard", "Service Mgmt", "Pending Jobs", "Cashiering", "Direct Sales", "Quotations", "Stock Control", "Oil Imports", "Vehicles", "Customers", "Accounts", "Profit & Loss", "Reports", "Search", "Settings"]);
      return;
    }
    relabelNavigation(domain.nav);
    if (domain.navSections) relabelNavSections(domain.navSections);
    patchDomainSections(domain);
  });
})();
