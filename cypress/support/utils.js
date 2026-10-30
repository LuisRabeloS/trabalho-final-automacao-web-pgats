export const createUserAndLogout = () => {
    const timestamp = Date.now();
    const userName = `User_${timestamp}`;
    const userEmail = `auto_${timestamp}@testmail.com`;
    const userPassword = 'ZL3@jYLJGCNNQq';

    cy.visit('http://automationexercise.com');
    cy.get('a[href="/login"]').click();
    cy.get('input[data-qa="signup-name"]').type(userName);
    cy.get('input[data-qa="signup-email"]').type(userEmail);
    cy.get('button[data-qa="signup-button"]').click();

    cy.get('#id_gender1').check();
    cy.get('#password').type(userPassword);
    cy.get('#days').select('10');
    cy.get('#months').select('May');
    cy.get('#years').select('1998');
    cy.get('#first_name').type('Test');
    cy.get('#last_name').type('User');
    cy.get('#address1').type('Street 123');
    cy.get('#country').select('United States');
    cy.get('#state').type('California');
    cy.get('#city').type('Los Angeles');
    cy.get('#zipcode').type('90001');
    cy.get('#mobile_number').type('+15551234567');
    cy.get('button[data-qa="create-account"]').click();
    
    cy.get('h2[data-qa="account-created"]').should('be.visible');
    cy.get('a[data-qa="continue-button"]').click();
    cy.get('a[href="/logout"]').click(); // Faz logout para o teste começar da tela de login

    // Retorna as credenciais caso o teste precise usá-las
    return { userEmail, userPassword };
  };

export const ensureAccountDoesNotExist = (email, password) => {
    cy.visit('http://automationexercise.com');
    cy.get('a[href="/login"]').click();
    cy.get('input[data-qa="login-email"]').type(email);
    cy.get('input[data-qa="login-password"]').type(password);
    cy.get('button[data-qa="login-button"]').click();

    // Verificamos se o login FOI bem-sucedido (ou seja, a conta existia)
    // Usamos um cy.get com timeout menor ou verificamos a URL/elemento com conditional graceful
    cy.get('body').then(($body) => {
      // Se encontrou o botão de 'Logout' ou 'Logged in as', significa que a conta EXISTIA
      if ($body.text().includes('Logged in as')) {
        cy.log('Conta indesejada encontrada. Deletando para limpar o ambiente...');
        cy.get('a[href="/delete_account"]').click();
        cy.get('h2[data-qa="account-deleted"]').should('be.visible');
        cy.get('a[data-qa="continue-button"]').click();
      } else {
        cy.log('Conta não existe. O ambiente já está limpo!');
      }
    });
  };  

export const ensureAccountExists = (name, email, password) => {
    cy.visit('http://automationexercise.com');
    cy.get('a[href="/login"]').click();
    
    // Tenta fazer login com a conta que precisa existir
    cy.get('input[data-qa="login-email"]').type(email);
    cy.get('input[data-qa="login-password"]').type(password);
    cy.get('button[data-qa="login-button"]').click();

    cy.get('body').then(($body) => {
      // Se NÃO apareceu o "Logged in as", significa que a conta NÃO existe. Precisamos criá-la!
      if (!$body.text().includes('Logged in as')) {
        cy.log('Conta não encontrada. Criando massa de dados para o teste...');
        cy.visit('http://automationexercise.com');
        cy.get('a[href="/login"]').click();
        cy.get('input[data-qa="signup-name"]').type(name);
        cy.get('input[data-qa="signup-email"]').type(email);
        cy.get('button[data-qa="signup-button"]').click();

        cy.get('#id_gender1').check();
        cy.get('#password').type(password);
        cy.get('#days').select('10');
        cy.get('#months').select('May');
        cy.get('#years').select('1998');
        cy.get('#first_name').type('Test');
        cy.get('#last_name').type('User');
        cy.get('#address1').type('Street 123');
        cy.get('#country').select('United States');
        cy.get('#state').type('California');
        cy.get('#city').type('Los Angeles');
        cy.get('#zipcode').type('90001');
        cy.get('#mobile_number').type('+15551234567');
        cy.get('button[data-qa="create-account"]').click();
        
        cy.get('h2[data-qa="account-created"]').should('be.visible');
        cy.get('a[data-qa="continue-button"]').click();
        cy.get('a[href="/logout"]').click(); // Desloga para deixar limpo para o teste principal
      } else {
        cy.log('A conta já existe. Apenas saindo para o teste...');
        cy.get('a[href="/logout"]').click();
      }
    });
  };  