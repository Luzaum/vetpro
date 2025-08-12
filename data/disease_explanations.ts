export interface DiseaseExplanation {
  name: string;
  synonyms: string[];
  etiology: string;
  epidemiology: string;
  pathophysiology: string;
  clinicalPresentation: string;
  diagnosis: string;
  treatment: string;
  prevention: string;
  references: string[];
}

export const diseaseExplanations: DiseaseExplanation[] = [
  {
    name: "Flebite Séptica",
    synonyms: ["Infecção de Cateter Venoso Periférico", "Phlebitis Séptica"],
    etiology: "A flebite séptica é causada pela colonização bacteriana do cateter venoso periférico, geralmente por Staphylococcus spp. (coagulase-positivos e negativos), Enterobactérias (E. coli, Klebsiella spp.), Pseudomonas aeruginosa e Candida spp. A contaminação pode ocorrer durante a inserção do cateter, manipulação inadequada ou migração de bactérias da pele.",
    epidemiology: "A flebite séptica é uma das complicações mais comuns de cateteres venosos periféricos, com incidência variando de 2-26% dependendo da técnica de inserção, duração do cateter e condições do paciente. Pacientes imunocomprometidos, idosos e aqueles com cateteres de longa duração (>72h) apresentam maior risco.",
    pathophysiology: "A patogênese envolve a adesão bacteriana à superfície do cateter, formação de biofilme e subsequente colonização. As bactérias podem migrar do sítio de inserção para o lúmen do cateter, resultando em bacteremia. A resposta inflamatória local causa flebite, caracterizada por eritema, edema, dor e calor local. A infecção pode progredir para celulite, abscesso ou bacteremia sistêmica.",
    clinicalPresentation: "Os sinais incluem eritema, edema, dor e calor no sítio de inserção do cateter. Pode haver secreção purulenta, febre, calafrios e sinais sistêmicos de infecção. A progressão para celulite é comum, com extensão do eritema e edema para tecidos adjacentes.",
    diagnosis: "O diagnóstico é clínico, baseado nos sinais locais de infecção. Cultura da ponta do cateter e hemoculturas são essenciais para identificação do agente etiológico e determinação da sensibilidade antimicrobiana. A remoção do cateter é obrigatória para cultura.",
    treatment: "Remoção imediata do cateter e inserção de novo em local distinto sob técnica asséptica rigorosa. Antibioticoterapia empírica inicial com cobertura para Gram-positivos e Gram-negativos, ajustada conforme resultado da cultura. Para celulite/sinais sistêmicos: Amoxicilina + Clavulanato 12,5-25 mg/kg q12h por 7-10 dias.",
    prevention: "Técnica asséptica rigorosa na inserção, troca de cateteres a cada 72-96h, higiene adequada das mãos, uso de antissépticos apropriados e monitoramento regular do sítio de inserção.",
    references: [
      "Nelson & Couto - Medicina Interna de Pequenos Animais, 6ª ed. Capítulo: Infecções Hospitalares",
      "Cunningham - Manual de Fisiologia Veterinária, 5ª ed. Capítulo: Sistema Imunológico",
      "Plumb's Veterinary Drug Handbook, 9ª ed. Capítulo: Antibioticoterapia"
    ]
  },
  {
    name: "Pneumonia",
    synonyms: ["Pneumonia Bacteriana", "Infecção Respiratória Baixa"],
    etiology: "A pneumonia pode ser causada por diversos agentes etiológicos, incluindo bactérias (Streptococcus pneumoniae, Staphylococcus aureus, Klebsiella pneumoniae, Pseudomonas aeruginosa), vírus, fungos e parasitas. A pneumonia bacteriana pode ser primária ou secundária a outras condições como aspiração, imunodepressão ou doença pulmonar pré-existente.",
    epidemiology: "A pneumonia é uma das principais causas de morbidade e mortalidade em medicina veterinária. Cães braquicefálicos, animais idosos, imunocomprometidos e aqueles com doença pulmonar crônica apresentam maior risco. A incidência é maior em ambientes com múltiplos animais e condições sanitárias inadequadas.",
    pathophysiology: "A patogênese envolve a inalação ou aspiração de microorganismos para o trato respiratório inferior. As bactérias colonizam o epitélio bronquial e alveolar, desencadeando resposta inflamatória com infiltração de neutrófilos, macrófagos e linfócitos. A inflamação resulta em edema, exsudação de proteínas e células, e consolidação pulmonar. A redução da complacência pulmonar e alterações na relação ventilação/perfusão levam à hipoxemia.",
    clinicalPresentation: "Sinais incluem tosse produtiva, dispneia, taquipneia, febre, letargia, anorexia e perda de peso. Pode haver secreção nasal mucopurulenta, respiração com boca aberta e intolerância ao exercício. Em casos graves, cianose e insuficiência respiratória.",
    diagnosis: "Diagnóstico baseado em história clínica, exame físico e radiografia torácica. Hemograma completo, bioquímico e cultura de secreção traqueal ou lavado broncoalveolar para identificação do agente etiológico. Radiografia torácica mostra padrão alveolar ou broncoalveolar.",
    treatment: "Antibioticoterapia empírica inicial com cobertura para Gram-positivos e Gram-negativos. Opções incluem Amoxicilina + Clavulanato, Cefalosporinas de 3ª geração ou Fluoroquinolonas. Suporte respiratório com oxigenoterapia e fluidoterapia. Broncodilatadores e mucolíticos conforme necessário.",
    prevention: "Vacinação adequada, controle de parasitas, higiene ambiental, evitar exposição a fumaça e poluentes, e tratamento precoce de infecções respiratórias superiores.",
    references: [
      "Nelson & Couto - Medicina Interna de Pequenos Animais, 6ª ed. Capítulo: Doenças Respiratórias",
      "Cunningham - Manual de Fisiologia Veterinária, 5ª ed. Capítulo: Sistema Respiratório",
      "Plumb's Veterinary Drug Handbook, 9ª ed. Capítulo: Antibioticoterapia"
    ]
  },
  {
    name: "Infecção do Trato Urinário",
    synonyms: ["ITU", "Cistite Bacteriana", "Pielonefrite"],
    etiology: "As ITUs são causadas principalmente por bactérias Gram-negativas, especialmente Escherichia coli (70-80% dos casos), seguida por Proteus spp., Klebsiella spp., Enterobacter spp. e Pseudomonas aeruginosa. Gram-positivos como Staphylococcus spp. e Enterococcus spp. são menos comuns. A infecção pode ser ascendente (da uretra para bexiga e rins) ou hematogênica.",
    epidemiology: "As ITUs são mais comuns em fêmeas devido à uretra mais curta. Fatores de risco incluem diabetes mellitus, hiperadrenocorticismo, urolitíase, neoplasias, cateterização urinária e imunodepressão. A incidência aumenta com a idade e em animais com doenças crônicas.",
    pathophysiology: "A patogênese envolve a adesão bacteriana ao epitélio urotelial através de fímbrias e adesinas. As bactérias colonizam a bexiga, multiplicam-se e podem ascender para os rins. A resposta inflamatória resulta em edema da mucosa, hiperemia e infiltração de neutrófilos. A inflamação crônica pode levar a alterações estruturais e predisposição a recidivas.",
    clinicalPresentation: "Sinais incluem polaciúria, disúria, estrangúria, hematúria, incontinência urinária e lambedura excessiva da região perineal. Em casos de pielonefrite, pode haver febre, letargia, anorexia e dor abdominal. Alguns animais podem ser assintomáticos.",
    diagnosis: "Diagnóstico baseado em urinálise (piúria, bacteriúria, hematuria), cultura e antibiograma. Ultrassom abdominal para avaliação de urolitíase, neoplasias ou alterações estruturais. Hemograma e bioquímico para avaliação de função renal e presença de infecção sistêmica.",
    treatment: "Antibioticoterapia baseada no resultado da cultura e antibiograma. Opções empíricas incluem Amoxicilina + Clavulanato, Ciprofloxacino ou Trimetoprim + Sulfametoxazol. Duração de 7-14 dias para cistite simples, 4-6 semanas para pielonefrite. Tratamento de condições predisponentes.",
    prevention: "Acesso adequado à água, micção frequente, higiene perineal, controle de doenças predisponentes e antibioticoprofilaxia em casos selecionados.",
    references: [
      "Nelson & Couto - Medicina Interna de Pequenos Animais, 6ª ed. Capítulo: Doenças do Trato Urinário",
      "Cunningham - Manual de Fisiologia Veterinária, 5ª ed. Capítulo: Sistema Urinário",
      "Plumb's Veterinary Drug Handbook, 9ª ed. Capítulo: Antibioticoterapia"
    ]
  },
  {
    name: "Dermatite",
    synonyms: ["Piodermite", "Infecção de Pele", "Celulite"],
    etiology: "As infecções de pele podem ser causadas por bactérias (Staphylococcus pseudintermedius, Streptococcus spp., Pseudomonas aeruginosa), fungos (Malassezia spp., dermatófitos) ou parasitas (Demodex spp., Sarcoptes scabiei). A infecção pode ser primária ou secundária a trauma, alergias, doenças endócrinas ou imunodepressão.",
    epidemiology: "As infecções de pele são comuns em cães, especialmente em raças com dobras cutâneas, pelagem densa ou predisposição a alergias. Fatores de risco incluem atopia, hipersensibilidade alimentar, hipotireoidismo, hiperadrenocorticismo e diabetes mellitus.",
    pathophysiology: "A patogênese envolve a colonização bacteriana da pele, geralmente secundária a alterações na barreira cutânea. O trauma, umidade excessiva ou alterações no pH cutâneo facilitam a proliferação bacteriana. A resposta inflamatória resulta em eritema, edema, pápulas, pústulas e crostas. A infecção pode progredir para celulite, abscessos ou infecção sistêmica.",
    clinicalPresentation: "Sinais incluem prurido, eritema, pápulas, pústulas, crostas, alopecia e odor desagradável. Pode haver piodermite superficial ou profunda, dependendo da profundidade da infecção. Em casos graves, febre, letargia e linfadenopatia regional.",
    diagnosis: "Diagnóstico baseado em exame físico, citologia cutânea (presença de bactérias e neutrófilos), cultura e antibiograma. Biópsia cutânea pode ser necessária em casos crônicos ou refratários. Avaliação de doenças predisponentes.",
    treatment: "Antibioticoterapia tópica e/ou sistêmica baseada na extensão e profundidade da infecção. Opções sistêmicas incluem Cefalexina, Amoxicilina + Clavulanato ou Clindamicina. Shampoos antissépticos e tratamento de doenças predisponentes. Duração de 3-6 semanas.",
    prevention: "Controle de doenças predisponentes (alergias, endocrinopatias), higiene adequada, secagem completa após banhos, controle de parasitas e dieta adequada.",
    references: [
      "Nelson & Couto - Medicina Interna de Pequenos Animais, 6ª ed. Capítulo: Doenças Dermatológicas",
      "Cunningham - Manual de Fisiologia Veterinária, 5ª ed. Capítulo: Sistema Tegumentar",
      "Plumb's Veterinary Drug Handbook, 9ª ed. Capítulo: Antibioticoterapia"
    ]
  },
  {
    name: "Meningite",
    synonyms: ["Meningoencefalite", "Infecção do SNC"],
    etiology: "A meningite pode ser causada por bactérias (Streptococcus spp., Staphylococcus spp., Escherichia coli, Klebsiella spp.), vírus (Parvovírus canino, Vírus da Cinomose), fungos (Cryptococcus neoformans, Aspergillus spp.) ou parasitas. A infecção pode ser primária ou secundária a otite, sinusite, trauma ou bacteremia.",
    epidemiology: "A meningite é mais comum em animais jovens, imunocomprometidos ou com doenças predisponentes. Fatores de risco incluem otite crônica, sinusite, trauma craniano, imunodepressão e neoplasias. A incidência é maior em cães braquicefálicos devido a alterações anatômicas.",
    pathophysiology: "A patogênese envolve a invasão bacteriana das meninges através de disseminação hematogênica, extensão de infecções adjacentes ou trauma. A resposta inflamatória resulta em edema meníngeo, aumento da pressão intracraniana e alterações no fluxo sanguíneo cerebral. A inflamação pode se estender para o parênquima cerebral (meningoencefalite).",
    clinicalPresentation: "Sinais incluem febre, letargia, anorexia, rigidez de nuca, hiperestesia, convulsões, alterações comportamentais, ataxia e paralisia. Pode haver sinais de hipertensão intracraniana (vômito, alterações pupilares, coma).",
    diagnosis: "Diagnóstico baseado em história clínica, exame neurológico, hemograma, bioquímico e análise do líquido cefalorraquidiano (LCR). Cultura do LCR para identificação do agente etiológico. Tomografia computadorizada ou ressonância magnética para avaliação de lesões estruturais.",
    treatment: "Antibioticoterapia empírica inicial com penetração adequada no SNC. Opções incluem Cefalosporinas de 3ª geração, Ampicilina + Gentamicina ou Vancomicina + Cefotaxima. Suporte intensivo com fluidoterapia, controle de convulsões e monitoramento da pressão intracraniana.",
    prevention: "Vacinação adequada, controle de infecções otológicas e sinusais, e tratamento precoce de bacteremia.",
    references: [
      "Nelson & Couto - Medicina Interna de Pequenos Animais, 6ª ed. Capítulo: Doenças Neurológicas",
      "Cunningham - Manual de Fisiologia Veterinária, 5ª ed. Capítulo: Sistema Nervoso",
      "Plumb's Veterinary Drug Handbook, 9ª ed. Capítulo: Antibioticoterapia"
    ]
  },
  {
    name: "Endocardite",
    synonyms: ["Endocardite Infecciosa", "Infecção Valvar"],
    etiology: "A endocardite é causada principalmente por bactérias Gram-positivas, especialmente Staphylococcus spp., Streptococcus spp. e Enterococcus spp. Gram-negativos como Escherichia coli e Pseudomonas aeruginosa são menos comuns. A infecção pode ser primária ou secundária a bacteremia de outras fontes.",
    epidemiology: "A endocardite é mais comum em cães machos, de meia-idade a idosos, com doença cardíaca pré-existente. Fatores de risco incluem valvulopatia degenerativa, cardiomiopatia, imunodepressão, cateterização venosa e procedimentos odontológicos.",
    pathophysiology: "A patogênese envolve a adesão bacteriana ao endocárdio, geralmente em áreas de lesão pré-existente. As bactérias formam vegetações fibrinosas que podem embolizar para outros órgãos. A resposta inflamatória resulta em destruição valvar, regurgitação e insuficiência cardíaca. A bacteremia persistente pode causar lesões em múltiplos órgãos.",
    clinicalPresentation: "Sinais incluem febre, letargia, anorexia, perda de peso, sopro cardíaco, arritmias e sinais de insuficiência cardíaca. Pode haver sinais de embolização (claudicação, alterações neurológicas, insuficiência renal).",
    diagnosis: "Diagnóstico baseado em história clínica, exame físico, hemograma, bioquímico, hemoculturas e ecocardiografia. Hemoculturas seriadas são essenciais para identificação do agente etiológico. Ecocardiografia mostra vegetações valvares e alterações funcionais.",
    treatment: "Antibioticoterapia prolongada (4-6 semanas) baseada no resultado das hemoculturas. Opções empíricas incluem Ampicilina + Gentamicina ou Vancomicina + Gentamicina. Tratamento da insuficiência cardíaca e controle de arritmias. Cirurgia valvar pode ser necessária em casos selecionados.",
    prevention: "Profilaxia antibiótica em procedimentos odontológicos e cirúrgicos em pacientes de alto risco, controle de doenças cardíacas pré-existentes e tratamento precoce de bacteremia.",
    references: [
      "Nelson & Couto - Medicina Interna de Pequenos Animais, 6ª ed. Capítulo: Doenças Cardiovasculares",
      "Cunningham - Manual de Fisiologia Veterinária, 5ª ed. Capítulo: Sistema Cardiovascular",
      "Plumb's Veterinary Drug Handbook, 9ª ed. Capítulo: Antibioticoterapia"
    ]
  }
];

export function findDiseaseByName(name: string): DiseaseExplanation | undefined {
  return diseaseExplanations.find(disease => 
    disease.name.toLowerCase().includes(name.toLowerCase()) ||
    disease.synonyms.some(synonym => synonym.toLowerCase().includes(name.toLowerCase()))
  );
}

export function getAllDiseaseNames(): string[] {
  return diseaseExplanations.map(disease => disease.name);
}
