import { simulateEconomy } from './GameLogic';

describe('Game Economy Scenarios', () => {
  const analyzeResults = (result) => {
    return {
      retentionRate: `${result.summary.retention_rate}%`,
      projectedMonthlyRevenue: `$${Math.round(result.summary.projected_monthly_revenue)}`,
      daysToUnlock: `${result.summary.days_to_unlock || 'N/A'} days`,
      finalPlayers: `${result.summary.final_active_players} players`
    };
  };

  const parseRange = (rangeStr) => {
    // Remove any non-numeric characters except '-'
    const cleanStr = rangeStr.replace(/[^0-9-]/g, '');
    const parts = cleanStr.split('-');
    
    // If no range, assume the value is the max
    if (parts.length === 1) {
      return { min: 0, max: parseInt(parts[0]) };
    }
    
    // Ensure we have two parts
    const min = parts[0] ? parseInt(parts[0]) : 0;
    const max = parts[1] ? parseInt(parts[1]) : Infinity;
    
    return { min, max };
  };

  const scenarios = [
    {
      name: 'Balanced Economy',
      config: {
        daily_login_reward: 10,
        win_reward: 30,
        board_unlock_cost: 500
      },
      expectations: {
        retentionRate: '5-20%',
        projectedMonthlyRevenue: '$300-$500',
        daysToUnlock: 1,
        finalPlayers: '100-200 players'
      }
    },
    {
      name: 'High Rewards, Low Cost',
      config: {
        daily_login_reward: 50,
        win_reward: 100,
        board_unlock_cost: 300
      },
      expectations: {
        retentionRate: '50-80%',
        projectedMonthlyRevenue: '$200-$300',
        daysToUnlock: 1,
        finalPlayers: '500-800 players'
      }
    },
    {
      name: 'Low Rewards, High Cost',
      config: {
        daily_login_reward: 5,
        win_reward: 10,
        board_unlock_cost: 1000
      },
      expectations: {
        retentionRate: '5-15%',
        projectedMonthlyRevenue: '$500-$1000',
        daysToUnlock: 1,
        finalPlayers: '50-150 players'
      }
    },
    {
      name: 'Balanced High Stakes',
      config: {
        daily_login_reward: 20,
        win_reward: 50,
        board_unlock_cost: 1000
      },
      expectations: {
        retentionRate: '5-15%',
        projectedMonthlyRevenue: '$500-$1000',
        daysToUnlock: 1,
        finalPlayers: '50-150 players'
      }
    },
    {
      name: 'Quick Progression',
      config: {
        daily_login_reward: 100,
        win_reward: 200,
        board_unlock_cost: 1000
      },
      expectations: {
        retentionRate: '40-70%',
        projectedMonthlyRevenue: '$1000-$2000',
        daysToUnlock: 1,
        finalPlayers: '400-700 players'
      }
    },
    {
      name: 'Revenue Optimization',
      config: {
        daily_login_reward: 5,
        win_reward: 15,
        board_unlock_cost: 300
      },
      expectations: {
        retentionRate: '10-25%',
        projectedMonthlyRevenue: '$100-$300',
        daysToUnlock: 1,
        finalPlayers: '100-250 players'
      }
    },
    {
      name: 'Competitive Player Focus',
      config: {
        daily_login_reward: 10,
        win_reward: 100,
        board_unlock_cost: 800
      },
      expectations: {
        retentionRate: '5-20%',
        projectedMonthlyRevenue: '$500-$1000',
        daysToUnlock: 1,
        finalPlayers: '50-200 players'
      }
    },
    {
      name: 'Casual Player Focus',
      config: {
        daily_login_reward: 30,
        win_reward: 40,
        board_unlock_cost: 400
      },
      expectations: {
        retentionRate: '10-30%',
        projectedMonthlyRevenue: '$200-$400',
        daysToUnlock: 1,
        finalPlayers: '100-300 players'
      }
    },
    {
      name: 'Long Term Engagement',
      config: {
        daily_login_reward: 15,
        win_reward: 35,
        board_unlock_cost: 800
      },
      expectations: {
        retentionRate: '5-20%',
        projectedMonthlyRevenue: '$500-$800',
        daysToUnlock: 1,
        finalPlayers: '50-200 players'
      }
    },
    {
      name: 'Whale Target',
      config: {
        daily_login_reward: 2,
        win_reward: 10,
        board_unlock_cost: 2500
      },
      expectations: {
        retentionRate: '5-15%',
        projectedMonthlyRevenue: '$1500-$2500',
        daysToUnlock: 2,
        finalPlayers: '50-150 players'
      }
    },
  ];

  scenarios.forEach(scenario => {
    test(scenario.name, () => {
      const result = simulateEconomy(scenario.config);
      const metrics = analyzeResults(result);
      
      console.log(`\nScenario: ${scenario.name}`);
      console.log('Results:', metrics);

      // Retention Rate Check
      const retentionRange = parseRange(scenario.expectations.retentionRate);
      const actualRetention = parseInt(metrics.retentionRate);
      expect(actualRetention).toBeGreaterThanOrEqual(retentionRange.min);
      expect(actualRetention).toBeLessThanOrEqual(retentionRange.max);

      // Projected Monthly Revenue Check
      const revenueRange = parseRange(scenario.expectations.projectedMonthlyRevenue);
      const actualRevenue = parseInt(metrics.projectedMonthlyRevenue.replace('$', ''));
      expect(actualRevenue).toBeGreaterThanOrEqual(revenueRange.min);
      expect(actualRevenue).toBeLessThanOrEqual(revenueRange.max);

      // Days to Unlock Check
      if (scenario.expectations.daysToUnlock) {
        expect(parseInt(metrics.daysToUnlock)).toBeLessThanOrEqual(
          scenario.expectations.daysToUnlock,
          `Days to unlock (${metrics.daysToUnlock}) exceeds maximum ${scenario.expectations.daysToUnlock}`
        );
      }

      // Final Players Check
      const playersRange = parseRange(scenario.expectations.finalPlayers);
      const actualPlayers = parseInt(metrics.finalPlayers);
      expect(actualPlayers).toBeGreaterThanOrEqual(playersRange.min);
      expect(actualPlayers).toBeLessThanOrEqual(playersRange.max);
    });
  });
});