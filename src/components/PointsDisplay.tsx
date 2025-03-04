
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserPoints, getLeaderboard } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

interface PointsDisplayProps {
  points: number;
  userId?: string | null;
  isLoading?: boolean;
}

interface LeaderboardItem {
  username: string;
  displayName: string;
  totalPoints: number;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ points, userId, isLoading = false }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  useEffect(() => {
    const loadLeaderboard = async () => {
      if (!userId) return;
      
      setLoadingLeaderboard(true);
      try {
        const data = await getLeaderboard(5);
        
        // Transform the data for the chart
        const formattedData = data.map(item => ({
          username: item.username || 'Usuario',
          displayName: item.display_name || item.username || 'Usuario',
          totalPoints: item.total_points
        }));
        
        setLeaderboard(formattedData);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setLoadingLeaderboard(false);
      }
    };
    
    loadLeaderboard();
  }, [userId, points]);

  const pointsLevel = Math.floor(points / 1000) + 1;
  const progressToNextLevel = (points % 1000) / 10; // 0-100 scale

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tus Puntos</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{points}</p>
                <p className="text-sm text-muted-foreground">puntos totales</p>
              </div>
              <div>
                <p className="text-xl font-semibold">Nivel {pointsLevel}</p>
                <div className="w-full bg-secondary h-2 rounded-full mt-1">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${progressToNextLevel}%` }}
                  />
                </div>
                <p className="text-xs text-right mt-1 text-muted-foreground">
                  {points % 1000} / 1000 para el siguiente nivel
                </p>
              </div>
            </div>
            
            {loadingLeaderboard ? (
              <Skeleton className="h-32 w-full" />
            ) : leaderboard.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium mb-2">Clasificación</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={leaderboard}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="displayName" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => value.substring(0, 8) + (value.length > 8 ? '...' : '')}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [value, 'Puntos']}
                      labelFormatter={(value) => `Usuario: ${value}`}
                    />
                    <Bar dataKey="totalPoints" fill="var(--primary)" name="Puntos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No hay datos de clasificación disponibles
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PointsDisplay;
