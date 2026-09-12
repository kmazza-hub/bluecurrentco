(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Presentation mode should never leave a section invisible while a long page scroll finishes.
  $$(".reveal").forEach((element) => element.classList.add("visible"));

  const status = document.createElement("div");
  status.className = "bc-action-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  document.body.appendChild(status);

  let statusTimer;
  function announce(message) {
    window.clearTimeout(statusTimer);
    status.textContent = message;
    status.classList.add("show");
    statusTimer = window.setTimeout(() => status.classList.remove("show"), 3200);
  }

  const heroLocations = ["Marina Grille", "The Wharfside", "Rod's Tavern", "Captain's Inn"];
  const heroLocationDetails = {
    "Marina Grille": ["MG", "Belmar · Waterfront dining"],
    "The Wharfside": ["WS", "Coastal dining · Dinner service"],
    "Rod's Tavern": ["RT", "Neighborhood tavern · Dinner service"],
    "Captain's Inn": ["CI", "Harbor dining · Dinner service"]
  };
  $("#switchHeroLocation")?.addEventListener("click", () => {
    const current = $("#currentLocation");
    if (!current) return;
    const next = heroLocations[(heroLocations.indexOf(current.textContent.trim()) + 1) % heroLocations.length];
    current.textContent = next;
    if ($("#heroLocationEmblem")) $("#heroLocationEmblem").textContent = heroLocationDetails[next][0];
    if ($("#heroLocationDetail")) $("#heroLocationDetail").textContent = heroLocationDetails[next][1];
    announce(`${next} demonstration selected.`);
  });

  $(".menu-button")?.addEventListener("click", (event) => {
    const expanded = event.currentTarget.getAttribute("aria-expanded") === "true";
    event.currentTarget.setAttribute("aria-label", expanded ? "Close navigation" : "Open navigation");
  });

  function createDialog(id, title, content) {
    const dialog = document.createElement("dialog");
    dialog.id = id;
    dialog.className = "bc-demo-dialog";
    dialog.innerHTML = `
      <form method="dialog" class="bc-demo-dialog-card">
        <header><div><small>BLUE CURRENT DEMO</small><h3>${title}</h3></div><button type="submit" value="cancel" aria-label="Close dialog">×</button></header>
        <div class="bc-demo-dialog-body">${content}</div>
      </form>`;
    document.body.appendChild(dialog);
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    return dialog;
  }

  const guestDialog = createDialog("hostGuestDialog", "Find a guest", `
    <label for="hostGuestLookup">Name, phone, or email</label>
    <input id="hostGuestLookup" type="search" placeholder="Try Anthony Russo" autocomplete="off">
    <div class="bc-guest-results" id="hostGuestLookupResults"></div>`);

  const guestRecords = [
    { name: "Anthony Russo", detail: "Party of 4 · Birthday · 7:30 PM", note: "Waterfront preference · Tree nut allergy" },
    { name: "Melissa Grant", detail: "Party of 2 · Anniversary · 7:15 PM", note: "Premier guest · Quiet table" },
    { name: "Priya Shah", detail: "Party of 4 · Waitlist", note: "High chair requested" }
  ];

  function renderGuestLookup(query = "") {
    const normalized = query.trim().toLowerCase();
    const matches = guestRecords.filter((guest) => !normalized || `${guest.name} ${guest.detail} ${guest.note}`.toLowerCase().includes(normalized));
    $("#hostGuestLookupResults").innerHTML = matches.length
      ? matches.map((guest) => `<button type="button" data-guest="${guest.name}"><strong>${guest.name}</strong><span>${guest.detail}</span><small>${guest.note}</small></button>`).join("")
      : "<p>No matching guest. Try a different name or phone number.</p>";
  }

  $("#hostSearchGuest")?.addEventListener("click", () => {
    renderGuestLookup();
    guestDialog.showModal();
    window.setTimeout(() => $("#hostGuestLookup")?.focus(), 0);
  });
  $("#hostGuestLookup")?.addEventListener("input", (event) => renderGuestLookup(event.target.value));
  $("#hostGuestLookupResults")?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-guest]");
    if (!button) return;
    $("#hostRecommendation").textContent = `${button.dataset.guest} selected · Guest context ready`;
    guestDialog.close();
    announce(`${button.dataset.guest}'s guest profile is ready.`);
  });

  const reservationDialog = createDialog("hostReservationDialog", "Add a reservation", `
    <div class="bc-dialog-grid">
      <label>Guest name<input name="guest" required value="Jordan Lee"></label>
      <label>Party size<select name="party"><option>2</option><option selected>4</option><option>6</option></select></label>
      <label>Time<input name="time" type="time" required value="20:00"></label>
      <label>Area<select name="area"><option>Main floor</option><option>Waterfront</option><option>Private dining</option></select></label>
    </div>
    <label>Hospitality note<input name="note" value="First visit"></label>
    <div class="bc-dialog-actions"><button type="submit" value="cancel">Cancel</button><button type="button" class="primary" id="saveDemoReservation">Save reservation</button></div>`);

  $("#hostAddReservation")?.addEventListener("click", () => reservationDialog.showModal());
  $("#operatorAddReservation")?.addEventListener("click", () => reservationDialog.showModal());
  $("#saveDemoReservation")?.addEventListener("click", () => {
    const form = $("form", reservationDialog);
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const time = String(data.get("time") || "20:00");
    const formattedTime = new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const item = document.createElement("article");
    item.className = "queue-item arrival";
    item.innerHTML = `<span class="arrival-time">${formattedTime.replace(" ", "")}</span><div><strong>${data.get("guest")}</strong><small>Party of ${data.get("party")} · ${data.get("area")} · ${data.get("note")}</small></div><span class="arrival-chip pending">Expected</span>`;
    $("#arrivalQueue")?.appendChild(item);
    const count = Number($("#reservedCount")?.textContent || 0) + 1;
    if ($("#reservedCount")) $("#reservedCount").textContent = String(count);
    reservationDialog.close();
    announce(`Reservation saved for ${data.get("guest")} at ${formattedTime}.`);
  });

  $("#waitlistQueue")?.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.textContent.trim() !== "Seat") return;
    const item = button.closest(".queue-item");
    const guest = $("strong", item)?.textContent || "Guest";
    item.remove();
    const waiting = Math.max(0, Number($("#waitlistBadge")?.textContent || 0) - 1);
    if ($("#waitlistBadge")) $("#waitlistBadge").textContent = String(waiting);
    if ($("#hostWaiting")) $("#hostWaiting").textContent = String(waiting);
    if ($("#hostSeated")) $("#hostSeated").textContent = String(Number($("#hostSeated").textContent || 0) + 1);
    announce(`${guest} has been seated.`);
  });

  const hostViews = {
    Floor: "Dining room",
    Reservations: "Reservation book",
    Waitlist: "Waitlist control",
    Guests: "Guest profiles"
  };
  $$(".host-nav button").forEach((button) => button.addEventListener("click", () => {
    const view = button.textContent.trim();
    const heading = $(".host-topbar h3");
    if (heading) heading.textContent = hostViews[view] || "Dining room";
    announce(`${view} view selected.`);
  }));

  $$(".host-floor-toolbar button").forEach((button) => button.addEventListener("click", () => {
    const area = button.textContent.trim();
    const copy = {
      "Main floor": "Main floor selected · Four tables currently available",
      Waterfront: "Waterfront selected · Table 14 opens in 12 minutes",
      "Private dining": "Private dining selected · Event configuration ready"
    };
    if ($("#hostRecommendation")) $("#hostRecommendation").textContent = copy[area] || `${area} selected`;
  }));

  $$(".host-table").forEach((table) => {
    table.tabIndex = 0;
    table.setAttribute("role", "button");
    table.setAttribute("aria-label", `Select table ${table.dataset.table}`);
    table.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        table.click();
      }
    });
  });

  $("#viewGuestIntelligence")?.addEventListener("click", () => {
    $("#guest-intelligence")?.scrollIntoView({ block: "start" });
    window.history.replaceState(null, "", "#guest-intelligence");
  });

  $("#downloadBriefing")?.addEventListener("click", () => {
    const range = $(".exec-range button.active")?.dataset.range || "Tonight";
    const summary = $("#execSummaryText")?.textContent?.trim() || $("#executiveBrief")?.textContent?.trim() || "Live operating briefing";
    const content = [
      "BLUE CURRENT — EXECUTIVE SERVICE BRIEFING",
      `Reporting range: ${range}`,
      `Generated: ${new Date().toLocaleString()}`,
      "",
      `Expected guests: ${$("#execGuests")?.textContent || "—"}`,
      `Reservations: ${$("#execReservations")?.textContent || "—"}`,
      `Calls answered: ${$("#execCalls")?.textContent || "—"}`,
      `Estimated revenue influenced: ${$("#execRevenue")?.textContent || "—"}`,
      "",
      summary,
      "",
      "Illustrative demonstration data. Not audited operating results."
    ].join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `blue-current-briefing-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce("Executive briefing downloaded.");
  });

  const heatmapStatus = document.createElement("p");
  heatmapStatus.className = "heatmap-selection-status";
  heatmapStatus.setAttribute("aria-live", "polite");
  $(".analytics-heatmap-panel")?.appendChild(heatmapStatus);
  const heatmapDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  $$(".analytics-heatmap button").forEach((button, index) => {
    const day = heatmapDays[Math.floor(index / 5)] || "Service day";
    const hour = ["5 PM", "6 PM", "7 PM", "8 PM", "9 PM"][index % 5];
    const intensity = Math.round(Number.parseFloat(getComputedStyle(button).getPropertyValue("--v") || "1") * 100);
    button.setAttribute("aria-label", `${day} at ${hour}, demand intensity ${intensity}%`);
    button.addEventListener("click", () => {
      $$(".analytics-heatmap button").forEach((cell) => cell.classList.remove("selected"));
      button.classList.add("selected");
      heatmapStatus.textContent = `${day}, ${hour}: demand intensity ${intensity}%.`;
    });
  });

  $$(".location-performance-row").forEach((row) => {
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.setAttribute("aria-label", `View ${row.dataset.location} details`);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        row.click();
      }
    });
  });

  const operatorViewNames = {
    Overview: "Good evening, Keith.",
    Reservations: "Reservation operations",
    Calls: "Guest call performance",
    Waitlist: "Waitlist performance",
    Guests: "Guest intelligence",
    Locations: "Location performance",
    Analytics: "Hospitality analytics"
  };
  $$(".operator-nav button").forEach((button) => button.addEventListener("click", () => {
    const view = button.textContent.trim();
    const heading = $(".operator-topbar h3");
    if (heading) heading.textContent = operatorViewNames[view] || view;
    announce(`${view} operator view selected.`);
  }));

  function downloadOperatorReport() {
    const location = $(".operator-location-tabs button.active")?.dataset.location || "Marina Grille";
    const content = [
      "BLUE CURRENT — OPERATOR REPORT",
      `Location: ${location}`,
      `Generated: ${new Date().toLocaleString()}`,
      "",
      `Expected guests: ${$("#opGuests")?.textContent || "—"}`,
      `Reservations: ${$("#opReservations")?.textContent || "—"}`,
      `Calls answered: ${$("#opCalls")?.textContent || "—"}`,
      `Waitlist: ${$("#opWaitlist")?.textContent || "—"}`,
      "",
      $("#managerSummary")?.textContent?.trim() || "",
      "",
      "Illustrative demonstration data."
    ].join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `blue-current-operator-report-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce("Operator report downloaded.");
  }
  $("#operatorExportReport")?.addEventListener("click", downloadOperatorReport);

  const allReservationsDialog = createDialog("allReservationsDialog", "Upcoming reservations", `
    <div class="bc-guest-results">
      <button type="button" data-reservation="Anthony Russo"><strong>7:30 · Anthony Russo</strong><span>Party of 4 · Birthday · Waterfront</span><small>Confirmed</small></button>
      <button type="button" data-reservation="Melissa Grant"><strong>7:45 · Melissa Grant</strong><span>Party of 2 · Anniversary · Window</span><small>Arrived</small></button>
      <button type="button" data-reservation="Daniel Cho"><strong>8:00 · Daniel Cho</strong><span>Party of 6 · Main room</span><small>Confirmed</small></button>
      <button type="button" data-reservation="Sofia Patel"><strong>8:15 · Sofia Patel</strong><span>Party of 3 · Quiet table</span><small>Confirmed</small></button>
    </div>`);
  $("#operatorViewAllReservations")?.addEventListener("click", () => allReservationsDialog.showModal());
  allReservationsDialog.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-reservation]");
    if (!button) return;
    allReservationsDialog.close();
    announce(`${button.dataset.reservation}'s reservation selected.`);
  });
})();
