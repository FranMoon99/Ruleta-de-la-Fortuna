
import React, { useState } from 'react';
import { SpinResult } from '@/hooks/useRoulette';
import { HistoryIcon, Trash2, Calendar, Search, Filter } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface HistoryDisplayProps {
  history: SpinResult[];
  onReset: () => void;
}

const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ history, onReset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Función para agrupar el historial por fecha
  const groupByDate = (items: SpinResult[]) => {
    const groups: { [key: string]: SpinResult[] } = {};
    
    items.forEach(item => {
      const date = new Date(item.timestamp);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(item);
    });
    
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
      .map(([date, items]) => ({
        date,
        items
      }));
  };

  // Aplicar filtros al historial
  const filteredHistory = history.filter(result => {
    // Aplicar búsqueda por término
    const matchesSearch = searchTerm === '' || 
      result.prize.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Aplicar filtro por valor
    const matchesFilter = filterValue === 'all' || 
      (filterValue === 'high' && result.prize.value >= 500) ||
      (filterValue === 'low' && result.prize.value < 500);
    
    return matchesSearch && matchesFilter;
  });

  // Agrupar por fecha después de aplicar filtros
  const groupedHistory = groupByDate(filteredHistory);

  return (
    <Card className="glass-panel h-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <HistoryIcon className="h-5 w-5" />
              Historial
            </CardTitle>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filtros</span>
            </Button>
          </div>
          
          {showFilters && (
            <div className="pt-2 space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                  <Input
                    placeholder="Buscar premio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>
                
                <Select
                  value={filterValue}
                  onValueChange={setFilterValue}
                >
                  <SelectTrigger className="w-[100px] h-9">
                    <SelectValue placeholder="Filtrar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="high">Alto valor</SelectItem>
                    <SelectItem value="low">Bajo valor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(searchTerm || filterValue !== 'all') && (
                <div className="flex gap-1">
                  {searchTerm && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs gap-1"
                      onClick={() => setSearchTerm('')}
                    >
                      {searchTerm}
                      <span className="cursor-pointer">×</span>
                    </Badge>
                  )}
                  
                  {filterValue !== 'all' && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs gap-1"
                      onClick={() => setFilterValue('all')}
                    >
                      {filterValue === 'high' ? 'Alto valor' : 'Bajo valor'}
                      <span className="cursor-pointer">×</span>
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="px-2">
        <ScrollArea className="h-[240px] px-2">
          {filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <HistoryIcon className="h-8 w-8 mb-2 opacity-50" />
              {history.length === 0 ? (
                <p>No hay resultados aún</p>
              ) : (
                <>
                  <p>No se encontraron resultados</p>
                  <p className="text-xs mt-1">Prueba con otros filtros</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {groupedHistory.map((group) => (
                <div key={group.date} className="space-y-2">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <time dateTime={group.date}>
                      {format(new Date(group.date), 'EEEE, d MMMM yyyy', { locale: es })}
                    </time>
                  </div>
                  
                  <ul className="space-y-2">
                    {group.items.map((result, index) => (
                      <li 
                        key={`${group.date}-${index}`}
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
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(result.timestamp), 'HH:mm:ss')}
                            </span>
                            {result.prize.value > 0 && (
                              <span className="text-xs font-medium text-primary">
                                +{result.prize.value} pts
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
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
