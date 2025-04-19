a@a:~/trustwallet$ curl -X POST http://localhost:5000/api/wallet/generate -H "Content-Type: application/json"

{"success":true,"data":{"seedPhrase":"general elbow ship spawn fitness domain attack they energy hybrid daughter shoot","walletAddress":"0x8f77B14c4520EDEa9BaB3367D1a96df91bD2384e","message":"IMPORTANT: Write down these 12 words in order and keep them safe. They are the only way to recover your wallet."}}a@a:~/trustwallet$ 
a@a:~/trustwallet$ 






a@a:~/trustwallet$ curl -X POST http://localhost:5000/api/wallet/generate -H "Content-Type: application/json" -c cookies.txt
{"success":true,"data":{"seedPhrase":"vacuum sheriff fade prison scout aisle stuff steak deposit snack industry three","walletAddress":"0x209D91721fD1f0a274708951E71F8E04d6c558c7","message":"IMPORTANT: Write down these 12 words in order and keep them safe. They are the only way to recover your wallet."}}a@a:~/trustwallet$ curl "hcurl "http://localhost:5000/api/wallet/verify-challenge?walletAddress=0x209D91721fD1f0a274708951E71F8E04d6c558c7" -H "Content-Type: application/json" -b cookies.txt -v
*   Trying 127.0.0.1:5000...
* Connected to localhost (127.0.0.1) port 5000 (#0)
> GET /api/wallet/verify-challenge?walletAddress=0x209D91721fD1f0a274708951E71F8E04d6c558c7 HTTP/1.1
> Host: localhost:5000
> User-Agent: curl/7.81.0
> Accept: */*
> Cookie: connect.sid=s%3A5VJ9fXDeL5QMr_P1QlUeDX6Jg2wGMZTp.%2B%2FYPp3657H4x4wU5I8e37%2BC3uYUIPuzy3ZvZn7t77v8
> Content-Type: application/json
> 
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
< Cross-Origin-Opener-Policy: same-origin
< Cross-Origin-Resource-Policy: same-origin
< Origin-Agent-Cluster: ?1
< Referrer-Policy: no-referrer
< Strict-Transport-Security: max-age=31536000; includeSubDomains
< X-Content-Type-Options: nosniff
< X-DNS-Prefetch-Control: off
< X-Download-Options: noopen
< X-Frame-Options: SAMEORIGIN
< X-Permitted-Cross-Domain-Policies: none
< X-XSS-Protection: 0
< Access-Control-Allow-Origin: *
< Content-Type: application/json; charset=utf-8
< Content-Length: 169
< ETag: W/"a9-30kc1iRXDXG72/SvvuEOlYB+HFo"
< Date: Sat, 19 Apr 2025 10:07:12 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
* Connection #0 to host localhost left intact
{"success":true,"data":{"indices":[10,1,5],"options":["idustry","industrys","industry","ndustry","sheriff","heriff","seriff","sheriffs","aisle","isle","aisles","asle"]}}a@a:~/trustwallet$ 


















a@a:~/trustwallet$ curl -X POST http://localhost:5000/api/wallet/generate -H "Content-Type: application/json" -c cookies.txt
{"success":true,"data":{"seedPhrase":"oyster nice age favorite shed chapter smile cable lift scale glory knock","walletAddress":"0x448cd797689eEC4Ee7Ea80BC0B30775f8B1a2eec","message":"IMPORTANT: Write down these 12 words in order and keep them safe. They are the only way to recover your wallet."}}a@a:~/trustwallet$ curl "http://lcurl "http://localhost:5000/api/wallet/verify-challenge?walletAddress=0x448cd797689eEC4Ee7Ea80BC0B30775f8B1a2eec" -H "Content-Type: application/json" -b cookies.txt
{"success":true,"data":{"indices":[11,6,3],"options":["knocks","knock","nock","kock","smiles","sile","mile","smile","fvorite","favorites","favorite","avorite"]}}a@a:~/trustwallet$ curl -X POST "http://localhost:5000/api/wallet/curl -X POST "http://localhost:5000/api/wallet/verify-and-create" -H "Content-Type: application/json" -b cookies.txt -d '{"selectedWords": [{"index": 3, "word": "favorite"}, {"index": 6, "word": "smile"}, {"index": 11, "word": "knock"}]}'
{"success":true,"data":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDM3OGEyZjdiMDQ4OGI0MjhlOTlmMiIsIndhbGxldEFkZHJlc3MiOiIweDQ0OGNkNzk3Njg5ZWVjNGVlN2VhODBiYzBiMzA3NzVmOGIxYTJlZWMiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTA1Nzk1NSwiZXhwIjoxNzQ1MTQ0MzU1fQ.bKIdIHNmLt9VFfvjyey0XfjJ3uPi3qa_x6FWAYS9dUU","walletAddress":"0x448cd797689eec4ee7ea80bc0b30775f8b1a2eec","message":"Wallet created successfully"}}a@a:~/trustwallet$ 






















a@a:~/trustwallet$ curl "http://localhost:5000/api/wallet/" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDM3OGEyZjdiMDQ4OGI0MjhlOTlmMiIsIndhbGxldEFkZHJlc3MiOiIweDQ0OGNkNzk3Njg5ZWVjNGVlN2VhODBiYzBiMzA3NzVmOGIxYTJlZWMiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTA1Nzk1NSwiZXhwIjoxNzQ1MTQ0MzU1fQ.bKIdIHNmLt9VFfvjyey0XfjJ3uPi3qa_x6FWAYS9dUU" -H "Content-Type: application/json"
{"success":true,"data":{"wallets":[{"walletAddress":"0x448cd797689eec4ee7ea80bc0b30775f8b1a2eec","name":"Wallet 1","isDefault":true,"isVerified":false,"security":{"hasPin":false,"hasBiometrics":false,"lastAccessed":"2025-04-19T10:19:15.338Z"},"status":"active","createdAt":"2025-04-19T10:19:15.356Z","updatedAt":"2025-04-19T10:19:15.356Z"}]}}a@a:~/trustwallet$ 














a@a:~/trustwallet$ curl -X POST "http://localhost:5000/api/wallet/0x448cd797689eec4ee7ea80bc0b30775f8b1a2eec/security" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDM3OGEyZjdiMDQ4OGI0MjhlOTlmMiIsIndhbGxldEFkZHJlc3MiOiIweDQ0OGNkNzk3Njg5ZWVjNGVlN2VhODBiYzBiMzA3NzVmOGIxYTJlZWMiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTA1Nzk1NSwiZXhwIjoxNzQ1MTQ0MzU1fQ.bKIdIHNmLt9VFfvjyey0XfjJ3uPi3qa_x6FWAYS9dUU" \
  -H "Content-Type: application/json" \
  -d '{"pin": "123456", "enableBiometrics": false}'
{"success":true,"message":"Security settings updated successfully"}a@a:~/trustwallet$ 
























a@a:~/trustwallet$ curl -X POcurl -X POST "http://localhost:5000/api/wallet/import" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDM3OGEyZjdiMDQ4OGI0MjhlOTlmMiIsIndhbGxldEFkZHJlc3MiOiIweDQ0OGNkNzk3Njg5ZWVjNGVlN2VhODBiYzBiMzA3NzVmOGIxYTJlZWMiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTA1Nzk1NSwiZXhwIjoxNzQ1MTQ0MzU1fQ.bKIdIHNmLt9VFfvjyey0XfjJ3uPi3qa_x6FWAYS9dUU" -H "Content-Type: application/json" -d '{"seedPhrase": "oven point voyage cousin main remind morning test found kingdom foot fashion"}'
{"success":true,"data":{"walletAddress":"0xe4043c8dfc42679256c99ca2f4837f6905204248","message":"Wallet imported successfully"}}a@a:~/trustwallet$ 













a@a:~/trustwallet$ curl -X POST "http://localhost:5000/api/wallet/0x448cd797689eec4ee7ea80bc0b30775f8b1a2eec/logout" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDM3OGEyZjdiMDQ4OGI0MjhlOTlmMiIsIndhbGxldEFkZHJlc3MiOiIweDQ0OGNkNzk3Njg5ZWVjNGVlN2VhODBiYzBiMzA3NzVmOGIxYTJlZWMiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTA1Nzk1NSwiZXhwIjoxNzQ1MTQ0MzU1fQ.bKIdIHNmLt9VFfvjyey0XfjJ3uPi3qa_x6FWAYS9dUU" -H "Content-Type: application/json"
{"success":true,"message":"Wallet logged out successfully"}a@a:~/trustwallet$ 



















a@a:~/trustwallet$ curl -X POST http://localhost:5000/api/wallet/generate -H "Content-Type: application/json"
{"success":true,"data":{"seedPhrase":"enemy stay solid elbow brush fluid outdoor ankle genuine wheat run skull","walletAddress":"0xe8cb3f211ef0C12D94436D419A2AD1E19a15f323","message":"IMPORTANT: Write down these 12 words in order and keep them safe. They are the only way to recover your wallet."}}a@a:~/trustwallet$ 












a@a:~/trustwallet$ curl -X POST http://localhost:5000/api/wallet/verify -H "Content-Type: application/json" -d '{"seedPhrase": "enemy stay solid elbow brush fluid outdoor ankle genuine wheat run skull"}'
{"success":true,"data":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDM4Zjc1MDJkMGJmN2FkZjMxYWQzMyIsIndhbGxldEFkZHJlc3MiOiIweGU4Y2IzZjIxMWVmMGMxMmQ5NDQzNmQ0MTlhMmFkMWUxOWExNWYzMjMiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTA2MzgwMiwiZXhwIjoxNzQ1MTUwMjAyfQ.8fSbM_5SH8kQ8JlSh68yr5TtLzmbOGve-bKOhzwdMEw","walletAddress":"0xe8cb3f211ef0c12d94436d419a2ad1e19a15f323","message":"Wallet created successfully"}}a@a:~/trustwallet$ 








a@a:~/trustwallet$ curl -X POST http://localhost:5000/api/wallet/transfer -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDM5YWEyYzkzMTY5NzBlYzdlZGY0YSIsIndhbGxldEFkZHJlc3MiOiIweDZjZmQ4ZDI4NTgwYjRkNTNiY2E1OWY4OWQ3ZmFmMzI0YTI0N2U5ZWEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTA2NjY2NywiZXhwIjoxNzQ1MTUzMDY3fQ.qTmu4usBZu6a7inyCz2z2h0A1bGQb1TfNjhHF37qLA4" -d '{"toAddress": "0x1234567890abcdef1234567890abcdef12345678", "amount": 1.5, "symbol": "BTC"}'
{"success":true,"data":{"message":"Please contact our customer care team to process your withdrawal request. For security purposes, all withdrawals require administrative approval.","contactEmail":"customercare@trustwallet.com","emailSubject":"Withdrawal Request","requestDetails":{"fromAddress":"0x6cfd8d28580b4d53bca59f89d7faf324a247e9ea","toAddress":"0x1234567890abcdef1234567890abcdef12345678","amount":1.5,"symbol":"BTC","timestamp":"2025-04-19T13:01:59.897Z"}}}a@a:~/trustwallet$ 