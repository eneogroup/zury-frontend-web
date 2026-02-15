'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';
import FadeIn from './FadeIn';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ 
  title = "Oups, une erreur s'est produite",
  message,
  onRetry 
}: ErrorMessageProps) {
  return (
    <FadeIn>
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-red-50 rounded-full p-4 mb-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        
        <h3 className="text-xl font-semibold text-dark mb-2">
          {title}
        </h3>
        
        <p className="text-gray text-center mb-6 max-w-md">
          {message}
        </p>
        
        {onRetry && (
          <Button 
            variant="primary" 
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </Button>
        )}
      </div>
    </FadeIn>
  );
}