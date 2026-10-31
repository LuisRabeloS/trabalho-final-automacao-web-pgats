import { createUserAndLogout, ensureAccountExists, ensureAccountDoesNotExist } from '../support/utils';
import AutomationPage from '../support/pages/automationPage.js';

describe('Automation Exercise - E2E Test Suite', () => {
  it('Should register a new user successfully, verify login, and delete the account', () => {
    const timestamp = Date.now();
    const userName = `TestUser_${timestamp}`;
    const userEmail = `user_${timestamp}@testmail.com`;

    AutomationPage.visitHome();
    AutomationPage.goToLogin();
    AutomationPage.fillSignupInitial(userName, userEmail);

    const userData = {
      password: 'StrongPassword123!',
      day: '15',
      month: 'June',
      year: '1995',
      firstName: 'John',
      lastName: 'Doe',
      company: 'Automation Ltd',
      address1: 'Main Street, 123',
      address2: 'Apt 4B',
      country: 'United States',
      state: 'California',
      city: 'Los Angeles',
      zipcode: '90001',
      mobileNumber: '+15551234567'
    };

    AutomationPage.fillAccountDetails(userData);
    AutomationPage.verifyAccountCreated();
    AutomationPage.verifyLoggedInAs(userName);
    AutomationPage.deleteAccount();
  });

  it('Should login with an existing account, verify, and delete the account', () => {
    const { userEmail, userPassword } = createUserAndLogout();

    AutomationPage.visitHome();
    AutomationPage.goToLogin();
    AutomationPage.login(userEmail, userPassword);

    cy.get('a').contains('Logged in as').should('be.visible');
    AutomationPage.deleteAccount();
  });

  it('Should show an error message when logging in with incorrect credentials', () => {
    const invalidEmail = 'wrong_user_email@testmail.com';
    const invalidPassword = 'WrongPassword999!';
    ensureAccountDoesNotExist(invalidEmail, invalidPassword);

    AutomationPage.visitHome();
    AutomationPage.goToLogin();
    AutomationPage.login(invalidEmail, invalidPassword);

    cy.get('.login-form form p').should('be.visible').and('contain.text', 'Your email or password is incorrect!');
  });

  it('Should login successfully, click logout, and verify return to login page', () => {
    const { userEmail, userPassword } = createUserAndLogout();

    AutomationPage.visitHome();
    AutomationPage.goToLogin();
    AutomationPage.login(userEmail, userPassword);

    cy.get('a').contains('Logged in as').should('be.visible');
    cy.get('a[href="/logout"]').click();

    cy.url().should('include', '/login');
    cy.get('.login-form h2').should('have.text', 'Login to your account');
  });

  it('Should show an error message when signing up with an already registered email', () => {
    const registeredName = 'Existing User';
    const registeredEmail = 'automation-pgats@email.com';
    const registeredPassword = 'ZL3@jYLJGCNNQq';

    ensureAccountExists(registeredName, registeredEmail, registeredPassword);

    AutomationPage.visitHome();
    AutomationPage.goToLogin();
    AutomationPage.fillSignupInitial(registeredName, registeredEmail);

    cy.get('.signup-form form p')
      .should('be.visible')
      .and('contain.text', 'Email Address already exist!');
  });

  it('Should navigate to products page and verify product details', () => {
    AutomationPage.visitHome();
    AutomationPage.goToProducts();

    cy.url().should('include', '/products');
    cy.get('.title.text-center').should('be.visible').and('contain.text', 'All Products');
    cy.get('.features_items').should('be.visible');

    cy.get('.features_items .col-sm-4').first().contains('View Product').click();
    cy.url().should('include', '/product_details/');

    cy.get('.product-information').within(() => {
      cy.get('h2').should('be.visible');
      cy.get('p').contains('Category:').should('be.visible');
      cy.get('span').contains('Rs.').should('be.visible');
      cy.get('p').contains('Availability:').should('be.visible');
      cy.get('p').contains('Condition:').should('be.visible');
      cy.get('p').contains('Brand:').should('be.visible');
    });
  });

  it('Should search for a product and verify that relevant results are displayed', () => {
    const searchTerm = 'kids';

    AutomationPage.visitHome();
    AutomationPage.goToProducts();

    cy.url().should('include', '/products');
    cy.get('.title.text-center').should('be.visible').and('contain.text', 'All Products');

    AutomationPage.searchProduct(searchTerm);

    cy.get('.title.text-center').should('be.visible').and('contain.text', 'Searched Products');
    cy.get('.features_items').should('be.visible');
    cy.get('.features_items .col-sm-4').should('have.length.greaterThan', 0);
    
    cy.get('.features_items .productinfo p').each(($el) => {
      expect($el.text().toLowerCase()).to.include(searchTerm.toLowerCase());
    });
  });

  it('Should scroll to footer and subscribe successfully', () => {
    const subscriberEmail = `subscribe_${Date.now()}@testmail.com`;

    AutomationPage.visitHome();
    AutomationPage.subscribeToNewsletter(subscriberEmail);

    cy.get('#success-subscribe')
      .should('be.visible')
      .and('contain.text', 'You have been successfully subscribed!');
  });

  it('Should register user, add product to cart, complete checkout payment, and delete account', () => {
    const timestamp = Date.now();
    const userName = `User_${timestamp}`;
    const userEmail = `user_${timestamp}@testmail.com`;

    AutomationPage.visitHome();
    AutomationPage.goToLogin();

    cy.get('input[data-qa="signup-name"]').type(userName);
    cy.get('input[data-qa="signup-email"]').type(userEmail);
    cy.get('button[data-qa="signup-button"]').click();

    const userData = {
      password: 'StrongPassword123!',
      day: '10',
      month: 'May',
      year: '1998',
      firstName: 'Alex',
      lastName: 'Smith',
      company: 'Tech Corp',
      address1: '123 Test Street',
      address2: 'Suite 100',
      country: 'United States',
      state: 'New York',
      city: 'New York',
      zipcode: '10001',
      mobileNumber: '+12125550199'
    };

    AutomationPage.fillAccountDetails(userData);
    AutomationPage.verifyAccountCreated();
    AutomationPage.verifyLoggedInAs(userName);

    const paymentData = {
      name: 'Alex Smith',
      cardNumber: '4111111111111111',
      cvc: '311',
      expiryMonth: '12',
      expiryYear: '2028'
    };

    AutomationPage.completeCheckoutAndPayment('Por favor, entregar no período da manhã.', paymentData);
    AutomationPage.deleteAccount();
  });

  it('Should login to an existing account, add product to cart, complete checkout, and delete account', () => {
    const userEmail = 'automation-pgats@email.com';
    const userPassword = 'ZL3@jYLJGCNNQq';

    AutomationPage.visitHome();
    AutomationPage.goToLogin();

    cy.get('input[data-qa="login-email"]').type(userEmail);
    cy.get('input[data-qa="login-password"]').type(userPassword);
    cy.get('button[data-qa="login-button"]').click();

    cy.get('a').contains('Logged in as').should('be.visible');

    const paymentData = {
      name: 'Test User',
      cardNumber: '4111111111111111',
      cvc: '311',
      expiryMonth: '12',
      expiryYear: '2028'
    };

    AutomationPage.completeCheckoutAndPayment('Entrega rápida, por favor.', paymentData);
    AutomationPage.deleteAccount();
  });
});