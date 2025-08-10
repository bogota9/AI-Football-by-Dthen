
import React from 'react';

export const FootballIcon = (): React.ReactNode => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 0 0-7.07 17.07l1.58-1.58A8 8 0 1 1 12 4zM4.93 4.93l1.58 1.58" />
    <path d="M17.49 6.51l1.58-1.58" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M6.51 17.49l-1.58 1.58" />
    <path d="M19.07 19.07l-1.58-1.58" />
    <path d="M12 22v-2" />
    <path d="m5.21 7.21 11.58 11.58" />
  </svg>
);

export const CalendarIcon = (): React.ReactNode => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const LoaderIcon = (): React.ReactNode => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin h-6 w-6">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const ArrowLeftIcon = (): React.ReactNode => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export const SparklesIcon = (): React.ReactNode => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M12 3L9.5 8.5 4 11l5.5 2.5L12 19l2.5-5.5L20 11l-5.5-2.5z" />
        <path d="M20 3v4" />
        <path d="M22 5h-4" />
    </svg>
);

export const ClipboardIcon = (): React.ReactNode => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    </svg>
);

export const ChevronLeftIcon = (): React.ReactNode => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const ChevronRightIcon = (): React.ReactNode => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const LinkIcon = ({ className }: { className?: string }): React.ReactNode => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
    </svg>
);

export const BrainCircuitIcon = (): React.ReactNode => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M12 5a3 3 0 1 0-5.993.296M12 5a3 3 0 1 1 5.993.296M12 5a3 3 0 1 0 .296-5.993M12 5a3 3 0 1 1 .296-5.993"/>
        <path d="M12 19a3 3 0 1 0-5.993.296M12 19a3 3 0 1 1 5.993.296M12 19a3 3 0 1 0 .296-5.993M12 19a3 3 0 1 1 .296-5.993"/>
        <path d="M12 12a3 3 0 1 0-5.993.296M12 12a3 3 0 1 1 5.993.296M12 12a3 3 0 1 0 .296-5.993M12 12a3 3 0 1 1 .296-5.993"/>
        <path d="M12 5a3 3 0 1 0-5.993.296m5.993-.296a3 3 0 1 1 5.993.296M9.007 5.296A3 3 0 1 0 12 5m-.296-5.993A3 3 0 1 1 12 5m12 7a3 3 0 1 0-5.993.296M12 12a3 3 0 1 1 5.993.296m-5.993-.296A3 3 0 1 0 12 12m-.296-5.993A3 3 0 1 1 12 12m0 7a3 3 0 1 0-5.993.296M12 19a3 3 0 1 1 5.993.296m-5.993-.296A3 3 0 1 0 12 19m-.296-5.993A3 3 0 1 1 12 19"/>
        <path d="M6 12h12"/>
    </svg>
);

export const AlertTriangleIcon = (): React.ReactNode => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const ChevronDownIcon = ({ className }: { className?: string }): React.ReactNode => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
