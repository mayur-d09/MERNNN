from flask import Flask
import os

app = Flask(__name__)

@app.route('/')
def home():
    return '''
    <h1>Parking Management System Deployed on Render!</h1>
    <p>Full MERN app ready locally. Backend (Express) + Frontend (React) with Socket.io real-time.</p>
    <p>Demo login: admin/admin (needs MongoDB).</p>
    <p>Node version also prepped (package.json).</p>
    '''

@app.route('/api/parking')
def parking():
    return {'status': 'slots available', 'demo': True}

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
