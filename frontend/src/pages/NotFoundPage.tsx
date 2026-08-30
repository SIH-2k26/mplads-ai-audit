import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { AlertCircle } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center select-none font-sans space-y-4">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-700">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-[#0E0E0E]">Route Not Found</h2>
        <p className="text-xs text-[#6B6B6B] max-w-sm">
          The requested audit vigilance module or project twin cockpit was not found.
        </p>
      </div>
      <Link to="/district">
        <Button variant="default" size="sm">
          Return to Command Nodal
        </Button>
      </Link>
    </div>
  );
}
