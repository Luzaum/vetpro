import { ArrowLeft, Home } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';

interface LayoutProps {
  children: React.ReactNode;
  onBack?: () => void;
  title?: string;
}

export const Layout = ({ children, onBack, title }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.location.href = '/'}
              className="h-8 w-8"
            >
              <Home className="h-4 w-4" />
            </Button>
            {title && (
              <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container py-8">
        {children}
      </main>
    </div>
  );
};
