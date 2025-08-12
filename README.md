# VetPro - Banco de Questões UFV 2021

## Visão Geral

Este projeto implementa um sistema completo de questões da prova UFV 2021 para residência veterinária, incluindo:

- **40 questões** completas com explicações detalhadas
- Sistema de **revisão literária** para cada questão
- Funcionalidade **"Treine seu aprendizado"** com questões de treino
- Classificação por áreas de conhecimento
- Interface moderna e responsiva

## Funcionalidades Implementadas

### 1. Banco de Questões UFV 2021
- **40 questões** da prova UFV 2021
- Explicações detalhadas para alternativas corretas e incorretas
- Classificação por área de conhecimento e tópicos
- Sistema de metadados para rastreabilidade

### 2. Revisão Literária Integrada
- Seção de revisão para cada questão
- Pontos de alto rendimento (high yield)
- Identificação de "pegadinhas" comuns
- Referências bibliográficas relevantes

### 3. Sistema de Treino Interativo
- Botão **"Treine seu aprendizado"** ao lado da revisão literária
- Modal pop-up com questão de treino relacionada
- Feedback imediato com explicação da resposta
- Questões de treino com diferenças sutis para testar conhecimento

### 4. Áreas de Conhecimento Cobertas
- **Saúde Pública** (10 questões)
- **Clínica Médica** (8 questões)
- **Clínica Cirúrgica** (4 questões)
- **Anestesiologia** (6 questões)
- **Diagnóstico por Imagem** (6 questões)
- **Laboratório Clínico** (6 questões)

### 5. Temas Abordados
- Vigilância Epidemiológica e Sanitária
- Transição Epidemiológica
- Zoonoses e Classificação
- Indicadores Epidemiológicos
- Animais Peçonhentos
- Controle de Roedores
- Leptospirose
- Leishmaniose
- Ofidismo
- Fluidoterapia
- Trauma e Emergência
- Síndrome Braquicefálica
- Farmacologia Anestésica
- Radiologia e Ultrassom
- Hematologia e Bioquímica
- Cardiologia e Arritmias
- Neurologia e Síndromes Vestibulares
- Dermatologia e Alergias
- Ortopedia e Fixação de Fraturas
- Cirurgia Torácica e Trauma
- Endocrinologia e Diabetes
- Gastroenterologia
- Monitoramento Anestésico
- Complicações Anestésicas
- Tomografia e Ressonância Magnética
- Citologia e Histopatologia
- Urinálise e Cristalúria

## Estrutura Técnica

### Arquivos Principais
- `data/question_bank_ufv_2021.json` - Banco de questões UFV 2021
- `types.ts` - Definições TypeScript para questões e treino
- `App.tsx` - Interface principal com funcionalidade de treino
- `db.ts` - Gerenciamento do banco de dados IndexedDB

### Estrutura de Dados
```typescript
interface Question {
  // ... campos existentes ...
  training_question?: TrainingQuestion; // Nova funcionalidade
}

interface TrainingQuestion {
  stem: string;
  options: Option[];
  answer_key: string;
  rationale: string;
}
```

## Como Usar

### 1. Acesso às Questões
- Navegue pelas questões usando os controles da interface
- Cada questão inclui explicações detalhadas e revisão literária

### 2. Sistema de Treino
- Após responder uma questão, clique em **"Treine seu aprendizado"**
- Responda a questão de treino no modal que aparece
- Receba feedback imediato com explicação da resposta correta

### 3. Revisão Literária
- Cada questão possui uma seção de revisão completa
- Inclui pontos de alto rendimento e identificação de pegadinhas
- Referências bibliográficas para aprofundamento

## Benefícios Pedagógicos

### 1. Aprendizado Ativo
- Sistema de treino interativo reforça conceitos
- Feedback imediato facilita correção de erros
- Questões relacionadas testam compreensão profunda

### 2. Preparação Estratégica
- Identificação de pontos de alto rendimento
- Alertas sobre pegadinhas comuns
- Foco em áreas frequentemente cobradas

### 3. Revisão Eficiente
- Revisão literária integrada para cada questão
- Classificação por áreas facilita estudo direcionado
- Referências para aprofundamento

## Atualizações Futuras

- Adição de mais bancos de questões de outras instituições
- Sistema de estatísticas de desempenho
- Modo de simulado cronometrado
- Exportação de relatórios de estudo

## Tecnologias Utilizadas

- **React** - Interface de usuário
- **TypeScript** - Tipagem estática
- **IndexedDB** - Armazenamento local
- **Tailwind CSS** - Estilização
- **Vite** - Build tool

---

**Desenvolvido para otimizar a preparação para residência veterinária com foco em aprendizado eficiente e retenção de conhecimento.**
