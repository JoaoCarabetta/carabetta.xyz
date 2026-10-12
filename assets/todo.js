(function () {
  "use strict";

  var svg = function (path) {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      path +
      "</svg>"
    );
  };

  var ICONS = {
    phone: svg('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.74-1.25a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 22 16.92z"/>'),
    wallet: svg('<path d="M19 7V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1"/><path d="M2 9h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H2z"/><circle cx="16" cy="12" r="1"/>'),
    truck: svg('<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62L20.2 10.6a1 1 0 0 0-.78-.4H15"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>'),
    plane: svg('<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>'),
    file: svg('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/>'),
    bell: svg('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>'),
    calendar: svg('<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>'),
    list: svg('<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>'),
    clock: svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
    check: svg('<path d="M20 6 9 17l-5-5"/>'),
    x: svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
    pencil: svg('<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.32 4.392a.5.5 0 0 0 .623.622l4.393-1.319a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>'),
    chevronDown: svg('<path d="m6 9 6 6 6-6"/>'),
    chevronUp: svg('<path d="m18 15-6-6-6 6"/>'),
    message: svg('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>'),
    sparkles: svg('<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>')
  };

  var TYPES = [
    ["Reminder", "bell"],
    ["Event", "calendar"],
    ["Payment", "wallet"],
    ["Checklist", "list"],
    ["Call", "phone"],
    ["Timer", "clock"]
  ];

  /* Invented demo cards only. Names, amounts, and tickets are fictional. */
  var SEED = [
    {
      id: "call-group",
      kind: "Call",
      icon: "phone",
      title: "Example: call the open-data working group",
      why: "Demo reason: an agent would surface a promised follow-up from calendar and chat. This card is invented.",
      chips: [
        { t: "Example", urgent: false },
        { t: "Today", urgent: true },
        { t: "Promised follow-up", urgent: false }
      ],
      detail: "Suggested slot: 15:00–15:30. The calendar in this demo is empty.",
      actions: [
        ["primary", "Call now", "Calling… (demo)"],
        ["", "Remind me at 15:00", "Reminder set for 15:00 (demo)"]
      ]
    },
    {
      id: "dataconf",
      kind: "Payment",
      icon: "wallet",
      title: "Example: hold a booth at DataConf 2027",
      big: "R$ 480,00",
      why: "Demo reason: a fake invoice PDF would be parsed here. Amount, event, and payee are invented.",
      chips: [
        { t: "Example", urgent: false },
        { t: "Due 25/10", urgent: false },
        { t: "+ ~R$ 12 IOF if split", urgent: false }
      ],
      pix: "00000000000000",
      actions: [
        ["primary", "Copy Pix key", "Pix key copied (demo)"],
        ["", "Mark paid", "Marked as paid (demo)"]
      ]
    },
    {
      id: "hosts",
      kind: "Quotes",
      icon: "truck",
      title: "Example: compare three tile-host vendors",
      why: "Demo reason: an agent would collect quotes for static PMTiles hosting. Vendor names and prices are invented.",
      rows: [
        ["Northwind Host", "R$ 90/mo", "arrived 11:20"],
        ["Contoso Tiles", "R$ 75/mo", "arrived 12:05"],
        ["3 others", "waiting", ""]
      ],
      actions: [
        ["primary", "Accept Contoso", "Accepted Contoso (demo)"],
        ["", "Wait for all quotes", "Will notify when all replies arrive (demo)"]
      ]
    },
    {
      id: "flight",
      kind: "Flight",
      icon: "plane",
      title: "Example: Recife → Brasília, 17 Jan",
      big: "R$ 640 for 1",
      why: "Demo reason: cheaper than 16 Jan (R$ 812) in this invented sample. No real itinerary exists.",
      chips: [
        { t: "Example", urgent: false },
        { t: "Nonstop 2h10", urgent: false },
        { t: "Bags may be extra", urgent: false }
      ],
      actions: [
        ["primary", "Book", "Booking prepared (demo, nothing purchased)"],
        ["", "Skip", "Skipped (demo)"]
      ]
    },
    {
      id: "review",
      kind: "Waiting on",
      icon: "file",
      title: "Example: tract-review ticket EX-1042",
      why: "Demo reason: waiting on a fictional reviewer to approve a census-tract note. Soft follow-up drafted below.",
      chips: [
        { t: "Example", urgent: false },
        { t: "Blocked", urgent: false },
        { t: "Owner: Alex Rivera", urgent: false }
      ],
      draft:
        "Hi Alex — checking whether there is any update on example ticket EX-1042. Happy to help with anything needed on our side. Thanks!",
      actions: [
        ["primary", "Send nudge Thursday", "Nudge scheduled for Thursday (demo)"],
        ["", "Keep waiting", "OK, I will watch the inbox (demo)"]
      ]
    }
  ];

  function guess(text) {
    var t = text.toLowerCase();
    if (/r\$|pay|pix|pagar|\d+,\d\d/.test(t)) return ["Payment", "wallet"];
    if (/call|ligar/.test(t)) return ["Call", "phone"];
    if (/,| and /.test(t) && /buy|comprar|list/.test(t)) return ["Checklist", "list"];
    if (/\b(mon|tue|wed|thu|fri|sat|sun|today|tomorrow|amanhã|\d{1,2}(am|pm|h))/.test(t)) {
      return ["Event", "calendar"];
    }
    return ["Reminder", "bell"];
  }

  function greeting() {
    var hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  function todayLabel() {
    return new Date().toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });
  }

  function el(tag, attrs, html) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === "className") node.className = attrs[key];
        else if (key.indexOf("on") === 0 && typeof attrs[key] === "function") {
          node.addEventListener(key.slice(2).toLowerCase(), attrs[key]);
        } else if (attrs[key] != null) {
          node.setAttribute(key, attrs[key]);
        }
      });
    }
    if (html != null) node.innerHTML = html;
    return node;
  }

  function renderCard(card, onDismiss) {
    var root = el("article", { className: "todo-card", "data-id": card.id });
    var status = null;
    var open = false;
    var editing = false;
    var draft = card.draft;

    function setStatus(msg) {
      status = msg;
      refresh();
    }

    function refresh() {
      root.className = "todo-card" + (status ? " done" : "");
      root.innerHTML = "";

      var top = el("div", { className: "todo-top" });
      top.appendChild(el("div", { className: "todo-tile" }, ICONS[card.icon] || ICONS.bell));
      var head = el("div", { style: "flex:1" });
      head.appendChild(el("div", { className: "todo-kind" }, escapeHtml(card.kind)));
      head.appendChild(el("div", { className: "todo-title" }, escapeHtml(card.title)));
      top.appendChild(head);
      var dismiss = el("button", {
        className: "todo-icon-btn",
        type: "button",
        title: "Dismiss",
        "aria-label": "Dismiss this example card"
      }, ICONS.x);
      dismiss.addEventListener("click", onDismiss);
      top.appendChild(dismiss);
      root.appendChild(top);

      if (card.big) root.appendChild(el("div", { className: "todo-big" }, escapeHtml(card.big)));

      if (card.chips && card.chips.length) {
        var chips = el("div", { className: "todo-chips" });
        card.chips.forEach(function (chip) {
          chips.appendChild(
            el("span", { className: "todo-chip" + (chip.urgent ? " urgent" : "") }, escapeHtml(chip.t))
          );
        });
        root.appendChild(chips);
      }

      var why = el("div", { className: "todo-why" }, ICONS.sparkles + " " + escapeHtml(card.why));
      root.appendChild(why);

      if (card.rows) {
        var rows = el("div", { className: "todo-rows" });
        card.rows.forEach(function (row) {
          var line = el("div", { className: "todo-row" });
          line.appendChild(el("span", null, escapeHtml(row[0])));
          line.appendChild(
            el("span", null, escapeHtml(row[1]) + (row[2] ? ' <span class="m">' + escapeHtml(row[2]) + "</span>" : ""))
          );
          rows.appendChild(line);
        });
        root.appendChild(rows);
      }

      if (card.pix) {
        root.appendChild(el("div", { className: "todo-chip mono" }, "Example Pix " + escapeHtml(card.pix)));
      }

      if (draft !== undefined) {
        if (editing) {
          var area = document.createElement("textarea");
          area.value = draft;
          area.setAttribute("aria-label", "Edit example draft");
          area.addEventListener("input", function (event) {
            draft = event.target.value;
          });
          root.appendChild(area);
        } else {
          root.appendChild(el("div", { className: "todo-draft" }, escapeHtml(draft)));
        }
      }

      if (open) {
        root.appendChild(
          el(
            "div",
            { className: "todo-draft" },
            escapeHtml(
              card.detail ||
                "Sources in a real feed would be email, chat, and calendar. This page uses invented example data only."
            )
          )
        );
      }

      var actions = el("div", { className: "todo-actions" });
      (card.actions || []).forEach(function (action) {
        var btn = el(
          "button",
          { className: action[0] || "", type: "button" },
          (action[0] ? ICONS.check : "") + escapeHtml(action[1])
        );
        btn.addEventListener("click", function () {
          if (card.pix && action[1].indexOf("Copy") === 0 && navigator.clipboard) {
            navigator.clipboard.writeText(card.pix).catch(function () {});
          }
          setStatus(action[2]);
        });
        actions.appendChild(btn);
      });

      if (draft !== undefined) {
        var editBtn = el(
          "button",
          { type: "button" },
          ICONS.pencil + (editing ? "Done" : "Edit")
        );
        editBtn.addEventListener("click", function () {
          editing = !editing;
          refresh();
        });
        actions.appendChild(editBtn);
      }

      var expand = el(
        "button",
        { type: "button", "aria-expanded": open ? "true" : "false" },
        (open ? ICONS.chevronUp : ICONS.chevronDown) + "Expand"
      );
      expand.addEventListener("click", function () {
        open = !open;
        refresh();
      });
      actions.appendChild(expand);

      var ask = el("button", { type: "button" }, ICONS.message + "Ask");
      ask.addEventListener("click", function () {
        setStatus("Ask stays local on this demo — no chat backend.");
      });
      actions.appendChild(ask);
      root.appendChild(actions);

      if (status) {
        root.appendChild(el("div", { className: "todo-status" }, ICONS.check + escapeHtml(status)));
      }
    }

    refresh();
    return root;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function init() {
    var greetingEl = document.getElementById("todo-greeting");
    var subEl = document.getElementById("todo-sub");
    var feed = document.getElementById("todo-feed");
    var empty = document.getElementById("todo-empty");
    var input = document.getElementById("todo-input");
    var addBtn = document.getElementById("todo-add");
    var palette = document.getElementById("todo-palette");
    var typeChip = document.getElementById("todo-type-chip");
    if (!feed || !input) return;

    if (greetingEl) greetingEl.textContent = greeting() + ", João";

    var cards = SEED.slice();
    var forced = null;
    var paletteOpen = false;

    function currentType() {
      if (forced) return forced;
      if (input.value.trim()) return guess(input.value);
      return null;
    }

    function renderMeta() {
      if (subEl) {
        subEl.textContent =
          cards.length + " example things prepared for you · " + todayLabel();
      }
      if (empty) empty.hidden = cards.length > 0;
    }

    function renderTypeChip() {
      var typed = currentType();
      if (!typeChip) return;
      if (!typed) {
        typeChip.hidden = true;
        typeChip.innerHTML = "";
        return;
      }
      typeChip.hidden = false;
      typeChip.innerHTML = (ICONS[typed[1]] || "") + escapeHtml(typed[0]);
    }

    function renderPalette() {
      if (!palette) return;
      palette.hidden = !paletteOpen;
      if (!paletteOpen) return;
      palette.innerHTML = "";
      TYPES.forEach(function (pair) {
        var btn = el("button", { type: "button" }, (ICONS[pair[1]] || "") + escapeHtml(pair[0]));
        btn.addEventListener("click", function () {
          forced = pair;
          paletteOpen = false;
          input.value = input.value.replace(/\/$/, "");
          input.focus();
          renderPalette();
          renderTypeChip();
        });
        palette.appendChild(btn);
      });
    }

    function renderFeed() {
      feed.innerHTML = "";
      cards.forEach(function (card) {
        feed.appendChild(
          renderCard(card, function () {
            cards = cards.filter(function (item) {
              return item.id !== card.id;
            });
            renderFeed();
            renderMeta();
          })
        );
      });
      renderMeta();
    }

    function addCard() {
      var text = input.value.trim();
      if (!text) return;
      var typed = currentType() || ["Reminder", "bell"];
      cards.unshift({
        id: "local-" + Date.now(),
        kind: typed[0],
        icon: typed[1],
        title: text,
        why: "Created from the quick input. A real agent would fill in details here. Still example-only.",
        chips: [{ t: "Example", urgent: false }],
        actions: [
          ["primary", "Approve", "Approved (demo)"],
          ["", "Snooze", "Snoozed (demo)"]
        ]
      });
      input.value = "";
      forced = null;
      paletteOpen = false;
      renderPalette();
      renderTypeChip();
      renderFeed();
    }

    input.addEventListener("input", function (event) {
      paletteOpen = event.target.value.slice(-1) === "/";
      renderPalette();
      renderTypeChip();
    });
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        addCard();
      }
      if (event.key === "Escape") {
        paletteOpen = false;
        renderPalette();
      }
    });
    if (addBtn) addBtn.addEventListener("click", addCard);

    renderPalette();
    renderTypeChip();
    renderFeed();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
