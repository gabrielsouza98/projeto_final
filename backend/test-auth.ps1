# Script de teste de autenticação

Write-Host "🧪 TESTANDO AUTENTICAÇÃO - EventSync AI`n" -ForegroundColor Cyan

# Teste 1: Health Check
Write-Host "TESTE 1: Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing
    Write-Host "✅ Servidor está rodando!`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Servidor não está rodando. Execute: npm run dev`n" -ForegroundColor Red
    exit 1
}

# Teste 2: Registrar usuário
Write-Host "TESTE 2: Registrar novo usuário..." -ForegroundColor Yellow
$registerBody = @{
    nome = "João Silva"
    email = "joao@test.com"
    senha = "senha123"
    cidade = "São Paulo"
} | ConvertTo-Json

try {
    $register = Invoke-WebRequest -Uri "http://localhost:3000/auth/register" `
        -Method POST `
        -Body $registerBody `
        -ContentType "application/json" `
        -UseBasicParsing
    
    $registerData = $register.Content | ConvertFrom-Json
    Write-Host "✅ Registro bem-sucedido!" -ForegroundColor Green
    Write-Host "   Usuário ID: $($registerData.usuario.id)"
    Write-Host "   Nome: $($registerData.usuario.nome)"
    Write-Host "   Email: $($registerData.usuario.email)"
    Write-Host "   Token: $($registerData.token.Substring(0, 30))...`n"
    
    $token = $registerData.token
} catch {
    Write-Host "❌ Erro no registro: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Resposta: $responseBody`n" -ForegroundColor Red
    }
    exit 1
}

# Teste 3: Login
Write-Host "TESTE 3: Login com mesmo usuário..." -ForegroundColor Yellow
$loginBody = @{
    email = "joao@test.com"
    senha = "senha123"
} | ConvertTo-Json

try {
    $login = Invoke-WebRequest -Uri "http://localhost:3000/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json" `
        -UseBasicParsing
    
    $loginData = $login.Content | ConvertFrom-Json
    Write-Host "✅ Login bem-sucedido!" -ForegroundColor Green
    Write-Host "   Token recebido: $($loginData.token.Substring(0, 30))...`n"
    
    $token = $loginData.token
} catch {
    Write-Host "❌ Erro no login: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Resposta: $responseBody`n" -ForegroundColor Red
    }
    exit 1
}

# Teste 4: Obter dados do usuário (rota protegida)
Write-Host "TESTE 4: Obter dados do usuário (rota protegida)..." -ForegroundColor Yellow
$headers = @{
    Authorization = "Bearer $token"
}

try {
    $me = Invoke-WebRequest -Uri "http://localhost:3000/auth/me" `
        -Headers $headers `
        -UseBasicParsing
    
    $meData = $me.Content | ConvertFrom-Json
    Write-Host "✅ Dados do usuário obtidos!" -ForegroundColor Green
    Write-Host "   ID: $($meData.id)"
    Write-Host "   Nome: $($meData.nome)"
    Write-Host "   Email: $($meData.email)"
    Write-Host "   Cidade: $($meData.cidade)"
    Write-Host "   Role: $($meData.role)`n"
} catch {
    Write-Host "❌ Erro ao obter dados: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Resposta: $responseBody`n" -ForegroundColor Red
    }
    exit 1
}

# Teste 5: Tentar registrar com email duplicado
Write-Host "TESTE 5: Tentar registrar com email duplicado (deve falhar)..." -ForegroundColor Yellow
try {
    $duplicate = Invoke-WebRequest -Uri "http://localhost:3000/auth/register" `
        -Method POST `
        -Body $registerBody `
        -ContentType "application/json" `
        -UseBasicParsing
    
    Write-Host "❌ ERRO: Deveria ter falhado!" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400) {
        Write-Host "✅ Erro esperado retornado (email já existe)`n" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Status code inesperado: $statusCode`n" -ForegroundColor Yellow
    }
}

# Teste 6: Login com senha incorreta
Write-Host "TESTE 6: Login com senha incorreta (deve falhar)..." -ForegroundColor Yellow
$wrongPasswordBody = @{
    email = "joao@test.com"
    senha = "senhaerrada"
} | ConvertTo-Json

try {
    $wrongLogin = Invoke-WebRequest -Uri "http://localhost:3000/auth/login" `
        -Method POST `
        -Body $wrongPasswordBody `
        -ContentType "application/json" `
        -UseBasicParsing
    
    Write-Host "❌ ERRO: Deveria ter falhado!" -ForegroundColor Red
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401) {
        Write-Host "✅ Erro esperado retornado (senha incorreta)`n" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Status code inesperado: $statusCode`n" -ForegroundColor Yellow
    }
}

Write-Host "🎉 TODOS OS TESTES CONCLUÍDOS!`n" -ForegroundColor Cyan



