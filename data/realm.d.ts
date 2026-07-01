export interface SupremeEntity {
  name: string;
  title: string;
  description: string;
  mystery: string;
  symbols: string[];
  relationToGods: string;
}

export interface Cartographer {
  name: string;
  title: string;
  role: string;
  introduction: string[];
  voice: string;
  visualDescription: string;
  functionInRealm: string;
  relationToUser: string;
  relationToGods: string;
}

export interface DomainDeity {
  name: string;
  title: string;
  archetype: string;
  desire: string;
  wound: string;
  gift: string;
  shadow: string;
  symbols: string[];
  speaksLike: string;
}

export interface DomainNarrative {
  premise: string;
  conflict: string;
  centralQuestion: string;
  transformation: string;
  danger: string;
  invitation: string;
}

export interface DomainVisualTheme {
  colors: string[];
  symbols: string[];
  atmosphere: string;
  landscape: string;
  sensoryDetails: string[];
}

export interface DomainInteraction {
  entryQuestion: string;
  sampleQuestions: string[];
  cartographerPrompt: string;
  userInvitation: string;
}

export interface DomainQuest {
  id: string;
  title: string;
  description: string;
  prompt: string;
  completionCriteriaPlaceholder: string;
}

export interface DomainReward {
  id: string;
  title: string;
  description: string;
  unlockConditionPlaceholder: string;
}

export interface RealmDomain {
  id: string;
  path: string;
  numeral: string;
  name: string;
  shortName: string;
  subtitle: string;
  shortDescription: string;
  longDescription: string;
  psychologicalTheme: string;
  philosophicalTheme: string;
  glyph: string;
  color: string;
  points: string;
  label: [number, number];
  deity: DomainDeity;
  narrative: DomainNarrative;
  visualTheme: DomainVisualTheme;
  interaction: DomainInteraction;
  quests: DomainQuest[];
  rewards: DomainReward[];
}

export const supremeEntity: SupremeEntity;
export const cartographer: Cartographer;
export const realmDomains: RealmDomain[];
export function getRealmDomain(domainId: string): RealmDomain | undefined;
