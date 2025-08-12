import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to enhance literary reviews with missing fields
function enhanceLiteraryReview(question) {
  if (!question.review) {
    question.review = {};
  }

  // Add missing fields if they don't exist
  if (!question.review.etiologia) {
    question.review.etiologia = generateEtiologia(question);
  }

  if (!question.review.epidemiologia) {
    question.review.epidemiologia = generateEpidemiologia(question);
  }

  if (!question.review.pegadinhas) {
    question.review.pegadinhas = generatePegadinhas(question);
  }

  if (!question.review.referencias) {
    question.review.referencias = generateReferencias(question);
  }

  // Ensure high_yield is an array
  if (question.review.high_yield && !Array.isArray(question.review.high_yield)) {
    question.review.high_yield = [question.review.high_yield];
  }

  // Ensure pegadinhas is an array
  if (question.review.pegadinhas && !Array.isArray(question.review.pegadinhas)) {
    question.review.pegadinhas = [question.review.pegadinhas];
  }

  return question;
}

// Generate etiologia based on question content
function generateEtiologia(question) {
  const topic = question.topic_tags?.[0] || question.area_tags?.[0] || 'Doença';
  const stem = question.stem.toLowerCase();

  if (stem.includes('radiografia') || stem.includes('ultrassonografia') || stem.includes('imagem')) {
    return `O diagnóstico por imagem é fundamental na medicina veterinária para identificar alterações estruturais e funcionais. ${topic} requer avaliação específica através de diferentes modalidades de imagem.`;
  }

  if (stem.includes('fratura') || stem.includes('fixação') || stem.includes('ortopedia')) {
    return `As fraturas são lesões traumáticas que comprometem a integridade óssea. ${topic} requer abordagem específica baseada no tipo de fratura, localização e características do paciente.`;
  }

  if (stem.includes('disco') || stem.includes('medula') || stem.includes('neurológico')) {
    return `A doença do disco intervertebral é causada pela degeneração do disco, resultando em compressão medular. ${topic} é uma condição neurológica que requer diagnóstico e tratamento específicos.`;
  }

  if (stem.includes('urina') || stem.includes('renal') || stem.includes('cilindro')) {
    return `A urinálise é um exame fundamental para avaliação da função renal. ${topic} pode ser identificado através de alterações específicas no sedimento urinário.`;
  }

  if (stem.includes('antibiótico') || stem.includes('infecção') || stem.includes('bacteriana')) {
    return `A antibioticoterapia é baseada no conhecimento da etiologia bacteriana e sensibilidade aos antimicrobianos. ${topic} requer seleção criteriosa do antimicrobiano adequado.`;
  }

  if (stem.includes('anestesia') || stem.includes('sedação') || stem.includes('analgesia')) {
    return `A anestesia veterinária envolve múltiplos fármacos que atuam em diferentes sistemas. ${topic} requer conhecimento farmacológico específico e monitoramento adequado.`;
  }

  if (stem.includes('cardíaco') || stem.includes('eletrocardiograma') || stem.includes('arritmia')) {
    return `As arritmias cardíacas são distúrbios do ritmo cardíaco que podem ter múltiplas etiologias. ${topic} requer interpretação eletrocardiográfica específica.`;
  }

  if (stem.includes('dermatologia') || stem.includes('pele') || stem.includes('dermatite')) {
    return `As doenças dermatológicas são comuns na medicina veterinária. ${topic} pode ter etiologia multifatorial incluindo fatores alérgicos, infecciosos e parasitários.`;
  }

  if (stem.includes('gastrointestinal') || stem.includes('vômito') || stem.includes('diarreia')) {
    return `As doenças gastrointestinais são frequentes na clínica veterinária. ${topic} pode ter etiologia infecciosa, inflamatória, neoplásica ou tóxica.`;
  }

  if (stem.includes('respiratório') || stem.includes('pulmão') || stem.includes('pneumonia')) {
    return `As doenças respiratórias podem afetar vias aéreas superiores ou inferiores. ${topic} requer diagnóstico específico e tratamento direcionado.`;
  }

  if (stem.includes('endócrino') || stem.includes('hormônio') || stem.includes('diabetes')) {
    return `As doenças endócrinas resultam de disfunções hormonais. ${topic} requer diagnóstico laboratorial específico e tratamento de reposição ou supressão hormonal.`;
  }

  if (stem.includes('toxicologia') || stem.includes('veneno') || stem.includes('intoxicação')) {
    return `A toxicologia veterinária envolve o estudo de substâncias tóxicas e seus efeitos. ${topic} requer identificação do agente tóxico e tratamento específico.`;
  }

  if (stem.includes('cirurgia') || stem.includes('operatório') || stem.includes('pós-operatório')) {
    return `A cirurgia veterinária envolve procedimentos invasivos que requerem cuidados específicos. ${topic} necessita de planejamento cirúrgico adequado e cuidados pós-operatórios.`;
  }

  if (stem.includes('laboratório') || stem.includes('exame') || stem.includes('bioquímico')) {
    return `O laboratório clínico fornece informações essenciais para o diagnóstico. ${topic} requer interpretação adequada dos resultados laboratoriais.`;
  }

  if (stem.includes('farmacologia') || stem.includes('fármaco') || stem.includes('medicamento')) {
    return `A farmacologia veterinária estuda os efeitos dos medicamentos nos animais. ${topic} requer conhecimento farmacocinético e farmacodinâmico específico.`;
  }

  if (stem.includes('saúde pública') || stem.includes('zoonose') || stem.includes('epidemiologia')) {
    return `A saúde pública veterinária foca na prevenção e controle de doenças. ${topic} é fundamental para a saúde coletiva e controle epidemiológico.`;
  }

  return `${topic} é uma condição que requer conhecimento específico para diagnóstico e tratamento adequados.`;
}

