// Game Economy Simulation Logic
export function simulateEconomy(config) {
  const days = 30;
  const monetization_insights = {};
  
  // Initial state
  let active_players = 1000;
  let total_tokens = 0;
  let days_to_unlock = null;
  let total_tokens_for_unlock = 0;
  
  // Dynamic rates based on rewards
  const baseWinRate = 0.3;
  const basePurchaseRate = 0.15;
  const baseRetentionRate = 0.85;
  
  // Calculate initial satisfaction and progression metrics
  const tokenSatisfactionRate = Math.min(1, (config.daily_login_reward + config.win_reward) / 300);
  const progressionRate = Math.max(0, 1 - (config.board_unlock_cost / 1200));
  
  // Introduce more stable initial conditions
  const initialPlayerQuality = Math.max(0.5, tokenSatisfactionRate * progressionRate);
  
  for (let day = 1; day <= days; day++) {
    // More nuanced decay and growth
    const retentionFactor = Math.max(0.3, 1 - (day / (days * 2)));
    const growthFactor = Math.max(0.1, 1 - (day / (days * 1.5)));
    
    // Dynamic win and purchase rates with more stable progression
    const win_rate = baseWinRate * (1 + Math.log(config.win_reward / 25) * 0.2) * retentionFactor;
    const purchase_rate = basePurchaseRate * (1 / (1 + Math.exp(-config.board_unlock_cost / 500))) * growthFactor;
    
    // Refined daily active player calculation
    const daily_active = Math.floor(
      active_players * 
      baseRetentionRate * 
      initialPlayerQuality * 
      retentionFactor * 
      (1 + Math.log(day) * 0.1)
    );
    
    const daily_winners = Math.floor(daily_active * win_rate);
    const daily_login_tokens = daily_active * config.daily_login_reward;
    const daily_win_tokens = daily_winners * config.win_reward;
    
    // Calculate daily token earnings per player
    const daily_tokens_per_player = (daily_login_tokens + daily_win_tokens) / (daily_active || 1);
    
    // More robust days to unlock calculation
    total_tokens_for_unlock += daily_tokens_per_player * daily_active;
    
    if (days_to_unlock === null && total_tokens_for_unlock >= config.board_unlock_cost) {
      days_to_unlock = day;
    }
    
    // Advanced scarcity and purchase dynamics
    const token_scarcity = Math.max(0, 1 - (daily_tokens_per_player / config.board_unlock_cost));
    const potential_buyers = Math.floor(daily_active * purchase_rate * token_scarcity);
    
    // Probabilistic buyer conversion with more complex dynamics
    const buyer_conversion_base = 0.3;
    const buyer_conversion_rate = buyer_conversion_base * (1 - Math.exp(-potential_buyers / 75));
    const actual_buyers = Math.floor(potential_buyers * buyer_conversion_rate);
    
    // Revenue calculation with enhanced elasticity
    const base_revenue_per_buyer = config.board_unlock_cost / 25;
    const revenue_elasticity = Math.max(0.5, 1 - Math.log(actual_buyers + 1) / 10);
    const revenue = actual_buyers * base_revenue_per_buyer * revenue_elasticity;
    
    // Update total tokens
    total_tokens += daily_login_tokens + daily_win_tokens;
    
    // More stable player dynamics
    const satisfaction = Math.min(1, (tokenSatisfactionRate + progressionRate) / 2);
    const base_churn_rate = 0.2;
    const base_growth_rate = 0.1;
    
    const churn_rate = base_churn_rate * (1 - satisfaction) * retentionFactor;
    const growth_rate = base_growth_rate * satisfaction * growthFactor;
    
    const churned_players = Math.floor(active_players * churn_rate);
    const new_players = Math.floor(active_players * growth_rate * (1 + Math.log(day) * 0.05));
    
    active_players = Math.max(100, active_players - churned_players + new_players);
    
    // Store daily insights
    monetization_insights[`Day ${day}`] = {
      active_players: daily_active,
      avg_tokens: Math.floor(daily_tokens_per_player),
      total_revenue: revenue,
      daily_winners: daily_winners,
      new_players: new_players,
      churned_players: churned_players,
      satisfaction_rate: satisfaction * 100,
      token_scarcity: token_scarcity * 100
    };
  }
  
  return {
    monetization_insights,
    summary: {
      final_active_players: active_players,
      total_tokens_distributed: total_tokens,
      days_to_unlock: days_to_unlock,
      average_daily_revenue: Object.values(monetization_insights)
        .reduce((sum, day) => sum + day.total_revenue, 0) / days
    }
  };
}

// Player Behavior Analysis
export const analyzePlayerBehavior = (config) => {
  const { retention_rate, progression_level, iap_count } = config;
  
  // Define player archetypes
  const archetypes = {
    'Casual Player': {
      avg_retention_rate: 40,
      avg_sessions: 2,
      avg_progression: 30,
      avg_iap_count: 0,
      avg_engagement_score: 35
    },
    'Regular Player': {
      avg_retention_rate: 70,
      avg_sessions: 5,
      avg_progression: 60,
      avg_iap_count: 1,
      avg_engagement_score: 65
    },
    'Power Player': {
      avg_retention_rate: 90,
      avg_sessions: 10,
      avg_progression: 90,
      avg_iap_count: 5,
      avg_engagement_score: 95
    }
  };

  // Calculate player metrics
  const playerMetrics = {
    retention_score: retention_rate / 100,
    progression_score: progression_level / 100,
    purchase_score: Math.min(iap_count / 5, 1)
  };

  // Compare with archetypes
  const comparison = {};
  Object.entries(archetypes).forEach(([type, metrics]) => {
    comparison[type] = {
      ...metrics,
      match_score: calculateMatchScore(playerMetrics, metrics)
    };
  });

  return {
    archetype_comparison: comparison,
    player_metrics: playerMetrics
  };
};

// Helper functions
const calculateMatchScore = (playerMetrics, archetypeMetrics) => {
  const weights = {
    retention_rate: 0.3,
    progression: 0.3,
    iap_count: 0.4
  };

  return (
    playerMetrics.retention_score * weights.retention_rate +
    playerMetrics.progression_score * weights.progression +
    playerMetrics.purchase_score * weights.iap_count
  ) * 100;
};
