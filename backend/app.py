import os
import sys
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import logging

# Add project root to Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s: %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('backend_server.log')
    ]
)

try:
    from backend.economy_simulator import GameEconomySimulator
    from backend.player_model import PlayerBehaviorModel
    from backend.monetization_strategies import MonetizationStrategyAnalyzer
except ImportError as e:
    logging.error(f"Import Error: {e}")
    logging.error(traceback.format_exc())
    sys.exit(1)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
socketio = SocketIO(app, cors_allowed_origins="*")  # Enable WebSocket with CORS

# Initialize simulation components
try:
    economy_simulator = GameEconomySimulator({})
    player_model = PlayerBehaviorModel({})
    monetization_analyzer = MonetizationStrategyAnalyzer({})
except Exception as e:
    logging.error(f"Initialization Error: {e}")
    logging.error(traceback.format_exc())
    sys.exit(1)

@app.route('/', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Game Economy Simulation Backend is running'
    }), 200

@app.route('/simulate/economy', methods=['POST'])
def simulate_economy():
    """
    Endpoint to simulate game economy based on input parameters
    """
    try:
        config = request.json.get('config', {})
        
        # Run economy simulation
        simulator = GameEconomySimulator(config)
        monetization_insights = simulator.analyze_monetization_strategies()
        optimization_suggestions = simulator.optimize_economy(config)
        
        return jsonify({
            'monetization_insights': monetization_insights,
            'optimization_suggestions': optimization_suggestions
        })
    except Exception as e:
        logging.error(f"Economy Simulation Error: {e}")
        return jsonify({
            'error': 'Simulation failed',
            'details': str(e)
        }), 500

@app.route('/analyze/players', methods=['POST'])
def analyze_player_behavior():
    """
    Endpoint to analyze player behavior and archetypes
    """
    try:
        config = request.json.get('config', {})
        
        # Compare player archetypes
        archetype_comparison = player_model.compare_player_archetypes()
        
        # Predict churn risk for a sample player
        sample_player = {
            'retention_rate': config.get('retention_rate', 60),
            'progression_level': config.get('progression_level', 40),
            'iap_count': config.get('iap_count', 2)
        }
        churn_risk = player_model.predict_churn_risk(sample_player)
        
        return jsonify({
            'archetype_comparison': archetype_comparison,
            'churn_risk': churn_risk
        })
    except Exception as e:
        logging.error(f"Player Analysis Error: {e}")
        return jsonify({
            'error': 'Player analysis failed',
            'details': str(e)
        }), 500

@app.route('/analyze/monetization', methods=['POST'])
def analyze_monetization():
    """
    Endpoint to analyze monetization strategies
    """
    try:
        # Simulate ad reward impact
        ad_impact = monetization_analyzer.simulate_ad_reward_impact(
            player_base_size=10000, 
            days=30
        )
        
        # Sample sales and subscription data for demonstration
        sample_sales_data = [
            {'tier_name': 'Starter Pack', 'contents': {'tokens': True}},
            {'tier_name': 'Premium Pack', 'contents': {'special_board': True, 'ad_removal': True}}
        ]
        
        sample_subscription_data = [
            {'tier_name': 'Monthly Gamer', 'duration_months': 3},
            {'tier_name': 'Annual Strategist', 'duration_months': 12}
        ]
        
        # Analyze IAP and subscription performance
        iap_insights = monetization_analyzer.analyze_iap_performance(sample_sales_data)
        subscription_insights = monetization_analyzer.evaluate_subscription_value(sample_subscription_data)
        
        return jsonify({
            'ad_reward_impact': ad_impact,
            'iap_performance': iap_insights,
            'subscription_performance': subscription_insights
        })
    except Exception as e:
        logging.error(f"Monetization Analysis Error: {e}")
        return jsonify({
            'error': 'Monetization analysis failed',
            'details': str(e)
        }), 500

@socketio.on('connect')
def handle_connect():
    """
    WebSocket connection handler
    """
    logging.info('WebSocket client connected')
    emit('connection_response', {'message': 'Connected to Game Economy Simulation Backend'})

@socketio.on('simulate_economy')
def handle_economy_simulation(data):
    """
    WebSocket endpoint for economy simulation
    """
    try:
        config = data.get('config', {})
        
        # Run economy simulation
        simulator = GameEconomySimulator(config)
        monetization_insights = simulator.analyze_monetization_strategies()
        optimization_suggestions = simulator.optimize_economy(config)
        
        emit('simulation_result', {
            'monetization_insights': monetization_insights,
            'optimization_suggestions': optimization_suggestions
        })
    except Exception as e:
        logging.error(f"WebSocket Economy Simulation Error: {e}")
        emit('simulation_error', {
            'error': 'Simulation failed',
            'details': str(e)
        })

if __name__ == '__main__':
    try:
        logging.info("Starting Game Economy Simulation Backend")
        socketio.run(app, host='0.0.0.0', port=5000, debug=True)
    except Exception as e:
        logging.error(f"Server Startup Error: {e}")
        logging.error(traceback.format_exc())
        sys.exit(1)
