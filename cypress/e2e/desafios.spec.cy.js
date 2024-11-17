//Desafio API -  Parte 1

describe('BookStore API Test', () => {
  let userId;
  let token;
  const uniqueUserName = `user_${Date.now()}`; // Nome de usuário único

  it('Criar um usuário', () => {
    cy.request({
      method: 'POST',
      url: 'https://demoqa.com/Account/v1/User',
      body: {
        "userName": uniqueUserName,  // Nome de usuário único
        "password": "Password@123"  // Senha 
      },
    }).then((response) => {
      expect(response.status).to.eq(201);  // Espera o status 201 para criação bem-sucedida
      userId = response.body.userID;  // Salva o userID 
      cy.log('User ID: ' + userId);
    });
  });

  it('Gerar token de acesso', () => {
    cy.request({
      method: 'POST',
      url: 'https://demoqa.com/Account/v1/GenerateToken',
      body: {
        "userName": uniqueUserName,  // Usa o nome de usuário único
        "password": "Password@123"   // Senha 
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      token = response.body.token;  // Salva o token para usá-lo nas requisições subsequentes
      cy.log('Token: ' + token);
    });
  });

  it('Confirmar se o usuário está autorizado', () => {
    // Enviar o nome de usuário e senha diretamente no corpo da requisição
    cy.request({
      method: 'POST',
      url: 'https://demoqa.com/Account/v1/Authorized',
      body: {
        userName: 'novoUsuario',  // nome de usuário 
        password: 'Password@123'  // senha 
      },
    }).then((response) => {
      // Verificar e logar a resposta completa
      cy.log('Response Body:', JSON.stringify(response.body));  // Verifica a estrutura da resposta
      expect(response.status).to.eq(200);  // Espera o status 200 para autorização bem-sucedida
      
      // Verificar a resposta dependendo da estrutura dela
      if (response.body && response.body.message) {
        expect(response.body.message).to.eq('Authorized');  // Espera a resposta de autorização
      } else {
        cy.log('A resposta não contém "message", verifique a estrutura da resposta!');
      }

    });
  });

  it('Listar livros disponíveis', () => {
    cy.request({
      method: 'GET',
      url: 'https://demoqa.com/BookStore/v1/Books'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.books).to.have.length.greaterThan(0);  // Verifica se há livros na resposta
      cy.log('Livros disponíveis: ' + JSON.stringify(response.body.books));
    });
  });

  it('Alugar dois livros', () => {
    cy.request({
      method: 'POST',
      url: 'https://demoqa.com/BookStore/v1/Books',
      headers: {
        'Authorization': `Bearer ${token}`  // Passa o token no header
      },
      body: {
        "userId": userId,
        "collectionOfIsbns": [
          { "isbn": "9781449331818" },  // Escolha livro 1
          { "isbn": "9781449365035" }   // Escolha livro 2
        ]
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      cy.log('Livros alugados com sucesso!');
    });
  });

  it('Listar detalhes do usuário', () => {
    cy.request({
      method: 'GET',
      url: `https://demoqa.com/Account/v1/User/${userId}`,
      headers: {
        'Authorization': `Bearer ${token}`  // Passa o token no header
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log('Detalhes do usuário: ' + JSON.stringify(response.body));
      expect(response.body.books).to.have.length(2);  // Verifica se os dois livros foram alugados corretamente
    });
  });
});

///XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


// Desafio Frontend -  Parte 2 - Slide 4 - Forms
describe('Forms', () => {
  it('Forms', () => {
    cy.visit("https://demoqa.com");
    cy.viewport(1280, 720);
    cy.get('.category-cards > :nth-child(2)').should('be.visible').click();
    cy.get(':nth-child(2) > .element-list > .menu-list > #item-0').should('be.visible').click();

    // Preenche os campos do formulário
    cy.get('#firstName').type('João');
    cy.get('#lastName').type('Alves');
    cy.get('#userEmail').type('test1@gmail.com');
    cy.get('#genterWrapper > .col-md-9 > :nth-child(1)').click(); 
    cy.get('#userNumber').type('11999999999'); 
    cy.get('#dateOfBirthInput').type(15/10/2000);
    cy.get('.react-datepicker__month-select').select('November');
    cy.get('.react-datepicker__year-select').select('2000');
    cy.get('.react-datepicker__day--015').click();
    cy.get('#subjectsInput').type('Math{enter}');
    cy.get('#hobbiesWrapper > .col-md-9 > :nth-child(2) > .custom-control-label').click();
    cy.get('#uploadPicture').attachFile('uploadfoto');

    
    cy.get('#currentAddress').type('Rua Hum');
    cy.get('#state > .css-yk16xz-control').click(); // Abre o dropdown de estado
    cy.get('div[id^="react-select-"]').contains('NCR').click(); // Seleciona a opção "NCR"
    cy.get('#city > .css-yk16xz-control').click(); // Abre o dropdown de cidade
    cy.get('div[id^="react-select-"]').contains('Delhi').click(); // Seleciona a opção "Delhi"

    // Submete o formulário
    cy.get('#submit').click();

    // Espera o modal de sucesso aparecer e verifica seu conteúdo
    cy.get('#example-modal-sizes-title-lg').should('be.visible').and('contain', 'Thanks for submitting the form');

    // Aguarda 10 segundos antes de fechar o popup
    cy.wait(5000); // Pausa por 5 segundos


    // Fecha o popup
    cy.get('#closeLargeModal').click({ force: true });
    });

  // Trata erros de CORS e outros erros não capturados
  Cypress.on('uncaught:exception', (err, runnable) => {
    // Retorna false para evitar que o teste falhe
    return false;
  });
});

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// Desafio Frontend -  Parte 2 - Slide 5 - Alerts, Frame & Windows 
describe('Alerts, Frame & Windows ', () => {
  it('Alerts, Frame & Windows ', () => {
    // Visita a página inicial
    cy.visit("https://demoqa.com");
    cy.viewport(1280, 720);

    // Acessa a seção "Browser Windows"
    cy.get('.category-cards > :nth-child(3)').should('be.visible').click();
    cy.get(':nth-child(3) > .element-list > .menu-list > #item-0').should('be.visible').click();

    // Intercepta a abertura da nova janela
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    // Clica no botão para abrir a nova janela
    cy.get('#windowButton').should('be.visible').click();

    // Captura a URL da nova janela e redireciona para ela
    cy.get('@windowOpen').should('be.called').then((stub) => {
      let url = stub.getCall(0).args[0]; // Obtém a URL relativa da nova janela
      if (!url.startsWith('http')) {
        url = `https://demoqa.com${url}`; // Converte para uma URL absoluta
      }
      cy.visit(url); // Redireciona o Cypress para a nova URL
    });

    // Valida o conteúdo da página na nova URL
    cy.contains('This is a sample page', { timeout: 5000 }).should('be.visible');
  
    // Simula o fechamento da nova janela e retorna à página principal
    // visitamos a página original
    cy.go('back'); // Volta para a página anterior

    
  });

// Trata erros de CORS e outros erros não capturados
    Cypress.on('uncaught:exception', (err, runnable) => {
   // Retorna false para evitar que o teste falhe
    return false;
  });

});

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// Desafio Frontend -  Parte 2 - Slide 6 - Elements

describe('Elements', () => {
  it('Elements', () => {
    // Visita a página inicial
    cy.visit("https://demoqa.com");
    cy.viewport(1280, 720);

    // Acessa a seção "Elements"
    cy.get('.category-cards > :nth-child(1)').should('be.visible').click();
    cy.get(':nth-child(1) > .element-list > .menu-list > #item-3').should('be.visible').click();

    cy.get('#addNewRecordButton').click();

 // Preenche os campos do formulário
    cy.get('#firstName').type('João');
    cy.get('#lastName').type('Alves');
    cy.get('#userEmail').type('test1@gmail.com');
    cy.get('#age').type('25');
    cy.get('#salary').type('2000');
    cy.get('#department').type('Finance');

    // Submete o formulário
  cy.get('#submit').click();


  // Aguarda 10 segundos antes de fechar o popup
  cy.wait(5000); // Pausa por 5 segundos

 cy.get('#edit-record-4 > svg').click();

 // Edite os campos do formulário
 cy.get('#firstName').clear().type('Ana');
    cy.get('#lastName').clear().type('Santos');
    cy.get('#userEmail').clear().type('test2@gmail.com');
    cy.get('#age').clear().type('20');
    cy.get('#salary').clear().type('3000');
    cy.get('#department').clear().type('IT');

    // Submete o formulário
  cy.get('#submit').click();

   // Aguarda 10 segundos antes de fechar o popup
   cy.wait(5000); // Pausa por 5 segundos

   // Exclui o registro 
   cy.get('#delete-record-4 > svg > path').click();
  });

    
   // Trata erros de CORS e outros erros não capturados
  Cypress.on('uncaught:exception', (err, runnable) => {
    // Retorna false para evitar que o teste falhe
     return false;
   });

});


//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// Desafio Frontend -  Parte 2 - Slide 7 - Widgets REFAZER ESTÁ ERRADO

describe('Validate progress bar functionality', () => {
  it('starts the progress bar and stops at exactly 25%', () => {
    // Visita a página inicial
    cy.visit("https://demoqa.com");
    cy.viewport(1280, 720);

    // Acessa a seção "Progress Bar"
    cy.get('.category-cards > :nth-child(4)').should('be.visible').click();
    cy.get(':nth-child(4) > .element-list > .menu-list > #item-4').should('be.visible').click();

    // Verifica se o botão de Start/Stop está visível e clica nele para iniciar
    cy.get('#startStopButton').should('be.visible').click();

    // Monitorar a barra de progresso até atingir exatamente 25%
    const monitorProgress = () => {
      cy.get('.progress-bar')
        .invoke('attr', 'aria-valuenow') // Obtém o valor atual do progresso
        .then((progressValue) => {
          const progress = parseInt(progressValue, 10);
          cy.log(`Progresso atual: ${progress}%`);
          if (progress < 24) {
            cy.wait(100).then(monitorProgress); // Continua monitorando se está abaixo de 25%
          } else if (progress === 24) {
            cy.get('#startStopButton').click(); // Para o progresso ao atingir 25%
            
          }
        });
    };
    monitorProgress();
    cy.wait(5000); // Pausa por 5 segundos
    cy.get('#startStopButton').should('be.visible').click();
    cy.wait(10000).then(monitorProgress);
    cy.get('#resetButton').should('be.visible').click();
  
  });

   

  // Trata erros de CORS e outros erros não capturados
  Cypress.on('uncaught:exception', (err, runnable) => {
    // Retorna false para evitar que o teste falhe
    return false;
  });
});


//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// Desafio Frontend -  Parte 2 - Slide 8 - Interactions
describe(' Interactions ', () => {
  it(' Interactions ', () => {
    // Visita a página inicial
    cy.visit("https://demoqa.com");
    cy.viewport(1280, 720);

    // Acessa a seção "Sortable"
    cy.get('.category-cards > :nth-child(5)').click();
    
    // Acessa o submenu "Sortable"
    cy.get(':nth-child(5) > .element-list > .menu-list > #item-0').should('be.visible').click();

    // Função para realizar o drag and drop
    const dragAndDrop = (from, to) => {
      from.trigger('mousedown', { which: 1 });
      to.trigger('mousemove').trigger('mouseover');
      to.trigger('mouseup', { force: true });
    };

    // Pega os elementos e ordena de forma crescente
    cy.get('.vertical-list-container > :nth-child(6)').then($el6 => {
      cy.get('.vertical-list-container > :nth-child(5)').then($el5 => {
        cy.get('.vertical-list-container > :nth-child(4)').then($el4 => {
          cy.get('.vertical-list-container > :nth-child(3)').then($el3 => {
            cy.get('.vertical-list-container > :nth-child(2)').then($el2 => {
              cy.get('.vertical-list-container > :nth-child(1)').then($el1 => {
                // Arrastando e soltando os elementos na ordem correta
                dragAndDrop($el6, $el5);
                dragAndDrop($el5, $el4);
                dragAndDrop($el4, $el3);
                dragAndDrop($el3, $el2);
                dragAndDrop($el2, $el1);
              });
            });
          });
        });
      });
    });

    // Função para mapear o texto para seu valor numérico
    const textToNumber = (text) => {
      const textMap = {
        'One': '1',
        'Two': '2',
        'Three': '3',
        'Four': '4',
        'Five': '5',
        'Six': '6'
      };
      return textMap[text.trim()] || text;
    };

    // Verificando a ordem final
    cy.get('.vertical-list-container')
      .children()
      .each(($el, index) => {
        // Compara o texto do item com o valor numérico esperado
        expect(textToNumber($el.text().trim())).to.equal((index + 1).toString());
      });

    // Trata erros de CORS e outros erros não capturados
    Cypress.on('uncaught:exception', (err, runnable) => {
    // Retorna false para evitar que o teste falhe
    return false;
    });

  });
});
