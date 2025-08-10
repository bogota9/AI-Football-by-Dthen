import React, { useState, useMemo } from 'react';
import { Match, AnalysisResult, AiModel, AnalysisData } from '../types';
import ReportDisplay from './ReportDisplay';
import { ClipboardIcon, LoaderIcon, FootballIcon } from './icons';
import ApiErrorDisplay from './ApiErrorDisplay';

interface AnalysisResultCardProps {
  match: Match;
  result: AnalysisResult;
}

const AI_MODEL_NAMES: Record<AiModel, string> = {
    gemini: "Gemini",
    qwen: "Qwen",
    deepseek: "DeepSeek",
    zai: "Z-AI",
    kimi: "Kimi",
    mai: "MAI",
    llama: "Llama",
};

const MatchHeaderDisplay: React.FC<{ match: Match; analysis: AnalysisData }> = ({ match, analysis }) => {
    const { homeTeam, awayTeam, time, odds } = match;
    const { predictedScore, winProbability, homeTeamLogoUrl, awayTeamLogoUrl } = analysis;

    return (
        <div className="bg-gray-700/30 p-4 rounded-lg mb-4 border border-gray-600">
            <div className="grid grid-cols-3 items-center text-center">
                {/* Home Team */}
                <div className="flex flex-col items-center justify-start gap-2 h-full">
                    <img
                        src={homeTeamLogoUrl || ''}
                        alt={`${homeTeam.name} logo`}
                        className="h-16 w-16 object-contain"
                        onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzTmFtZT0iaC01IHctNSIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNlNWU3ZWIiIHN0cm9rZVdpZHRoPSIyIiBzdHJva2VMaW5lY2FwPSJyb3VuZCIgc3Ryb2tlTGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTEuMDcgOC45M0ExMCAxMCAwIDAgMCAyIDEybDEuNTggMS41OEE4IDggMCAxIDEgMTIgNFoiLz48cGF0aCBkPSJNNCAxMmwzLjA3IDMuMDdhMTAgMTAgMCAwIDAgMTAuODcgMGwyLjA2LTIuMDYiLz48cGF0aCBkPSJNMTIgMnYyIi8+PHBhdGggZD0ibTE5LjA3IDQuOTMtMS41OCAxLjU4Ii8+PHBhdGggZD0iTTIyIDEyaC0yIi8+PHBhdGggZD0ibTE5LjA3IDE5LjA3LTEuNTgtMS41OCIvPjwvc3ZnPg==' }}
                    />
                    <h4 className="font-bold text-lg leading-tight">{homeTeam.name}</h4>
                </div>

                {/* Score & Time */}
                <div className="flex flex-col items-center">
                    <span className="text-sm text-gray-400">сегодня в {time}</span>
                    {predictedScore ? (
                        <>
                            <span className="text-xs text-gray-300 mt-2">Прогноз</span>
                            <div className="text-4xl font-bold my-1">
                                {predictedScore.home} : {predictedScore.away}
                            </div>
                        </>
                    ) : <div className="text-4xl font-bold my-1">vs</div>}
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center justify-start gap-2 h-full">
                     <img
                        src={awayTeamLogoUrl || ''}
                        alt={`${awayTeam.name} logo`}
                        className="h-16 w-16 object-contain"
                        onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzTmFtZT0iaC01IHctNSIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNlNWU3ZWIiIHN0cm9rZVdpZHRoPSIyIiBzdHJva2VMaW5lY2FwPSJyb3VuZCIgc3Ryb2tlTGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTEuMDcgOC45M0ExMCAxMCAwIDAgMCAyIDEybDEuNTggMS41OEE4IDggMCAxIDEgMTIgNFoiLz48cGF0aCBkPSJNNCAxMmwzLjA3IDMuMDdhMTAgMTAgMCAwIDAgMTAuODcgMGwyLjA2LTIuMDYiLz48cGF0aCBkPSJNMTIgMnYyIi8+PHBhdGggZD0ibTE5LjA3IDQuOTMtMS41OCAxLjU4Ii8+PHBhdGggZD0iTTIyIDEyaC0yIi8+PHBhdGggZD0ibTE5LjA3IDE5LjA3LTEuNTgtMS41OCIvPjwvc3ZnPg==' }}
                    />
                    <h4 className="font-bold text-lg leading-tight">{awayTeam.name}</h4>
                </div>
            </div>

            {odds && (
                <div className="flex justify-center gap-2 md:gap-4 mt-4 text-xs md:text-sm">
                    <span className="bg-gray-600/50 px-3 py-1 rounded">П1 {odds.w1}</span>
                    <span className="bg-gray-600/50 px-3 py-1 rounded">X {odds.draw}</span>
                    <span className="bg-gray-600/50 px-3 py-1 rounded">П2 {odds.w2}</span>
                </div>
            )}

            {winProbability && (
                <div className="mt-4">
                    <h5 className="text-center text-sm font-semibold mb-2">Вероятность выигрыша</h5>
                    <div className="flex w-full h-2.5 rounded-full overflow-hidden bg-gray-600">
                        <div style={{ width: `${winProbability.home}%` }} className="bg-emerald-500 transition-all duration-500"></div>
                        <div style={{ width: `${winProbability.draw}%` }} className="bg-gray-400 transition-all duration-500"></div>
                        <div style={{ width: `${winProbability.away}%` }} className="bg-cyan-500 transition-all duration-500"></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1 px-1">
                        <span className="text-emerald-400 font-medium">{winProbability.home}%</span>
                        <span className="text-gray-300 font-medium">{winProbability.draw}%</span>
                        <span className="text-cyan-400 font-medium">{winProbability.away}%</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const AnalysisContent: React.FC<{ analysis: AnalysisData; team1Name: string; team2Name: string; }> = ({ analysis, team1Name, team2Name }) => (
    <div className="space-y-4 text-sm">
         {(analysis.team1Starting || analysis.team1Injuries || analysis.team2Starting || analysis.team2Injuries) && (
             <div className="p-3 bg-gray-900/40 rounded-lg border border-gray-700/50">
                <h4 className="font-bold text-gray-200 mb-2">Составы и отсутствующие</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <strong className="text-gray-300 block mb-1">{team1Name}</strong>
                        {analysis.team1Starting && <p className="text-gray-400 whitespace-pre-wrap"><strong className="font-semibold text-gray-300">Старт:</strong> {analysis.team1Starting}</p>}
                        {analysis.team1Injuries && <p className="text-gray-400 whitespace-pre-wrap mt-1"><strong className="font-semibold text-gray-300">Травмы:</strong> {analysis.team1Injuries}</p>}
                    </div>
                     <div>
                        <strong className="text-gray-300 block mb-1">{team2Name}</strong>
                        {analysis.team2Starting && <p className="text-gray-400 whitespace-pre-wrap"><strong className="font-semibold text-gray-300">Старт:</strong> {analysis.team2Starting}</p>}
                        {analysis.team2Injuries && <p className="text-gray-400 whitespace-pre-wrap mt-1"><strong className="font-semibold text-gray-300">Травмы:</strong> {analysis.team2Injuries}</p>}
                    </div>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div><strong className="text-gray-300 block mb-1">Сильные и слабые стороны {team1Name}:</strong> <p className="text-gray-400 whitespace-pre-wrap">{analysis.strengthWeaknessTeam1 || '...'}</p></div>
             <div><strong className="text-gray-300 block mb-1">Сильные и слабые стороны {team2Name}:</strong> <p className="text-gray-400 whitespace-pre-wrap">{analysis.strengthWeaknessTeam2 || '...'}</p></div>
        </div>

        <div><strong className="text-gray-300 block mb-1">Очные встречи (H2H):</strong> <p className="text-gray-400 whitespace-pre-wrap">{analysis.h2h || '...'}</p></div>
        <div><strong className="text-gray-300 block mb-1">Тактика и мотивация:</strong> <p className="text-gray-400 whitespace-pre-wrap">{analysis.motivationAndTactics || '...'}</p></div>
        <div><strong className="text-gray-300 block mb-1">Ключевые игроки:</strong> <p className="text-gray-400 whitespace-pre-wrap">{analysis.keyPlayers || '...'}</p></div>
        <div><strong className="text-gray-300 block mb-1">Прогноз на ход игры:</strong> <p className="text-gray-400 whitespace-pre-wrap">{analysis.matchPrediction || '...'}</p></div>
        
        <div className="pt-4 border-t border-gray-700/50 space-y-3">
             <div>
                <strong className="text-emerald-300 block mb-1">Основная ставка:</strong>
                <p className="text-gray-200 bg-gray-900/50 p-3 rounded whitespace-pre-wrap font-medium">{analysis.bet || '...'}</p>
                {analysis.betConfidence && (
                    <div className="mt-2">
                        <label className="text-xs text-gray-400">Уверенность ( {analysis.betConfidence} / 10 )</label>
                        <div className="w-full bg-gray-600 rounded-full h-1.5 mt-1">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${analysis.betConfidence * 10}%`}}></div>
                        </div>
                    </div>
                )}
            </div>
            <div>
                <strong className="text-cyan-300 block mb-1">Альтернативные ставки:</strong>
                {analysis.altBets && analysis.altBets.length > 0 ? (
                    <div className="space-y-3">
                        {analysis.altBets.map((altBet, index) => (
                            <div key={index} className="bg-gray-900/50 p-3 rounded">
                                <p className="text-gray-200 whitespace-pre-wrap font-medium">{altBet.bet}</p>
                                <div className="mt-2">
                                    <label className="text-xs text-gray-400">Уверенность ( {altBet.confidence} / 10 )</label>
                                    <div className="w-full bg-gray-600 rounded-full h-1.5 mt-1">
                                        <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${altBet.confidence * 10}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 bg-gray-900/50 p-3 rounded">...</p>
                )}
            </div>
             <div>
                <strong className="text-amber-300 block mb-1">Live-ставки:</strong>
                <p className="text-gray-200 bg-gray-900/50 p-3 rounded whitespace-pre-wrap">{analysis.liveBet || '...'}</p>
            </div>
        </div>
    </div>
);


const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({ match, result }) => {
  const availableModels = useMemo(() => Object.keys(result).filter(m => Object.keys(result[m as AiModel]).length > 0) as AiModel[], [result]);
  const [activeTab, setActiveTab] = useState<AiModel | null>(null);
  const [report, setReport] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Set initial active tab only once when models become available
  useMemo(() => {
    if (!activeTab && availableModels.length > 0) {
        const successfulModel = availableModels.find(m => result[m]?.data);
        if (successfulModel) {
            setActiveTab(successfulModel);
        } else {
             setActiveTab(availableModels[0]);
        }
    }
  }, [availableModels, result, activeTab]);

  const generateReportText = () => {
    if (!activeTab) return;
    const analysis = result[activeTab]?.data;
    if (!analysis) return;
    
    const lineupSection = (analysis.team1Starting || analysis.team1Injuries) ? `
🧑‍⚕️ СОСТАВЫ И ОТСУТСТВУЮЩИЕ:
${match.homeTeam.name}:
  - Старт: ${analysis.team1Starting || "Не указан"}
  - Травмы: ${analysis.team1Injuries || "Не указан"}

${match.awayTeam.name}:
  - Старт: ${analysis.team2Starting || "Не указан"}
  - Травмы: ${analysis.team2Injuries || "Не указан"}
` : '';
    
    const altBetsSection = analysis.altBets && analysis.altBets.length > 0 
        ? analysis.altBets.map(b => `- ${b.bet} (Уверенность: ${b.confidence}/10)`).join('\n')
        : "Нет данных";

    const output = `🔹 Матч: ${match.homeTeam.name} – ${match.awayTeam.name}
📍 Турнир: ${match.leagueRussianName} (${match.leagueName}) | Дата: ${match.date}
${lineupSection ? lineupSection + '\n' : ''}📊 АНАЛИТИКА (от ${AI_MODEL_NAMES[activeTab]}):
Сильные/слабые стороны ${match.homeTeam.name}: ${analysis.strengthWeaknessTeam1 || "Нет данных"}
Сильные/слабые стороны ${match.awayTeam.name}: ${analysis.strengthWeaknessTeam2 || "Нет данных"}

🔥 ОЧНЫЕ ВСТРЕЧИ (H2H):
${analysis.h2h || "Нет данных"}

⚔️ ТАКТИКА И МОТИВАЦИЯ:
${analysis.motivationAndTactics || "Нет данных"}

🌟 КЛЮЧЕВЫЕ ИГРОКИ:
${analysis.keyPlayers || "Нет данных"}

🔮 ПРОГНОЗ НА ХОД ИГРЫ:
${analysis.matchPrediction || "Нет данных"}

✅ ПРОГНОЗ И СТАВКИ:
Основная ставка: ${analysis.bet || "Нет данных"}
Уверенность: ${analysis.betConfidence ? `${analysis.betConfidence}/10` : 'N/A'}
Альтернативные ставки:\n${altBetsSection}
Live-ставки: ${analysis.liveBet || "Нет данных"}`;
    
    setReport(output.replace(/^\s*[\r\n]/gm, '')); // Remove empty lines at start
  };

  const copyReport = () => {
    if (!report) return;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const modelsWithResults = useMemo(() => Object.keys(result) as AiModel[], [result]);
  
  if (modelsWithResults.length === 0) {
    return (
      <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
        <h3 className="text-xl font-bold">{match.homeTeam.name} vs {match.awayTeam.name}</h3>
        <div className="flex justify-center items-center p-8">
          <LoaderIcon />
          <p className="ml-4">Ожидание результатов анализа...</p>
        </div>
      </div>
    );
  }

  const activeResult = activeTab ? result[activeTab] : undefined;

  return (
    <div className="bg-gray-800/50 p-4 sm:p-6 rounded-2xl border border-gray-700">
        <h3 className="text-xl font-bold mb-1">{match.homeTeam.name} vs {match.awayTeam.name}</h3>
        <p className="text-sm text-gray-400 mb-4">{match.leagueRussianName} ({match.leagueName}) - {match.time}</p>
        
        {modelsWithResults.length > 0 && (
            <div className="border-b border-gray-600 mb-4">
                <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                    {modelsWithResults.map(model => (
                        <button key={model} onClick={() => setActiveTab(model)}
                            className={`whitespace-nowrap py-3 px-2 border-b-2 font-medium text-sm transition-colors
                                ${activeTab === model 
                                    ? 'border-emerald-500 text-emerald-400' 
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-400'
                                }`
                            }
                        >
                            {AI_MODEL_NAMES[model]}
                        </button>
                    ))}
                </nav>
            </div>
        )}

        <div>
            {activeResult?.data && (
                <>
                    <MatchHeaderDisplay match={match} analysis={activeResult.data} />
                    <AnalysisContent analysis={activeResult.data} team1Name={match.homeTeam.name} team2Name={match.awayTeam.name} />
                </>
            )}
            {activeResult?.error && <ApiErrorDisplay error={activeResult.error} />}
            {!activeResult && <div className="flex items-center justify-center p-6"><LoaderIcon /><p className="ml-3">Загрузка анализа...</p></div>}
        </div>
        
        {activeResult?.data && (
            <div className="mt-6">
                <button 
                    onClick={generateReportText}
                    className="w-full justify-center text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-all duration-300 ease-in-out bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                >
                  Сформировать отчет для "{activeTab ? AI_MODEL_NAMES[activeTab] : ''}"
                </button>
            </div>
        )}

        {report && (
            <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-bold">Итоговый отчет</h4>
                     <button onClick={copyReport} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                        <ClipboardIcon />
                        {copied ? 'Скопировано!' : 'Копировать'}
                    </button>
                </div>
                <ReportDisplay report={report} />
            </div>
        )}
    </div>
  );
};

export default AnalysisResultCard;