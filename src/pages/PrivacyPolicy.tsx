
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30 dark:from-slate-900 dark:via-slate-900 dark:to-primary/10">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-3xl mx-auto bg-card p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link to="/" className="flex items-center gap-1">
                <ChevronLeft className="h-4 w-4" />
                Volver al inicio
              </Link>
            </Button>
            
            <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
            
            <p className="text-sm text-muted-foreground mb-4">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>
            
            <div className="space-y-6 text-sm">
              <section>
                <h2 className="text-xl font-semibold mb-2">1. Introducción</h2>
                <p>
                  Bienvenido a Ruleta de la Fortuna. Nos comprometemos a proteger su privacidad y a tratar sus datos personales con transparencia.
                  Esta Política de Privacidad describe cómo recopilamos, utilizamos y compartimos su información cuando utiliza nuestra aplicación.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">2. Información que Recopilamos</h2>
                <p>
                  Recopilamos varios tipos de información para proporcionar y mejorar nuestros servicios:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Información de la cuenta (correo electrónico, nombre de usuario)</li>
                  <li>Datos de uso (estadísticas de juego, resultados)</li>
                  <li>Información del dispositivo (tipo de navegador, sistema operativo)</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">3. Uso de la Información</h2>
                <p>
                  Utilizamos la información recopilada para:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Proporcionar, mantener y mejorar nuestros servicios</li>
                  <li>Personalizar su experiencia</li>
                  <li>Comunicarnos con usted</li>
                  <li>Mostrar anuncios relevantes a través de Google AdSense</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">4. Cookies y Tecnologías Similares</h2>
                <p>
                  Utilizamos cookies y tecnologías similares para recopilar información sobre cómo interactúa con nuestra aplicación. 
                  Estas tecnologías nos ayudan a recordar sus preferencias, entender cómo utiliza nuestra aplicación y personalizar nuestros servicios.
                </p>
                <p className="mt-2">
                  Además, utilizamos servicios de terceros como Google AdSense, que utilizan cookies para mostrar anuncios basados en sus intereses.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">5. Compartir Información</h2>
                <p>
                  No vendemos su información personal. Podemos compartir su información con:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Proveedores de servicios que nos ayudan a operar nuestra aplicación</li>
                  <li>Socios publicitarios, como Google AdSense</li>
                  <li>Autoridades cuando sea requerido por ley</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">6. Sus Derechos</h2>
                <p>
                  Dependiendo de su ubicación, puede tener ciertos derechos relacionados con su información personal, como:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Acceder a su información</li>
                  <li>Corregir su información</li>
                  <li>Eliminar su información</li>
                  <li>Oponerse al procesamiento de su información</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">7. Cambios a esta Política</h2>
                <p>
                  Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos cualquier cambio significativo publicando la nueva Política de Privacidad en esta página.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">8. Contacto</h2>
                <p>
                  Si tiene preguntas sobre esta Política de Privacidad, por favor contáctenos a: [correo electrónico de contacto].
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
