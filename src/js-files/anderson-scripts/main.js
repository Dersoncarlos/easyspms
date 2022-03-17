(function () {
  /**
   *******************************
   * ADICIONA A CLASSE "hasText" PARA USO DO DICIONÁRIO
   *******************************
   */

  //Adiciona classe "hasText" em todos os elementos da pagina que contem texto
  var nodes = document.evaluate(
    ".//*[normalize-space(text())]",
    document,
    null,
    XPathResult.ANY_TYPE,
    null
  );

  var textElements = [];

  var nextNode = nodes.iterateNext();

  while (!!nextNode) {
    textElements.push(nextNode);
    nextNode = nodes.iterateNext();
  }

  for (var element of textElements) {
    element.classList.add("hasText");
  }

  textElements.forEach((textElement) => {
    var childWithSameClass = textElement.querySelectorAll(".hasText");

    if (!!childWithSameClass.length) {
      textElement.childNodes.forEach((childElem, index) => {
        if (
          childElem.nodeType === 3 &&
          !!childElem.data.replace(/\r?\n|\r/, "").trim()
        ) {
          let span = document.createElement("span");

          span.classList.add("hasText");

          span.innerHTML = childElem.data;

          textElement.insertBefore(span, textElement.childNodes[index]);

          childElem.remove();
        }
      });

      textElement.classList.remove("hasText");
    }
  });

  /**
   *******************************
   * FIM ADICIONA "hasText"
   *******************************
   */

  /**
   *******************************
   * COMEÇA DICIONÁRIO
   *******************************
   */

  var btnDicio = document.getElementById("btnDicio");

  //Recupera todos os elementos com a classe "hasText" para o dicionário encontrar as palavras
  var allTexts = document.querySelectorAll(".hasText");

  /**
   * Adiciona separa frase em palavras, e adiciona o a tag "diciotext", após isso escuta eventos de "mouseenter" e "mouseleve" nas palavras
   * @param {MouseEvent} event
   */
  function _diciohandleMouseEnter(event) {
    event.target.innerHTML = event.target.innerText.replace(
      /([a-zA-Zà-úÀ-Ú]+)/g,
      "<diciotext class='dicioTooltip'>$1</diciotext>"
    );

    var words = event.target.getElementsByTagName("diciotext");
    var spanElement = document.createElement("span");
    var dicioTootipBox = document.getElementById("dicioTootipBox");

    for (const word of words) {
      //FAZENDO
      // word.addEventListener("mousemove", (evt) => {
      //   dicioTootipBox.style.display = "block";
      //   dicioTootipBox.style.color = "white";
      //   dicioTootipBox.style.top = `${evt.y}px`;
      //   dicioTootipBox.style.left = `${evt.x}px`;

      // });

      word.addEventListener("mouseenter", (wordEvent) => {
        spanElement.classList.add("dicioTooltipText");
        spanElement.innerHTML = "Procurando siginificado...";

        _fetchMeaning(
          wordEvent.target,
          wordEvent.target.innerText,
          spanElement
        );
        wordEvent.target.style.backgroundColor = "red";
      });
      word.addEventListener("mouseleave", (wordEvent) => {
        wordEvent.target.removeChild(spanElement);
        wordEvent.target.style.backgroundColor = "";
      });
    }
  }

  /**
   * Procura sigificado da palavra
   * @param {EventTarget} wordElement
   * @param {String} wordText
   * @param {HTMLElement} wordText
   */
  function _fetchMeaning(wordElement, wordText, spanElement) {
    wordElement.appendChild(spanElement);
    fetch(
      `https://significado.herokuapp.com/meanings/${wordText
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()}`
    ).then((response) => {
      response
        .json()
        .then((jsonResponse) => {
          if (!!jsonResponse.length) {
            const meanings = jsonResponse[0].meanings.join("<br>");
            spanElement.innerHTML = meanings;
          } else {
            spanElement.innerHTML = "Siginificado não foi localizado.";
          }
        })
        .catch((err) => {
          console.log(err);
          spanElement.innerHTML = "Siginificado não foi localizado.";
        });
    });
  }

  /**
   * Retorna frase ao seu ponto inicial.
   * @param {MouseEvent} event
   */
  function _dicioHandleMouseLeave(event) {
    event.target.innerHTML = event.target.innerText;
  }

  /**
   * Habilita evento "mouseenter" ao ativar o dicionário.
   */
  function _dicioEnableOnHoverText() {
    for (const text of allTexts) {
      text.addEventListener("mouseenter", _diciohandleMouseEnter);
      text.addEventListener("mouseleave", _dicioHandleMouseLeave);
    }
  }

  /**
   * Desabilita evento "mouseenter" ao desativar o dicionário.
   */
  function _dicioDisableOnHoverText() {
    for (const text of allTexts) {
      text.removeEventListener("mouseenter", _diciohandleMouseEnter);
    }
  }

  /**
   * Função para ativar ou desativar o dicionário.
   * @param {MouseEvent} btnElem
   */
  function _toogleDicio(e) {
    e.preventDefault();

    if (btnDicio.classList.contains("btn-outline-primary")) {
      _dicioEnableOnHoverText();
      btnDicio.classList.remove("btn-outline-primary");
      btnDicio.classList.add("btn-primary");
      btnDicio.innerText = "Desativar Dicionário";
    } else {
      _dicioDisableOnHoverText();
      btnDicio.classList.remove("btn-primary");
      btnDicio.classList.add("btn-outline-primary");
      btnDicio.innerText = "Ativar Dicionário";
    }

    btnDicio.blur();
  }

  /**
   * Escuta evento "click" para ativa ou desativar o dicionário
   */
  btnDicio.addEventListener("click", _toogleDicio);

  /**
   ********************************
   * FINALIZA DICIONÁRIO
   ********************************
   */

  /**
   *******************************
   * COMEÇA TRADUTOR
   *******************************
   */

  //OBS: Tradutor é iniciado no arquivo "custom_translate.js";

  var comboBoxLanguages = document.getElementById("comboBoxLanguages");

  var resetTranslate = document.getElementById("resetTranslate");

  function _handleRestoreLanguage() {
    restoreLanguage();
    resetTranslate.style.display = "none";
    comboBoxLanguages.value = "";
  }
  //Escuta evento do combobox do tradutor
  comboBoxLanguages.addEventListener("change", (event) => {
    if (!!event.target.value) {
      changeLanguage(event.target.value);
      resetTranslate.style.display = "block";
    } else {
      _handleRestoreLanguage();
    }
  });

  resetTranslate.addEventListener("click", _handleRestoreLanguage);

  /**
   ******************************
   * FINALIZA TRADUTOR
   ******************************
   */

  /**
   ******************************
   * REPRODUTOR DE IMAGENS
   ******************************
   */

  var btnSpeaker = document.getElementById("btnSpeaker");
  var allImages = document.getElementsByTagName("img");
  var speaker = new SpeechSynthesisUtterance();

  /**
   * Reproduz "alt" ao clicar na imagem
   * @param {MouseEvent} event
   */
  function _imageOnClick(event) {
    var image = event.target;
    speaker.lang = "pt-BR";
    speaker.text = "Imagem sem descrição";

    if (!!image.alt) {
      speaker.text = image.alt;
    }
    speechSynthesis.speak(speaker);
  }

  /**
   * Ativa evento para reproduzir
   */
  function _enableImageSpeaker() {
    for (const image of allImages) {
      image.addEventListener("click", _imageOnClick);
    }
  }

  /**
   * Desativa evento do reprodutor
   */
  function _disableImageSpeaker() {
    for (const image of allImages) {
      image.removeEventListener("click", _imageOnClick);
    }
  }

  /**
   * Alterna entre Ativado/Desativado o reprodutor da imagem
   * @param {MouseEvent} e
   */
  function _toogleImageSpeaker(e) {
    e.preventDefault();

    if (btnSpeaker.classList.contains("btn-outline-primary")) {
      _enableImageSpeaker();
      btnSpeaker.classList.remove("btn-outline-primary");
      btnSpeaker.classList.add("btn-primary");
      btnSpeaker.innerText = "Desativar reprodutor de imagem";
    } else {
      _disableImageSpeaker();
      btnSpeaker.classList.remove("btn-primary");
      btnSpeaker.classList.add("btn-outline-primary");
      btnSpeaker.innerText = "Ativar reprodutor de imagem";
    }

    btnSpeaker.blur();
  }

  btnSpeaker.addEventListener("click", _toogleImageSpeaker);

  /**
   ******************************
   * FINALIZA REPRODUTOR DE IMAGENS
   ******************************
   */
})();
