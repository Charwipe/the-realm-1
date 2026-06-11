// @ts-check

import { cartographer, realmDomains, supremeEntity } from "./data/realm.js";

const realms = realmDomains;

const hotspotLayer = /** @type {SVGSVGElement} */ (document.querySelector("#hotspot-layer"));
const realmGrid = /** @type {HTMLElement} */ (document.querySelector("#realm-grid"));
const mapStage = /** @type {HTMLElement} */ (document.querySelector("#map-stage"));
const tooltip = /** @type {HTMLElement} */ (document.querySelector("#map-tooltip"));
const tooltipGlyph = /** @type {HTMLElement} */ (tooltip.querySelector(".map-tooltip__glyph"));
const tooltipName = /** @type {HTMLElement} */ (tooltip.querySelector("strong"));
const tooltipDetail = /** @type {HTMLElement} */ (tooltip.querySelector("small"));

const svgNamespace = "http://www.w3.org/2000/svg";

/** @param {import("./data/realm.js").RealmDomain} realm */
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

/** @param {import("./data/realm.js").RealmDomain} realm */
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
      <span class="realm-card__deity">Ruled by ${realm.deity.name}, ${realm.deity.title}</span>
      <span class="realm-card__description">${realm.shortDescription}</span>
      <span class="realm-card__prompt">${realm.interaction.entryQuestion}</span>
    </span>
    <span class="realm-card__arrow" aria-hidden="true">↗</span>
  `;

  card.addEventListener("pointerenter", () => highlightMap(realm.id, true));
  card.addEventListener("pointerleave", () => highlightMap(realm.id, false));
  card.addEventListener("focus", () => highlightMap(realm.id, true));
  card.addEventListener("blur", () => highlightMap(realm.id, false));

  realmGrid.append(card);
}

/** @param {import("./data/realm.js").RealmDomain} realm @param {SVGAElement} hotspot */
function showRealm(realm, hotspot) {
  hotspot.classList.add("is-active");
  mapStage.classList.add("has-active-realm");
  tooltipGlyph.textContent = realm.glyph;
  tooltipName.textContent = realm.name;
  tooltipDetail.textContent = `${realm.deity.name} · ${realm.deity.title}`;
  tooltip.style.setProperty("--realm-color", realm.color);

  const xPercent = (realm.label[0] / 2048) * 100;
  const yPercent = (realm.label[1] / 1365) * 100;
  tooltip.style.left = `${xPercent}%`;
  tooltip.style.top = `${yPercent}%`;
  tooltip.classList.add("is-visible");

  document.querySelector(`.realm-card[data-realm="${realm.id}"]`)?.classList.add("is-active");
}

/** @param {SVGAElement} hotspot */
function hideRealm(hotspot) {
  hotspot.classList.remove("is-active");
  mapStage.classList.remove("has-active-realm");
  tooltip.classList.remove("is-visible");
  document.querySelector(`.realm-card[data-realm="${hotspot.dataset.realm}"]`)?.classList.remove("is-active");
}

/** @param {string} realmId @param {boolean} isActive */
function highlightMap(realmId, isActive) {
  const hotspot = /** @type {SVGAElement | null} */ (hotspotLayer.querySelector(`[data-realm="${realmId}"]`));
  const realm = realms.find((item) => item.id === realmId);
  if (!hotspot || !realm) return;
  if (isActive) showRealm(realm, hotspot);
  else hideRealm(hotspot);
}

function renderMythologyFrame() {
  const cartographerHeading = document.querySelector("#cartographer-heading");
  const cartographerBody = document.querySelector("#cartographer-copy-body");
  const mythologyText = document.querySelector("#mythology-text");
  const supremeName = document.querySelector("#supreme-entity-name");

  if (cartographerHeading) cartographerHeading.textContent = `Meet ${cartographer.name}`;
  if (cartographerBody) {
    cartographerBody.replaceChildren(
      ...cartographer.introduction.map((paragraph) => {
        const element = document.createElement("p");
        element.textContent = paragraph;
        return element;
      }),
    );
  }
  if (mythologyText) {
    mythologyText.textContent = `Each realm is ruled by a deity with a gift, a wound, and a question. Even the gods orient themselves toward ${supremeEntity.name}, ${supremeEntity.title.toLowerCase()}. ${cartographer.name} carries a lantern between their territories, helping each traveler find the road their question has opened.`;
  }
  if (supremeName) supremeName.textContent = supremeEntity.name;
}

renderMythologyFrame();

realms.forEach((realm) => {
  createHotspot(realm);
  createCard(realm);
});

