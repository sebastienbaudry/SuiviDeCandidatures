import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Calendar, Building2, MapPin, Users, Target, TrendingUp, CheckCircle2, XCircle, Clock, Star, Mail, Copy, Send, ExternalLink } from 'lucide-react';

const STORAGE_KEY = 'candidatures-bim';
const SHARED_STORAGE = false;

// Profile data from CV and formation
const PROFILE_DATA = {
  nom: "Anthony BAUDRY",
  email: "baudry.anthony44@gmail.com",
  tel: "07 69 93 59 79",
  localisation: "Boussay (44)",
  formation_actuelle: "BTS Bâtiment au Lycée Rosa Parks (La Roche-sur-Yon)",
  licence_cible: "Licence Professionnelle NSC - Le Numérique sur les Chantiers du BTP",
  iut: "IUT de Saint-Nazaire, Nantes Université",
  periode_alternance: "2 à 3 semaines / mois en entreprise",
  debut_alternance: "Septembre 2026",
  competences_cles: [
    "Modélisation BIM (Revit, AutoCAD, So Build PIC Revit, Arche)",
    "Topographie & Implantation (théodolite, niveau laser)",
    "Suivi de chantier et méthodes",
    "Extraction de quantitatifs et métrés",
    "Lecture de plans complexes"
  ],
  experience_principale: "Assistant Conducteur de Travaux chez MRC Constructions (suivi de 4 chantiers industriels en gros œuvre)",
  projet_marquant: "Maquette numérique complète d'un bâtiment résidentiel avec extraction de quantitatifs",
  points_forts: [
    "Esprit collaboratif",
    "Rigueur et organisation", 
    "Autonomie sur le terrain"
  ],
  motivation: "développer mes compétences sur les nouvelles technologies appliquées au BTP, notamment l'acquisition de données, la modélisation et l'exploitation de la maquette numérique en phase chantier"
};

const FORMATION_NSC = {
  duree_entreprise: "35 semaines en entreprise",
  duree_iut: "17 semaines à l'IUT dont 4 semaines de projets tutorés",
  modules_cles: [
    "Acquisition et traitement des données (lasergrammétrie, photogrammétrie, nuages de points)",
    "Modélisation de maquettes numériques (Revit, ArchiCAD, Mensura, Covadis)",
    "Exploitation des données et gestion de projets BIM",
    "Détection de conflits et synthèse (Navisworks)",
    "Organisation et suivi de chantier",
    "Réalité virtuelle et augmentée, robotisation"
  ],
  debouches: "Modeleur Projeteur en génie civil, BIM Coordinateur, Géomètre, Projeteur Méthode",
  contacts: {
    nicolas_bernier: "nicolas.bernier@univ-nantes.fr",
    christophe_couve: "christophe.couve@univ-nantes.fr"
  }
};

