import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-[#B44343] mb-4 border border-[#B44343]/30">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold text-[#18324A]">404 — Page or Case Record Not Found</h1>
      <p className="mt-2 text-xs text-[#667085] max-w-md">
        The requested URL does not correspond to an active MPLADS project file, investigation docket, or authority dashboard.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="default" size="sm" className="flex items-center gap-1.5 text-xs">
          <ArrowLeft className="h-3.5 w-3.5" />
          Return to Operational Command
        </Button>
      </Link>
    </div>
  );
}
