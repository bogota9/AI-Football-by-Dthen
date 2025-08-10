
import { Match, AnalysisData, LineupData } from '../types';
import { parseJsonFromText } from './parser';
import { API_KEY } from './apiKey';

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-flash-1.5"; // Using a model available on OpenRouter
const SITE_URL = "https://ai-football-by-dthen.web.app";
const SITE_NAME = "AI Football by Dthen";

async function callOpenRouterAPI(prompt: string) {
    const body = {
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        // We let the prompt enforce JSON output and parse it manually for consistency
        // across all services in the app.
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": SITE_URL,
            "X-Title": SITE_NAME,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini (OpenRouter) API Error:", errorText);
        throw new Error(`Ошибка API Gemini (via OpenRouter): ${response.status} ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content;
}


export async function parseManualMatches(text: string, date: string): Promise<{ matches: Match[] }> {
    const prompt = `
        You are an AI assistant that parses raw text containing football match data and converts it into a structured JSON format.
        The user has provided a list of matches for the date ${date}. The text may contain league names, team names, match times, and betting odds for W1, Draw, and W2.
        Your task is to parse this text and return a single JSON object with a "matches" key. Your entire response MUST be a single, valid JSON object.

        INPUT EXAMPLE:
        Испания. Примера
        Барселона - Реал Мадрид 22:00 1.85 3.50 4.20
        Англия. Премьер-лига
        Манчестер Юнайтед - Ливерпуль 2.50 3.80 2.90

        OUTPUT REQUIREMENTS:
        1.  The entire response MUST be a single, valid JSON object. Do not wrap it in markdown or add any commentary.
        2.  The schema for each match object must be: { "leagueName": "...", "leagueRussianName": "...", "homeTeam": "...", "awayTeam": "...", "time": "...", "odds": { "w1": ..., "draw": ..., "w2": ... } }.
        3.  Infer the official English 'leagueName' and provide the Russian 'leagueRussianName'. Use the name provided by the user for 'leagueRussianName'.
        4.  If betting odds (three numbers) are provided for a match, include the "odds" object. If not, omit the "odds" key entirely for that match.
        5.  The odds are always in the order: W1 (home win), X (draw), W2 (away win). They can be numbers or strings.
        6.  If a time is not provided, set "time" to an empty string.
        7.  Parse team names accurately.

        Here is the user's text to parse:
        ${text}
    `;

    try {
        const jsonText = await callOpenRouterAPI(prompt);
        const result = parseJsonFromText(jsonText);

        if (!result || !Array.isArray(result.matches)) {
            console.warn("AI response did not contain a valid 'matches' array.", result);
            return { matches: [] };
        }

        const matches: Match[] = result.matches.map((m: any, index: number) => ({
            id: Date.now() + index,
            leagueName: m.leagueName,
            leagueRussianName: m.leagueRussianName,
            homeTeam: { id: Date.now() + index + 1000, name: m.homeTeam },
            awayTeam: { id: Date.now() + index + 2000, name: m.awayTeam },
            date: date,
            time: m.time || '',
            odds: m.odds,
        }));

        return { matches };

    } catch (error) {
        console.error('Error parsing manual matches with Gemini (OpenRouter):', error);
        if (error instanceof Error) {
            throw new Error(`Ошибка при разборе матчей через Gemini: ${error.message}`);
        }
        throw new Error("Неизвестная ошибка при обращении к API Gemini для разбора матчей.");
    }
}

export async function generateSingleMatchAnalysis(match: Match, lineup: Partial<AnalysisData> | undefined): Promise<AnalysisData> {
    const oddsString = match.odds ? `Odds (W1/D/W2): ${match.odds.w1} / ${match.odds.draw} / ${match.odds.w2}` : "Odds not provided";
    
    const betInstruction = match.odds
    ? `Ты — исполнитель правил для ставок. Твоя задача — вернуть ОДНУ строку с результатом, строго следуя этой логике IF/ELSE IF/ELSE. Не отклоняйся и не добавляй ничего лишнего.

Вот коэффициенты: П1=${match.odds.w1}, П2=${match.odds.w2}.

ЕСЛИ коэффициент П1 находится в диапазоне [1.10, 1.30] ИЛИ П2 находится в диапазоне [1.10, 1.30]:
  // Это ПРАВИЛО 1.
  // На основе своего анализа выбери между 'ТБ 1.5' и 'ТМ 4.5'.
  // Если фаворит П1, верни 'П1 + [выбранный тотал]'.
  // Если фаворит П2, верни 'П2 + [выбранный тотал]'.
  // Если считаешь ставку рискованной, добавь в конце ' (не рекомендовано)'.
  // На этом твоя работа закончена.
ИНАЧЕ ЕСЛИ коэффициент П1 находится в диапазоне [1.70, 2.00] ИЛИ П2 находится в диапазоне [1.70, 2.00]:
  // Это ПРАВИЛО 2.
  // На основе своего анализа выбери между 'ТБ 1.5' и 'ТМ 4.5'.
  // Если фаворит П1, верни '1X и [выбранный тотал]'.
  // Если фаворит П2, верни '2X и [выбранный тотал]'.
  // Если считаешь ставку рискованной, добавь в конце ' (не рекомендовано)'.
  // На этом твоя работа закончена.
ИНАЧЕ:
  // Ни одно из правил не подошло.
  // Просто верни точную строку 'Ставки нет'.`
    : 'Ставки нет';

    const prompt = `
        You are a professional football analyst. Your task is to provide a detailed analysis for a SINGLE match in Russian.

        Analyze THIS ONE match:
        Match: ${match.homeTeam.name} vs ${match.awayTeam.name}
        Tournament: ${match.leagueRussianName} (${match.leagueName})
        ${oddsString}
        Provided Lineup Info:
        - ${match.homeTeam.name}:
          - Starting: ${lineup?.team1Starting || "Not provided"}
          - Subs: ${lineup?.team1Subs || "Not provided"}
          - Injuries/Absences: ${lineup?.team1Injuries || "Not provided"}
        - ${match.awayTeam.name}:
          - Starting: ${lineup?.team2Starting || "Not provided"}
          - Subs: ${lineup?.team2Subs || "Not provided"}
          - Injuries/Absences: ${lineup?.team2Injuries || "Not provided"}
        
        Your response MUST be a single, valid JSON object with the following schema. Be concise but informative.

        Analysis object schema:
        {
          "predictedScore": { "home": 1, "away": 0 },
          "winProbability": { "home": 55, "draw": 25, "away": 20 },
          "homeTeamLogoUrl": "Try to find a public URL for the home team's logo.",
          "awayTeamLogoUrl": "Try to find a public URL for the away team's logo.",
          "strengthWeaknessTeam1": "Analysis of team 1's strengths and weaknesses, including current form (in Russian).",
          "strengthWeaknessTeam2": "Analysis of team 2's strengths and weaknesses, including current form (in Russian).",
          "h2h": "Head-to-head analysis (in Russian).",
          "motivationAndTactics": "Motivation for both teams and expected tactics (in Russian).",
          "keyPlayers": "Key players who can influence the match outcome (in Russian).",
          "matchPrediction": "A narrative description of how the match is likely to unfold (in Russian).",
          "bet": "${betInstruction}",
          "betConfidence": "A numeric confidence score from 1 to 10 for the main bet.",
          "altBets": "Массив из 2-3 объектов. Основываясь на своем полном анализе, предложи интересные альтернативные ставки с указанием уверенности. Здесь используй свои аналитические способности, а не правила для основной ставки.",
          "liveBet": "Основываясь на динамике матча, предложи конкретные идеи для live-ставок (например, 'Если счет 1:0 к перерыву, рассмотреть ставку на...')."
        }

        Do not add any extra text, explanations, or markdown formatting. Just the JSON object.
    `;
    
    try {
        const content = await callOpenRouterAPI(prompt);
        const result = parseJsonFromText(content);
        return result;
    } catch (error) {
        console.error('Gemini API error during single match analysis:', error);
         if (error instanceof Error) {
            throw new Error(`Не удалось сгенерировать детальный анализ через Gemini: ${error.message}`);
        }
        throw new Error("Не удалось сгенерировать детальный анализ через Gemini: Неизвестная ошибка.");
    }
}
