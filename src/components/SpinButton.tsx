
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
      className={`control-button relative overflow-hidden group bg-primary text-white text-lg font-bold h-14 px-12 ${
        disabled ? 'opacity-70' : 'animate-glow hover:shadow-xl'
      }`}
    >
      <span className="flex items-center gap-2">
        {disabled ? (
          <>
            <RotateCcw className="h-5 w-5 animate-spin" />
            <span>Girando...</span>
          </>
        ) : (
          <>
            <PlayCircle className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
            <span>¡Girar!</span>
          </>
        )}
      </span>
      
      {/* Button glow effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
    </Button>
  );
};

export default SpinButton;
