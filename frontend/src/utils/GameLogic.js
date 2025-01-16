// Game Economy Simulation Logic
export function simulateEconomy(config) {
  const days = 30;
  const monetization_insights = {};
  
  // Initial state
  let active_players = 1000;
  let total_tokens = 0;
  
  // Dynamic rates based on rewards
  const baseWinRate = 0.4;
  const basePurchaseRate = 0.1;
  const baseRetentionRate = 0.95;
  
  // Calculate dynamic rates based on config
  const tokenSatisfactionRate = Math.min(1, (config.daily_login_reward + config.win_reward) / 150);
  const progressionRate = Math.min(1, 1000 / config.board_unlock_cost);
  
  for (let day = 1; day <= days; day++) {
    // Adjust rates based on economy balance
    const win_rate = baseWinRate * (1 + (config.win_reward - 25) / 100);
    const retention_rate = baseRetentionRate * (tokenSatisfactionRate + progressionRate) / 2;
    const purchase_rate = basePurchaseRate * (1 - tokenSatisfactionRate) * (config.board_unlock_cost / 500);
    
    // Calculate daily metrics
    const daily_active = Math.floor(active_players * retention_rate);
    const daily_winners = Math.floor(daily_active * win_rate);
    const daily_login_tokens = daily_active * config.daily_login_reward;
    const daily_win_tokens = daily_winners * config.win_reward;
    
    // Calculate daily token earnings per player
    const daily_tokens_per_player = (daily_login_tokens + daily_win_tokens) / daily_active;
    
    // Calculate purchases based on token scarcity
    const token_scarcity = Math.max(0, 1 - (daily_tokens_per_player / config.board_unlock_cost));
    const potential_buyers = Math.floor(daily_active * purchase_rate * token_scarcity);
    const actual_buyers = Math.floor(potential_buyers * (0.3 + Math.random() * 0.2));
    const revenue = actual_buyers * (config.board_unlock_cost / 100);
    
    // Update total tokens
    total_tokens += daily_login_tokens + daily_win_tokens;
    
    // Simulate player growth/churn based on satisfaction
    const satisfaction = (tokenSatisfactionRate + progressionRate) / 2;
    const churn_rate = 0.05 * (1 - satisfaction);
    const growth_rate = 0.08 * satisfaction;
    
    const churned_players = Math.floor(active_players * churn_rate);
    const new_players = Math.floor(active_players * growth_rate);
    active_players = active_players - churned_players + new_players;
    
    // Store daily insights
    monetization_insights[`Day ${day}`] = {
      active_players: daily_active,
      avg_tokens: Math.floor(daily_tokens_per_player),
      total_revenue: revenue,
      daily_winners: daily_winners,
      new_players: new_players,
      churned_players: churned_players,
      satisfaction_rate: satisfaction * 100
    };
  }
  
  return {
    monetization_insights,
    summary: {
      final_active_players: active_players,
      total_tokens_distributed: total_tokens,
      average_daily_revenue: Object.values(monetization_insights)
        .reduce((sum, day) => sum + day.total_revenue, 0) / days,
      player_satisfaction: (tokenSatisfactionRate + progressionRate) / 2 * 100
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
