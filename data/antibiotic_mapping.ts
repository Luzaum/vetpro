export interface AntibioticMapping {
  abbreviation: string;
  fullName: string;
  bularioId: string;
  class: string;
  spectrum: string[];
  commonIndications: string[];
}

export const antibioticMappings: AntibioticMapping[] = [
  {
    abbreviation: "AMPI",
    fullName: "Ampicilina",
    bularioId: "ampicilina",
    class: "Penicilina",
    spectrum: ["Gram-positivos", "Gram-negativos sensíveis"],
    commonIndications: ["Infecções respiratórias", "Infecções urinárias", "Infecções de pele"]
  },
  {
    abbreviation: "AMPI+SULBACT",
    fullName: "Ampicilina + Sulbactam",
    bularioId: "ampicilina-sulbactam",
    class: "Penicilina + Inibidor de beta-lactamase",
    spectrum: ["Gram-positivos", "Gram-negativos", "Anaeróbios"],
    commonIndications: ["Infecções intra-abdominais", "Infecções de pele", "Infecções respiratórias"]
  },
  {
    abbreviation: "AMOX+CLAV",
    fullName: "Amoxicilina + Clavulanato",
    bularioId: "amoxicilina-clavulanato",
    class: "Penicilina + Inibidor de beta-lactamase",
    spectrum: ["Gram-positivos", "Gram-negativos", "Anaeróbios"],
    commonIndications: ["Infecções de pele", "Infecções respiratórias", "Infecções urinárias", "Flebite séptica"]
  },
  {
    abbreviation: "CEFAZ",
    fullName: "Cefazolina",
    bularioId: "cefazolina",
    class: "Cefalosporina de 1ª geração",
    spectrum: ["Gram-positivos", "Gram-negativos sensíveis"],
    commonIndications: ["Profilaxia cirúrgica", "Infecções de pele", "Infecções de tecidos moles"]
  },
  {
    abbreviation: "CEFOTAX",
    fullName: "Cefotaxima",
    bularioId: "cefotaxima",
    class: "Cefalosporina de 3ª geração",
    spectrum: ["Gram-negativos", "Gram-positivos"],
    commonIndications: ["Infecções respiratórias", "Infecções urinárias", "Meningite"]
  },
  {
    abbreviation: "CEFTRI",
    fullName: "Ceftriaxona",
    bularioId: "ceftriaxona",
    class: "Cefalosporina de 3ª geração",
    spectrum: ["Gram-negativos", "Gram-positivos"],
    commonIndications: ["Infecções respiratórias", "Infecções urinárias", "Meningite", "Gonorreia"]
  },
  {
    abbreviation: "CEFEP",
    fullName: "Cefepima",
    bularioId: "cefepima",
    class: "Cefalosporina de 4ª geração",
    spectrum: ["Gram-negativos", "Gram-positivos", "Pseudomonas"],
    commonIndications: ["Infecções hospitalares", "Infecções por Pseudomonas", "Neutropenia febril"]
  },
  {
    abbreviation: "IMIP",
    fullName: "Imipenem",
    bularioId: "imipenem",
    class: "Carbapenêmico",
    spectrum: ["Gram-positivos", "Gram-negativos", "Anaeróbios", "Pseudomonas"],
    commonIndications: ["Infecções graves", "Infecções hospitalares", "Infecções polimicrobianas"]
  },
  {
    abbreviation: "MEROP",
    fullName: "Meropenem",
    bularioId: "meropenem",
    class: "Carbapenêmico",
    spectrum: ["Gram-positivos", "Gram-negativos", "Anaeróbios", "Pseudomonas"],
    commonIndications: ["Infecções graves", "Infecções hospitalares", "Meningite"]
  },
  {
    abbreviation: "GENTA",
    fullName: "Gentamicina",
    bularioId: "gentamicina",
    class: "Aminoglicosídeo",
    spectrum: ["Gram-negativos", "Gram-positivos"],
    commonIndications: ["Infecções urinárias", "Infecções respiratórias", "Infecções intra-abdominais"]
  },
  {
    abbreviation: "AMIC",
    fullName: "Amicacina",
    bularioId: "amicacina",
    class: "Aminoglicosídeo",
    spectrum: ["Gram-negativos", "Gram-positivos"],
    commonIndications: ["Infecções por Pseudomonas", "Infecções hospitalares", "Infecções resistentes"]
  },
  {
    abbreviation: "CIPRO",
    fullName: "Ciprofloxacino",
    bularioId: "ciprofloxacino",
    class: "Fluoroquinolona",
    spectrum: ["Gram-negativos", "Gram-positivos"],
    commonIndications: ["Infecções urinárias", "Infecções respiratórias", "Infecções de pele"]
  },
  {
    abbreviation: "LEVO",
    fullName: "Levofloxacino",
    bularioId: "levofloxacino",
    class: "Fluoroquinolona",
    spectrum: ["Gram-negativos", "Gram-positivos"],
    commonIndications: ["Infecções respiratórias", "Infecções urinárias", "Infecções de pele"]
  },
  {
    abbreviation: "VANCO",
    fullName: "Vancomicina",
    bularioId: "vancomicina",
    class: "Glicopeptídeo",
    spectrum: ["Gram-positivos"],
    commonIndications: ["Infecções por MRSA", "Endocardite", "Meningite"]
  },
  {
    abbreviation: "LINEZ",
    fullName: "Linezolida",
    bularioId: "linezolida",
    class: "Oxazolidinona",
    spectrum: ["Gram-positivos"],
    commonIndications: ["Infecções por MRSA", "Infecções por VRE", "Pneumonia"]
  },
  {
    abbreviation: "DAPTO",
    fullName: "Daptomicina",
    bularioId: "daptomicina",
    class: "Lipopeptídeo",
    spectrum: ["Gram-positivos"],
    commonIndications: ["Infecções por MRSA", "Endocardite", "Infecções de pele"]
  },
  {
    abbreviation: "TIGEC",
    fullName: "Tigeciclina",
    bularioId: "tigeciclina",
    class: "Glicilciclina",
    spectrum: ["Gram-positivos", "Gram-negativos", "Anaeróbios"],
    commonIndications: ["Infecções intra-abdominais", "Infecções de pele", "Infecções hospitalares"]
  },
  {
    abbreviation: "COLIST",
    fullName: "Colistina",
    bularioId: "colistina",
    class: "Polimixina",
    spectrum: ["Gram-negativos"],
    commonIndications: ["Infecções por Pseudomonas", "Infecções por Acinetobacter", "Infecções resistentes"]
  },
  {
    abbreviation: "METRO",
    fullName: "Metronidazol",
    bularioId: "metronidazol",
    class: "Nitroimidazol",
    spectrum: ["Anaeróbios", "Protozoários"],
    commonIndications: ["Infecções intra-abdominais", "Infecções ginecológicas", "Giardíase"]
  },
  {
    abbreviation: "CLINDA",
    fullName: "Clindamicina",
    bularioId: "clindamicina",
    class: "Lincosamida",
    spectrum: ["Gram-positivos", "Anaeróbios"],
    commonIndications: ["Infecções de pele", "Infecções dentárias", "Infecções ginecológicas"]
  },
  {
    abbreviation: "DOXI",
    fullName: "Doxiciclina",
    bularioId: "doxiciclina",
    class: "Tetraciclina",
    spectrum: ["Gram-positivos", "Gram-negativos", "Rickettsias", "Chlamydias"],
    commonIndications: ["Infecções respiratórias", "Infecções sexualmente transmissíveis", "Rickettsioses"]
  },
  {
    abbreviation: "AZITRO",
    fullName: "Azitromicina",
    bularioId: "azitromicina",
    class: "Macrolídeo",
    spectrum: ["Gram-positivos", "Gram-negativos", "Chlamydias", "Mycoplasma"],
    commonIndications: ["Infecções respiratórias", "Infecções sexualmente transmissíveis", "Infecções de pele"]
  },
  {
    abbreviation: "CLARI",
    fullName: "Claritromicina",
    bularioId: "claritromicina",
    class: "Macrolídeo",
    spectrum: ["Gram-positivos", "Gram-negativos", "Chlamydias", "Mycoplasma"],
    commonIndications: ["Infecções respiratórias", "Infecções de pele", "Helicobacter pylori"]
  },
  {
    abbreviation: "TRIM+SULFA",
    fullName: "Trimetoprim + Sulfametoxazol",
    bularioId: "trimetoprim-sulfametoxazol",
    class: "Sulfonamida + Inibidor de dihidrofolato redutase",
    spectrum: ["Gram-positivos", "Gram-negativos"],
    commonIndications: ["Infecções urinárias", "Pneumonia por Pneumocystis", "Infecções de pele"]
  },
  {
    abbreviation: "FOSFO",
    fullName: "Fosfomicina",
    bularioId: "fosfomicina",
    class: "Fosfônico",
    spectrum: ["Gram-positivos", "Gram-negativos"],
    commonIndications: ["Infecções urinárias", "Infecções de pele", "Infecções respiratórias"]
  },
  {
    abbreviation: "NITRO",
    fullName: "Nitrofurantoína",
    bularioId: "nitrofurantoina",
    class: "Nitrofurano",
    spectrum: ["Gram-positivos", "Gram-negativos"],
    commonIndications: ["Infecções urinárias", "Profilaxia de ITU"]
  }
];

export function findAntibioticByAbbreviation(abbreviation: string): AntibioticMapping | undefined {
  return antibioticMappings.find(ab => ab.abbreviation === abbreviation.toUpperCase());
}

export function findAntibioticByName(name: string): AntibioticMapping | undefined {
  return antibioticMappings.find(ab => 
    ab.fullName.toLowerCase().includes(name.toLowerCase()) ||
    ab.abbreviation.toLowerCase().includes(name.toLowerCase())
  );
}

export function getAllAntibioticAbbreviations(): string[] {
  return antibioticMappings.map(ab => ab.abbreviation);
}
