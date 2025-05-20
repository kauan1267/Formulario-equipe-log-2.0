<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Formulário - Equipe LOG</title>
  <style>
    body {
      margin: 0;
      font-family: 'Segoe UI', sans-serif;
      background: black;
      color: white;
      overflow: hidden;
    }
    .slide, .form-container {
      display: none;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      padding: 30px;
      box-sizing: border-box;
    }
    .active {
      display: flex;
      flex-direction: column;
    }
    button {
      padding: 12px 24px;
      margin-top: 20px;
      font-size: 18px;
      background: #00ffcc;
      color: black;
      border: none;
      cursor: pointer;
      border-radius: 8px;
    }
    input, textarea {
      width: 80%;
      padding: 10px;
      margin-top: 15px;
      font-size: 16px;
      border-radius: 5px;
      border: none;
    }
  </style>
</head>
<body>

  <div class="slide active" id="slide1">
    <h1>📋 Formulário para a Equipe LOG</h1>
  </div>
  <div class="slide" id="slide2">
    <div>
      <h2>📜 Regras</h2>
      <p>- Você tem 12 minutos para preencher.<br>
         - Não pode voltar as perguntas.<br>
         - Não pode copiar nem colar.<br>
         - Só pode responder uma vez.<br>
      </p>
    </div>
  </div>
  <div class="slide" id="slide3">
    <button onclick="startForm()">🚀 Iniciar</button>
  </div>

  <div class="form-container" id="form-container"></div>

  <script>
    // Slides automáticos
    let slides = ["slide1", "slide2", "slide3"];
    let currentSlide = 0;
    let slideInterval = setInterval(() => {
      document.getElementById(slides[currentSlide]).classList.remove("active");
      currentSlide++;
      if (currentSlide < slides.length) {
        document.getElementById(slides[currentSlide]).classList.add("active");
      } else {
        clearInterval(slideInterval);
      }
    }, 3500);

    // Verifica se já respondeu
    if (localStorage.getItem("formulario_enviado_log") === "true") {
      document.body.innerHTML = "<h2 style='text-align:center;color:white;padding:20px;'>❌ Você já respondeu este formulário. Agradecemos sua participação.</h2>";
    }

    // Bloquear copiar/colar/cortar
    document.addEventListener('copy', e => e.preventDefault());
    document.addEventListener('paste', e => e.preventDefault());
    document.addEventListener('cut', e => e.preventDefault());

    const perguntas = [
      "1. Nome + ID Discord",
      "2. Qual seu horário disponível pra ajudar na log?",
      "3. Atua em alguma área da staff? Se sim, quais?",
      "4. Já teve experiência como Equipe. LOG? Se sim, me diga mais sobre.",
      "5. Pra que serve o comando hackperma? E quando ele deve ser usado?",
      "6. Em quais situações o propmanager seria ideal para achar hacker?",
      "7. Pra que serve o delobjs? E em quais situações seria necessário usá-lo?",
      "8. Pra que serve o forcedelete? E por que ele pode ser usado quando o delobjs não funcionar?",
      "9. Como você poderia achar o hack que usa função do mod menu pra falar alto?",
      "10. Se você banir um hacker e ele não for kikado da cidade, o que você poderia fazer?",
      "11. Se você ver um hacker zaralhando na cidade, o que você faria?",      
      "12. Se alguém te marcar num ticket falando que o dinheiro dele sumiu, o que você faria?"
      "13. Está ciente que se entrar pra log, você terá uma meta semanal de 50 banimentos? (Sim ou Não)"
    ];

    let respostas = {};
    let perguntaAtual = 0;

    function startForm() {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.getElementById('form-container').classList.add('active');
      mostrarPergunta();

      setTimeout(() => {
        alert("⏱ Tempo esgotado! Você não pode mais responder o formulário.");
        document.getElementById("form-container").innerHTML = "<h2>⏱ Tempo esgotado! Formulário encerrado.</h2>";
      }, 12 * 60 * 1000); // 12 minutos
    }

    function mostrarPergunta() {
      const container = document.getElementById("form-container");
      container.innerHTML = `
        <h2>${perguntas[perguntaAtual]}</h2>
        <textarea id="resposta" rows="5"></textarea><br>
        <button onclick="proximaPergunta()">Próxima</button>
      `;
    }

    function proximaPergunta() {
      const resp = document.getElementById("resposta").value;
      respostas[perguntas[perguntaAtual]] = resp;
      perguntaAtual++;
      if (perguntaAtual < perguntas.length) {
        mostrarPergunta();
      } else {
        enviarParaWebhook(respostas);
        document.getElementById("form-container").innerHTML = "<h2>✅ Formulário enviado com sucesso! Obrigado.</h2>";
        localStorage.setItem("formulario_enviado_log", "true");
      }
    }

    function enviarParaWebhook(respostas) {
      const fields = Object.entries(respostas).map(([pergunta, resposta]) => ({
        name: pergunta,
        value: resposta || "Sem resposta",
        inline: false
      }));

      const payload = {
        embeds: [{
          title: "📨 Nova Resposta - Formulário Equipe LOG",
          color: 3447003,
          fields: fields,
          timestamp: new Date()
        }]
      };

      fetch("https://discord.com/api/webhooks/1374172908804374639/vjh2jNdi4AwfVHcUljAznB2P_hEZDNplrpUK80CiOpnqXXzmbq4rlN1vY9pqZvk7EGxs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }
  </script>
</body>
</html>
