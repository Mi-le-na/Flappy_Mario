console.log('[Mi-le-na] Flappy Bird');

let frames = 0;
const som_hit = new Audio();
som_hit.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


// [Plano de Fundo]
const planoDeFundo = {
  spritex: 390,
  spritey: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0, 0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.spritex, planoDeFundo.spritey,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spritex, planoDeFundo.spritey,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
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
      const repeteem= chao.largura / 2;
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
function fazcolisao(flappyBird, chao) {
  const flappyBirdy = flappyBird.y + flappyBird.altura;
  const chaoy = chao.y;

  if (flappyBirdy >= chaoy) {
    return true;

  }
  return false;
}
function criaflappybird() {
  const flappyBird = {
    spritex: 0,
    spritey: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 4.6,
    pula() {
      console.log('devopular');
      flappyBird.velocidade = -flappyBird.pulo;
    },
    gravidade: 0.25,
    velocidade: 0,

    atualiza() {
      if (fazcolisao(flappyBird, globais.chao)) {
        console.log('fez colisao');
        som_hit.play();

        setTimeout(() => {
          mudaparatela(telas.inicio);
        }, 500);
        return;
      }
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    movimentos: [
      {spritex: 0, spritey: 0, },
      {spritex: 0, spritey: 26, },
      {spritex: 0, spritey: 52, },
    ],
    frameatual: 0,
    atualizaoframeatual() {
      const intervalodeframes = 10;
      const passouointervalo = frames % intervalodeframes === 0;
      //console.log('passouointervalo', passouointervalo)

    if(passouointervalo) {
      const basedoincremento = 1;
      const incremento = basedoincremento + flappyBird.frameatual;
      const baserepeticao = flappyBird.movimentos.length;
      flappyBird.frameatual = incremento % baserepeticao
    }
    },
    desenha() {
      flappyBird.atualizaoframeatual();
      const {spritex, spritey} = flappyBird.movimentos[flappyBird.frameatual];

      contexto.drawImage(
        sprites,
        spritex, spritey, // Sprite X, Sprite Y
        flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura,
      );
    }
  }
  return flappyBird;
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

// telas
const globais = {};
let telaativa = {};
function mudaparatela(novatela) {
  telaativa = novatela;
  if (telaativa.inicializa) {
    telaativa.inicializa();
  }
}
const telas = {
  inicio: {

    inicializa() {
      globais.flappyBird = criaflappybird();
      globais.chao = criachao();
    },
    desenha() {
      planoDeFundo.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
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
  desenha() {
    planoDeFundo.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
  },
  click() {
    globais.flappyBird.pula();
  },
  atualiza() {
    globais.flappyBird.atualiza();
  }
};

function loop() {
  telaativa.desenha();
  telaativa.atualiza();

  frames = frames + 1;
  requestAnimationFrame(loop);
}

window.addEventListener('click', function () {
  if (telaativa.click) {
    telaativa.click();
  }
});
mudaparatela(telas.inicio);
loop();





