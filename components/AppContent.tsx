import { useState } from 'react';
import { HeroSection } from './HeroSection';
import { Layout } from './Layout';
import { AppCard } from './AppCard';

interface AppItem {
  id: string;
  name: string;
  description: string;
  category: string;
  component?: React.ComponentType;
  externalUrl?: string;
  features: string[];
  status: 'active' | 'development' | 'planned';
  color: string;
}

interface AppCategory {
  name: string;
  description: string;
  apps: AppItem[];
}

const appData: AppCategory[] = [
  {
    name: "Aplicações Principais",
    description: "Ferramentas essenciais para o dia a dia veterinário",
    apps: [
      {
        id: "bulario",
        name: "Bulário VET",
        description: "Consulta rápida de medicamentos veterinários com informações detalhadas sobre posologia, contraindicações e interações.",
        category: "Medicamentos",
        externalUrl: "http://localhost:5182",
        features: ["Consulta por nome", "Filtros por categoria", "Informações detalhadas", "Modo offline"],
        status: "active",
        color: "bg-primary/10"
      },
      {
        id: "vetpro",
        name: "VetPro",
        description: "Plataforma de estudos para residência veterinária com questões, simulados e análise de performance.",
        category: "Educação",
        externalUrl: "http://localhost:5190",
        features: ["Banco de questões", "Simulados personalizados", "Estatísticas detalhadas", "Modo escuro"],
        status: "active",
        color: "bg-primary/10"
      },
      {
        id: "crivet",
        name: "CRIVET",
        description: "Sistema de gestão de clínica veterinária com prontuários, agendamentos e controle financeiro.",
        category: "Gestão",
        externalUrl: "http://localhost:5173",
        features: ["Prontuários digitais", "Agendamento online", "Controle financeiro", "Relatórios"],
        status: "development",
        color: "bg-muted"
      }
    ]
  },
  {
    name: "Ferramentas Especializadas",
    description: "Aplicações para casos específicos e procedimentos",
    apps: [
      {
        id: "transfusao",
        name: "Transfusão Sanguínea",
        description: "Calculadora e guia para procedimentos de transfusão sanguínea em animais.",
        category: "Procedimentos",
        component: () => <div>Transfusão Sanguínea Component</div>,
        features: ["Calculadora de volume", "Compatibilidade sanguínea", "Protocolos de emergência"],
        status: "active",
        color: "bg-primary/10"
      },
      {
        id: "hidroeletrolitico",
        name: "Hidroeletrolítico",
        description: "Calculadora de fluidoterapia e correção de distúrbios hidroeletrolíticos.",
        category: "Calculadoras",
        externalUrl: "http://localhost:5174",
        features: ["Cálculo de fluidos", "Correção de eletrólitos", "Protocolos personalizados"],
        status: "active",
        color: "bg-primary/10"
      },
      {
        id: "antibioticoterapia",
        name: "Antibioticoterapia",
        description: "Guia para seleção e uso racional de antibióticos em medicina veterinária.",
        category: "Medicamentos",
        externalUrl: "http://localhost:5175",
        features: ["Seleção de antibióticos", "Dosagens por espécie", "Interações medicamentosas"],
        status: "development",
        color: "bg-muted"
      }
    ]
  },
  {
    name: "Recursos Educacionais",
    description: "Materiais de estudo e referência",
    apps: [
      {
        id: "animais-peconhentos",
        name: "Animais Peçonhentos",
        description: "Guia completo sobre identificação e tratamento de envenenamentos por animais peçonhentos.",
        category: "Emergências",
        externalUrl: "http://localhost:5176",
        features: ["Identificação de espécies", "Protocolos de tratamento", "Primeiros socorros"],
        status: "active",
        color: "bg-primary/10"
      }
    ]
  }
];

type View = 'home' | 'apps' | 'app';

export const AppContent = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [activeApp, setActiveApp] = useState<AppItem | null>(null);

  const handleAppClick = (app: AppItem) => {
    if (app.externalUrl) {
      window.open(app.externalUrl, '_blank');
    } else if (app.component) {
      setActiveApp(app);
      setCurrentView('app');
    }
  };

  const handleBackToApps = () => {
    setCurrentView('apps');
    setActiveApp(null);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setActiveApp(null);
  };

  if (currentView === 'home') {
    return <HeroSection onGetStarted={() => setCurrentView('apps')} />;
  }

  if (currentView === 'app' && activeApp?.component) {
    const AppComponent = activeApp.component;
    return (
      <Layout onBack={handleBackToApps} title={activeApp.name}>
        <AppComponent />
      </Layout>
    );
  }

  return (
    <Layout onBack={handleBackToHome} title="Aplicações">
      <div className="space-y-8">
        {appData.map((category) => (
          <div key={category.name} className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{category.name}</h2>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.apps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onClick={() => handleAppClick(app)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};
