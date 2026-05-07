function initMvpViewGuard(config) {
  var appKey = config.appKey;
  var durationMs = 10 * 60 * 1000;
  var stateKey = "essacore_guard_" + appKey;

  var gate = document.getElementById("gate");
  var gateStartBtn = document.getElementById("gateStartBtn");
  var appRoot = document.getElementById("appRoot");
  var timerEl = document.getElementById("timer");
  var lock = document.getElementById("lock");

  function getState() {
    try {
      var raw = localStorage.getItem(stateKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setState(state) {
    localStorage.setItem(stateKey, JSON.stringify(state));
  }

  function lockForever() {
    setState({ status: "expired" });
    appRoot.style.display = "none";
    gate.style.display = "none";
    lock.style.display = "flex";
  }

  function showApp(expiresAt) {
    gate.style.display = "none";
    lock.style.display = "none";
    appRoot.style.display = "block";

    var tick = setInterval(function () {
      var left = expiresAt - Date.now();
      if (left <= 0) {
        clearInterval(tick);
        lockForever();
        return;
      }
      var min = Math.floor(left / 60000);
      var sec = Math.floor((left % 60000) / 1000);
      timerEl.textContent = String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
    }, 250);
  }

  function expireOnLeave() {
    var state = getState();
    if (!state || state.status !== "active") return;
    setState({ status: "expired" });
  }

  function boot() {
    var state = getState();
    if (state && state.status === "expired") {
      lockForever();
      return;
    }
    if (state && state.status === "active" && Date.now() < state.expiresAt) {
      showApp(state.expiresAt);
      return;
    }
    if (state && state.status === "active" && Date.now() >= state.expiresAt) {
      lockForever();
      return;
    }
    gate.style.display = "flex";
    appRoot.style.display = "none";
    lock.style.display = "none";
  }

  gateStartBtn.addEventListener("click", function () {
    var expiresAt = Date.now() + durationMs;
    setState({ status: "active", expiresAt: expiresAt });
    showApp(expiresAt);
  });

  // Hard rule: once viewer leaves this page, access is permanently expired.
  window.addEventListener("pagehide", expireOnLeave);
  window.addEventListener("beforeunload", expireOnLeave);

  // Best-effort deterrence only (OS screenshots cannot be fully blocked in browsers).
  document.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  document.addEventListener("keydown", function (e) {
    var k = e.key.toLowerCase();
    var blocked = e.key === "PrintScreen" ||
      ((e.ctrlKey || e.metaKey) && e.shiftKey && (k === "3" || k === "4" || k === "5" || k === "i" || k === "j")) ||
      ((e.ctrlKey || e.metaKey) && (k === "u" || k === "s" || k === "p"));
    if (blocked) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden && appRoot.style.display === "block") {
      appRoot.classList.add("blurred");
    } else {
      appRoot.classList.remove("blurred");
    }
  });

  boot();
}
