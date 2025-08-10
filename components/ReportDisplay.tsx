
import React from 'react';

interface ReportDisplayProps {
  report: string;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report }) => {
  return (
    <div className="bg-gray-900/70 p-6 rounded-lg border border-gray-700">
      <pre className="whitespace-pre-wrap font-sans text-gray-200 text-base leading-relaxed">
        {report}
      </pre>
    </div>
  );
};

export default ReportDisplay;
