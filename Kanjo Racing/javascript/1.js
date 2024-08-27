// Define um objeto global `HUB_EVENTS` no escopo da janela (window), contendo eventos do sistema.
window.HUB_EVENTS = {
    // Eventos relacionados a ativos
    ASSET_ADDED: "ASSET_ADDED",
    ASSET_DELETED: "ASSET_DELETED",
    ASSET_DESELECTED: "ASSET_DESELECTED",
    ASSET_SELECTED: "ASSET_SELECTED",
    ASSET_UPDATED: "ASSET_UPDATED",
    
    // Eventos relacionados ao console
    CONSOLE_CHANGE: "CONSOLE_CHANGE",
    CONSOLE_CLOSED: "CONSOLE_CLOSED",
    CONSOLE_EVENT: "CONSOLE_EVENT",
    CONSOLE_OPENED: "CONSOLE_OPENED",
    CONSOLE_RUN_COMMAND: "CONSOLE_RUN_COMMAND",
    CONSOLE_SERVER_CHANGE: "CONSOLE_SERVER_CHANGE",
    
    // Eventos relacionados ao embed
    EMBED_ACTIVE_PEN_CHANGE: "EMBED_ACTIVE_PEN_CHANGE",
    EMBED_ACTIVE_THEME_CHANGE: "EMBED_ACTIVE_THEME_CHANGE",
    EMBED_ATTRIBUTE_CHANGE: "EMBED_ATTRIBUTE_CHANGE",
    EMBED_RESHOWN: "EMBED_RESHOWN",
    
    // Eventos relacionados ao formato
    FORMAT_FINISH: "FORMAT_FINISH",
    FORMAT_ERROR: "FORMAT_ERROR",
    FORMAT_START: "FORMAT_START",
    
    // Eventos relacionados ao iframe de visualização
    IFRAME_PREVIEW_RELOAD_CSS: "IFRAME_PREVIEW_RELOAD_CSS",
    IFRAME_PREVIEW_URL_CHANGE: "IFRAME_PREVIEW_URL_CHANGE",
    
    // Eventos de teclado
    KEY_PRESS: "KEY_PRESS",
    
    // Eventos do linter
    LINTER_FINISH: "LINTER_FINISH",
    LINTER_START: "LINTER_START",
    
    // Eventos relacionados ao Pen
    PEN_CHANGE_SERVER: "PEN_CHANGE_SERVER",
    PEN_CHANGE: "PEN_CHANGE",
    PEN_EDITOR_CLOSE: "PEN_EDITOR_CLOSE",
    PEN_EDITOR_CODE_FOLD: "PEN_EDITOR_CODE_FOLD",
    PEN_EDITOR_ERRORS: "PEN_EDITOR_ERRORS",
    PEN_EDITOR_EXPAND: "PEN_EDITOR_EXPAND",
    PEN_EDITOR_FOLD_ALL: "PEN_EDITOR_FOLD_ALL",
    PEN_EDITOR_LOADED: "PEN_EDITOR_LOADED",
    PEN_EDITOR_REFRESH_REQUEST: "PEN_EDITOR_REFRESH_REQUEST",
    PEN_EDITOR_RESET_SIZES: "PEN_EDITOR_RESET_SIZES",
    PEN_EDITOR_SIZES_CHANGE: "PEN_EDITOR_SIZES_CHANGE",
    PEN_EDITOR_UI_CHANGE_SERVER: "PEN_EDITOR_UI_CHANGE_SERVER",
    PEN_EDITOR_UI_CHANGE: "PEN_EDITOR_UI_CHANGE",
    PEN_EDITOR_UI_DISABLE: "PEN_EDITOR_UI_DISABLE",
    PEN_EDITOR_UI_ENABLE: "PEN_EDITOR_UI_ENABLE",
    PEN_EDITOR_UNFOLD_ALL: "PEN_EDITOR_UNFOLD_ALL",
    PEN_ERROR_INFINITE_LOOP: "PEN_ERROR_INFINITE_LOOP",
    PEN_ERROR_RUNTIME: "PEN_ERROR_RUNTIME",
    PEN_ERRORS: "PEN_ERRORS",
    PEN_LIVE_CHANGE: "PEN_LIVE_CHANGE",
    PEN_LOGS: "PEN_LOGS",
    PEN_MANIFEST_CHANGE: "PEN_MANIFEST_CHANGE",
    PEN_MANIFEST_FULL: "PEN_MANIFEST_FULL",
    PEN_PREVIEW_FINISH: "PEN_PREVIEW_FINISH",
    PEN_PREVIEW_START: "PEN_PREVIEW_START",
    PEN_SAVED: "PEN_SAVED",
    
    // Eventos relacionados a popups
    POPUP_CLOSE: "POPUP_CLOSE",
    POPUP_OPEN: "POPUP_OPEN",
    
    // Eventos relacionados a posts
    POST_CHANGE: "POST_CHANGE",
    POST_SAVED: "POST_SAVED",
    
    // Eventos de processamento
    PROCESSING_FINISH: "PROCESSING_FINISH",
    PROCESSING_START: "PROCESSING_START"
  };
  
  // Verifica se `window.CP` não é um objeto e, se não for, inicializa-o como um objeto vazio.
  if ("object" != typeof window.CP) {
    window.CP = {};
  }
  
  // Define um objeto `PenTimer` dentro de `window.CP` para monitoramento de loops e proteção contra loops infinitos.
  window.CP.PenTimer = {
    programNoLongerBeingMonitored: false, // Flag para indicar se o programa não está mais sendo monitorado.
    timeOfFirstCallToShouldStopLoop: 0, // Armazena o tempo da primeira chamada da função `shouldStopLoop`.
    _loopExits: {}, // Armazena se um loop foi encerrado.
    _loopTimers: {}, // Armazena os tempos de início dos loops.
    START_MONITORING_AFTER: 2000, // Tempo para começar o monitoramento após o início do loop (em milissegundos).
    STOP_ALL_MONITORING_TIMEOUT: 5000, // Tempo máximo para monitorar o loop antes de parar o monitoramento (em milissegundos).
    MAX_TIME_IN_LOOP_WO_EXIT: 2200, // Tempo máximo permitido em um loop sem saída (em milissegundos).
    
    // Marca um loop como encerrado.
    exitedLoop: function (loopId) {
      this._loopExits[loopId] = true;
    },
    
    // Verifica se o loop deve ser interrompido.
    shouldStopLoop: function (loopId) {
      if (this.programKilledSoStopMonitoring) return true;
      if (this.programNoLongerBeingMonitored) return false;
      if (this._loopExits[loopId]) return false;
      
      var currentTime = this._getTime();
      
      if (this.timeOfFirstCallToShouldStopLoop === 0) {
        this.timeOfFirstCallToShouldStopLoop = currentTime;
        return false;
      }
      
      var elapsedTime = currentTime - this.timeOfFirstCallToShouldStopLoop;
      
      if (elapsedTime < this.START_MONITORING_AFTER) return false;
      if (elapsedTime > this.STOP_ALL_MONITORING_TIMEOUT) {
        this.programNoLongerBeingMonitored = true;
        return false;
      }
      
      try {
        this._checkOnInfiniteLoop(loopId, currentTime);
      } catch (e) {
        this._sendErrorMessageToEditor();
        this.programKilledSoStopMonitoring = true;
        return true;
      }
      
      return false;
    },
    
    // Envia uma mensagem de erro para o editor se houver um loop infinito.
    _sendErrorMessageToEditor: function () {
      try {
        if (this._shouldPostMessage()) {
          var message = {
            topic: HUB_EVENTS.PEN_ERROR_INFINITE_LOOP,
            data: {
              line: this._findAroundLineNumber()
            }
          };
          parent.postMessage(message, "*");
        } else {
          this._throwAnErrorToStopPen();
        }
      } catch (e) {
        this._throwAnErrorToStopPen();
      }
    },
    
    // Verifica se a mensagem deve ser enviada para o editor.
    _shouldPostMessage: function () {
      return document.location.href.match(/boomboom/);
    },
    
    // Lança um erro para parar a execução do Pen.
    _throwAnErrorToStopPen: function () {
      throw "We found an infinite loop in your Pen. We've stopped the Pen from running. More details and workarounds at https://blog.codepen.io/2016/06/08/can-adjust-infinite-loop-protection-timing/";
    },
    
    // Encontra o número da linha onde o erro ocorreu.
    _findAroundLineNumber: function () {
      var error = new Error();
      var lineNumber = 0;
      if (error.stack) {
        var match = error.stack.match(/boomboom\S+:(\d+):\d+/);
        match && (lineNumber = match[1]);
      }
      return lineNumber;
    },
    
    // Verifica se um loop é infinito.
    _checkOnInfiniteLoop: function (loopId, currentTime) {
      if (!this._loopTimers[loopId]) {
        this._loopTimers[loopId] = currentTime;
        return false;
      }
      
      if (currentTime - this._loopTimers[loopId] > this.MAX_TIME_IN_LOOP_WO_EXIT) {
        throw "Infinite Loop found on loop: " + loopId;
      }
    },
    
    // Retorna o tempo atual.
    _getTime: function () {
      return +new Date();
    }
  };
  
  // Define a função `shouldStopExecution` para verificar se a execução do código deve ser parada.
  window.CP.shouldStopExecution = function (loopId) {
    var shouldStop = window.CP.PenTimer.shouldStopLoop(loopId);
    if (shouldStop) {
      console.warn("[CodePen]: An infinite loop (or a loop taking too long) was detected, so we stopped its execution. More details at https://blog.codepen.io/2016/06/08/can-adjust-infinite-loop-protection-timing/");
    }
    return shouldStop;
  };
  
  // Define a função `exitedLoop` para marcar um loop como encerrado.
  window.CP.exitedLoop = function (loopId) {
    window.CP.PenTimer.exitedLoop(loopId);
  };
  