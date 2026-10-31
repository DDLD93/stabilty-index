/**
 * Open-licence photographs of Nigeria used across the public site.
 * Every entry carries its credit; /credits lists them all.
 * Source records live in public/images/credits.json.
 */

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  credit: {
    title: string;
    creator: string;
    license: string;
    licenseUrl: string;
    page: string;
  };
};

const commons = (
  title: string,
  creator: string,
  license: string,
  licenseUrl: string,
  file: string,
): Photo["credit"] => ({
  title,
  creator,
  license,
  licenseUrl,
  page: `https://commons.wikimedia.org/wiki/File:${file}`,
});

const BY_SA_4 = "https://creativecommons.org/licenses/by-sa/4.0";

export const photos = {
  balogunMarket: {
    src: "/images/balogun-market-lagos.jpg",
    width: 1600,
    height: 900,
    alt: "Crowded lanes of Balogun Market on Lagos Island seen from above, with umbrellas and shop awnings.",
    caption: "Balogun Market, Lagos Island.",
    credit: commons("Balogun Market, Lagos Island", "Yellowcrunchy", "CC BY-SA 4.0", BY_SA_4, "Balogun_Market,_Lagos_Island.jpg"),
  },
  thirdMainlandBridge: {
    src: "/images/third-mainland-bridge-lagos.jpg",
    width: 1600,
    height: 1067,
    alt: "The underside of the Third Mainland Bridge stretching across the Lagos Lagoon.",
    caption: "Third Mainland Bridge over the Lagos Lagoon.",
    credit: commons("Third-mainland-bridge--lagos 2", "S.aderogba", "CC BY-SA 4.0", BY_SA_4, "Third-mainland-bridge--lagos_2.jpg"),
  },
  votersQueue: {
    src: "/images/voters-queue-kubwa-abuja.jpg",
    width: 1600,
    height: 1067,
    alt: "A long line of people waiting their turn under umbrellas at a polling unit in Kubwa, Abuja.",
    caption: "Waiting to vote in Kubwa, Abuja.",
    credit: commons("Kubwa Voting", "Jeremy Weate", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0", "Kubwa_Voting.jpg"),
  },
  nationalAssemblyMace: {
    src: "/images/national-assembly-mace-abuja.jpg",
    width: 1600,
    height: 1067,
    alt: "The green dome of the National Assembly in Abuja with the mace sculpture in front.",
    caption: "National Assembly, Abuja.",
    credit: commons("National Assembly Building with Mace, Abuja, Nigeria", "Kabusa16", "CC BY-SA 4.0", BY_SA_4, "National_Assembly_Building_with_Mace,_Abuja,_Nigeria.jpg"),
  },
  asoRock: {
    src: "/images/aso-rock-abuja.jpg",
    width: 1600,
    height: 1067,
    alt: "Aso Rock rising behind trees and open grass in Abuja.",
    caption: "Aso Rock, Abuja.",
    credit: commons("Aso Rock as seen from the IBB golf course in Abuja, Nigeria", "Mark Fischer", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0", "Aso_Rock_as_seen_from_the_IBB_golf_course_in_Abuja,_Nigeria.jpg"),
  },
  abujaCbd: {
    src: "/images/central-business-district-abuja.jpg",
    width: 1600,
    height: 1071,
    alt: "Office towers of the Central Business District in Abuja under a cloudy sky.",
    caption: "Central Business District, Abuja.",
    credit: commons("Central business district abuja", "Kenogenic", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0", "Central_business_district_abuja.jpg"),
  },
  dyePit: {
    src: "/images/kofar-mata-dye-pit-kano.jpg",
    width: 1600,
    height: 1200,
    alt: "Round indigo dye pits set into the ground at Kofar Mata, Kano.",
    caption: "Kofar Mata dye pits, Kano.",
    credit: commons("Kofar Mata Dye Pit, Kano", "Solasly", "CC BY-SA 4.0", BY_SA_4, "Kofar_Mata_Dye_Pit,_Kano.jpg"),
  },
  dyeWorkers: {
    src: "/images/dye-pit-workers-kano.jpg",
    width: 1600,
    height: 992,
    alt: "Workers sorting freshly dyed cloth beside the dye pits in Kano.",
    caption: "At work beside the dye pits, Kano.",
    credit: commons("Workers at a Kano Dye pit 01", "Andy Musa Chantu", "CC BY-SA 4.0", BY_SA_4, "Workers_at_a_Kano_Dye_pit_01.jpg"),
  },
  classroom: {
    src: "/images/classroom-students.jpg",
    width: 1600,
    height: 1067,
    alt: "Students seated at long laboratory benches while a teacher stands at the front of the class.",
    caption: "A secondary school class in session.",
    credit: commons("A classroom of students (7138907393)", "DFID - UK Department for International Development", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0", "A_classroom_of_students_(7138907393).jpg"),
  },
  canoeLagoon: {
    src: "/images/canoe-third-mainland-bridge.jpg",
    width: 1600,
    height: 1200,
    alt: "A passenger canoe crossing the misty Lagos Lagoon near the Third Mainland Bridge.",
    caption: "Crossing the lagoon, Lagos.",
    credit: commons("A canoe conveying passenger beneath Third mainland Bridge, Lagos", "Kaizenify", "CC BY-SA 4.0", BY_SA_4, "A_canoe_conveying_passenger_beneath_Third_mainland_Bridge,_Lagos.jpg"),
  },
  policeTraffic: {
    src: "/images/police-officer-traffic.jpg",
    width: 1600,
    height: 1067,
    alt: "A police officer speaking with the driver of an old blue jeep on a busy road.",
    caption: "Traffic duty on a busy road.",
    credit: commons("A police officer coordinating traffic", "Timmylegend", "CC BY-SA 4.0", BY_SA_4, "A_police_officer_coordinating_traffic.jpg"),
  },
  nairaNotes: {
    src: "/images/naira-notes-hand.jpg",
    width: 1600,
    height: 1200,
    alt: "A hand holding worn five-hundred naira notes.",
    caption: "Five-hundred naira notes.",
    credit: commons("500 Nigerian Notes", "Weblingdevs", "CC BY-SA 4.0", BY_SA_4, "500_Nigerian_Notes.jpg"),
  },
  apapaPort: {
    src: "/images/apapa-port-lagos.jpg",
    width: 1600,
    height: 1200,
    alt: "A red cargo ship with cranes berthed at Apapa port, Lagos.",
    caption: "Apapa port, Lagos.",
    credit: commons("Apapa port.lagos", "Quadrex24", "CC BY-SA 4.0", BY_SA_4, "Apapa_port.lagos.jpg"),
  },
  nationalAssembly: {
    src: "/images/national-assembly-abuja.jpg",
    width: 1600,
    height: 1067,
    alt: "The white National Assembly building in Abuja with its green dome and front steps.",
    caption: "National Assembly complex, Abuja.",
    credit: commons("National Assembly Building, Abuja, Nigeria", "Kabusa16", "CC BY-SA 4.0", BY_SA_4, "National_Assembly_Building,_Abuja,_Nigeria.jpg"),
  },
  osunFestival: {
    src: "/images/osun-osogbo-festival.jpg",
    width: 1600,
    height: 900,
    alt: "A large crowd gathered under trees at the Osun-Osogbo Festival.",
    caption: "Osun-Osogbo Festival, 2026.",
    credit: commons("Osun Osogbo Festival 2026", "Abdulrosheed Fadipe", "CC BY-SA 4.0", BY_SA_4, "Osun_Osogbo_Festival_2026.jpg"),
  },
  durbar: {
    src: "/images/durbar-horsemen-kano.jpg",
    width: 1600,
    height: 1050,
    alt: "Horsemen in embroidered robes riding at the Durbar in Kano.",
    caption: "Horsemen at the Durbar, Kano.",
    credit: commons("Horsemen during the September 2016 Durbar in Kano - 1", "DonCamillo", "CC BY-SA 4.0", BY_SA_4, "Horsemen_during_the_September_2016_Durbar_in_Kano_-_1.jpg"),
  },
  healthCentre: {
    src: "/images/primary-health-centre-ujuolen.jpg",
    width: 1600,
    height: 1200,
    alt: "A single-storey primary health centre building with a signboard and covered waiting area.",
    caption: "Ujuolen Primary Health Centre.",
    credit: commons("Ujuolen Primary Health Centre 03", "Hackesan", "CC BY-SA 4.0", BY_SA_4, "Ujuolen_Primary_Health_Centre_03.jpg"),
  },
  digitalClassroom: {
    src: "/images/digital-classroom.jpg",
    width: 1600,
    height: 1200,
    alt: "Pupils in school uniform working on laptops while a teacher looks on.",
    caption: "Pupils using laptops in class.",
    credit: commons("Introducing digital classroom", "Advancedsolver", "CC BY-SA 4.0", BY_SA_4, "Introducing_digital_classroom.jpg"),
  },
  nurse: {
    src: "/images/nurse-ilorin.jpg",
    width: 1600,
    height: 1071,
    alt: "A nurse in a headscarf reading a patient card at a desk.",
    caption: "At work in a general hospital, Ilorin.",
    credit: commons("A Nigerian Nurse", "Jamie Tubers", "CC BY-SA 4.0", BY_SA_4, "A_Nigerian_Nurse.jpg"),
  },
  roadWorks: {
    src: "/images/road-construction-bogije-lagos.jpg",
    width: 1600,
    height: 1067,
    alt: "People walking across a newly laid concrete road with construction machinery behind.",
    caption: "Concrete road works in Bogije, Lagos State.",
    credit: commons("Concrete road construction in Bogije, Lagos Sate, Nigeria", "Ayodele Adeniji", "CC BY-SA 4.0", BY_SA_4, "Concrete_road_construction_in_Bogije,_Lagos_Sate,_Nigeria.jpg"),
  },
  foodTrader: {
    src: "/images/foodstuff-trader.jpg",
    width: 1600,
    height: 1143,
    alt: "A trader at her stall of peppers, tomatoes and dried fish under a thatched roof.",
    caption: "A foodstuff trader at her stall.",
    credit: commons("Foodstuff Trader 01", "LauraB1", "CC BY-SA 4.0", BY_SA_4, "Foodstuff_Trader_01.jpg"),
  },
  miniGrid: {
    src: "/images/solar-mini-grid-bayelsa.jpg",
    width: 1600,
    height: 1200,
    alt: "Aerial view of a solar mini-grid installation in a forest clearing in Bayelsa.",
    caption: "Solar mini-grid, Bayelsa.",
    credit: commons("Mini-Grid Bayelsa", "Rupumped", "CC BY-SA 4.0", BY_SA_4, "Mini-Grid_Bayelsa.jpg"),
  },
  farmer: {
    src: "/images/farmer-at-harvest.jpg",
    width: 1600,
    height: 1067,
    alt: "A farmer carrying a bundle of harvested rice stalks across a green field.",
    caption: "Rice harvest.",
    credit: commons("Farmer at harvest", "Photobyamin", "CC BY-SA 4.0", BY_SA_4, "Farmer_at_harvest.jpg"),
  },
  newspaperVendor: {
    src: "/images/newspaper-vendor.jpg",
    width: 1600,
    height: 1111,
    alt: "A newspaper vendor resting his chin on his hand beside a stand of papers and magazines.",
    caption: "A newspaper vendor's stand.",
    credit: commons("NIGERIAN TABLOID VENDOR", "Orji Favour Chisom", "CC BY-SA 4.0", BY_SA_4, "NIGERIAN_TABLOID_VENDOR.jpg"),
  },
  danfo: {
    src: "/images/danfo-conductors-lagos.jpg",
    width: 1600,
    height: 1198,
    alt: "A yellow danfo bus on a Lagos street with conductors standing in the open door.",
    caption: "A danfo on its route, Lagos.",
    credit: commons("Conductors commuting on the popular Yellow of Lagos - Danfo", "Eromonsele Emmanuel Oigiagbe (ericotrips)", "CC BY-SA 4.0", BY_SA_4, "Conductors_commuting_on_the_popular_Yellow_of_Lagos_-_Danfo.jpg"),
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** Photograph shown for each survey pillar (keys match lib/constants PILLARS). */
export const pillarPhotos: Record<string, Photo> = {
  Security: photos.policeTraffic,
  "FX & Economy": photos.nairaNotes,
  "Investor Confidence": photos.apapaPort,
  Governance: photos.nationalAssembly,
  "Social Stability": photos.osunFestival,
};
