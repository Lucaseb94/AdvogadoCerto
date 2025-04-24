document.addEventListener("DOMContentLoaded", function () {
    const cadastroForm = document.getElementById("cadastroForm");
    const telefoneInput = document.getElementById("telefone");
    const submitButton = cadastroForm.querySelector("button[type='submit']");
  
    // a) Permitir apenas dígitos enquanto o usuário digita (limite 11 dígitos para DDD + número sem formatação)
    telefoneInput.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "").slice(0, 11);
    });
  
    // b) Função para formatar o telefone: adiciona "+55" no início se necessário
    function formatarTelefone(telefone) {
      let somenteNumeros = telefone.replace(/\D/g, "");
      if (somenteNumeros.startsWith("55")) {
        return `+${somenteNumeros}`;
      }
      return `+55${somenteNumeros}`;
    }
  
    // c) Função para validar o telefone no padrão:
    // Deve ficar no formato "+55" + DDD (2 dígitos) + número (9 dígitos) = total de 14 caracteres.
    function telefoneValido(telefone) {
      if (!telefone.startsWith("+55")) return false;
      const numeros = telefone.substring(1); // Remove o '+' para contar apenas os dígitos.
      return numeros.length === 13;
    }
  
    // d) Tratamento do envio do formulário (captura os dados, valida e envia via fetch)
    cadastroForm.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      // Coleta dos dados do formulário
      const formData = new FormData(cadastroForm);
      const telefoneRaw = formData.get("telefone").trim();
      const telefoneFormatado = formatarTelefone(telefoneRaw);
  
      const data = {
        nome: formData.get("nome").trim(),
        email: formData.get("email").trim(),
        telefone: telefoneFormatado,
        endereco: formData.get("endereco").trim(),
        regiao: formData.get("regiao").trim(),
        areaInteresse: formData.get("areaInteresse").trim()
      };
  
      console.log("Telefone formatado:", telefoneFormatado);
      console.log("Comprimento telefone:", telefoneFormatado.length);
      console.log("Dados do cadastro:", data);
  
      // Validação simples (verifica se todos os campos estão preenchidos e se o telefone é válido)
      if (
        !data.nome ||
        !data.email ||
        !telefoneValido(data.telefone) ||
        !data.endereco ||
        !data.regiao ||
        !data.areaInteresse
      ) {
        alert("Preencha todos os campos corretamente.\nO telefone deve estar no formato: +55 + DDD (2 dígitos) + 9 dígitos.");
        return;
      }
  
      // Feedback visual: desabilitar o botão de envio
      submitButton.disabled = true;
      submitButton.textContent = "Enviando...";
  
      try {
        const response = await fetch("https://leads-api-gigb.onrender.com/api/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
      
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
      
        const resultado = await response.json();
        alert("Cadastro realizado com sucesso, em breve um profissional da área entrará em contato com você");
        cadastroForm.reset();
        // Redireciona para a página home
        window.location.href = "index.html";
      } catch (error) {
        console.error("Erro ao enviar o cadastro:", error);
        alert("Ocorreu um erro ao enviar o cadastro. Por favor, tente novamente.");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Enviar Cadastro";
      }
    })})      