const STATUS_CONFIG = {
  pending: { label: 'À envoyer', color: 'bg-gray-100 text-gray-700', icon: Clock },
  sent: { label: 'Envoyé', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
  relance: { label: 'Relance à faire', color: 'bg-yellow-100 text-yellow-700', icon: Calendar },
  entretien: { label: 'Entretien', color: 'bg-green-100 text-green-700', icon: Star },
  refus: { label: 'Refus', color: 'bg-red-100 text-red-700', icon: XCircle }
};

const PRIORITY_CONFIG = {
  1: { label: '🏆 Priorité 1', color: 'text-yellow-600' },
  2: { label: '🥈 Priorité 2', color: 'text-gray-500' },
  3: { label: '🥉 Priorité 3', color: 'text-orange-600' }
};

// DONNÉES MISES À JOUR AVEC RECHERCHES
const INITIAL_DATA = [
  { id: 1, entreprise: "Botte Fondations (Vinci)", localisation: "St-Herblain / Nantes / St-Nazaire", effectifs: "~500", priorite: 1, probabilite: "Très forte / partenaire", interets: "Guidage machines, modélisation sols, proche IUT", contact: "bottefondations@vinci-construction.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Spécialiste fondations profondes. Vérifier si offre spécifique sur site Vinci.", siteRecrutement: "https://www.vinci-construction.com/carrieres" },
  { id: 2, entreprise: "ALP Géomètres", localisation: "St-Nazaire (Bd Victor Hugo) & Nantes", effectifs: "15-20", priorite: 1, probabilite: "Forte", interets: "Scanner 3D + drones, structure humaine", contact: "contact@alp-geometres.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Julien Pottier / Thierry Legros (Gérants). Très actifs sur le bassin nazairien.", siteRecrutement: "https://www.alp-geometres.fr/contact" },
  { id: 3, entreprise: "Atlantique Géomètres Experts", localisation: "St-Nazaire & La Baule", effectifs: "20-30", priorite: 1, probabilite: "Forte", interets: "Scan 3D → maquettes BIM", contact: "secretariat@age-lb.com", status: "pending", dateCandidature: "", dateRelance: "", notes: "Fabien Palfroy / Germain Batard (Associés). Adresses mails spécifiques possibles : fabien.palfroy@geometre-expert.fr", siteRecrutement: "https://www.age-lb.com" },
  { id: 4, entreprise: "Chantiers de l'Atlantique", localisation: "St-Nazaire", effectifs: "~3 500", priorite: 1, probabilite: "Très forte", interets: "Contrôle laser, précision industrielle", contact: "Via site carrières", status: "pending", dateCandidature: "", dateRelance: "", notes: "150 alternants/an. École interne. Viser le service 'Métrologie / Contrôle dimensionnel'.", siteRecrutement: "https://carrieres-offresemploi.chantiers-atlantique.com" },
  { id: 5, entreprise: "GEOFIT", localisation: "Nantes (Rue Alfred Kastler)", effectifs: "~1 500", priorite: 2, probabilite: "Très forte", interets: "Drone, LiDAR, géomatique, gros projets", contact: "rh@geofit.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Siège à Nantes. Très gros acteur du LiDAR et Scan to BIM.", siteRecrutement: "https://geofit.fr/carrieres/" },
  { id: 6, entreprise: "QUARTA", localisation: "St-Herblain / Nantes", effectifs: "~250", priorite: 2, probabilite: "Forte", interets: "BIM 3D, scan laser", contact: "contact@quarta.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Agence Nantes : 3 Rue du Moulin de la Rousselière, St-Herblain.", siteRecrutement: "https://www.quarta.fr/recrutement/" },
  { id: 7, entreprise: "S3D Engineering United", localisation: "Nantes", effectifs: "réseau", priorite: 2, probabilite: "Moy./Forte", interets: "ISO 19650, scan → Revit/IFC", contact: "contact@s3d-engineering.com", status: "pending", dateCandidature: "", dateRelance: "", notes: "Spécialistes purs du Scan to BIM. Franchise 'S3D Partner'.", siteRecrutement: "https://www.s3dengineering.net" },
  { id: 8, entreprise: "ScanFACTORY", localisation: "St-Philbert-de-Grand-Lieu (Sud Nantes)", effectifs: "2-10", priorite: 2, probabilite: "Moy./Forte", interets: "Scan-to-BIM pur, PME technique", contact: "contact@scanfactory.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Très niche. Contact direct recommandé.", siteRecrutement: "https://scanfactory.fr" },
  { id: 9, entreprise: "HeyBIM", localisation: "Nantes & alentours", effectifs: "<50 estimé", priorite: 2, probabilite: "Moyenne", interets: "Relevés + photogrammétrie + BIM", contact: "contact@heybim.io", status: "pending", dateCandidature: "", dateRelance: "", notes: "Start-up / PME agile. Tel: 06 35 27 48 98.", siteRecrutement: "https://heybim.io" },
  { id: 10, entreprise: "AGEIS", localisation: "Ste-Luce / Nantes", effectifs: "~10-50", priorite: 2, probabilite: "Moyenne", interets: "Géomètre, relevés 3D", contact: "rh@ageis-ge.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Candidatures spontanées encouragées sur leur site.", siteRecrutement: "https://www.ageis-ge.fr/recrutement/" },
  { id: 11, entreprise: "GEOSAT", localisation: "Nantes (Carquefou)", effectifs: "~500", priorite: 2, probabilite: "Variable", interets: "Cartographie mobile, LiDAR, BIM", contact: "recrutement@geosat.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Spécialistes détection réseaux et 3D.", siteRecrutement: "https://www.geosat.fr" },
  { id: 12, entreprise: "Groupe EJ / BAM", localisation: "Région nantaise", effectifs: ">500", priorite: 3, probabilite: "Moyenne", interets: "Préfa numérique", contact: "", status: "pending", dateCandidature: "", dateRelance: "", notes: "", siteRecrutement: "" },
  { id: 13, entreprise: "AIA Life Designers / Artelia", localisation: "Nantes (Ile de Nantes)", effectifs: "gros groupe", priorite: 3, probabilite: "Moyenne", interets: "LOD 400-500, coordination BIM", contact: "Via site web", status: "pending", dateCandidature: "", dateRelance: "", notes: "Gros bureau d'études, très structuré en BIM Management.", siteRecrutement: "https://www.aialifedesigners.com/carrieres/" },
  { id: 14, entreprise: "AC Environnement", localisation: "Pont-Saint-Martin / Nantes", effectifs: "~100-200", priorite: 3, probabilite: "Moyenne", interets: "Drone + maquette pour maintenance, diagnostic BIM 4.0", contact: "02 52 33 12 53", status: "pending", dateCandidature: "", dateRelance: "", notes: "Scan laser, nuages de points → modélisation 3D pour l'existant.", siteRecrutement: "https://www.ac-environnement.com" },
  { id: 15, entreprise: "BEST (Bureau d'Études Synthèse Technique)", localisation: "Nantes", effectifs: "~20-50", priorite: 2, probabilite: "Forte", interets: "Synthèse BIM, BIM management", contact: "Via formulaire site", status: "pending", dateCandidature: "", dateRelance: "", notes: "Experts en synthèse technique, idéal pour profil BIM coordinateur.", siteRecrutement: "https://agence-best.fr" },
  { id: 16, entreprise: "AREST Bureau d'Études", localisation: "Le Bignon (Sud Nantes)", effectifs: "~30-50", priorite: 2, probabilite: "Forte", interets: "BIM structure, maquette 3D collaborative", contact: "infos-nantes@arest.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Spécialistes structure. Contact : Pascal Pineau.", siteRecrutement: "https://www.arest.fr" },
  { id: 17, entreprise: "STBAT", localisation: "Nantes", effectifs: "~50-100", priorite: 2, probabilite: "Forte", interets: "Projets collaboratifs BIM Revit, structures", contact: "contact@stbat.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Bureau d'études pluridisciplinaire.", siteRecrutement: "https://www.stbat.fr" },
  { id: 18, entreprise: "OTE Ingénierie", localisation: "Nantes", effectifs: "~100+", priorite: 2, probabilite: "Forte", interets: "Grands projets, assistance MOA", contact: "ote.direction@ote.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Privilégier le formulaire de candidature spontanée sur leur site.", siteRecrutement: "https://www.ote-ingenierie.com" },
  { id: 19, entreprise: "SOGEA Atlantique BTP (Vinci)", localisation: "St-Herblain / Nantes", effectifs: "~500+", priorite: 1, probabilite: "Très forte", interets: "Bâtiment gros œuvre, innovation BIM groupe Vinci", contact: "gaelle.forgeau@vinci-construction.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Contact RH identifié : Gaëlle Forgeau. Projets majeurs : CHU Nantes.", siteRecrutement: "https://www.vinci-construction.com" },
  { id: 20, entreprise: "Bouygues Bâtiment Grand-Ouest", localisation: "Nantes", effectifs: "~1000+", priorite: 1, probabilite: "Très forte", interets: "BIM sur grands projets, leader national", contact: "a.vidalain@bouygues-construction.com", status: "pending", dateCandidature: "", dateRelance: "", notes: "Contact recrutement : A. Vidalain. Site : 24 Mail Pablo Picasso.", siteRecrutement: "https://www.bouygues-batiment-grand-ouest.fr" },
  { id: 21, entreprise: "Scanny", localisation: "Nantes région", effectifs: "réseau", priorite: 3, probabilite: "Moyenne", interets: "Relevé 3D, scan laser", contact: "Via site web", status: "pending", dateCandidature: "", dateRelance: "", notes: "Plateforme de mise en relation, moins 'entreprise' classique.", siteRecrutement: "https://scanny-hub.com" },
  { id: 22, entreprise: "i ARCHITECTES", localisation: "Nantes & Quiberon", effectifs: "~10-20", priorite: 2, probabilite: "Moyenne", interets: "BIM niveau 2B, coordination maquettes", contact: "agence@iarchitectes.com", status: "pending", dateCandidature: "", dateRelance: "", notes: "Accompagnement BIM complet.", siteRecrutement: "https://www.iarchitectes.com" },
  { id: 23, entreprise: "KABANE Architecture", localisation: "Nantes", effectifs: "~5-15", priorite: 3, probabilite: "Moyenne", interets: "BIM archi, efficacité", contact: "Via formulaire", status: "pending", dateCandidature: "", dateRelance: "", notes: "Tel : 02 85 52 84 93. Cabinet jeune et numérique.", siteRecrutement: "https://www.kabane-architecture.fr" },
  { id: 24, entreprise: "ACDM Architecture", localisation: "Vertou (Sud Nantes)", effectifs: "~10-20", priorite: 2, probabilite: "Moyenne", interets: "Expertise BIM 15+ ans", contact: "architectes@acdm-architecture.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Maquette numérique paramétrable.", siteRecrutement: "https://www.acdm-architecture.com" },
  { id: 25, entreprise: "CAN-IA Architecture", localisation: "Nantes", effectifs: "~5-10", priorite: 3, probabilite: "Moyenne", interets: "BIM & Biosourcé", contact: "contact@can-ia.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Spécialiste construction bio-sourcée + processus BIM.", siteRecrutement: "https://www.can-ia.fr" },
  { id: 26, entreprise: "Archipel5 Architectes", localisation: "Nantes (Rue Baboneau)", effectifs: "~10-20", priorite: 3, probabilite: "Moyenne", interets: "Maquette numérique outil incontournable", contact: "02 40 73 23 95", status: "pending", dateCandidature: "", dateRelance: "", notes: "Appeler pour avoir le mail contact.", siteRecrutement: "https://www.archipel5.com" },
  { id: 27, entreprise: "ANDRÉ BTP (Groupe Demathieu Bard)", localisation: "Nantes / Pays de la Loire", effectifs: "~200-300", priorite: 2, probabilite: "Forte", interets: "Gros œuvre, construction bois", contact: "contact.andre@demathieu-bard.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Filiale Demathieu Bard.", siteRecrutement: "https://www.andre-btp.com" },
  { id: 28, entreprise: "FAYAT Bâtiment Pays de la Loire", localisation: "Nantes (Chantenay)", effectifs: "~300+", priorite: 2, probabilite: "Forte", interets: "Groupe majeur construction, innovation, BIM", contact: "Via site carrières", status: "pending", dateCandidature: "", dateRelance: "", notes: "8 Boulevard de Chantenay.", siteRecrutement: "https://fayat.com/fr/carrieres" },
  { id: 29, entreprise: "BETAP", localisation: "Nantes", effectifs: "~30-50", priorite: 2, probabilite: "Forte", interets: "Structure béton armé, PEO, grands ouvrages BIM", contact: "contact@betap.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Expertise technique pointue.", siteRecrutement: "https://www.betap.fr" },
  { id: 30, entreprise: "Moinard Énergie", localisation: "Ste-Pazanne / Nantes", effectifs: "~50-100", priorite: 3, probabilite: "Moyenne", interets: "BIM électricité, expertise logicielle", contact: "contact@moinard-energie.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Spécialiste BIM fluides.", siteRecrutement: "https://www.moinard-energie.fr" },
  { id: 31, entreprise: "Eiffage Construction Pays de Loire", localisation: "Nantes (Route du Gachet)", effectifs: "~300-500", priorite: 1, probabilite: "Très forte", interets: "Groupe majeur, BIM, alternance", contact: "Via portail Eiffage", status: "pending", dateCandidature: "", dateRelance: "", notes: "Partenaire Campus Bâtisseurs. 11 route du Gachet.", siteRecrutement: "https://www.eiffage.com/carrieres" },
  { id: 32, entreprise: "Léon Grosse - Agence Nantes", localisation: "St-Herblain", effectifs: "~2300 (groupe)", priorite: 1, probabilite: "Très forte", interets: "BIM, entreprise générale", contact: "lgouest@leongrosse.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Mail direct agence Ouest (Nantes). Entreprise familiale.", siteRecrutement: "https://www.leongrosse.fr/carrieres" },
  { id: 33, entreprise: "CHARIER TP & Routes", localisation: "Montoir / Nantes / Couëron", effectifs: "~800+", priorite: 1, probabilite: "Très forte", interets: "TP/VRD, travaux urbains", contact: "Via site charier.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Marraine de la licence NSC par le passé. Très bonne piste.", siteRecrutement: "https://www.charier.fr/carrieres/" },
  { id: 34, entreprise: "SPIE Batignolles Grand Ouest", localisation: "Orvault (Rue du Mail)", effectifs: "~200-300", priorite: 2, probabilite: "Forte", interets: "Construction, réhabilitation, BIM", contact: "Via site spiebatignolles.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Agence Présance Nantes à Bouguenais.", siteRecrutement: "https://www.spiebatignolles.fr/carrieres/" },
  { id: 35, entreprise: "SPIE Batignolles TP Grand Ouest", localisation: "Nantes région", effectifs: "~100-200", priorite: 2, probabilite: "Forte", interets: "Travaux publics, terrassements, VRD", contact: "Via site", status: "pending", dateCandidature: "", dateRelance: "", notes: "Filiale TP.", siteRecrutement: "" },
  { id: 36, entreprise: "SPIE Batignolles ETPO", localisation: "Nantes", effectifs: "~750", priorite: 2, probabilite: "Forte", interets: "Travaux maritimes/fluviaux, génie civil", contact: "contact@etpo.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Ex-ETPO, très ancré localement. Partenaire Campus Bâtisseurs.", siteRecrutement: "https://www.etpo.fr" },
  { id: 37, entreprise: "A-BTP Atlantique Bâtiment TP", localisation: "Blain", effectifs: "~20-50", priorite: 3, probabilite: "Moyenne", interets: "Maçonnerie, gros œuvre", contact: "contact@a-btp.fr", status: "pending", dateCandidature: "", dateRelance: "", notes: "Structure PME locale.", siteRecrutement: "https://www.a-btp.fr" },
  { id: 38, entreprise: "Clemessy (Groupe Eiffage)", localisation: "St-Nazaire", effectifs: "~100-200", priorite: 2, probabilite: "Moyenne", interets: "Construction navale, réseaux", contact: "Via Eiffage", status: "pending", dateCandidature: "", dateRelance: "", notes: "Spécialiste naval, travaille sur paquebots.", siteRecrutement: "https://www.eiffage.com/carrieres" }
];

export default function CandidaturesTracker() {
  const [candidatures, setCandidatures] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState(null);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [currentLetterCandidature, setCurrentLetterCandidature] = useState(null);

  // Load data from storage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await (window as any).storage.get(STORAGE_KEY, SHARED_STORAGE);
      if (result && result.value) {
        setCandidatures(JSON.parse(result.value));
      } else {
        // Initialize with default data
        setCandidatures(INITIAL_DATA);
        await saveData(INITIAL_DATA);
      }
    } catch (error) {
      console.log('Initializing with default data');
      setCandidatures(INITIAL_DATA);
      await saveData(INITIAL_DATA);
    }
    setLoading(false);
  };

  const saveData = async (data: any) => {
    try {
      await (window as any).storage.set(STORAGE_KEY, JSON.stringify(data), SHARED_STORAGE);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const updateCandidature = async (id: number, updates: any) => {
    const updated = candidatures.map(c => 
      c.id === id ? { ...c, ...updates } : c
    );
    setCandidatures(updated);
    await saveData(updated);
  };

  const deleteCandidature = async (id: number) => {
    if (!confirm('Supprimer cette candidature ?')) return;
    const updated = candidatures.filter(c => c.id !== id);
    setCandidatures(updated);
    await saveData(updated);
  };

  const addCandidature = async (newCand: any) => {
    const newId = Math.max(...candidatures.map(c => c.id), 0) + 1;
    const updated = [...candidatures, { ...newCand, id: newId }];
    setCandidatures(updated);
    await saveData(updated);
  };

  const resetData = async () => {
    if (!confirm('Réinitialiser toutes les données ? Cette action est irréversible et rechargera les données par défaut mises à jour.')) return;
    setCandidatures(INITIAL_DATA);
    await saveData(INITIAL_DATA);
  };

  const generateLetter = async (candidature: any) => {
    setIsGenerating(true);
    setGeneratedLetter(null);
    setShowLetterModal(true);
    
    try {
      const prompt = `Tu es un assistant qui aide à rédiger des lettres de motivation professionnelles pour des candidatures en alternance.

PROFIL DU CANDIDAT :
- Nom : ${PROFILE_DATA.nom}
- Formation actuelle : ${PROFILE_DATA.formation_actuelle}
- Formation visée : ${PROFILE_DATA.licence_cible} à l'${PROFILE_DATA.iut}
- Début alternance : ${PROFILE_DATA.debut_alternance}
- Rythme : ${PROFILE_DATA.periode_alternance}
- Compétences techniques : ${PROFILE_DATA.competences_cles.join(', ')}
- Expérience clé : ${PROFILE_DATA.experience_principale}
- Projet marquant : ${PROFILE_DATA.projet_marquant}
- Points forts : ${PROFILE_DATA.points_forts.join(', ')}
- Motivation : ${PROFILE_DATA.motivation}

FORMATION NSC :
- Modules : ${FORMATION_NSC.modules_cles.slice(0, 4).join(', ')}
- Débouchés : ${FORMATION_NSC.debouches}

ENTREPRISE CIBLE :
- Nom : ${candidature.entreprise}
- Localisation : ${candidature.localisation}
- Effectifs : ${candidature.effectifs}
- Points d'intérêt : ${candidature.interets}
- Probabilité d'alternance : ${candidature.probabilite}
${candidature.notes ? `- Notes personnelles : ${candidature.notes}` : ''}

CONSIGNES :
1. Rédige une lettre de motivation COURTE (250-300 mots maximum)
2. Structure : paragraphe d'accroche + 2 paragraphes argumentés + conclusion
3. Adapte le contenu aux spécificités de l'entreprise (${candidature.interets})
4. Utilise un ton professionnel mais naturel, sincère et enthousiaste
5. Mets en avant les compétences BIM/scan 3D pertinentes pour cette entreprise
6. Inclus des éléments concrets du CV (expérience MRC, projet Revit)
7. Montre que tu connais l'entreprise et ses activités
8. NE PAS mettre d'adresse, date ou objet - juste le corps de la lettre
9. Tutoie pas, vouvoie
10. Termine par une formule de politesse sobre

Génère uniquement le texte de la lettre, sans métadonnées.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            { role: "user", content: prompt }
          ],
        })
      });

      const data = await response.json();
      const letterText = data.content
        .map((item: any) => (item.type === "text" ? item.text : ""))
        .filter(Boolean)
        .join("\n");
      
      setGeneratedLetter(letterText);
    } catch (error) {
      console.error('Error generating letter:', error);
      alert('Erreur lors de la génération de la lettre. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  const sendWithGmail = (candidature: any) => {
    // Extract email from contact field (supports formats like "name - email" or just "email")
    let recipient = '';
    if (candidature.contact) {
      const emailMatch = candidature.contact.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (emailMatch) {
        recipient = emailMatch[0];
      }
    }
    
    const subject = encodeURIComponent(`Candidature alternance Licence Pro NSC - ${PROFILE_DATA.nom}`);
    const body = encodeURIComponent(
      `${generatedLetter}\n\n` +
      `---\n` +
      `${PROFILE_DATA.nom}\n` +
      `${PROFILE_DATA.tel}\n` +
      `${PROFILE_DATA.email}`
    );
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${subject}&body=${body}`;
    
    window.open(gmailUrl, '_blank');
  };

  const copyToClipboard = () => {
    const fullText = `${generatedLetter}\n\n---\n${PROFILE_DATA.nom}\n${PROFILE_DATA.tel}\n${PROFILE_DATA.email}`;
    navigator.clipboard.writeText(fullText);
    alert('✅ Lettre copiée dans le presse-papier !');
  };

  // Filter candidatures
  const filteredCandidatures = candidatures.filter(c => {
    const matchSearch = c.entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.localisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.interets.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchPriority = filterPriority === 'all' || c.priorite === parseInt(filterPriority);
    return matchSearch && matchStatus && matchPriority;
  });

  // Calculate stats
  const stats = {
    total: candidatures.length,
    sent: candidatures.filter(c => c.status === 'sent').length,
    relance: candidatures.filter(c => c.status === 'relance').length,
    entretien: candidatures.filter(c => c.status === 'entretien').length,
    refus: candidatures.filter(c => c.status === 'refus').length,
    pending: candidatures.filter(c => c.status === 'pending').length
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-lg">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            📊 Suivi Candidatures
          </h1>
          <p className="text-sm sm:text-base text-gray-600">BIM / Scan 3D - Alternance 2026</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg shadow-sm border border-blue-200">
            <div className="text-xl sm:text-2xl font-bold text-blue-700">{stats.sent}</div>
            <div className="text-xs sm:text-sm text-blue-600">Envoyés</div>
          </div>
          <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg shadow-sm border border-yellow-200">
            <div className="text-xl sm:text-2xl font-bold text-yellow-700">{stats.relance}</div>
            <div className="text-xs sm:text-sm text-yellow-600">Relances</div>
          </div>
          <div className="bg-green-50 p-3 sm:p-4 rounded-lg shadow-sm border border-green-200">
            <div className="text-xl sm:text-2xl font-bold text-green-700">{stats.entretien}</div>
            <div className="text-xs sm:text-sm text-green-600">Entretiens</div>
          </div>
          <div className="bg-red-50 p-3 sm:p-4 rounded-lg shadow-sm border border-red-200">
            <div className="text-xl sm:text-2xl font-bold text-red-700">{stats.refus}</div>
            <div className="text-xs sm:text-sm text-red-600">Refus</div>
          </div>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-xl sm:text-2xl font-bold text-gray-700">{stats.pending}</div>
            <div className="text-xs sm:text-sm text-gray-600">À envoyer</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous statuts</option>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toutes priorités</option>
                <option value="1">🏆 Priorité 1</option>
                <option value="2">🥈 Priorité 2</option>
                <option value="3">🥉 Priorité 3</option>
              </select>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={resetData}
              className="px-3 py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Candidatures List */}
        <div className="space-y-3">
          {filteredCandidatures.sort((a, b) => a.priorite - b.priorite).map((cand) => {
            return (
              <div key={cand.id} className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{cand.entreprise}</h3>
                      <span className={`text-xs font-medium ${(PRIORITY_CONFIG as any)[cand.priorite].color} whitespace-nowrap`}>
                        {(PRIORITY_CONFIG as any)[cand.priorite].label}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-1.5 text-xs sm:text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{cand.localisation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 flex-shrink-0" />
                        {cand.effectifs} employés
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="line-clamp-2">{cand.interets}</span>
                      </div>
                    </div>

                    {cand.notes && (
                      <div className="text-xs sm:text-sm text-gray-700 bg-gray-50 p-2 rounded mt-2">
                        <strong>Notes:</strong> {cand.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {cand.siteRecrutement && (
                      <button
                        onClick={() => window.open(cand.siteRecrutement, '_blank')}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                        title="Ouvrir le site de recrutement"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setCurrentLetterCandidature(cand);
                        generateLetter(cand);
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Générer lettre"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCandidature(cand);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Status buttons */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, config]: [string, any]) => {
                    const IconComponent = config.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => updateCandidature(cand.id, { status: key })}
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          cand.status === key ? config.color : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        <IconComponent className="h-3 w-3" />
                        <span className="hidden sm:inline">{config.label}</span>
                        <span className="sm:hidden">{config.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {filteredCandidatures.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucune candidature trouvée
          </div>
        )}

        {/* Letter Generation Modal */}
        {showLetterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full my-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold">Lettre de motivation</h2>
                <button
                  onClick={() => setShowLetterModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {currentLetterCandidature && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
                  <div className="font-semibold text-blue-900">{currentLetterCandidature.entreprise}</div>
                  <div className="text-blue-700">{currentLetterCandidature.localisation}</div>
                </div>
              )}
              
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <div className="text-gray-600">Génération de votre lettre personnalisée...</div>
                  <div className="text-sm text-gray-500 mt-2">Cela peut prendre quelques secondes</div>
                </div>
              ) : generatedLetter ? (
                <div>
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-4 max-h-96 overflow-y-auto">
                    <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                      {generatedLetter}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600">
                      <div>{PROFILE_DATA.nom}</div>
                      <div>{PROFILE_DATA.tel}</div>
                      <div>{PROFILE_DATA.email}</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2 font-medium"
                    >
                      <Copy className="h-4 w-4" />
                      Copier
                    </button>
                    <button
                      onClick={() => sendWithGmail(currentLetterCandidature)}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium"
                    >
                      <Send className="h-4 w-4" />
                      Ouvrir dans Gmail
                    </button>
                    <button
                      onClick={() => {
                        setCurrentLetterCandidature(currentLetterCandidature);
                        generateLetter(currentLetterCandidature);
                      }}
                      className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-medium"
                    >
                      ↻ Régénérer
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isModalOpen && selectedCandidature && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Modifier la candidature</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site de recrutement</label>
                  <input
                    type="url"
                    value={selectedCandidature.siteRecrutement || ''}
                    onChange={(e) => setSelectedCandidature({...selectedCandidature, siteRecrutement: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://exemple.com/carrieres"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <input
                    type="text"
                    value={selectedCandidature.contact}
                    onChange={(e) => setSelectedCandidature({...selectedCandidature, contact: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom, email, téléphone..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de candidature</label>
                  <input
                    type="date"
                    value={selectedCandidature.dateCandidature}
                    onChange={(e) => setSelectedCandidature({...selectedCandidature, dateCandidature: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de relance</label>
                  <input
                    type="date"
                    value={selectedCandidature.dateRelance}
                    onChange={(e) => setSelectedCandidature({...selectedCandidature, dateRelance: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={selectedCandidature.notes}
                    onChange={(e) => setSelectedCandidature({...selectedCandidature, notes: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Notes personnelles, remarques sur l'entretien, etc."
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg order-2 sm:order-1"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      updateCandidature(selectedCandidature.id, selectedCandidature);
                      setIsModalOpen(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 order-1 sm:order-2"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
