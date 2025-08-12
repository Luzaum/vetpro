
import { ThemeProvider } from './components/theme-provider';
import { AppContent } from './components/AppContent';

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="luzaum-theme">
      <AppContent />
    </ThemeProvider>
  );
};

export default App;