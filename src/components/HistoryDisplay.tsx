
import React from 'react';
import { SpinResult } from '@/hooks/useRoulette';
import { HistoryIcon, Trash2 } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HistoryDisplayProps {
  history: SpinResult[];
  onReset: () => void;
}

const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ history, onReset }) => {
  return (
    <Card className="glass-panel h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <HistoryIcon className="h-5 w-5" />
          Historial
        </CardTitle>
      </CardHeader>
      
      <CardContent className="px-2">
        <ScrollArea className="h-[240px] px-2">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <HistoryIcon className="h-8 w-8 mb-2 opacity-50" />
              <p>No hay resultados aún</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {history.map((result, index) => (
                <li 
                  key={index}
                  className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-md p-3 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ 
                          backgroundColor: result.prize.color.startsWith('roulette-') 
                            ? `var(--${result.prize.color.replace('roulette-', '')})` 
                            : result.prize.color 
                        }}
                      ></div>
                      <span className="font-medium">{result.prize.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
      
      {history.length > 0 && (
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center gap-1 text-xs"
            onClick={onReset}
          >
            <Trash2 className="h-3 w-3" />
            Limpiar historial
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default HistoryDisplay;
