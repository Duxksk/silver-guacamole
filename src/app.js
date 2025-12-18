const views = document.getElementById("views");
const tabsEl = document.getElementById("tabs");
const address = document.getElementById("address");
const banner = document.getElementById("banner");

let WAYBACK_YEAR = "20050101000000";
const WAYBACK = "https://web.archive.org/web/";
const EXCLUDE = ["emupedia.net", ".swf", "localhost"];

let tabs = [];
let current = 0;

function createTab(url) {
  const iframe = document.createElement("iframe");
  views.appendChild(iframe);

  tabs.push({ iframe, url });
  switchTab(tabs.length - 1);
  navigate(url);
  renderTabs();
}

function renderTabs() {
  tabsEl.innerHTML = "";
  tabs.forEach((t, i) => {
    const div = document.createElement("div");
    div.className = "tab" + (i === current ? " active" : "");
    div.textContent = "탭";
    const close = document.createElement("span");
    close.textContent = "×";
    close.onclick = e => {
      e.stopPropagation();
      closeTab(i);
    };
    div.onclick = () => switchTab(i);
    div.appendChild(close);
    tabsEl.appendChild(div);
  });
}

function switchTab(i) {
  tabs.forEach((t, idx) => {
    t.iframe.style.display = idx === i ? "block" : "none";
  });
  current = i;
  address.value = tabs[i].url;
  renderTabs();
}

function closeTab(i) {
  views.removeChild(tabs[i].iframe);
  tabs.splice(i, 1);
  if (current >= tabs.length) current--;
  switchTab(Math.max(current, 0));
}

function shouldWayback(url) {
  return !EXCLUDE.some(e => url.includes(e));
}

function toWayback(url) {
  return `${WAYBACK}${WAYBACK_YEAR}*/${url}`;
}

function navigate(url) {
  if (!url.startsWith("http")) {
    url = "https://www.google.com/search?q=" + encodeURIComponent(url);
  }

  banner.hidden = true;
  tabs[current].url = url;
  address.value = url;

  const iframe = tabs[current].iframe;
  iframe.src = shouldWayback(url) ? toWayback(url) : url;

  iframe.onload = () => {
    try {
      if (iframe.contentWindow.location.href.includes("web.archive.org") &&
          iframe.contentDocument.body.innerText.includes("Wayback")) {
        throw 1;
      }
    } catch {
      iframe.src = url;
      banner.hidden = false;
    }
  };
}

function enter(e) {
  if (e.key === "Enter") navigate(address.value);
}

function newTab() {
  createTab("portal.html");
}

function home() {
  tabs[current].iframe.src = "portal.html";
}

function back() {
  tabs[current].iframe.contentWindow.history.back();
}

function forward() {
  tabs[current].iframe.contentWindow.history.forward();
}

function reload() {
  tabs[current].iframe.contentWindow.location.reload();
}

function changeYear(y) {
  WAYBACK_YEAR = y;
  navigate(address.value);
}

// 시작
createTab("portal.html");
