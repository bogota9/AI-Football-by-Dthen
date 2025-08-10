
import { Match, AnalysisData } from '../types';
import { parseJsonFromText } from './parser';
import { API_KEY } from './apiKey';

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "zhipu/glm-4-air";
const SITE_URL = "https://ai-football-by-dthen.web.app"; 
const SITE_NAME = "AI Football by Dthen";

async function callZaiAPI(prompt: string) {
    const body: any = {
        messages: [
            { role: "system", content: "You are a helpful assistant designed to output JSON." },
            { role: "user", content: prompt }
        ],
        model: MODEL,
        temperature: 0.3,
        max_tokens: 4096,
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
        console.error("Z-AI (OpenRouter) API Error:", errorText);
        throw new Error(`Ошибка API Z-AI (OpenRouter): ${response.status} ${response.statusText}. ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content;
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
        const content = await callZaiAPI(prompt);
        const result = parseJsonFromText(content);
        return result;
    } catch (error) {
        console.error('Z-AI API error during single match analysis:', error);
         if (error instanceof Error) {
            throw new Error(`Не удалось сгенерировать детальный анализ через Z-AI: ${error.message}`);
        }
        throw new Error("Не удалось сгенерировать детальный анализ через Z-AI: Неизвестная ошибка.");
    }
}
