# 🛡️ FiscalGuard

### *Motor Híbrido de Auditoria Fiscal & Inteligência Artificial Preditiva*

O **FiscalGuard** é uma plataforma Full-Stack de conformidade e auditoria fiscal contínua projetada para escritórios de contabilidade e departamentos fiscais modernos. O sistema combina o rigor analítico de um **Motor de Regras Determinísticas** (baseado na legislação tributária brasileira de PIS/COFINS) com o poder estatístico de **Modelos de Inteligência Artificial (Isolation Forest)** para interceptar anomalias, erros de faturamento, divergências de CST (Código de Situação Tributária) e variações de preços antes de qualquer autuação da Receita Federal.

Com uma arquitetura moderna dividida em um ecossistema **Monorepo**, o projeto entrega processamento de notas fiscais de alto desempenho no Back-end e uma experiência analítica imersiva e de alto padrão (Dark Mode Premium) no Front-end.

---

## 📸 Arquitetura e Design do Sistema

O sistema foi estruturado seguindo os mais altos padrões de design de interface corporativa integrando um fluxo automatizado de dados:

> **[ Arquivo XML ] ➔ [ Ingestão e Parsing FastAPI ] ➔ [ PostgreSQL ]**
> ⬇
> **[ Relatório Consolidado ] ◀── [ FiscalAuditEngine ]**
> *(Camada 1: Regras Fiscais | Camada 2: IA Preditiva)*
> ⬇
> **[ Painel UI Premium em React ]**

---

## 🛠️ Tecnologias Utilizadas

### **Back-end (`FiscalGuard_back_end`)**
* **FastAPI:** Framework assíncrono de alto desempenho para construção de APIs.
* **SQLAlchemy & PostgreSQL:** ORM robusto e banco de dados relacional para persistência de dados fiscais estruturados.
* **Pandas & NumPy:** Manipulação e consolidação de grandes volumes de itens e históricos tributários.
* **Scikit-Learn (Sklearn):** Engine de Machine Learning utilizando o algoritmo `Isolation Forest` para cálculo do *Score de Bizarrice* e detecção de outliers.
* **Uvicorn:** Servidor ASGI rápido para produção e desenvolvimento.

### **Front-end (`FiscalGuard_front_end`)**
* **React + TypeScript:** Componentização forte, tipagem estática e reatividade robusta.
* **Tailwind CSS:** Estilização utilitária focada em alta performance e design customizado.
* **Lucide React:** Ícones modernos de linha para dashboards profissionais.

---

## 🧠 O Coração do Projeto: O Motor Híbrido de Auditoria

O grande diferencial do FiscalGuard é atuar em **duas camadas independentes e complementares**, acabando com o problema da "IA Caixa-Preta":

### **Camada 1: O Xerife Fiscal (Regras Determinísticas)**
Varre cada item das Notas Fiscais Eletrônicas (`NF-e`) aplicando validações exatas estruturadas por especialistas:
1. **Mudança de CST Crítica (`CST_MUDOU_PARA_ISENTO`):** Detecta se um produto que sempre foi tributado apareceu repentinamente como isento/não-tributado.
2. **Inconsistência Tributária (`CST_INCONSISTENTE`):** Alerta se o faturista preencheu uma alíquota maior que zero em uma operação declarada com CST de isenção.
3. **Preço Unitário Anômalo (`PRECO_ANOMALO`):** Identifica se o valor praticado no item está 50% abaixo ou 200% acima da média histórica registrada para aquele NCM.
4. **Base de Cálculo Vazia (`BASE_VAZIA`):** Intercepta itens cruciais com valor unitário ou total menor ou igual a zero.

### **Camada 2: O Assistente Estatístico (Inteligência Artificial)**
Caso o item passe intacto pelas regras fiscais fixas, ele é processado pelo algoritmo **`Isolation Forest`**. O modelo analisa o comportamento multidimensional das variáveis numéricas (`quantidade`, `valor_unitario`):
* Gera um **`score_bizarrice`** para detectar anomalias estatísticas puras.
* Marca operações volumétricas atípicas como **`OPERACAO_RARA`**.

---

## 📂 Estrutura de Diretórios (Monorepo)

```text
sistema_contabilidade/
├── FiscalGuard_back_end/          # API REST & Motor Preditivo (Python)
│   ├── api/routes/api_v1.py       # Endpoints de controle
│   ├── database/connection.py     # Setup do PostgreSQL
│   ├── IA_preditiva/services/     # Motor de Anomalias e Auditoria
│   └── main.py                    # Inicialização do FastAPI
│
└── FiscalGuard_front_end/         # Interface de Usuário Premium
    ├── src/components/            # Cards de KPI, Gráficos e Tabelas
    ├── src/pages/                 # Abas principais de navegação
    └── App.tsx                    # Gerenciador de Estados Globais


```

👥 Autoria e Contribuição
Desenvolvido por Laiane Sousa como parte de um ecossistema avançado de Engenharia de Dados Aplicada e Auditoria Preditiva Fiscal.

⭐ Se este projeto te ajudou a entender como aplicar Engenharia de Dados e IA em problemas reais do mundo contábil, deixe uma estrela no repositório!
