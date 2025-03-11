
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Trophy, Database } from 'lucide-react';

const IntegracionesSupabase: React.FC = () => {
  return (
    <Card className="bg-gradient-to-br from-secondary/30 to-background border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Integraciones con Supabase
        </CardTitle>
        <CardDescription>
          Características avanzadas sincronizadas con la nube
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <Cloud className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Sincronización completa de ajustes y estadísticas</h3>
              <p className="text-sm text-muted-foreground">
                Todos tus ajustes y estadísticas se sincronizan automáticamente entre dispositivos
              </p>
            </div>
          </li>
          
          <li className="flex items-start gap-3">
            <Trophy className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Sistema de clasificación entre usuarios</h3>
              <p className="text-sm text-muted-foreground">
                Compite con otros usuarios y sube en la clasificación global de puntos
              </p>
            </div>
          </li>
          
          <li className="flex items-start gap-3">
            <Database className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Almacenamiento de ruletas personalizadas en la nube</h3>
              <p className="text-sm text-muted-foreground">
                Crea y guarda tus propias ruletas personalizadas y accede a ellas desde cualquier dispositivo
              </p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default IntegracionesSupabase;
