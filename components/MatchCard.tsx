
import React from 'react';
import { Match } from '../types';

interface MatchCardProps {
  match: Match;
  isSelected: boolean;
  onToggleSelect: (matchId: number) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, isSelected, onToggleSelect }) => {
  const cardId = `match-card-${match.id}`;
  return (
    <div 
        onClick={() => onToggleSelect(match.id)}
        className={`flex items-center p-2 rounded-md cursor-pointer transition-all duration-200 ${isSelected ? 'bg-emerald-800/70' : 'bg-gray-700/50 hover:bg-gray-700'}`}
    >
        <input type="checkbox" id={cardId} checked={isSelected} readOnly
            className="w-4 h-4 text-emerald-600 bg-gray-900 border-gray-600 rounded focus:ring-emerald-500 cursor-pointer"
        />
        <label htmlFor={cardId} className="ml-3 text-sm font-medium text-gray-300 truncate cursor-pointer w-full">
            {match.homeTeam.name} vs {match.awayTeam.name}
             <span className="text-xs text-gray-400 block">{match.time}</span>
             {match.odds && (
                <span className="text-xs text-cyan-400 block">
                    П1: {match.odds.w1} X: {match.odds.draw} П2: {match.odds.w2}
                </span>
            )}
        </label>
    </div>
  );
};

export default MatchCard;
