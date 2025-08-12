# VetPro - Banco de Questões UFV 2021

## Visão Geral

Este projeto implementa um sistema completo de questões da prova UFV 2021 para residência veterinária, incluindo:

- **40 questões** completas com explicações detalhadas
- Sistema de **revisão literária** para cada questão
- Funcionalidade **"Treine seu aprendizado"** com questões de treino
- Classificação por áreas de conhecimento
- Interface moderna e responsiva
- **Explicações educativas completas** para todas as alternativas

## Funcionalidades Implementadas

### 1. Banco de Questões UFV 2021
- **40 questões** da prova UFV 2021
- **Explicações detalhadas e educativas** para alternativas corretas e incorretas
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

### 4. Explicações Educativas Completas
- **Explicações detalhadas** para todas as alternativas (corretas e incorretas)
- **Contexto fisiopatológico** para facilitar compreensão
- **Mecanismos de ação** explicados de forma didática
- **Correlações clínicas** para aplicação prática
- **Identificação de erros comuns** e confusões frequentes

### 5. Áreas de Conhecimento Cobertas
- **Saúde Pública** (10 questões)
- **Clínica Médica** (8 questões)
- **Clínica Cirúrgica** (4 questões)
- **Anestesiologia** (6 questões)
- **Diagnóstico por Imagem** (6 questões)
- **Laboratório Clínico** (6 questões)

### 6. Temas Abordados
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
  rationales: {
    A: string; // Explicação detalhada da alternativa A
    B: string; // Explicação detalhada da alternativa B
    C: string; // Explicação detalhada da alternativa C
    D: string; // Explicação detalhada da alternativa D
    E?: string; // Explicação detalhada da alternativa E (quando aplicável)
  };
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

### 4. Explicações Educativas
- **Alternativas corretas**: Explicação detalhada do porquê está correta
- **Alternativas incorretas**: Explicação do erro e conceito correto
- **Contexto fisiopatológico**: Mecanismos de ação e correlações clínicas
- **Identificação de confusões**: Erros comuns e como evitá-los

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

### 4. Compreensão Profunda
- Explicações detalhadas facilitam aprendizado
- Contexto fisiopatológico melhora retenção
- Identificação de erros comuns previne confusões

## Melhorias Implementadas

### Explicações Educativas Completas
- **Todas as 40 questões** do banco UFV 2021 foram revisadas
- **Explicações detalhadas** para alternativas corretas e incorretas
- **Contexto fisiopatológico** incluído em todas as explicações
- **Mecanismos de ação** explicados de forma didática
- **Correlações clínicas** para aplicação prática
- **Identificação de erros comuns** e confusões frequentes

### Exemplos de Melhorias
- **Questões de Saúde Pública**: Explicações sobre critérios de notificação, diferenças entre vigilâncias
- **Questões de Clínica**: Mecanismos fisiopatológicos detalhados
- **Questões de Anestesiologia**: Farmacologia e indicações específicas
- **Questões de Laboratório**: Interpretação de resultados e limitações
- **Questões de Imagem**: Indicações e limitações de cada método

## Atualizações Futuras

- Adição de mais bancos de questões de outras instituições
- Sistema de estatísticas de desempenho
- Modo de simulado cronometrado
- Exportação de relatórios de estudo
- Melhorias contínuas nas explicações educativas

## Tecnologias Utilizadas

- **React** - Interface de usuário
- **TypeScript** - Tipagem estática
- **IndexedDB** - Armazenamento local
- **Tailwind CSS** - Estilização
- **Vite** - Build tool

---

**Desenvolvido para otimizar a preparação para residência veterinária com foco em aprendizado eficiente e retenção de conhecimento através de explicações educativas completas e sistema de treino interativo.**
