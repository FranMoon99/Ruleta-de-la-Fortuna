
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const TermsOfService = () => {
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
            
            <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>
            
            <p className="text-sm text-muted-foreground mb-4">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>
            
            <div className="space-y-6 text-sm">
              <section>
                <h2 className="text-xl font-semibold mb-2">1. Introducción</h2>
                <p>
                  Estos Términos y Condiciones rigen el uso de la aplicación Ruleta de la Fortuna. Al acceder o utilizar nuestra aplicación, usted acepta estar sujeto a estos Términos. Si no está de acuerdo con estos Términos, no utilice nuestra aplicación.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">2. Uso de la Aplicación</h2>
                <p>
                  Ruleta de la Fortuna es una aplicación de entretenimiento que permite a los usuarios girar una ruleta virtual y obtener resultados aleatorios. Al utilizar nuestra aplicación, usted se compromete a:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Utilizar la aplicación de acuerdo con las leyes aplicables</li>
                  <li>No intentar manipular o hacer trampa en el sistema</li>
                  <li>No utilizar la aplicación para fines ilícitos o no autorizados</li>
                  <li>No interferir con la seguridad o funcionalidad de la aplicación</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">3. Cuentas de Usuario</h2>
                <p>
                  Para acceder a ciertas funciones de nuestra aplicación, puede ser necesario crear una cuenta. Usted es responsable de mantener la confidencialidad de su información de cuenta y de todas las actividades que ocurran bajo su cuenta.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">4. Contenido de la Aplicación</h2>
                <p>
                  Todo el contenido presente en la aplicación, incluyendo textos, gráficos, logotipos, imágenes y software, está protegido por leyes de propiedad intelectual y pertenece a Ruleta de la Fortuna o a sus licenciantes.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">5. Anuncios</h2>
                <p>
                  La aplicación puede mostrar anuncios proporcionados por Google AdSense u otros proveedores de publicidad. Al utilizar nuestra aplicación, usted acepta la visualización de estos anuncios. Los anuncios pueden estar basados en su actividad de navegación y otros factores determinados por los proveedores de publicidad.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">6. Limitación de Responsabilidad</h2>
                <p>
                  En la medida máxima permitida por la ley aplicable, Ruleta de la Fortuna no será responsable por daños directos, indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo, sin limitación, pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles, resultantes de:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>El uso o la imposibilidad de usar la aplicación</li>
                  <li>Cualquier cambio en la aplicación</li>
                  <li>El uso no autorizado de su cuenta</li>
                  <li>Errores, omisiones o inexactitudes en el contenido</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">7. Modificaciones</h2>
                <p>
                  Nos reservamos el derecho de modificar estos Términos en cualquier momento. Le notificaremos cualquier cambio significativo publicando los nuevos Términos en esta página. Su uso continuado de la aplicación después de dichos cambios constituye su aceptación de los Términos modificados.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">8. Ley Aplicable</h2>
                <p>
                  Estos Términos se regirán e interpretarán de acuerdo con las leyes de [País/Jurisdicción], sin dar efecto a ningún principio de conflicto de leyes.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">9. Contacto</h2>
                <p>
                  Si tiene preguntas sobre estos Términos, por favor contáctenos a: [correo electrónico de contacto].
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

export default TermsOfService;
