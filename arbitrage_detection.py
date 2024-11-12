import json
from flask import Flask, request, jsonify
from flask_cors import CORS  # 引入CORS支持

app = Flask(__name__)
CORS(app)  # 启用CORS

# 套利检测函数
def detect_arbitrage(logs):
    if len(logs) == 2:
        return "simple"
    elif len(logs) > 2:
        return "complex"
    return "none"

# 批量套利检测API
@app.route('/detect_arbitrage', methods=['POST'])
def detect_arbitrage_api():
    data = request.get_json()
    results = []

    if "transactions" not in data:
        return jsonify([])

    for tx in data["transactions"]:
        if "receipt" not in tx:
            continue

        logs = tx["receipt"].get("logs", [])
        arbitrage_type = detect_arbitrage(logs)
        # 将更多信息传递到前端
        results.append({
            "transactionHash": tx["transactionHash"],
            "arbitrage_type": arbitrage_type,
            "from": tx["from"],
            "to": tx["to"],
            "logs": logs
        })

    return jsonify(results)

# 读取JSON文件并提供给前端
@app.route('/load_data', methods=['GET'])
def load_data():
    with open('block_19952000.json', 'r') as f:
        data = json.load(f)
    
    # 输出加载的数据以便调试
    print("Loaded JSON data:", json.dumps(data, indent=4))
    
    return jsonify(data)

# 主程序入口
if __name__ == '__main__':
    app.run(debug=True)
