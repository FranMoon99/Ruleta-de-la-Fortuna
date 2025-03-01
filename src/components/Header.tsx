
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 text-center relative z-10">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
        Ruleta de la Fortuna
      </h1>
      <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
        Gira la ruleta y pon a prueba tu suerte para ganar increíbles premios
      </p>
    </header>
  );
};

export default Header;
