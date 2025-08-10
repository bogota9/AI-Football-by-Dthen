export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  retrievedContext?: {
    uri?: string;
    title?: string;
  };
}

export interface Team {
    id: number;
    name: string;
}

export interface Match {
    id: number;
    leagueName: string;
    leagueRussianName: string;
    homeTeam: Team;
    awayTeam: Team;
    date: string;
    time: string;
    odds?: {
        w1: number | string;
        draw: number | string;
        w2: number | string;
    }
}

export interface League {
    name: string;
    russianName: string;
    matches: Match[];
}

export interface LoadingState {
    matches: boolean;
    analysis: boolean;
}

export interface AnalysisData {
    // For the visual header
    predictedScore?: { home: number; away: number; };
    winProbability?: { home: number; draw: number; away: number; }; // Percentages, should sum to 100
    homeTeamLogoUrl?: string;
    awayTeamLogoUrl?: string;

    // Detailed text analysis
    strengthWeaknessTeam1?: string; // Strong and weak sides of team 1, including current form.
    strengthWeaknessTeam2?: string; // Strong and weak sides of team 2, including current form.
    h2h?: string; // Head-to-head analysis.
    motivationAndTactics?: string; // Motivation for both teams and expected tactics.
    keyPlayers?: string; // Key players who can influence the match outcome.
    matchPrediction?: string; // A narrative description of how the match is likely to unfold.

    // Betting insights
    bet?: string; // The main recommended bet.
    betConfidence?: number; // A numeric confidence score from 1 to 10 for the main bet.
    altBets?: { bet: string; confidence: number; }[]; // Alternative betting options with confidence.
    liveBet?: string; // Ideas for live betting.
    
    // Provided lineup info from user
    team1Starting?: string;
    team1Subs?: string;
    team1Injuries?: string;
    team2Starting?: string;
    team2Subs?: string;
    team2Injuries?: string;
}

export type AiModel = 'gemini' | 'qwen' | 'deepseek' | 'zai' | 'kimi' | 'mai' | 'llama';

export interface ModelResult {
    data?: AnalysisData;
    error?: string;
}

export type AnalysisResult = Partial<Record<AiModel, ModelResult>>;

export type LineupData = Record<number, Partial<AnalysisData>>;