// Generate epidemiologia based on question content
function generateEpidemiologia(question) {
  const topic = question.topic_tags?.[0] || question.area_tags?.[0] || 'Doença';
  const stem = question.stem.toLowerCase();

  if (stem.includes('gato') || stem.includes('felino')) {
    return `${topic} é mais comum em gatos, especialmente em determinadas faixas etárias e raças específicas. A prevalência varia conforme fatores ambientais e genéticos.`;
  }

  if (stem.includes('cão') || stem.includes('canino')) {
    return `${topic} afeta principalmente cães, com variação de incidência entre raças e idades. Fatores genéticos e ambientais influenciam a ocorrência.`;
  }

  if (stem.includes('jovem') || stem.includes('filhote')) {
    return `${topic} é mais frequente em animais jovens, sendo uma condição comum na população pediátrica veterinária.`;
  }

  if (stem.includes('idoso') || stem.includes('senior')) {
    return `${topic} é mais prevalente em animais idosos, refletindo alterações fisiológicas relacionadas ao envelhecimento.`;
  }

  if (stem.includes('raça') || stem.includes('genético')) {
    return `${topic} apresenta predisposição racial, indicando componente genético na etiologia da doença.`;
  }

  if (stem.includes('sazonal') || stem.includes('estação')) {
    return `${topic} apresenta variação sazonal, sendo mais comum em determinadas épocas do ano.`;
  }

  if (stem.includes('geográfico') || stem.includes('região')) {
    return `${topic} varia geograficamente, sendo mais prevalente em determinadas regiões devido a fatores ambientais e climáticos.`;
  }

  if (stem.includes('zoonose') || stem.includes('saúde pública')) {
    return `${topic} é uma zoonose de importância em saúde pública, afetando tanto animais quanto humanos.`;
  }

  return `${topic} apresenta distribuição variável na população veterinária, sendo influenciada por múltiplos fatores epidemiológicos.`;
}

// Generate pegadinhas based on question content
function generatePegadinhas(question) {
  const stem = question.stem.toLowerCase();
  const options = question.options.map(opt => opt.text.toLowerCase());
  const correctAnswer = question.answer_key;

  let pegadinhas = [];

  // Common traps based on question type
  if (stem.includes('não') || stem.includes('incorreto') || stem.includes('exceto')) {
    pegadinhas.push("Não ler atentamente palavras negativas como 'não', 'incorreto', 'exceto'");
  }

  if (stem.includes('mais') || stem.includes('melhor') || stem.includes('principal')) {
    pegadinhas.push("Confundir 'mais comum' com 'único' ou 'sempre'");
  }

  if (stem.includes('sempre') || stem.includes('nunca')) {
    pegadinhas.push("Generalizar com 'sempre' ou 'nunca' sem considerar exceções");
  }

  if (options.some(opt => opt.includes('todos') || opt.includes('nenhum'))) {
    pegadinhas.push("Cuidado com opções absolutas como 'todos' ou 'nenhum'");
  }

  if (stem.includes('diagnóstico') && options.some(opt => opt.includes('tratamento'))) {
    pegadinhas.push("Confundir diagnóstico com tratamento");
  }

  if (stem.includes('causa') && options.some(opt => opt.includes('sintoma'))) {
    pegadinhas.push("Confundir causa com consequência ou sintoma");
  }

  if (stem.includes('agudo') && options.some(opt => opt.includes('crônico'))) {
    pegadinhas.push("Confundir condições agudas com crônicas");
  }

  if (stem.includes('primeiro') || stem.includes('inicial')) {
    pegadinhas.push("Confundir primeira linha de tratamento com tratamento definitivo");
  }

  // Add specific traps based on topic
  if (stem.includes('radiografia') || stem.includes('ultrassonografia')) {
    pegadinhas.push("Confundir indicações de diferentes exames de imagem");
  }

  if (stem.includes('antibiótico')) {
    pegadinhas.push("Usar antibiótico sem indicação específica");
  }

  if (stem.includes('anestesia')) {
    pegadinhas.push("Confundir fármacos anestésicos e suas indicações");
  }

  if (stem.includes('cardíaco')) {
    pegadinhas.push("Interpretar incorretamente alterações eletrocardiográficas");
  }

  if (stem.includes('renal') || stem.includes('urina')) {
    pegadinhas.push("Confundir diferentes tipos de alterações urinárias");
  }

  if (stem.includes('cirurgia')) {
    pegadinhas.push("Confundir diferentes técnicas cirúrgicas");
  }

  if (pegadinhas.length === 0) {
    pegadinhas.push("Não ler o enunciado com atenção");
    pegadinhas.push("Confundir conceitos relacionados");
  }

  return pegadinhas;
}

