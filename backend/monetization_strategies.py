import random
from typing import Dict, List, Any

class MonetizationStrategyAnalyzer:
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize monetization strategy analyzer
        
        :param config: Configuration for monetization strategies
        """
        # In-App Purchase (IAP) Tiers
        self.iap_tiers = config.get('iap_tiers', [
            {
                'name': 'Starter Pack',
                'price': 2.99,
                'contents': {
                    'tokens': 250,
                    'special_board': False,
                    'ad_removal': False
                }
            },
            {
                'name': 'Premium Pack',
                'price': 9.99,
                'contents': {
                    'tokens': 1000,
                    'special_board': True,
                    'ad_removal': True
                }
            },
            {
                'name': 'Ultimate Pack',
                'price': 19.99,
                'contents': {
                    'tokens': 2500,
                    'special_board': True,
                    'ad_removal': True,
                    'exclusive_pieces': True
                }
            }
        ])
        
        # Ad Reward Configuration
        self.ad_rewards = config.get('ad_rewards', [
            {
                'type': 'token_boost',
                'reward': 50,
                'cooldown_hours': 4
            },
            {
                'type': 'extra_move',
                'reward': 1,
                'cooldown_hours': 2
            }
        ])
        
        # Subscription Tiers
        self.subscriptions = config.get('subscriptions', [
            {
                'name': 'Monthly Gamer',
                'price': 4.99,
                'benefits': [
                    'Daily token bonus',
                    'Exclusive monthly board',
                    'Ad-free experience'
                ]
            },
            {
                'name': 'Annual Strategist',
                'price': 49.99,
                'benefits': [
                    'Daily token bonus',
                    'Exclusive monthly boards',
                    'Ad-free experience',
                    '20% bonus on all purchases'
                ]
            }
        ])
    
    def analyze_iap_performance(self, sales_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze the performance of in-app purchase tiers
        
        :param sales_data: Historical sales data
        :return: Insights into IAP performance
        """
        tier_performance = {}
        
        for tier in self.iap_tiers:
            tier_sales = [sale for sale in sales_data if sale['tier_name'] == tier['name']]
            
            tier_performance[tier['name']] = {
                'total_sales': len(tier_sales),
                'total_revenue': len(tier_sales) * tier['price'],
                'average_purchase_frequency': len(tier_sales) / max(len(sales_data), 1),
                'most_popular_contents': self._find_most_popular_contents(tier_sales)
            }
        
        return tier_performance
    
    def simulate_ad_reward_impact(self, player_base_size: int, days: int) -> Dict[str, Any]:
        """
        Simulate the impact of ad rewards on player engagement
        
        :param player_base_size: Total number of players
        :param days: Number of days to simulate
        :return: Ad reward engagement metrics
        """
        ad_engagement_metrics = {}
        
        for reward in self.ad_rewards:
            # Simulate ad view probability
            ad_view_probability = random.uniform(0.2, 0.5)
            
            total_ad_views = int(player_base_size * ad_view_probability * days)
            total_rewards_claimed = int(total_ad_views * 0.8)  # Not all viewers claim rewards
            
            ad_engagement_metrics[reward['type']] = {
                'total_ad_views': total_ad_views,
                'rewards_claimed': total_rewards_claimed,
                'engagement_rate': total_rewards_claimed / total_ad_views * 100
            }
        
        return ad_engagement_metrics
    
    def evaluate_subscription_value(self, subscription_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Evaluate the value and performance of subscription tiers
        
        :param subscription_data: Historical subscription data
        :return: Subscription performance insights
        """
        subscription_performance = {}
        
        for tier in self.subscriptions:
            tier_subscriptions = [sub for sub in subscription_data if sub['tier_name'] == tier['name']]
            
            subscription_performance[tier['name']] = {
                'total_subscribers': len(tier_subscriptions),
                'total_revenue': len(tier_subscriptions) * tier['price'],
                'average_subscription_duration': self._calculate_avg_subscription_duration(tier_subscriptions),
                'retention_rate': len(tier_subscriptions) / max(len(subscription_data), 1) * 100
            }
        
        return subscription_performance
    
    def _find_most_popular_contents(self, sales_data: List[Dict[str, Any]]) -> List[str]:
        """
        Helper method to find most popular IAP contents
        
        :param sales_data: Sales data for a specific tier
        :return: List of most popular contents
        """
        content_popularity = {}
        for sale in sales_data:
            for content, value in sale.get('contents', {}).items():
                if value:
                    content_popularity[content] = content_popularity.get(content, 0) + 1
        
        return sorted(content_popularity, key=content_popularity.get, reverse=True)[:3]
    
    def _calculate_avg_subscription_duration(self, subscription_data: List[Dict[str, Any]]) -> float:
        """
        Calculate average subscription duration
        
        :param subscription_data: Subscription data for a specific tier
        :return: Average subscription duration in months
        """
        if not subscription_data:
            return 0
        
        durations = [sub.get('duration_months', 1) for sub in subscription_data]
        return sum(durations) / len(durations)

# Example usage
if __name__ == '__main__':
    # Initialize monetization strategy analyzer
    monetization_analyzer = MonetizationStrategyAnalyzer({})
    
    # Simulate sample sales and subscription data
    sample_sales_data = [
        {'tier_name': 'Starter Pack', 'contents': {'tokens': True}},
        {'tier_name': 'Premium Pack', 'contents': {'special_board': True, 'ad_removal': True}}
    ]
    
    sample_subscription_data = [
        {'tier_name': 'Monthly Gamer', 'duration_months': 3},
        {'tier_name': 'Annual Strategist', 'duration_months': 12}
    ]
    
    # Analyze IAP performance
    iap_insights = monetization_analyzer.analyze_iap_performance(sample_sales_data)
    print("IAP Performance Insights:", iap_insights)
    
    # Simulate ad reward impact
    ad_impact = monetization_analyzer.simulate_ad_reward_impact(player_base_size=10000, days=30)
    print("\nAd Reward Impact:", ad_impact)
    
    # Evaluate subscription performance
    subscription_insights = monetization_analyzer.evaluate_subscription_value(sample_subscription_data)
    print("\nSubscription Performance:", subscription_insights)
