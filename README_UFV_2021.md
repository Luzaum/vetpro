# Banco de Questões UFV 2021 - VetPro

## 📚 Novas Funcionalidades Implementadas

### 1. Banco de Questões UFV 2021
- **20 questões** da prova UFV 2021 adicionadas ao banco de dados
- **Classificação por área do conhecimento**: Saúde Pública, Clínica Médica, Clínica Cirúrgica, Anestesiologia, Diagnóstico por Imagem, Laboratório Clínico
- **Revisão literária completa** para cada questão com:
  - Etiologia
  - Epidemiologia  
  - Fisiologia
  - High-yield points
  - Pegadinhas comuns
  - Referências bibliográficas

### 2. Sistema de Treino Integrado
- **Botão "Treine seu aprendizado"** aparece ao lado da revisão literária
- **Questões de treino** relacionadas ao tema principal, mas com diferenças que permitem testar o conhecimento
- **Modal interativo** com:
  - Questão de treino específica
  - Opções de resposta
  - Feedback imediato (correto/incorreto)
  - Explicação detalhada da resposta

### 3. Estrutura das Questões

#### Questão Principal
```json
{
  "id": "UFV-2021-SP-0001",
  "year": 2021,
  "exam": "UFV",
  "area_tags": ["SAÚDE PÚBLICA"],
  "topic_tags": ["VIGILÂNCIA EPIDEMIOLÓGICA", "LEI 8.080/90", "SUS"],
  "stem": "Enunciado da questão...",
  "options": [...],
  "answer_key": "D",
  "rationales": {
    "A": "Explicação detalhada...",
    "B": "Explicação detalhada...",
    "C": "Explicação detalhada...",
    "D": "Explicação detalhada..."
  },
  "review": {
    "etiologia": "...",
    "epidemiologia": "...",
    "fisiologia": "...",
    "high_yield": ["...", "..."],
    "pegadinhas": ["...", "..."],
    "referencias": [...]
  }
}
```

#### Questão de Treino
```json
{
  "training_question": {
    "stem": "Questão relacionada mas diferente...",
    "options": [...],
    "answer_key": "B",
    "rationale": "Explicação da diferença..."
  }
}
```

### 4. Áreas de Conhecimento Cobertas

#### Saúde Pública (10 questões)
- Vigilância Epidemiológica
- Transição Epidemiológica
- Notificação Compulsória
- Zoonoses
- Indicadores Epidemiológicos
- Animais Peçonhentos
- Controle de Roedores
- Leptospirose
- Leishmaniose Tegumentar

#### Clínica Médica (3 questões)
- Fluidoterapia
- Trauma e Emergência
- Síndrome Braquicefálica

#### Anestesiologia (2 questões)
- Farmacologia (Acepromazina)
- Classificação de Fármacos

#### Diagnóstico por Imagem (2 questões)
- Hematúria
- Hepatomegalia

#### Laboratório Clínico (2 questões)
- Efusões (Transudatos/Exudatos)
- Anemia Regenerativa

### 5. Como Usar

1. **Acesse o app** e vá para a seção "Estudar" ou "Navegar"
2. **Responda a questão** normalmente
3. **Após confirmar a resposta**, aparecerá a revisão literária
4. **Clique em "Treine seu aprendizado"** (se disponível)
5. **Responda a questão de treino** no modal
6. **Veja o feedback** e a explicação

### 6. Benefícios Pedagógicos

- **Aprendizado ativo**: O usuário testa o conhecimento imediatamente após a revisão
- **Diferenciação conceitual**: As questões de treino ajudam a distinguir conceitos similares
- **Retenção**: O feedback imediato reforça o aprendizado
- **Preparação para prova**: Simula o ambiente de teste com questões relacionadas

### 7. Próximas Atualizações

- Adição das próximas 20 questões da UFV 2021
- Mais questões de treino para cada tema
- Sistema de progresso por área
- Estatísticas específicas por prova

---

**Desenvolvido para preparação de residência veterinária com foco em aprendizado eficiente e retenção de conhecimento.**
