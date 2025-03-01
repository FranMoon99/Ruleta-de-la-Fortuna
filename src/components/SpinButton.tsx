
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, RotateCcw } from 'lucide-react';
import { playClickSound } from '@/utils/animations';

interface SpinButtonProps {
  onSpin: () => void;
  disabled: boolean;
}

const SpinButton: React.FC<SpinButtonProps> = ({ onSpin, disabled }) => {
  const handleClick = () => {
    playClickSound();
    onSpin();
  };
  
  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      size="lg"
      className={`control-button relative overflow-hidden group bg-gradient-to-r from-primary/90 to-accent text-white text-lg font-bold h-16 px-14 rounded-full ${
        disabled ? 'opacity-70' : 'animate-glow hover:shadow-xl'
      }`}
    >
      <span className="flex items-center gap-3 relative z-10">
        {disabled ? (
          <>
            <RotateCcw className="h-6 w-6 animate-spin" />
            <span>Girando...</span>
          </>
        ) : (
          <>
            <PlayCircle className="h-7 w-7 group-hover:scale-110 transition-transform duration-200" />
            <span className="tracking-wide">¡GIRAR!</span>
          </>
        )}
      </span>
      
      {/* Enhanced button glow effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
      
      {/* Pulsating background for idle state */}
      {!disabled && (
        <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      )}
    </Button>
  );
};

export default SpinButton;
