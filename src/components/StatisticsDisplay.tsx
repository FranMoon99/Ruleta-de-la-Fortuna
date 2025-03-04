
import React from 'react';
import { Prize } from '@/utils/prizes';
import { BarChart2, RotateCcw } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

interface StatisticsDisplayProps {
  statistics: Record<string, number>;
  prizes: Prize[];
  onReset: () => void;
}

const StatisticsDisplay: React.FC<StatisticsDisplayProps> = ({ statistics, prizes, onReset }) => {
  // Calculate total spins
  const totalSpins = Object.values(statistics).reduce((sum, count) => sum + count, 0);
  
  // Sort prizes by frequency
  const sortedPrizes = [...prizes].sort((a, b) => {
    const countA = statistics[a.id] || 0;
    const countB = statistics[b.id] || 0;
    return countB - countA;
  });
  
  return (
    <Card className="glass-panel h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <BarChart2 className="h-5 w-5" />
          Estadísticas
        </CardTitle>
      </CardHeader>
      
      <CardContent className="px-2">
        <ScrollArea className="h-[240px] px-2">
          {totalSpins === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <BarChart2 className="h-8 w-8 mb-2 opacity-50" />
              <p>No hay estadísticas aún</p>
              <p className="text-xs mt-1">Gira la ruleta para comenzar a recopilar datos</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center mb-3">
                <div className="text-sm font-medium text-muted-foreground">Total de giros</div>
                <div className="text-3xl font-bold">{totalSpins}</div>
              </div>
              
              {sortedPrizes.map((prize) => {
                const count = statistics[prize.id] || 0;
                const percentage = totalSpins > 0 ? Math.round((count / totalSpins) * 100) : 0;
                
                return (
                  <div key={prize.id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ 
                            backgroundColor: prize.color.startsWith('roulette-') 
                              ? `var(--${prize.color.replace('roulette-', '')})` 
                              : prize.color 
                          }}
                        ></div>
                        <span className="text-sm font-medium">{prize.name}</span>
                      </div>
                      <div className="text-sm font-medium">{count} <span className="text-muted-foreground">({percentage}%)</span></div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      {totalSpins > 0 && (
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center gap-1 text-xs"
            onClick={onReset}
          >
            <RotateCcw className="h-3 w-3" />
            Reiniciar estadísticas
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default StatisticsDisplay;
