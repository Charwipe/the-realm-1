// @ts-check

import { cartographer, getRealmDomain, supremeEntity } from "../data/realm.js";

const domainId = document.body.dataset.domainId ?? "";
const domain = getRealmDomain(domainId);

if (!domain) {
  document.title = "Uncharted Realm — REALM";
  const realmContent = /** @type {HTMLElement} */ (document.querySelector("#realm-content"));
  realmContent.innerHTML = `
    <section class="realm-error">
      <p class="section-kicker">Beyond the known map</p>
      <h1>This realm has not yet been charted.</h1>
      <a class="realm-button" href="../index.html#realm-map">Return to the map</a>
    </section>
  `;
  throw new Error(`Unknown realm domain: ${domainId}`);
}

document.title = `${domain.name} — REALM`;
document.body.style.setProperty("--realm-color", domain.color);
document.querySelector('meta[name="description"]')?.setAttribute("content", domain.shortDescription);

/** @param {string} selector @param {string} value */
const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
};

/** @param {string} selector @param {string[]} items */
const renderList = (selector, items) => {
  const list = document.querySelector(selector);
  if (!list) return;
  list.replaceChildren(
    ...items.map((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      return listItem;
    }),
  );
};

setText("#realm-number", `Realm ${domain.numeral} of VI`);
setText("#realm-glyph", domain.glyph);
setText("#realm-title", domain.name);
setText("#realm-subtitle", domain.subtitle);
setText("#realm-description", domain.longDescription);
setText("#deity-name", domain.deity.name);
setText("#deity-title", domain.deity.title);
setText("#deity-archetype", domain.deity.archetype);
setText("#deity-desire", domain.deity.desire);
setText("#deity-wound", domain.deity.wound);
setText("#deity-gift", domain.deity.gift);
setText("#deity-shadow", domain.deity.shadow);
setText("#deity-voice", domain.deity.speaksLike);
setText("#narrative-premise", domain.narrative.premise);
setText("#narrative-conflict", domain.narrative.conflict);
setText("#narrative-question", domain.narrative.centralQuestion);
setText("#narrative-transformation", domain.narrative.transformation);
setText("#narrative-danger", domain.narrative.danger);
setText("#narrative-invitation", domain.narrative.invitation);
setText("#psychological-theme", domain.psychologicalTheme);
setText("#philosophical-theme", domain.philosophicalTheme);
setText("#visual-atmosphere", domain.visualTheme.atmosphere);
setText("#visual-landscape", domain.visualTheme.landscape);
setText("#entry-question", domain.interaction.entryQuestion);
setText("#user-invitation", domain.interaction.userInvitation);
setText("#quest-title", domain.quests[0].title);
setText("#quest-description", domain.quests[0].description);
setText("#quest-prompt", domain.quests[0].prompt);
setText("#reward-title", domain.rewards[0].title);
setText("#reward-description", domain.rewards[0].description);
setText("#cartographer-placeholder", `Speak with ${cartographer.name} about ${domain.shortName} — coming soon.`);
setText("#supreme-reference", `${supremeEntity.name} remains beyond this realm, worshipped even by ${domain.deity.name}.`);

renderList("#deity-symbols", domain.deity.symbols);
renderList("#visual-symbols", domain.visualTheme.symbols);
renderList("#sensory-details", domain.visualTheme.sensoryDetails);
renderList("#sample-questions", domain.interaction.sampleQuestions);

const palette = document.querySelector("#visual-colors");
if (palette) {
  palette.replaceChildren(
    ...domain.visualTheme.colors.map((color) => {
      const chip = document.createElement("li");
      chip.textContent = color;
      return chip;
    }),
  );
}
