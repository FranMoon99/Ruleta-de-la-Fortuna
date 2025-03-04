
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Coins, TrendingUp, Award, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PointsDisplayProps {
  user: any | null;
  points: number;
  onPointsUpdate?: (points: number) => void;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ 
  user,
  points,
  onPointsUpdate
}) => {
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [nextMilestone, setNextMilestone] = useState(1000);
  const [progress, setProgress] = useState(0);

  // Cargar leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Using RPC function instead of direct table query
        const { data, error } = await supabase
          .rpc('get_leaderboard', { limit_count: 5 });
        
        if (error) throw error;
        
        setLeaderboard(data || []);
      } catch (error) {
        console.error('Error cargando leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [user, points]);

  // Calcular el próximo milestone y el progreso
  useEffect(() => {
    // Definir los milestones
    const milestones = [100, 500, 1000, 2000, 5000, 10000];
    
    // Encontrar el próximo milestone
    const next = milestones.find(m => m > points) || (points + 1000);
    const prev = milestones.filter(m => m <= points).pop() || 0;
    
    setNextMilestone(next);
    
    // Calcular el progreso como porcentaje hacia el próximo milestone
    const calculatedProgress = prev === next ? 100 : Math.floor(((points - prev) / (next - prev)) * 100);
    setProgress(calculatedProgress);
  }, [points]);

  // Si no hay usuario, mostrar mensaje para iniciar sesión
  if (!user) {
    return (
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Sistema de Puntos
          </CardTitle>
          <CardDescription>
            Inicia sesión para acumular puntos
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <Award className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
          <p className="text-muted-foreground text-center">
            Gana premios y acumula puntos al girar la ruleta
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Puntos Acumulados
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-primary/10 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">Tus Puntos</p>
          <p className="text-3xl font-bold">{points || 0}</p>
          
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progreso</span>
              <span>Próximo: {nextMilestone}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
        
        {leaderboard.length > 0 && (
          <div className="bg-secondary/10 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-1">
              <Crown className="h-4 w-4" />
              Tabla de Líderes
            </h4>
            
            <ScrollArea className="h-[140px]">
              <div className="space-y-2">
                {leaderboard.map((entry, index) => {
                  const isCurrentUser = entry.user_id === user.id;
                  // Handle potential data structure differences
                  const displayName = entry.display_name || 
                                      entry.username ||
                                      entry.user_id?.substring(0, 8);
                  
                  return (
                    <div 
                      key={entry.user_id}
                      className={`flex items-center justify-between p-2 rounded-md ${
                        isCurrentUser ? 'bg-primary/10 font-medium' : 'bg-background/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-amber-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-amber-800 text-white' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-sm truncate max-w-[120px]">
                          {displayName} {isCurrentUser && '(Tú)'}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{entry.total_points}</span>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PointsDisplay;
