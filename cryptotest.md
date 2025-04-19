a@a:~/trustwallet$ curl http://localhost:5000/api/crypto/prices -H "Content-Type: application/json"
{"success":true,"data":{"prices":{"ETH":{"price":1598.1,"marketCap":966825667,"volume24h":50177.8,"priceChange24h":0.48,"liquidity":2331444.4},"BTC":{"price":85299.44,"marketCap":5569521604,"volume24h":37585.03,"priceChange24h":0.77,"liquidity":3055249.77}},"timestamp":"2025-04-19T12:38:21.361Z"}}a@a:~/trustwallet$ 










a@a:~/trustwallet$ curl -X GET http://localhost:5000/api/crypto/0x6cfd8d28580b4d53bca59f89d7faf324a247e9ea/balances -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDM5YWEyYzkzMTY5NzBlYzdlZGY0YSIsIndhbGxldEFkZHJlc3MiOiIweDZjZmQ4ZDI4NTgwYjRkNTNiY2E1OWY4OWQ3ZmFmMzI0YTI0N2U5ZWEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTA2NjY2NywiZXhwIjoxNzQ1MTUzMDY3fQ.qTmu4usBZu6a7inyCz2z2h0A1bGQb1TfNjhHF37qLA4"
{"success":true,"data":{"balances":[{"symbol":"BTC","amount":10,"priceUsd":85299.44,"value":852994.4,"lastUpdated":"2025-04-19T12:45:18.503Z","metrics":{"price":85299.44,"marketCap":5569521604,"volume24h":37528.86,"priceChange24h":0.74,"liquidity":3055249.77},"_id":"68039aa4c9316970ec7edf51"},{"symbol":"ETH","amount":200,"priceUsd":1598.22,"value":319644,"lastUpdated":"2025-04-19T12:45:18.503Z","metrics":{"price":1598.22,"marketCap":966900979,"volume24h":50225.72,"priceChange24h":0.49,"liquidity":2331530.41},"_id":"68039aa4c9316970ec7edf52"}],"totalValue":1172638.4}}a@a:~/trustwallet$ 