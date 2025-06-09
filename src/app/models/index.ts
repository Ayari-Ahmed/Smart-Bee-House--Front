// Model interfaces for Smart Bee House application

export interface User {
  id: number;
  username: string;
  password?: string;
  nom: string;
  prenom: string;
  email: string;
  phoneNumber: string;
  role: string;
}

export interface Fermier extends User {
  fermes?: Ferme[];
}

export interface Agent extends User {
  role: string;
}

export interface Ferme {
  id: number;
  nom: string;
  surface: number;
  fermier?: Fermier;
  siteApiculture?: SiteApiculture;
}

export interface SiteApiculture {
  id: number;
  nom: string;
  localisation: string;
  coordonnees: string;
  ferme?: Ferme;
  ruches?: Ruche[];
}

export enum TypeCadre {
  STANDARD = 'STANDARD',
  DADANT = 'DADANT',
  LANGSTROTH = 'LANGSTROTH'
}

export enum TypeComposant {
  HAUSSE = 'HAUSSE',
  CORPS = 'CORPS',
  PLANCHER = 'PLANCHER',
  TOIT = 'TOIT'
}

export enum StatutRuche {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EN_PREPARATION = 'EN_PREPARATION'
}

export enum TypeMesure {
  POIDS = 'POIDS',
  TEMPERATURE = 'TEMPERATURE',
  HUMIDITE = 'HUMIDITE'
}

export interface ComposantRuche {
  id: number;
  type: TypeComposant;
  description: string;
  dateAjout: Date;
  ruche?: Ruche;
}

export interface Cadre {
  id: number;
  type: TypeCadre;
  dateInstallation: Date;
  description: string;
  composantRuche?: ComposantRuche;
}

export interface Ruche {
  id: number;
  nom: string;
  dateInstallation: Date;
  statut: StatutRuche;
  agent?: Agent;
  siteApiculture?: SiteApiculture;
  composants?: ComposantRuche[];
  mesures?: Mesure[];
}

export interface Mesure {
  id: number;
  type: TypeMesure;
  valeur: number;
  date: Date;
  ruche?: Ruche;
}

export interface PlanningVisite {
  id: number;
  datePrevu: Date;
  description: string;
  isCompleted: boolean;
  ruche?: Ruche;
  agent?: Agent;
}

export interface RapportVisite {
  id: number;
  titre: string;
  description: string;
  date: Date;
  presenceReine: boolean;
  presenceCouvain: boolean;
  presenceVarroa: boolean;
  comportementDefensif: boolean;
  forceDeLaColonie: number;
  actionsMenees: string;
  recommandations: string;
  planningVisite?: PlanningVisite;
  agent?: Agent;
  ruche?: Ruche;
}