// Generate referencias based on question content
function generateReferencias(question) {
  const area = question.area_tags?.[0] || 'Clínica';
  const topic = question.topic_tags?.[0] || 'Geral';

  let referencias = [
    {"obra": "Nelson & Couto", "cap": getNelsonChapter(area, topic), "pg": topic},
    {"obra": "Cunningham", "cap": getCunninghamChapter(area, topic), "pg": topic},
    {"obra": "Plumb's", "cap": getPlumbsChapter(area, topic), "pg": topic}
  ];

  return referencias;
}

function getNelsonChapter(area, topic) {
  const areaMap = {
    'CLÍNICA MÉDICA': 'Clínica Médica',
    'CLÍNICA CIRÚRGICA': 'Cirurgia',
    'DIAGNÓSTICO POR IMAGEM': 'Diagnóstico por Imagem',
    'LABORATÓRIO CLÍNICO': 'Laboratório Clínico',
    'ANESTESIOLOGIA': 'Anestesiologia',
    'FARMACOLOGIA': 'Farmacologia',
    'SAÚDE PÚBLICA': 'Saúde Pública',
    'TOXICOLOGIA': 'Toxicologia'
  };

  return areaMap[area] || area;
}

function getCunninghamChapter(area, topic) {
  const areaMap = {
    'CLÍNICA MÉDICA': 'Clínica Médica',
    'CLÍNICA CIRÚRGICA': 'Cirurgia',
    'DIAGNÓSTICO POR IMAGEM': 'Diagnóstico',
    'LABORATÓRIO CLÍNICO': 'Laboratório',
    'ANESTESIOLOGIA': 'Anestesia',
    'FARMACOLOGIA': 'Farmacologia',
    'SAÚDE PÚBLICA': 'Saúde Pública',
    'TOXICOLOGIA': 'Toxicologia'
  };

  return areaMap[area] || area;
}

function getPlumbsChapter(area, topic) {
  const areaMap = {
    'CLÍNICA MÉDICA': 'Clínica',
    'CLÍNICA CIRÚRGICA': 'Cirurgia',
    'DIAGNÓSTICO POR IMAGEM': 'Diagnóstico',
    'LABORATÓRIO CLÍNICO': 'Laboratório',
    'ANESTESIOLOGIA': 'Anestesia',
    'FARMACOLOGIA': 'Farmacologia',
    'SAÚDE PÚBLICA': 'Saúde Pública',
    'TOXICOLOGIA': 'Toxicologia'
  };

  return areaMap[area] || area;
}

// Main function to process question banks
function processQuestionBank(filePath) {
  console.log(`Processing ${filePath}...`);

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (data.items && Array.isArray(data.items)) {
      data.items = data.items.map(enhanceLiteraryReview);
      console.log(`Enhanced ${data.items.length} questions in ${filePath}`);
    }

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully updated ${filePath}`);

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Process all question banks
const questionBanks = [
  'data/question_bank_2.json',
  'data/question_bank_3.json',
  'data/question_bank_4.json'
];

questionBanks.forEach(bank => {
  const fullPath = path.join(__dirname, bank);
  if (fs.existsSync(fullPath)) {
    processQuestionBank(fullPath);
  } else {
    console.log(`File not found: ${fullPath}`);
  }
});

console.log('Literary review enhancement completed!');
