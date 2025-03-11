
import React from 'react';
import { SparklesIcon } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-8 px-4 text-center relative z-10">
      <div className="max-w-3xl mx-auto">
        <div className="relative inline-block">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-pulse-light">
            Ruleta de la Fortuna
          </h1>
          <SparklesIcon className="absolute -top-4 -right-8 h-8 w-8 text-yellow-400 animate-pulse" />
        </div>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-lg">
          Gira la ruleta y pon a prueba tu suerte para ganar increíbles premios
        </p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-8 w-20 h-20 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-8 w-24 h-24 bg-accent/10 rounded-full blur-3xl"></div>
    </header>
  );
};

export default Header;
