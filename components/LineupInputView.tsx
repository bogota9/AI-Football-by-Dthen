
import React, { useState } from 'react';
import { Match, LineupData, AnalysisData } from '../types';
import { ArrowLeftIcon, LoaderIcon, SparklesIcon } from './icons';

interface LineupInputViewProps {
  matches: Match[];
  lineupData: LineupData;
  setLineupData: React.Dispatch<React.SetStateAction<LineupData>>;
  onBack: () => void;
  onAnalyze: (lineupData: LineupData) => void;
}

const LineupInputView: React.FC<LineupInputViewProps> = ({ matches, lineupData, setLineupData, onBack, onAnalyze }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (matchId: number, teamType: 'team1' | 'team2', field: 'Starting' | 'Subs' | 'Injuries', value: string) => {
        const key = `${teamType}${field}` as keyof AnalysisData;
        setLineupData(prev => ({
            ...prev,
            [matchId]: {
                ...prev[matchId],
                [key]: value,
            }
        }));
    };

    const handleFinalAnalyze = () => {
        setIsLoading(true);
        onAnalyze(lineupData);
    };

    return (
        <div className="bg-gray-900 min-h-screen font-sans text-gray-200">
            <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <header className="mb-8">
                     <button onClick={onBack} className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold mb-4">
                        <ArrowLeftIcon />
                        Назад к выбору матчей
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                        Добавление составов
                    </h1>
                    <p className="mt-2 text-lg text-gray-400">Укажите стартовые составы, замены и травмы для более точного анализа.</p>
                </header>

                <div className="space-y-6">
                    {matches.map(match => (
                        <div key={match.id} className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                            <h2 className="text-xl font-bold mb-4">{match.homeTeam.name} vs {match.awayTeam.name}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Home Team */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg">{match.homeTeam.name}</h3>
                                    <textarea
                                        placeholder="Основной состав"
                                        className="w-full bg-gray-700/50 p-2 rounded-md border border-gray-600 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        rows={3}
                                        value={lineupData[match.id]?.team1Starting || ''}
                                        onChange={(e) => handleInputChange(match.id, 'team1', 'Starting', e.target.value)}
                                    />
                                    <textarea
                                        placeholder="Замены"
                                        className="w-full bg-gray-700/50 p-2 rounded-md border border-gray-600 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        rows={2}
                                         value={lineupData[match.id]?.team1Subs || ''}
                                        onChange={(e) => handleInputChange(match.id, 'team1', 'Subs', e.target.value)}
                                    />
                                    <textarea
                                        placeholder="Травмы и кто не сыграет"
                                        className="w-full bg-gray-700/50 p-2 rounded-md border border-gray-600 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        rows={2}
                                         value={lineupData[match.id]?.team1Injuries || ''}
                                        onChange={(e) => handleInputChange(match.id, 'team1', 'Injuries', e.target.value)}
                                    />
                                </div>
                                {/* Away Team */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg">{match.awayTeam.name}</h3>
                                    <textarea
                                        placeholder="Основной состав"
                                        className="w-full bg-gray-700/50 p-2 rounded-md border border-gray-600 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        rows={3}
                                         value={lineupData[match.id]?.team2Starting || ''}
                                        onChange={(e) => handleInputChange(match.id, 'team2', 'Starting', e.target.value)}
                                    />
                                    <textarea
                                        placeholder="Замены"
                                        className="w-full bg-gray-700/50 p-2 rounded-md border border-gray-600 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        rows={2}
                                         value={lineupData[match.id]?.team2Subs || ''}
                                        onChange={(e) => handleInputChange(match.id, 'team2', 'Subs', e.target.value)}
                                    />
                                    <textarea
                                        placeholder="Травмы и кто не сыграет"
                                        className="w-full bg-gray-700/50 p-2 rounded-md border border-gray-600 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                        rows={2}
                                         value={lineupData[match.id]?.team2Injuries || ''}
                                        onChange={(e) => handleInputChange(match.id, 'team2', 'Injuries', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <button onClick={handleFinalAnalyze} disabled={isLoading}
                        className="w-full md:w-2/3 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 ease-in-out bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <LoaderIcon /> : <SparklesIcon />}
                        {isLoading ? 'Анализ...' : `Запустить анализ (${matches.length} матчей)`}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default LineupInputView;
