import requests
import json

# 读取JSON文件
file_path = 'block_19952000.json'  # 你的JSON文件路径
with open(file_path, 'r') as f:
    data = json.load(f)

# 检查读取的数据结构是否正确
print("读取的JSON数据：")
print(json.dumps(data, indent=4))  # 打印JSON数据

# 设置API URL
url = 'http://127.0.0.1:5000/detect_arbitrage'

# 发送POST请求
response = requests.post(url, json=data)

# 打印响应
if response.status_code == 200:
    print("API响应成功！结果如下：")
    print(json.dumps(response.json(), indent=4))
else:
    print("API请求失败，状态码：", response.status_code)
    print(response.text)
