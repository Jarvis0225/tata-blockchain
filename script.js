document.getElementById("fetch-results").addEventListener("click", fetchDataAndDetectArbitrage);

function fetchDataAndDetectArbitrage() {
    // 第一步：从后端加载实际JSON数据
    fetch("http://127.0.0.1:5000/load_data")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load JSON data");
            }
            return response.json();
        })
        .then(data => {
            console.log("Loaded data from /load_data:", data);  // 输出加载的数据以调试
            // 第二步：将加载的数据发送到检测套利的API端点
            return fetch("http://127.0.0.1:5000/detect_arbitrage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Arbitrage detection failed");
            }
            return response.json();
        })
        .then(detectionResults => {
            console.log("Arbitrage Detection Results from /detect_arbitrage:", detectionResults);  // 输出检测结果
            displayResults(detectionResults);  // 显示结果
        })
        .catch(error => console.error("Error:", error));
}

function displayResults(results) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = ""; // 清空之前的内容

    if (results.length === 0) {
        resultsDiv.innerHTML = "<p>No arbitrage detected.</p>";
    } else {
        results.forEach(result => {
            const resultItem = document.createElement("div");
            resultItem.classList.add("result-item");

            const type = document.createElement("p");
            type.classList.add("result-type");
            type.textContent = `Arbitrage Type: ${result.arbitrage_type}`;

            const hash = document.createElement("p");
            hash.classList.add("transaction-hash");
            hash.textContent = `Transaction Hash: ${result.transactionHash}`;

            const from = document.createElement("p");
            from.classList.add("transaction-from");
            from.textContent = `From: ${result.from}`;

            const to = document.createElement("p");
            to.classList.add("transaction-to");
            to.textContent = `To: ${result.to}`;

            // 创建logs的显示
            const logsHeader = document.createElement("p");
            logsHeader.classList.add("logs-header");
            logsHeader.textContent = "Logs:";

            const logsList = document.createElement("ul");
            logsList.classList.add("logs-list");
            result.logs.forEach(log => {
                const logItem = document.createElement("li");
                logItem.textContent = `From: ${log.from}, To: ${log.to}, Value: ${log.value}, Token: ${log.token}`;
                logsList.appendChild(logItem);
            });

            // 将所有元素添加到resultItem
            resultItem.appendChild(type);
            resultItem.appendChild(hash);
            resultItem.appendChild(from);
            resultItem.appendChild(to);
            resultItem.appendChild(logsHeader);
            resultItem.appendChild(logsList);

            resultsDiv.appendChild(resultItem);
        });
    }
}
