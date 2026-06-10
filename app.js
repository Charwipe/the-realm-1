const realms = [
  {
    id: "being",
    path: "realms/ocean-of-being.html",
    numeral: "I",
    name: "The Ocean of Being",
    shortName: "Ocean of Being",
    description: "Presence, awareness, and the mystery beneath all experience.",
    prompt: "What remains when all else falls away?",
    glyph: "≋",
    color: "#69c8dc",
    points: "0,0 605,0 605,140 700,350 570,660 0,670",
    label: [300, 375],
  },
  {
    id: "perception",
    path: "realms/theatre-of-perception.html",
    numeral: "II",
    name: "The Theatre of Perception",
    shortName: "Theatre of Perception",
    description: "Sensation, imagination, and the stage upon which reality appears.",
    prompt: "How is your world being made?",
    glyph: "◉",
    color: "#c58fd9",
    points: "605,0 1330,0 1330,70 1375,570 1160,760 610,650 690,365",
    label: [960, 370],
  },
  {
    id: "thought",
    path: "realms/forge-of-thought.html",
    numeral: "III",
    name: "The Forge of Thought",
    shortName: "Forge of Thought",
    description: "Ideas, beliefs, and the bright machinery of the thinking mind.",
    prompt: "Which thoughts are shaping you?",
    glyph: "✺",
    color: "#ed9d56",
    points: "1330,0 2048,0 2048,675 1715,690 1370,570",
    label: [1690, 345],
  },
  {
    id: "emotion",
    path: "realms/field-of-emotion.html",
    numeral: "IV",
    name: "The Field of Emotion",
    shortName: "Field of Emotion",
    description: "Feeling, longing, and the inner weather that colors our days.",
    prompt: "What is asking to be felt?",
    glyph: "♡",
    color: "#ec88a9",
    points: "0,610 610,600 905,840 800,1365 0,1365",
    label: [370, 930],
  },
  {
    id: "action",
    path: "realms/path-of-action.html",
    numeral: "V",
    name: "The Path of Action",
    shortName: "Path of Action",
    description: "Choice, practice, and the winding road from intention to change.",
    prompt: "What is your next true step?",
    glyph: "↟",
    color: "#dac071",
    points: "610,580 1260,570 1470,800 1250,1365 760,1365 865,870",
    label: [1085, 900],
  },
  {
    id: "meaning",
    path: "realms/mountain-of-meaning.html",
    numeral: "VI",
    name: "The Mountain of Meaning",
    shortName: "Mountain of Meaning",
    description: "Purpose, belonging, and the summit from which life takes shape.",
    prompt: "What makes the climb worthwhile?",
    glyph: "△",
    color: "#9db5e9",
    points: "1270,570 2048,540 2048,1365 1220,1365 1420,820",
    label: [1670, 900],
  },
];

const hotspotLayer = document.querySelector("#hotspot-layer");
const realmGrid = document.querySelector("#realm-grid");
const mapStage = document.querySelector("#map-stage");
const tooltip = document.querySelector("#map-tooltip");
const tooltipGlyph = tooltip.querySelector(".map-tooltip__glyph");
const tooltipName = tooltip.querySelector("strong");

const svgNamespace = "http://www.w3.org/2000/svg";

function createHotspot(realm) {
  const link = document.createElementNS(svgNamespace, "a");
  link.setAttribute("href", realm.path);
  link.setAttribute("aria-label", `Explore ${realm.name}`);
  link.dataset.realm = realm.id;

  const polygon = document.createElementNS(svgNamespace, "polygon");
  polygon.setAttribute("points", realm.points);
  polygon.setAttribute("class", "realm-hotspot");
  polygon.style.setProperty("--realm-color", realm.color);

  const marker = document.createElementNS(svgNamespace, "g");
  marker.setAttribute("class", "hotspot-marker");
  marker.setAttribute("transform", `translate(${realm.label[0]} ${realm.label[1]})`);
  marker.innerHTML = `
    <circle class="hotspot-marker__pulse" r="36"></circle>
    <circle class="hotspot-marker__ring" r="25"></circle>
    <circle class="hotspot-marker__core" r="4"></circle>
  `;

  link.append(polygon, marker);
  hotspotLayer.append(link);

  const activate = () => showRealm(realm, link);
  const deactivate = () => hideRealm(link);
  link.addEventListener("pointerenter", activate);
  link.addEventListener("pointerleave", deactivate);
  link.addEventListener("focus", activate);
  link.addEventListener("blur", deactivate);
}

function createCard(realm) {
  const card = document.createElement("a");
  card.className = "realm-card";
  card.id = realm.id;
  card.href = realm.path;
  card.dataset.realm = realm.id;
  card.style.setProperty("--realm-color", realm.color);
  card.innerHTML = `
    <span class="realm-card__number">${realm.numeral}</span>
    <span class="realm-card__glyph" aria-hidden="true">${realm.glyph}</span>
    <span class="realm-card__body">
      <span class="realm-card__name">${realm.name}</span>
      <span class="realm-card__description">${realm.description}</span>
      <span class="realm-card__prompt">${realm.prompt}</span>
    </span>
    <span class="realm-card__arrow" aria-hidden="true">↗</span>
  `;

  card.addEventListener("pointerenter", () => highlightMap(realm.id, true));
  card.addEventListener("pointerleave", () => highlightMap(realm.id, false));
  card.addEventListener("focus", () => highlightMap(realm.id, true));
  card.addEventListener("blur", () => highlightMap(realm.id, false));

  realmGrid.append(card);
}

function showRealm(realm, hotspot) {
  hotspot.classList.add("is-active");
  mapStage.classList.add("has-active-realm");
  tooltipGlyph.textContent = realm.glyph;
  tooltipName.textContent = realm.name;
  tooltip.style.setProperty("--realm-color", realm.color);

  const xPercent = (realm.label[0] / 2048) * 100;
  const yPercent = (realm.label[1] / 1365) * 100;
  tooltip.style.left = `${xPercent}%`;
  tooltip.style.top = `${yPercent}%`;
  tooltip.classList.add("is-visible");

  document.querySelector(`.realm-card[data-realm="${realm.id}"]`)?.classList.add("is-active");
}

function hideRealm(hotspot) {
  hotspot.classList.remove("is-active");
  mapStage.classList.remove("has-active-realm");
  tooltip.classList.remove("is-visible");
  document.querySelector(`.realm-card[data-realm="${hotspot.dataset.realm}"]`)?.classList.remove("is-active");
}

function highlightMap(realmId, isActive) {
  const hotspot = hotspotLayer.querySelector(`[data-realm="${realmId}"]`);
  const realm = realms.find((item) => item.id === realmId);
  if (!hotspot || !realm) return;
  if (isActive) showRealm(realm, hotspot);
  else hideRealm(hotspot);
}

realms.forEach((realm) => {
  createHotspot(realm);
  createCard(realm);
});

