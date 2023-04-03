console.log('[Mi-le-na] Flappy Mario');

let frames = 0;
const som_hit = new Audio();
som_hit.src = './efeitos/hit.wav';

const music = new Audio();
music.src = './theme.mp3';

const sprites = new Image();
sprites.src = './spritess.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


// [Plano de Fundo]
const planodefundo = {
  spritex: 390,
  spritey: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 290,
  desenha() {
    contexto.fillStyle = '#fae5bd';
    contexto.fillRect(0, 0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planodefundo.spritex, planodefundo.spritey,
      planodefundo.largura, planodefundo.altura,
      planodefundo.x, planodefundo.y,
      planodefundo.largura, planodefundo.altura,
    );
    contexto.drawImage(
      sprites,
      planodefundo.spritex, planodefundo.spritey,
      planodefundo.largura, planodefundo.altura,
      (planodefundo.x + planodefundo.largura), planodefundo.y,
      planodefundo.largura, planodefundo.altura,
    );
  },
};

// [Chao]
function criachao() {
  const chao = {
    spritex: 0,
    spritey: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza() {
      const movimentodochao = 1;
      const repeteem = chao.largura / 2;
      const movimentacao = chao.x - movimentodochao;

      //console.log('chao.x', chao.x);
      //console.log('repeteem', repeteem);
      //console.log('movimentacao', movimentacao % tepeteem);

      chao.x = movimentacao % repeteem;
    },
    desenha() {
      contexto.drawImage(
        sprites,
        chao.spritex, chao.spritey,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura,
      );

      contexto.drawImage(
        sprites,
        chao.spritex, chao.spritey,
        chao.largura, chao.altura,
        (chao.x + chao.largura), chao.y,
        chao.largura, chao.altura,
      );
    },
  };
  return chao;
}
function fazcolisao(flappybird, chao) {
  const flappybirdy = flappybird.y + flappybird.altura;
  const chaoy = chao.y;

  if (flappybirdy >= chaoy) {
    return true;

  }
  return false;
}
function criaflappybird() {
  const flappybird = {
    spritex: 0,
    spritey: 0,
    largura: 26,
    altura: 29,
    x: 10,
    y: 50,
    pulo: 4.6,
    pula() {
      console.log('devo pular');
      console.log('[antes]', flappybird.velocidade);
      flappybird.velocidade =  - flappybird.pulo;
      console.log('[depois]', flappybird.velocidade);
    },
    gravidade: 0.25,
    velocidade: 0,
    atualiza() {
      if(fazcolisao(flappybird, globais.chao)) {
        console.log('Fez colisao');
        som_hit.play();
        mudaparatela(telas.game_over);
        return;
      }
  
      flappybird.velocidade = flappybird.velocidade + flappybird.gravidade;
      flappybird.y = flappybird.y + flappybird.velocidade;
    },
    movimentos: [
      { spritex: 0, spritey: 0, }, // asa pra cima
      { spritex: 31, spritey: 0, }, // asa no meio 
      { spritex: 62, spritey: 0, }, // asa pra baixo
      { spritex: 31, spritey: 0, }, // asa no meio
    ],
    frameatual: 0,
    atualizaoframeatual() {
      const intervalodeframes = 10;
      const passouointervalo = frames % intervalodeframes === 0;
      //console.log('passouointervalo', passouointervalo)

      if (passouointervalo) {
        const basedoincremento = 1;
        const incremento = basedoincremento + flappybird.frameatual;
        const baserepeticao = flappybird.movimentos.length;
        flappybird.frameatual = incremento % baserepeticao
      }
    },
    desenha() {
      flappybird.atualizaoframeatual();
      const { spritex, spritey } = flappybird.movimentos[flappybird.frameatual];

      contexto.drawImage(
        sprites,
        spritex, spritey, // Sprite X, Sprite Y
        flappybird.largura, flappybird.altura, // Tamanho do recorte na sprite
        flappybird.x, flappybird.y,
        flappybird.largura, flappybird.altura,
      );
    }
  }
  return flappybird;
}
const mensagemGetReady = {
  sx: 134,
  sy: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.sx, mensagemGetReady.sy,
      mensagemGetReady.w, mensagemGetReady.h,
      mensagemGetReady.x, mensagemGetReady.y,
      mensagemGetReady.w, mensagemGetReady.h
    );
  }
}
const mensagemgameover = {
  sx: 134,
  sy: 152,
  w: 226,
  h: 200,
  x: (canvas.width / 2) - 226 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemgameover.sx, mensagemgameover.sy,
      mensagemgameover.w, mensagemgameover.h,
      mensagemgameover.x, mensagemgameover.y,
      mensagemgameover.w, mensagemgameover.h,
    );
  }
}
//canos

function criacanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spritex: 0,
      spritey: 169,
    },
    ceu: {
      spritex: 52,
      spritey: 169,
    },
    espaco: 80,
    desenha() {
      canos.pares.forEach(function (par) {
        const yrandom = par.y;
        const espacamentoentrecanos = 90;

        const canoceux = par.x;
        const canoceuy = yrandom;

        // cano do céu
        contexto.drawImage(
          sprites,
          canos.ceu.spritex, canos.ceu.spritey,
          canos.largura, canos.altura,
          canoceux, canoceuy,
          canos.largura, canos.altura,
        )
        // cano do chão
        const canochaox = par.x;
        const canochaoy = canos.altura + espacamentoentrecanos + yrandom;
        contexto.drawImage(
          sprites,
          canos.chao.spritex, canos.chao.spritey,
          canos.largura, canos.altura,
          canochaox, canochaoy,
          canos.largura, canos.altura,
        )

        par.canoceu = {
          x: canoceux,
          y: canos.altura + canoceuy
        }
        par.canochao = {
          x: canochaox,
          y: canochaoy
        }
      })
    },
    temcolisaocomoflappybird(par) {
      const cabecadoflappy = globais.flappybird.y;
      const pedoflappy = globais.flappybird.y + globais.flappybird.altura;

      if ((globais.flappybird.x + globais.flappybird.largura) >= par.x) {
        if (cabecadoflappy <= par.canoceu.y) {
          return true;
        }

        if (pedoflappy >= par.canochao.y) {
          return true;
        }
      }
      return false;
    },
    pares: [],
    atualiza() {
      const passou100frames = frames % 100 === 0;
      if (passou100frames) {
        console.log('Passou 100 frames');
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }



      canos.pares.forEach(function (par) {
        par.x = par.x - 2;

        if (canos.temcolisaocomoflappybird(par)) {
          console.log('Você perdeu!')
          som_hit.play();
          mudaparatela(telas.game_over);
        }

        if (par.x + canos.largura <= 0) {
          canos.pares.shift();
        }
      });

    }
  }

  return canos;
}

function criaplacar() {
  const placar = {
    pontuacao: 0,
    desenha() {
      contexto.font = '35px "VT323"';
      contexto.textAlign = 'right';
      contexto.fillStyle = 'white';
      contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);
    },
    atualiza() {
      const intervalodeframes = 20;
      const passouointervalo = frames % intervalodeframes === 0;

      if (passouointervalo) {
        placar.pontuacao = placar.pontuacao + 1;
      }
    }
  }
  return placar;
}


// telas
const globais = {};
let telaativa = {};
function mudaparatela(novatela) {
  telaativa = novatela;

  if (telaativa.inicializa) {
    music.currentTime = 0;
    music.play();
    telaativa.inicializa();

  }
}
const telas = {
  inicio: {

    inicializa() {
      globais.flappybird = criaflappybird();
      globais.chao = criachao();
      globais.canos = criacanos();
    },
    desenha() {
      planodefundo.desenha();
      globais.flappybird.desenha();

      globais.chao.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudaparatela(telas.jogo);
    },
    atualiza() {

      globais.chao.atualiza();

    }
  }
};

telas.jogo = {
  inicializa() {
    globais.placar = criaplacar();
  },
  desenha() {
    planodefundo.desenha();
    globais.canos.desenha();
    globais.chao.desenha();
    globais.flappybird.desenha();
    globais.placar.desenha();
  },
  click() {
    globais.flappybird.pula();
  },
  atualiza() {
    globais.canos.atualiza();
    globais.chao.atualiza();
    globais.flappybird.atualiza();
    globais.placar.atualiza();
  }
};

telas.game_over = {
  desenha() {
    mensagemgameover.desenha();
  },
  atualiza() {

  },
  click() {
    mudaparatela(telas.inicio);
  }
}

function loop() {
  telaativa.desenha();
  telaativa.atualiza();

  frames = frames + 1;
  requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
  if(telaativa.click) {
    telaativa.click();
  }
});

window.addEventListener('keydown', function(e) {
 // console.log(e);
  if (e.keyCode == 38) {
    e.preventDefault();
    telaativa.click();
  }
});

mudaparatela(telas.inicio);
loop();





