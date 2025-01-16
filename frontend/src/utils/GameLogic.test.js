import { simulateEconomy } from './GameLogic';

describe('Game Economy Scenarios', () => {
  const analyzeResults = (result) => {
    const lastDay = Object.values(result.monetization_insights)[29];
    const firstDay = Object.values(result.monetization_insights)[0];
    
    const retentionRate = Math.min(100, (lastDay.active_players / firstDay.active_players) * 100);
    const avgRevenue = Math.round(result.summary.average_daily_revenue);
    const daysToUnlock = result.summary.days_to_unlock;
    
    return {
      retentionRate: Math.round(retentionRate),
      avgRevenue,
      daysToUnlock,
      avgTokens: Math.round(lastDay.avg_tokens),
      finalPlayers: lastDay.active_players
    };
  };

  const runScenario = (name, config, expectations) => {
    test(name, () => {
      const result = simulateEconomy(config);
      const metrics = analyzeResults(result);
      
      console.log(`\nScenario: ${name}`);
      console.log('Results:', {
        retentionRate: metrics.retentionRate + '%',
        avgRevenue: '$' + metrics.avgRevenue,
        daysToUnlock: (metrics.daysToUnlock || 'N/A') + ' days',
        avgTokens: metrics.avgTokens + ' tokens/day',
        finalPlayers: metrics.finalPlayers + ' players'
      });

      // Test expectations with detailed messages
      if (expectations.retentionMin) {
        expect(metrics.retentionRate).toBeGreaterThanOrEqual(
          expectations.retentionMin,
          `Retention rate ${metrics.retentionRate}% is below minimum ${expectations.retentionMin}%`
        );
      }
      if (expectations.retentionMax) {
        expect(metrics.retentionRate).toBeLessThanOrEqual(
          expectations.retentionMax,
          `Retention rate ${metrics.retentionRate}% exceeds maximum ${expectations.retentionMax}%`
        );
      }
      if (expectations.revenueMin) {
        expect(metrics.avgRevenue).toBeGreaterThanOrEqual(
          expectations.revenueMin,
          `Average revenue $${metrics.avgRevenue} is below minimum $${expectations.revenueMin}`
        );
      }
      if (expectations.revenueMax) {
        expect(metrics.avgRevenue).toBeLessThanOrEqual(
          expectations.revenueMax,
          `Average revenue $${metrics.avgRevenue} exceeds maximum $${expectations.revenueMax}`
        );
      }
      if (expectations.daysToUnlock) {
        expect(metrics.daysToUnlock).toBeLessThanOrEqual(
          expectations.daysToUnlock,
          `Days to unlock (${metrics.daysToUnlock}) exceeds maximum ${expectations.daysToUnlock}`
        );
      }
    });
  };

  // Scenario 1: Balanced Economy (Default Settings)
  runScenario('Balanced Economy', {
    daily_login_reward: 10,
    win_reward: 25,
    board_unlock_cost: 500
  }, {
    retentionMin: 5,
    retentionMax: 20,
    revenueMin: 5,
    revenueMax: 30,
    daysToUnlock: 15
  });

  // Scenario 2: High Rewards, Low Cost
  runScenario('High Rewards, Low Cost', {
    daily_login_reward: 50,
    win_reward: 100,
    board_unlock_cost: 500
  }, {
    retentionMin: 20,
    retentionMax: 50,
    revenueMax: 50,
    daysToUnlock: 10
  });

  // Scenario 3: Low Rewards, High Cost
  runScenario('Low Rewards, High Cost', {
    daily_login_reward: 5,
    win_reward: 10,
    board_unlock_cost: 1000
  }, {
    retentionMax: 15,
    retentionMin: 5,
    revenueMax: 50,
    daysToUnlock: 25
  });

  // Scenario 4: Balanced High Stakes
  runScenario('Balanced High Stakes', {
    daily_login_reward: 20,
    win_reward: 50,
    board_unlock_cost: 1000
  }, {
    retentionMin: 5,
    retentionMax: 20,
    revenueMin: 20,
    daysToUnlock: 15
  });

  // Scenario 5: Quick Progression
  runScenario('Quick Progression', {
    daily_login_reward: 100,
    win_reward: 200,
    board_unlock_cost: 1000
  }, {
    retentionMin: 30,
    retentionMax: 60,
    revenueMax: 100,
    daysToUnlock: 5
  });

  // More focused scenarios
  runScenario('Revenue Optimization', {
    daily_login_reward: 5,
    win_reward: 15,
    board_unlock_cost: 300
  }, {
    retentionMin: 10,
    retentionMax: 25,
    revenueMin: 5,
    revenueMax: 30,
    daysToUnlock: 12
  });

  runScenario('Competitive Player Focus', {
    daily_login_reward: 10,
    win_reward: 100,
    board_unlock_cost: 800
  }, {
    retentionMin: 5,
    retentionMax: 20,
    revenueMin: 20,
    daysToUnlock: 10
  });

  runScenario('Casual Player Focus', {
    daily_login_reward: 30,
    win_reward: 40,
    board_unlock_cost: 400
  }, {
    retentionMin: 10,
    retentionMax: 30,
    revenueMax: 30,
    daysToUnlock: 7
  });

  runScenario('Long Term Engagement', {
    daily_login_reward: 15,
    win_reward: 35,
    board_unlock_cost: 800
  }, {
    retentionMin: 5,
    retentionMax: 20,
    revenueMin: 10,
    daysToUnlock: 15
  });

  runScenario('Whale Target', {
    daily_login_reward: 2,
    win_reward: 10,
    board_unlock_cost: 2500
  }, {
    retentionMax: 10,
    revenueMin: 50,
    daysToUnlock: 25
  });
});