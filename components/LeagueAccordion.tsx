
import React, { useState } from 'react';
import { League } from '../types';
import MatchCard from './MatchCard';
import { ChevronDownIcon } from './icons';

interface LeagueAccordionProps {
  league: League;
  selectedMatchIds: Set<number>;
  onToggleMatch: (matchId: number) => void;
  onToggleAllInLeague: (league: League, selectAll: boolean) => void;
}

const LeagueAccordion: React.FC<LeagueAccordionProps> = ({ league, selectedMatchIds, onToggleMatch, onToggleAllInLeague }) => {
  const [isOpen, setIsOpen] = useState(true);

  const allMatchesInLeagueSelected = league.matches.every(m => selectedMatchIds.has(m.id));
  const handleSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggleAllInLeague(league, e.target.checked);
  };

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-gray-700/50 hover:bg-gray-700 transition"
      >
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={allMatchesInLeagueSelected}
            onChange={handleSelectAllClick}
            onClick={(e) => e.stopPropagation()} // Prevent accordion from toggling
            className="w-4 h-4 text-emerald-600 bg-gray-900 border-gray-600 rounded focus:ring-emerald-500 cursor-pointer"
          />
          <span className="font-bold text-gray-200 text-left">{league.russianName} <span className="text-gray-400 font-normal">({league.name})</span></span>
        </div>
        <ChevronDownIcon className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 space-y-2">
          {league.matches.map(match => (
            <MatchCard key={match.id} match={match} isSelected={selectedMatchIds.has(match.id)} onToggleSelect={onToggleMatch} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LeagueAccordion;
