import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container relative z-10 mx-auto px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            🚀 Versão 2.0
          </Badge>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Luzaum's{' '}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Guidebook
            </span>
          </h1>
          
          <p className="mb-8 text-xl text-muted-foreground sm:text-2xl">
            Seu hub central para todas as ferramentas veterinárias. 
            Acesso rápido e organizado às suas aplicações favoritas.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="text-lg px-8 py-6"
            >
              Explorar Aplicações
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6"
            >
              Saiba Mais
            </Button>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="rounded-lg bg-card/80 p-6 text-center">
            <div className="mb-4 text-3xl">📱</div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Acesso Rápido
            </h3>
            <p className="text-muted-foreground">
              Todas suas ferramentas em um só lugar
            </p>
          </div>
          
          <div className="rounded-lg bg-card/80 p-6 text-center">
            <div className="mb-4 text-3xl">🎨</div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Interface Moderna
            </h3>
            <p className="text-muted-foreground">
              Design elegante e responsivo
            </p>
          </div>
          
          <div className="rounded-lg bg-card/80 p-6 text-center">
            <div className="mb-4 text-3xl">⚡</div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Performance
            </h3>
            <p className="text-muted-foreground">
              Carregamento rápido e eficiente
            </p>
          </div>
        </div>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>
    </div>
  );
};
