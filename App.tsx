import React, { useState, useCallback, useMemo } from 'react';
import { AiModel, Match, League, LoadingState, AnalysisResult, LineupData, AnalysisData } from './types';
import Calendar from './components/Calendar';
import { BrainCircuitIcon, LoaderIcon, SparklesIcon } from './components/icons';
import LineupInputView from './components/LineupInputView';
import AnalysisResultCard from './components/AnalysisResultCard';
import { MAJOR_LEAGUE_PRIORITY } from './constants';
import LeagueAccordion from './components/LeagueAccordion';

import * as geminiService from './services/geminiService';
import * as qwenService from './services/qwenService';
import * as deepseekService from './services/deepseekService';
import * as zaiService from './services/zaiService';
import * as kimiService from './services/kimiService';
import * as maiService from './services/maiService';
import * as llamaService from './services/llamaService';


const AI_MODELS: { id: AiModel; name: string }[] = [
  { id: 'gemini', name: 'Gemini' },
  { id: 'qwen', name: 'Qwen' },
  { id: 'deepseek', name: 'DeepSeek' },
  { id: 'zai', name: 'Z-AI' },
  { id: 'kimi', name: 'Kimi' },
  { id: 'mai', name: 'MAI' },
  { id: 'llama', name: 'Llama' },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'main' | 'lineups' | 'results'>('main');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [manualMatchesInput, setManualMatchesInput] = useState<string>('');
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedMatchIds, setSelectedMatchIds] = useState<Set<number>>(new Set());
  const [selectedAiModels, setSelectedAiModels] = useState<Set<AiModel>>(new Set(['gemini']));
  const [lineupData, setLineupData] = useState<LineupData>({});
  const [analysisResults, setAnalysisResults] = useState<Record<number, AnalysisResult>>({});

  const [loadingState, setLoadingState] = useState<LoadingState>({
    matches: false,
    analysis: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleDateChange = useCallback(async (date: Date) => {
    setSelectedDate(date);
    setError(null);
    setLeagues([]);
    setSelectedMatchIds(new Set());
    setManualMatchesInput('');
    setAnalysisResults({});
  }, []);

  const handleParseMatches = useCallback(async () => {
      if (!manualMatchesInput.trim()) {
          setError("Пожалуйста, вставьте список матчей.");
          return;
      }
      setError(null);
      setLeagues([]);
      setSelectedMatchIds(new Set());
      setLoadingState(prev => ({ ...prev, matches: true }));
      
      try {
          const dateString = selectedDate.toISOString().split('T')[0];
          const { matches } = await geminiService.parseManualMatches(manualMatchesInput, dateString);

          if (matches.length === 0) {
            setError("Не удалось распознать матчи из предоставленного текста. Проверьте формат или попробуйте снова.");
            setLeagues([]);
            return;
          }
        
          const leaguesMap: Map<string, League> = new Map();
          matches.forEach(match => {
            const leagueKey = `${match.leagueName}|${match.leagueRussianName}`;
            if (!leaguesMap.has(leagueKey)) {
              leaguesMap.set(leagueKey, {
                name: match.leagueName,
                russianName: match.leagueRussianName,
                matches: [],
              });
            }
            leaguesMap.get(leagueKey)?.matches.push(match);
          });
          
          const unsortedLeagues = Array.from(leaguesMap.values());

          const sortedLeagues = unsortedLeagues.sort((a, b) => {
            const aIndex = MAJOR_LEAGUE_PRIORITY.indexOf(a.name);
            const bIndex = MAJOR_LEAGUE_PRIORITY.indexOf(b.name);

            if (aIndex > -1 && bIndex > -1) {
                return aIndex - bIndex;
            }
            if (aIndex > -1) {
                return -1;
            }
            if (bIndex > -1) {
                return 1;
            }
            return a.russianName.localeCompare(b.russianName);
          });

          setLeagues(sortedLeagues);

      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла неизвестная ошибка при разборе матчей.");
        setLeagues([]);
      } finally {
        setLoadingState(prev => ({ ...prev, matches: false }));
      }
  }, [manualMatchesInput, selectedDate]);


  const handleToggleAiModel = (modelId: AiModel) => {
    setSelectedAiModels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(modelId)) {
        newSet.delete(modelId);
      } else {
        newSet.add(modelId);
      }
      return newSet;
    });
  };
  
  const handleToggleMatch = (matchId: number) => {
      setSelectedMatchIds(prev => {
          const newSet = new Set(prev);
          if (newSet.has(matchId)) {
              newSet.delete(matchId);
          } else {
              newSet.add(matchId);
          }
          return newSet;
      });
  };

  const handleSelectAllInLeague = (league: League, selectAll: boolean) => {
    setSelectedMatchIds(prevIds => {
        const newIds = new Set(prevIds);
        league.matches.forEach(match => {
            if (selectAll) {
                newIds.add(match.id);
            } else {
                newIds.delete(match.id);
            }
        });
        return newIds;
    });
  };

  const selectedMatches = useMemo(() => {
    const allMatches: Match[] = leagues.flatMap(l => l.matches);
    return allMatches.filter(m => selectedMatchIds.has(m.id));
  }, [leagues, selectedMatchIds]);

  const handleAnalyzeWithLineupsClick = () => {
    if (selectedMatches.length > 0 && selectedAiModels.size > 0) {
      setCurrentView('lineups');
    } else if (selectedAiModels.size === 0) {
      setError("Выберите хотя бы одну модель ИИ.");
    } else {
      setError("Выберите хотя бы один матч для анализа.");
    }
  };

  const handleFinalAnalyze = useCallback(async (finalLineupData: LineupData) => {
    setLoadingState(prev => ({ ...prev, analysis: true }));
    setCurrentView('results');
    setError(null);

    const modelsToRun = Array.from(selectedAiModels);

    // Initialize results state for all selected matches and models
    const initialResults: Record<number, AnalysisResult> = {};
    selectedMatches.forEach(match => {
        initialResults[match.id] = {};
        modelsToRun.forEach(modelId => {
            initialResults[match.id][modelId] = {}; // empty object indicates loading
        });
    });
    setAnalysisResults(initialResults);
    
    const promises: Promise<void>[] = [];

    // --- All models now use single requests for consistency and reliability ---
    const singleRequestServices: Record<AiModel, (match: Match, lineup?: Partial<AnalysisData>) => Promise<AnalysisData>> = {
        gemini: geminiService.generateSingleMatchAnalysis,
        qwen: qwenService.generateSingleMatchAnalysis,
        deepseek: deepseekService.generateSingleMatchAnalysis,
        zai: zaiService.generateSingleMatchAnalysis,
        kimi: kimiService.generateSingleMatchAnalysis,
        mai: maiService.generateSingleMatchAnalysis,
        llama: llamaService.generateSingleMatchAnalysis,
    };
    
    const singleRequestModels = modelsToRun.filter((m): m is keyof typeof singleRequestServices => m in singleRequestServices);

    for (const match of selectedMatches) {
        for (const modelId of singleRequestModels) {
            const service = singleRequestServices[modelId];
            if (service) {
                const singlePromise = service(match, finalLineupData[match.id])
                    .then(analysisData => {
                        setAnalysisResults(prev => ({
                            ...prev,
                            [match.id]: { ...prev[match.id], [modelId]: { data: analysisData } },
                        }));
                    })
                    .catch(error => {
                        const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
                        setAnalysisResults(prev => ({
                            ...prev,
                            [match.id]: { ...prev[match.id], [modelId]: { error: errorMessage } },
                        }));
                    });
                promises.push(singlePromise);
            }
        }
    }
    
    await Promise.allSettled(promises);
    setLoadingState(prev => ({ ...prev, analysis: false }));
  }, [selectedMatches, selectedAiModels]);
  
  const handleAnalyzeWithoutLineups = useCallback(() => {
    if (selectedMatches.length > 0 && selectedAiModels.size > 0) {
      handleFinalAnalyze({});
    } else if (selectedAiModels.size === 0) {
      setError("Выберите хотя бы одну модель ИИ.");
    } else {
      setError("Выберите хотя бы один матч для анализа.");
    }
  }, [selectedMatches, selectedAiModels, handleFinalAnalyze]);

  if (currentView === 'lineups') {
    return <LineupInputView 
      matches={selectedMatches} 
      lineupData={lineupData}
      setLineupData={setLineupData}
      onBack={() => setCurrentView('main')} 
      onAnalyze={handleFinalAnalyze}
    />;
  }
  
  if(currentView === 'results') {
      return (
          <div className="bg-gray-900 min-h-screen font-sans text-gray-200">
             <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                 <header className="mb-8">
                    <button onClick={() => { setCurrentView('main'); setAnalysisResults({}); }} className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold mb-4">
                        <SparklesIcon />
                        Новый анализ
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                        Результаты анализа
                    </h1>
                 </header>
                 <div className="space-y-6">
                    {selectedMatches.map(match => (
                        <AnalysisResultCard 
                            key={match.id} 
                            match={match} 
                            result={analysisResults[match.id] || {}}
                        />
                    ))}
                 </div>
             </main>
          </div>
      );
  }

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-gray-200">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            AI Football by Dthen
          </h1>
          <p className="mt-2 text-lg text-gray-400">Ваш ИИ-помощник для футбольной аналитики</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                 <div>
                    <h2 className="text-xl font-bold mb-2">1. Выбор даты</h2>
                    <Calendar currentDate={selectedDate} onDateSelect={handleDateChange} />
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-2">2. Список матчей</h2>
                     <textarea
                        className="w-full bg-gray-700/50 p-3 rounded-lg border border-gray-600 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        rows={8}
                        placeholder="Вставьте сюда список матчей. Например:&#10;Англия. Премьер-лига&#10;Манчестер Юнайтед - Ливерпуль 2.50 3.80 2.90"
                        value={manualMatchesInput}
                        onChange={(e) => setManualMatchesInput(e.target.value)}
                        aria-label="Список матчей для анализа"
                    />
                     <button
                        onClick={handleParseMatches}
                        disabled={loadingState.matches || !manualMatchesInput.trim()}
                        className="w-full mt-2 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ease-in-out bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingState.matches ? <LoaderIcon /> : null}
                        {loadingState.matches ? 'Распознавание...' : 'Распознать матчи'}
                    </button>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                        <BrainCircuitIcon />
                        3. Выбор ИИ
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                        {AI_MODELS.map(({ id, name }) => (
                            <button key={id} onClick={() => handleToggleAiModel(id)}
                                className={`p-3 text-sm font-semibold rounded-lg border-2 transition-all duration-200 flex justify-center items-center
                                    ${selectedAiModels.has(id)
                                        ? 'bg-emerald-500 border-emerald-400 text-white'
                                        : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 hover:border-gray-500'
                                    }`
                                }
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <div>
                    <h2 className="text-xl font-bold mb-3">4. Выбор матчей</h2>
                     {loadingState.matches && (
                        <div className="flex justify-center items-center p-8 bg-gray-800/50 rounded-lg">
                            <LoaderIcon />
                            <p className="ml-4">Распознавание матчей из текста...</p>
                        </div>
                    )}
                    {error && !loadingState.matches && <p className="text-red-400 text-center p-4 bg-red-900/30 rounded-lg">{error}</p>}
                    
                    {!loadingState.matches && leagues.length === 0 && !error && (
                         <div className="text-gray-500 text-center p-8 bg-gray-800/50 rounded-lg">
                            <p>Вставьте список матчей слева и нажмите "Распознать матчи", чтобы увидеть их здесь.</p>
                        </div>
                    )}

                    {!loadingState.matches && leagues.length > 0 && (
                        <div className="space-y-4">
                            {leagues.map(league => (
                                <LeagueAccordion
                                    key={`${league.name}|${league.russianName}`}
                                    league={league}
                                    selectedMatchIds={selectedMatchIds}
                                    onToggleMatch={handleToggleMatch}
                                    onToggleAllInLeague={handleSelectAllInLeague}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center gap-4">
            <button 
                onClick={handleAnalyzeWithLineupsClick} 
                disabled={selectedMatchIds.size === 0 || selectedAiModels.size === 0}
                className="w-full md:w-1/2 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 ease-in-out bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/50">
                <SparklesIcon />
                {selectedMatchIds.size > 0 ? `Добавить составы (${selectedMatchIds.size} матчей)` : 'Выберите матчи'}
            </button>
             <button
                onClick={handleAnalyzeWithoutLineups}
                disabled={selectedMatchIds.size === 0 || selectedAiModels.size === 0}
                className="text-sm text-gray-400 hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Анализировать без составов →
            </button>
        </div>
      </main>
    </div>
  );
};

export default App;