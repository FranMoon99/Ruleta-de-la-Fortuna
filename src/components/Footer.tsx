
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 text-center text-muted-foreground text-sm">
      <p>© {new Date().getFullYear()} Ruleta de la Fortuna. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
