# Teste simples de autenticação

Write-Host "`n🧪 TESTE DE AUTENTICAÇÃO`n" -ForegroundColor Cyan

# Teste 1: Health
Write-Host "1. Health Check..." -ForegroundColor Yellow
try {
    $h = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing
    Write-Host "   ✅ OK`n" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Erro`n" -ForegroundColor Red
    exit
}

# Teste 2: Registrar
Write-Host "2. Registrar usuário..." -ForegroundColor Yellow
$body = '{"nome":"Teste User","email":"teste@test.com","senha":"senha123"}'
try {
    $r = Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "   ✅ OK - ID: $($r.usuario.id.Substring(0,8))..." -ForegroundColor Green
    Write-Host "   Token: $($r.token.Substring(0,30))...`n" -ForegroundColor Gray
    $token = $r.token
} catch {
    Write-Host "   ❌ Erro: $($_.ErrorDetails.Message)`n" -ForegroundColor Red
    $token = $null
}

# Teste 3: Login
Write-Host "3. Login..." -ForegroundColor Yellow
$loginBody = '{"email":"teste@test.com","senha":"senha123"}'
try {
    $l = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "   ✅ OK - Usuário: $($l.usuario.nome)`n" -ForegroundColor Green
    $token = $l.token
} catch {
    Write-Host "   ❌ Erro: $($_.ErrorDetails.Message)`n" -ForegroundColor Red
}

# Teste 4: /auth/me
if ($token) {
    Write-Host "4. /auth/me (protegida)..." -ForegroundColor Yellow
    $headers = @{ Authorization = "Bearer $token" }
    try {
        $m = Invoke-RestMethod -Uri "http://localhost:3000/auth/me" -Headers $headers
        Write-Host "   ✅ OK - Nome: $($m.nome), Email: $($m.email)`n" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Erro: $($_.ErrorDetails.Message)`n" -ForegroundColor Red
    }
}

Write-Host "🎉 Testes concluídos!`n" -ForegroundColor Cyan









