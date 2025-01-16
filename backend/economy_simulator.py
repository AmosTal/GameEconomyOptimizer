import numpy as np
import random
from typing import Dict, List, Any

class GameEconomySimulator:
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize the game economy simulator with configuration parameters
        
        :param config: Dictionary containing economic parameters
        """
        # Resource generation parameters
        self.daily_login_reward = config.get('daily_login_reward', 50)
        self.win_reward = config.get('win_reward', 25)
        self.board_unlock_cost = config.get('board_unlock_cost', 500)
        
        # Monetization parameters
        self.iap_tiers = config.get('iap_tiers', [
            {'name': 'Small Pack', 'price': 2.99, 'tokens': 250},
            {'name': 'Medium Pack', 'price': 4.99, 'tokens': 500},
            {'name': 'Large Pack', 'price': 9.99, 'tokens': 1250}
        ])
        
        # Player behavior parameters
        self.player_types = {
            'free_to_play': {
                'daily_play_chance': 0.6,
                'iap_conversion_rate': 0.05
            },
            'casual_spender': {
                'daily_play_chance': 0.8,
                'iap_conversion_rate': 0.2
            },
            'whale': {
                'daily_play_chance': 0.9,
                'iap_conversion_rate': 0.5
            }
        }
    
    def simulate_player_progression(self, player_type: str, days: int) -> Dict[str, Any]:
        """
        Simulate a player's progression over a specified number of days
        
        :param player_type: Type of player (free_to_play, casual_spender, whale)
        :param days: Number of days to simulate
        :return: Dictionary of player progression metrics
        """
        player_config = self.player_types[player_type]
        
        total_tokens = 0
        total_iap_revenue = 0
        days_played = 0
        
        for day in range(days):
            # Daily login reward
            if random.random() < player_config['daily_play_chance']:
                total_tokens += self.daily_login_reward
                days_played += 1
            
            # Potential in-app purchase
            if random.random() < player_config['iap_conversion_rate']:
                # Choose a random IAP tier
                iap_tier = random.choice(self.iap_tiers)
                total_tokens += iap_tier['tokens']
                total_iap_revenue += iap_tier['price']
        
        return {
            'player_type': player_type,
            'total_tokens': total_tokens,
            'total_iap_revenue': total_iap_revenue,
            'days_played': days_played,
            'retention_rate': days_played / days * 100
        }
    
    def analyze_monetization_strategies(self, simulation_runs: int = 100) -> Dict[str, Any]:
        """
        Analyze monetization strategies across different player types
        
        :param simulation_runs: Number of simulation runs
        :return: Aggregated monetization insights
        """
        insights = {}
        
        for player_type in self.player_types.keys():
            type_results = [
                self.simulate_player_progression(player_type, 30) 
                for _ in range(simulation_runs)
            ]
            
            insights[player_type] = {
                'avg_tokens': np.mean([r['total_tokens'] for r in type_results]),
                'avg_revenue': np.mean([r['total_iap_revenue'] for r in type_results]),
                'avg_retention_rate': np.mean([r['retention_rate'] for r in type_results])
            }
        
        return insights
    
    def optimize_economy(self, current_config: Dict[str, Any]) -> Dict[str, Any]:
        """
        Suggest optimizations for the game economy
        
        :param current_config: Current economic configuration
        :return: Recommended economic adjustments
        """
        # Run initial simulation
        base_insights = self.analyze_monetization_strategies()
        
        # Potential optimization suggestions
        recommendations = {
            'daily_login_reward': {
                'current': current_config.get('daily_login_reward', 50),
                'suggestion': 'Consider increasing daily login reward to improve retention'
                if base_insights['free_to_play']['avg_retention_rate'] < 50 else 'Current daily reward seems optimal'
            },
            'iap_pricing': {
                'current': self.iap_tiers,
                'suggestion': 'Introduce more granular IAP tiers to cater to different spending habits'
                if base_insights['casual_spender']['avg_revenue'] < 10 else 'Current IAP structure appears effective'
            }
        }
        
        return recommendations

# Example usage
if __name__ == '__main__':
    initial_config = {
        'daily_login_reward': 50,
        'win_reward': 25,
        'board_unlock_cost': 500
    }
    
    simulator = GameEconomySimulator(initial_config)
    
    # Run monetization analysis
    monetization_insights = simulator.analyze_monetization_strategies()
    print("Monetization Insights:", monetization_insights)
    
    # Get economy optimization recommendations
    optimization_suggestions = simulator.optimize_economy(initial_config)
    print("\nOptimization Suggestions:", optimization_suggestions)
