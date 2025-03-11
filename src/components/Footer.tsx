
import React from 'react';
import { HeartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 text-center text-muted-foreground text-sm relative z-10">
      <div className="flex items-center justify-center gap-1.5">
        <p>© {new Date().getFullYear()} Ruleta de la Fortuna.</p>
        <p className="flex items-center">
          Hecho con <HeartIcon className="h-4 w-4 mx-1 text-red-500" /> para ti
        </p>
      </div>
      <div className="flex justify-center gap-4 mt-3">
        <Link 
          to="/privacidad" 
          className="text-xs hover:underline hover:text-primary transition-colors"
        >
          Política de Privacidad
        </Link>
        <Link 
          to="/terminos" 
          className="text-xs hover:underline hover:text-primary transition-colors"
        >
          Términos y Condiciones
        </Link>
      </div>
      <p className="text-xs mt-3 text-muted-foreground/70">Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
