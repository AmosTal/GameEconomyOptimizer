import numpy as np
import random
from typing import Dict, List, Any

class PlayerBehaviorModel:
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize player behavior model with configuration parameters
        
        :param config: Dictionary containing player behavior parameters
        """
        # Player archetype configurations
        self.player_archetypes = {
            'explorer': {
                'retention_base': 0.7,
                'iap_likelihood': 0.1,
                'progression_speed': 0.6
            },
            'competitive': {
                'retention_base': 0.8,
                'iap_likelihood': 0.3,
                'progression_speed': 0.9
            },
            'casual': {
                'retention_base': 0.5,
                'iap_likelihood': 0.05,
                'progression_speed': 0.4
            }
        }
        
        # Custom configuration overrides
        for archetype, params in config.get('archetypes', {}).items():
            if archetype in self.player_archetypes:
                self.player_archetypes[archetype].update(params)
    
    def simulate_player_journey(self, archetype: str, game_duration: int = 30) -> Dict[str, Any]:
        """
        Simulate a player's journey through the game
        
        :param archetype: Player archetype (explorer, competitive, casual)
        :param game_duration: Number of days to simulate
        :return: Detailed player journey metrics
        """
        player_config = self.player_archetypes[archetype]
        
        # Tracking variables
        total_sessions = 0
        total_progression = 0
        iap_count = 0
        retention_days = 0
        
        for day in range(game_duration):
            # Daily play probability based on archetype
            if random.random() < player_config['retention_base']:
                total_sessions += 1
                retention_days += 1
                
                # Progression calculation
                total_progression += player_config['progression_speed']
                
                # In-app purchase likelihood
                if random.random() < player_config['iap_likelihood']:
                    iap_count += 1
        
        return {
            'archetype': archetype,
            'total_sessions': total_sessions,
            'retention_rate': retention_days / game_duration * 100,
            'progression_level': total_progression,
            'iap_count': iap_count,
            'engagement_score': (total_sessions * player_config['progression_speed']) / game_duration
        }
    
    def compare_player_archetypes(self, simulation_runs: int = 100) -> Dict[str, Dict[str, float]]:
        """
        Compare different player archetypes across multiple simulation runs
        
        :param simulation_runs: Number of simulation runs
        :return: Aggregated metrics for each archetype
        """
        archetype_metrics = {}
        
        for archetype in self.player_archetypes.keys():
            # Run multiple simulations
            archetype_results = [
                self.simulate_player_journey(archetype) 
                for _ in range(simulation_runs)
            ]
            
            # Calculate aggregate metrics
            archetype_metrics[archetype] = {
                'avg_retention_rate': np.mean([r['retention_rate'] for r in archetype_results]),
                'avg_sessions': np.mean([r['total_sessions'] for r in archetype_results]),
                'avg_progression': np.mean([r['progression_level'] for r in archetype_results]),
                'avg_iap_count': np.mean([r['iap_count'] for r in archetype_results]),
                'avg_engagement_score': np.mean([r['engagement_score'] for r in archetype_results])
            }
        
        return archetype_metrics
    
    def predict_churn_risk(self, player_data: Dict[str, Any]) -> float:
        """
        Predict the likelihood of a player churning
        
        :param player_data: Player's historical game data
        :return: Churn risk percentage
        """
        # Churn risk factors
        retention_weight = 0.4
        progression_weight = 0.3
        iap_weight = 0.3
        
        churn_risk = (
            (1 - player_data.get('retention_rate', 0) / 100) * retention_weight +
            (1 - player_data.get('progression_level', 0) / 100) * progression_weight +
            (1 - min(player_data.get('iap_count', 0) / 5, 1)) * iap_weight
        ) * 100
        
        return min(max(churn_risk, 0), 100)

# Example usage
if __name__ == '__main__':
    # Initialize player behavior model
    player_model = PlayerBehaviorModel({})
    
    # Compare player archetypes
    archetype_comparison = player_model.compare_player_archetypes()
    print("Archetype Comparison:", archetype_comparison)
    
    # Example churn risk prediction
    sample_player = {
        'retention_rate': 60,
        'progression_level': 40,
        'iap_count': 2
    }
    churn_risk = player_model.predict_churn_risk(sample_player)
    print("\nChurn Risk for Sample Player:", churn_risk, "%")
