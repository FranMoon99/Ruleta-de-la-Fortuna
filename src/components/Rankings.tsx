
import React, { useState, useEffect } from 'react';
import { TrendingUp, Crown, Medal, Trophy, Award } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getLeaderboard } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RankingsProps {
  user: any | null;
}

const Rankings: React.FC<RankingsProps> = ({ user }) => {
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [rankingType, setRankingType] = useState<'points' | 'spins'>('points');

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await getLeaderboard(10);
        setTopUsers(data || []);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
    
    // Refresh leaderboard every minute
    const interval = setInterval(loadLeaderboard, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 1: return <Medal className="h-5 w-5 text-gray-400" />;
      case 2: return <Medal className="h-5 w-5 text-amber-700" />;
      default: return <Award className="h-5 w-5 text-blue-400" />;
    }
  };

  const getInitials = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || '?';
  };

  return (
    <Card className="glass-panel h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Clasificación
        </CardTitle>
        <CardDescription>
          Compite con otros usuarios
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="points" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="points" onClick={() => setRankingType('points')}>Por Puntos</TabsTrigger>
            <TabsTrigger value="spins" onClick={() => setRankingType('spins')}>Por Giros</TabsTrigger>
          </TabsList>
          
          <TabsContent value="points" className="mt-0">
            <ScrollArea className="h-[300px]">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-muted-foreground">Cargando ranking...</p>
                </div>
              ) : topUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <Trophy className="h-10 w-10 mb-2 opacity-50" />
                  <p>No hay usuarios en el ranking todavía</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topUsers.map((userRank, index) => {
                    const isCurrentUser = user && userRank.user_id === user.id;
                    
                    return (
                      <div 
                        key={userRank.user_id}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          isCurrentUser ? 'bg-primary/10' : 'bg-background/60'
                        }`}
                      >
                        <div className="flex items-center justify-center w-8 h-8">
                          {getRankIcon(index)}
                        </div>
                        
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' :
                            index === 2 ? 'bg-amber-700' : 'bg-blue-400'
                          }>
                            {getInitials(userRank.display_name || userRank.username)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {userRank.display_name || userRank.username || 'Usuario'}
                            {isCurrentUser && ' (Tú)'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Nivel {Math.floor(userRank.total_points / 1000) + 1}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold">{userRank.total_points}</p>
                          <p className="text-xs text-muted-foreground">puntos</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="spins" className="mt-0">
            <ScrollArea className="h-[300px]">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-muted-foreground">Cargando ranking...</p>
                </div>
              ) : topUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <Trophy className="h-10 w-10 mb-2 opacity-50" />
                  <p>No hay usuarios en el ranking todavía</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...topUsers].sort((a, b) => b.total_spins - a.total_spins).map((userRank, index) => {
                    const isCurrentUser = user && userRank.user_id === user.id;
                    
                    return (
                      <div 
                        key={userRank.user_id}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          isCurrentUser ? 'bg-primary/10' : 'bg-background/60'
                        }`}
                      >
                        <div className="flex items-center justify-center w-8 h-8">
                          {getRankIcon(index)}
                        </div>
                        
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' :
                            index === 2 ? 'bg-amber-700' : 'bg-blue-400'
                          }>
                            {getInitials(userRank.display_name || userRank.username)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {userRank.display_name || userRank.username || 'Usuario'}
                            {isCurrentUser && ' (Tú)'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Nivel {Math.floor(userRank.total_points / 1000) + 1}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold">{userRank.total_spins || 0}</p>
                          <p className="text-xs text-muted-foreground">giros</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Rankings;
