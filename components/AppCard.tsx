import { ExternalLink, Star, Clock, Zap } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

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

interface AppCardProps {
  app: AppItem;
  onClick: () => void;
}

export const AppCard = ({ app, onClick }: AppCardProps) => {
  const getStatusIcon = () => {
    switch (app.status) {
      case 'active':
        return <Zap className="h-4 w-4 text-green-500" />;
      case 'development':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'planned':
        return <Star className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (app.status) {
      case 'active':
        return 'Ativo';
      case 'development':
        return 'Em Desenvolvimento';
      case 'planned':
        return 'Planejado';
      default:
        return '';
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/30">
      <div className="flex items-start justify-between mb-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${app.color}`}>
          <span className="text-2xl">
            {app.name.charAt(0)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <Badge variant="secondary" className="text-xs">
            {getStatusText()}
          </Badge>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {app.name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {app.description}
        </p>
      </div>

      <div className="mb-4">
        <Badge variant="outline" className="text-xs">
          {app.category}
        </Badge>
      </div>

      <div className="mb-6">
        <h4 className="mb-2 text-sm font-medium text-foreground">Recursos:</h4>
        <ul className="space-y-1">
          {app.features.slice(0, 3).map((feature, index) => (
            <li key={index} className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-primary/60" />
              {feature}
            </li>
          ))}
          {app.features.length > 3 && (
            <li className="text-xs text-muted-foreground">
              +{app.features.length - 3} mais...
            </li>
          )}
        </ul>
      </div>

      <Button
        onClick={onClick}
        className="w-full group-hover:bg-primary/90 transition-colors"
        variant={app.externalUrl ? "outline" : "default"}
      >
        {app.externalUrl ? (
          <>
            <ExternalLink className="mr-2 h-4 w-4" />
            Abrir Aplicação
          </>
        ) : (
          'Acessar'
        )}
      </Button>
    </div>
  );
};
