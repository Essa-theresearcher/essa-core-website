function initFunctionalMvp(config) {
  var root = document.getElementById("mvpApp");
  if (!root) return;

  var pages = config.pages || [];
  var state = { activePage: pages[0] ? pages[0].id : "", data: {} };
  pages.forEach(function (p) { state.data[p.id] = []; });

  function esc(v) {
    return String(v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function render() {
    var active = pages.find(function (p) { return p.id === state.activePage; }) || pages[0];
    if (!active) return;
    var rows = state.data[active.id];

    root.innerHTML =
      '<div class="app-grid">' +
      '<aside class="app-nav">' +
      '<h3>' + esc(config.name) + "</h3>" +
      '<p class="subline">Operations</p>' +
      pages.map(function (p) {
        var cls = p.id === active.id ? "tab active" : "tab";
        return '<button class="' + cls + '" data-tab="' + esc(p.id) + '">• ' + esc(p.label) + "</button>";
      }).join("") +
      "</aside>" +
      '<section class="app-main">' +
      '<h2>' + esc(active.label) + "</h2>" +
      '<p class="subline">' + esc(active.description) + "</p>" +
      '<form id="addForm" class="form-row">' +
      active.fields.map(function (f) {
        return '<input required name="' + esc(f.key) + '" placeholder="' + esc(f.label) + '" />';
      }).join("") +
      '<button type="submit">Add Record</button>' +
      "</form>" +
      '<div class="list-wrap">' +
      '<table class="list"><thead><tr>' +
      active.fields.map(function (f) { return "<th>" + esc(f.label) + "</th>"; }).join("") +
      "<th>Action</th></tr></thead><tbody>" +
      (rows.length
        ? rows.map(function (r, i) {
            return "<tr>" +
              active.fields.map(function (f) { return "<td>" + esc(r[f.key] || "") + "</td>"; }).join("") +
              '<td><button class="danger" data-del="' + i + '">Delete</button></td></tr>';
          }).join("")
        : '<tr><td colspan="' + (active.fields.length + 1) + '">No records yet.</td></tr>') +
      "</tbody></table></div>" +
      "</section></div>";

    root.querySelectorAll("[data-tab]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.activePage = btn.getAttribute("data-tab");
        render();
      });
    });

    var form = document.getElementById("addForm");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var obj = {};
      active.fields.forEach(function (f) {
        obj[f.key] = form.elements[f.key].value.trim();
      });
      state.data[active.id].push(obj);
      form.reset();
      render();
    });

    root.querySelectorAll("[data-del]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = Number(btn.getAttribute("data-del"));
        state.data[active.id].splice(idx, 1);
        render();
      });
    });
  }

  render();
}
