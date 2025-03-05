
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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

// Sample leaderboard data since authentication is disabled
const sampleLeaderboard: LeaderboardItem[] = [
  { username: 'usuario1', displayName: 'Jugador 1', totalPoints: 5200 },
  { username: 'usuario2', displayName: 'Jugador 2', totalPoints: 4800 },
  { username: 'usuario3', displayName: 'Jugador 3', totalPoints: 3700 },
  { username: 'usuario4', displayName: 'Jugador 4', totalPoints: 2900 },
  { username: 'usuario5', displayName: 'Jugador 5', totalPoints: 2100 },
];

const PointsDisplay: React.FC<PointsDisplayProps> = ({ points, isLoading = false }) => {
  const [leaderboard] = useState<LeaderboardItem[]>(sampleLeaderboard);

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
            
            <div>
              <h3 className="text-sm font-medium mb-2">Clasificación (Demo)</h3>
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PointsDisplay;
