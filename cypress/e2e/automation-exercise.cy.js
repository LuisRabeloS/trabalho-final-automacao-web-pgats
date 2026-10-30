import { createUserAndLogout, ensureAccountExists, ensureAccountDoesNotExist } from '../support/utils';

describe('Automation Exercise - User Registration Test', () => {
  it('Should register a new user successfully, verify login, and delete the account', () => {
    // Dados dinâmicos para evitar conflito de e-mail duplicado
    const timestamp = Date.now();
    const userName = `TestUser_${timestamp}`;
    const userEmail = `user_${timestamp}@testmail.com`;

    // 1. Launch browser & Navigate to url 'http://automationexercise.com'
    cy.visit('http://automationexercise.com');

    // 3. Verify that home page is visible successfully
    cy.get('img[alt="Website for automation practice"]').should('be.visible');
    cy.url().should('eq', 'https://automationexercise.com/');

    // 4. Click on 'Signup / Login' button
    cy.get('a[href="/login"]').click();

    // 5. Verify 'New User Signup!' is visible
    cy.get('.signup-form h2').should('have.text', 'New User Signup!');

    // 6. Enter name and email address
    cy.get('input[data-qa="signup-name"]').type(userName);
    cy.get('input[data-qa="signup-email"]').type(userEmail);

    // 7. Click 'Signup' button
    cy.get('button[data-qa="signup-button"]').click();

    // 8. Verify that 'ENTER ACCOUNT INFORMATION' is visible
    cy.get('.login-form h2.title').should('contain.text', 'Enter Account Information');

    // 9. Fill details: Title, Name, Email, Password, Date of birth
    cy.get('#id_gender1').check(); // Seleciona o título (Mr.)
    cy.get('#password').type('StrongPassword123!');
    cy.get('#days').select('15');
    cy.get('#months').select('June');
    cy.get('#years').select('1995');

    // 10. Select checkbox 'Sign up for our newsletter!'
    cy.get('#newsletter').check();

    // 11. Select checkbox 'Receive special offers from our partners!'
    cy.get('#optin').check();

    // 12. Fill details: First name, Last name, Company, Address, Address2, Country, State, City, Zipcode, Mobile Number
    cy.get('#first_name').type('John');
    cy.get('#last_name').type('Doe');
    cy.get('#company').type('Automation Ltd');
    cy.get('#address1').type('Main Street, 123');
    cy.get('#address2').type('Apt 4B');
    cy.get('#country').select('United States');
    cy.get('#state').type('California');
    cy.get('#city').type('Los Angeles');
    cy.get('#zipcode').type('90001');
    cy.get('#mobile_number').type('+15551234567');

    // 13. Click 'Create Account button'
    cy.get('button[data-qa="create-account"]').click();

    // 14. Verify that 'ACCOUNT CREATED!' is visible
    cy.get('h2[data-qa="account-created"]').should('be.visible').and('contain.text', 'Account Created!');

    // 15. Click 'Continue' button
    cy.get('a[data-qa="continue-button"]').click();

    // 16. Verify that 'Logged in as username' is visible
    cy.get('a').contains(`Logged in as ${userName}`).should('be.visible');

    // 17. Click 'Delete Account' button
    cy.get('a[href="/delete_account"]').click();

    // 18. Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
    cy.get('h2[data-qa="account-deleted"]').should('be.visible').and('contain.text', 'Account Deleted!');
    cy.get('a[data-qa="continue-button"]').click();
  });

  it('Should login with an existing account, verify, and delete the account', () => {
    const { userEmail, userPassword } = createUserAndLogout();

    // 1. Launch browser & Navigate to url 'http://automationexercise.com'
    cy.visit('http://automationexercise.com');

    // 3. Verify that home page is visible successfully
    cy.get('img[alt="Website for automation practice"]').should('be.visible');
    cy.url().should('eq', 'https://automationexercise.com/');

    // 4. Click on 'Signup / Login' button
    cy.get('a[href="/login"]').click();

    // 5. Verify 'Login to your account' is visible
    cy.get('.login-form h2').should('have.text', 'Login to your account');

    // 6. Enter correct email address and password
    cy.get('input[data-qa="login-email"]').type(userEmail);
    cy.get('input[data-qa="login-password"]').type(userPassword);

    // 7. Click 'login' button
    cy.get('button[data-qa="login-button"]').click();

    // 8. Verify that 'Logged in as username' is visible
    cy.get('a').contains('Logged in as').should('be.visible');

    // 9. Click 'Delete Account' button
    cy.get('a[href="/delete_account"]').click();

    // 10. Verify that 'ACCOUNT DELETED!' is visible
    cy.get('h2[data-qa="account-deleted"]').should('be.visible').and('contain.text', 'Account Deleted!');
  });

  it('Should show an error message when logging in with incorrect credentials', () => {
    
    const invalidEmail = 'wrong_user_email@testmail.com';
    const invalidPassword = 'WrongPassword999!';
    ensureAccountDoesNotExist(invalidEmail, invalidPassword);

    // 1. Launch browser & Navigate to url 'http://automationexercise.com'
    cy.visit('http://automationexercise.com');

    // 3. Verify that home page is visible successfully
    cy.get('img[alt="Website for automation practice"]').should('be.visible');
    cy.url().should('eq', 'https://automationexercise.com/');

    // 4. Click on 'Signup / Login' button
    cy.get('a[href="/login"]').click();

    // 5. Verify 'Login to your account' is visible
    cy.get('.login-form h2').should('have.text', 'Login to your account');

    // 6. Enter incorrect email address and password
    cy.get('input[data-qa="login-email"]').type(invalidEmail);
    cy.get('input[data-qa="login-password"]').type(invalidPassword);

    // 7. Click 'login' button
    cy.get('button[data-qa="login-button"]').click();

    // 8. Verify error 'Your email or password is incorrect!' is visible
    cy.get('.login-form form p').should('be.visible').and('contain.text', 'Your email or password is incorrect!');
  });

  it('Should login successfully, click logout, and verify return to login page', () => {
    const { userEmail, userPassword } = createUserAndLogout();

    // 1. Launch browser & Navigate to url 'http://automationexercise.com'
    cy.visit('http://automationexercise.com');

    // 3. Verify that home page is visible successfully
    cy.get('img[alt="Website for automation practice"]').should('be.visible');
    cy.url().should('eq', 'https://automationexercise.com/');

    // 4. Click on 'Signup / Login' button
    cy.get('a[href="/login"]').click();

    // 5. Verify 'Login to your account' is visible
    cy.get('.login-form h2').should('have.text', 'Login to your account');

    // 6. Enter correct email address and password
    cy.get('input[data-qa="login-email"]').type(userEmail);
    cy.get('input[data-qa="login-password"]').type(userPassword);

    // 7. Click 'login' button
    cy.get('button[data-qa="login-button"]').click();

    // 8. Verify that 'Logged in as username' is visible
    cy.get('a').contains('Logged in as').should('be.visible');

    // 9. Click 'Logout' button
    cy.get('a[href="/logout"]').click();

    // 10. Verify that user is navigated to login page
    cy.url().should('include', '/login');
    cy.get('.login-form h2').should('have.text', 'Login to your account');
  });

  it('Should show an error message when signing up with an already registered email', () => {
    const registeredName = 'Existing User';
    const registeredEmail = 'automation-pgats@email.com';
    const registeredPassword = 'ZL3@jYLJGCNNQq';

    ensureAccountExists(registeredName, registeredEmail, registeredPassword);

    // 1. Launch browser & Navigate to url 'http://automationexercise.com'
    cy.visit('http://automationexercise.com');

    // 3. Verify that home page is visible successfully
    cy.get('img[alt="Website for automation practice"]').should('be.visible');
    cy.url().should('eq', 'https://automationexercise.com/');

    // 4. Click on 'Signup / Login' button
    cy.get('a[href="/login"]').click();

    // 5. Verify 'New User Signup!' is visible
    cy.get('.signup-form h2').should('have.text', 'New User Signup!');

    // 6. Enter name and already registered email address
    cy.get('input[data-qa="signup-name"]').type(registeredName);
    cy.get('input[data-qa="signup-email"]').type(registeredEmail);

    // 7. Click 'Signup' button
    cy.get('button[data-qa="signup-button"]').click();

    // 8. Verify error 'Email Address already exist!' is visible
    cy.get('.signup-form form p')
      .should('be.visible')
      .and('contain.text', 'Email Address already exist!');
  });

  it('Should navigate to products page and verify product details', () => {
    // 1. Launch browser & Navigate to url 'http://automationexercise.com'
    cy.visit('http://automationexercise.com');

    // 3. Verify that home page is visible successfully
    cy.get('img[alt="Website for automation practice"]').should('be.visible');
    cy.url().should('eq', 'https://automationexercise.com/');

    // 4. Click on 'Products' button
    cy.get('a[href="/products"]').click();

    // 5. Verify user is navigated to ALL PRODUCTS page successfully
    cy.url().should('include', '/products');
    cy.get('.title.text-center').should('be.visible').and('contain.text', 'All Products');

    // 6. The products list is visible
    cy.get('.features_items').should('be.visible');

    // 7. Click on 'View Product' of first product
    cy.get('.features_items .col-sm-4').first().contains('View Product').click();

    // 8. User is landed to product detail page
    cy.url().should('include', '/product_details/');

    // 9. Verify that detail is visible: product name, category, price, availability, condition, brand
    cy.get('.product-information').within(() => {
      cy.get('h2').should('be.visible'); // Product name
      cy.get('p').contains('Category:').should('be.visible'); // Category
      cy.get('span').contains('Rs.').should('be.visible'); // Price
      cy.get('p').contains('Availability:').should('be.visible'); // Availability
      cy.get('p').contains('Condition:').should('be.visible'); // Condition
      cy.get('p').contains('Brand:').should('be.visible'); // Brand
    });
  });

  it('Should search for a product and verify that relevant results are displayed', () => {
    const searchTerm = 'kids';

    // 1. Launch browser & Navigate to url 'http://automationexercise.com'
    cy.visit('http://automationexercise.com');

    // 3. Verify that home page is visible successfully
    cy.get('img[alt="Website for automation practice"]').should('be.visible');
    cy.url().should('eq', 'https://automationexercise.com/');

    // 4. Click on 'Products' button
    cy.get('a[href="/products"]').click();

    // 5. Verify user is navigated to ALL PRODUCTS page successfully
    cy.url().should('include', '/products');
    cy.get('.title.text-center').should('be.visible').and('contain.text', 'All Products');

    // 6. Enter product name in search input and click search button
    cy.get('#search_product').type(searchTerm);
    cy.get('#submit_search').click();

    // 7. Verify 'SEARCHED PRODUCTS' is visible
    cy.get('.title.text-center').should('be.visible').and('contain.text', 'Searched Products');

    // 8. Verify all the products related to search are visible
    cy.get('.features_items').should('be.visible');
    cy.get('.features_items .col-sm-4').should('have.length.greaterThan', 0);
    
    cy.get('.features_items .productinfo p').each(($el) => {
      expect($el.text().toLowerCase()).to.include(searchTerm.toLowerCase());
    });
  });

  it('Should scroll to footer and subscribe successfully', () => {
    const subscriberEmail = `subscribe_${Date.now()}@testmail.com`;

    // 1. Launch browser & Navigate to url 'http://automationexercise.com'
    cy.visit('http://automationexercise.com');

    // 3. Verify that home page is visible successfully
    cy.get('img[alt="Website for automation practice"]').should('be.visible');
    cy.url().should('eq', 'https://automationexercise.com/');

    // 4. Scroll down to footer
    cy.get('#footer').scrollIntoView();

    // 5. Verify text 'SUBSCRIPTION'
    cy.get('.single-widget h2')
      .should('be.visible')
      .and('have.text', 'Subscription');

    // 6. Enter email address in input and click arrow button
    cy.get('#susbscribe_email').type(subscriberEmail);
    cy.get('#subscribe').click();

    // 7. Verify success message 'You have been successfully subscribed!' is visible
    cy.get('#success-subscribe')
      .should('be.visible')
      .and('contain.text', 'You have been successfully subscribed!');
  });

  it('Should register user, add product to cart, complete checkout payment, and delete account', () => {
    const timestamp = Date.now();
    const userName = `User_${timestamp}`;
    const userEmail = `user_${timestamp}@testmail.com`;

    // 1. Launch browser & Navigate to url 'http://automationexercise.com'
    cy.visit('http://automationexercise.com');

    // 3. Verify that home page is visible successfully
    cy.get('img[alt="Website for automation practice"]').should('be.visible');
    cy.url().should('eq', 'https://automationexercise.com/');

    // 4. Click 'Signup / Login' button
    cy.get('a[href="/login"]').click();

    // 5. Fill all details in Signup and create account
    cy.get('input[data-qa="signup-name"]').type(userName);
    cy.get('input[data-qa="signup-email"]').type(userEmail);
    cy.get('button[data-qa="signup-button"]').click();

    cy.get('#id_gender1').check();
    cy.get('#password').type('StrongPassword123!');
    cy.get('#days').select('10');
    cy.get('#months').select('May');
    cy.get('#years').select('1998');

    cy.get('#newsletter').check();
    cy.get('#optin').check();

    cy.get('#first_name').type('Alex');
    cy.get('#last_name').type('Smith');
    cy.get('#company').type('Tech Corp');
    cy.get('#address1').type('123 Test Street');
    cy.get('#address2').type('Suite 100');
    cy.get('#country').select('United States');
    cy.get('#state').type('New York');
    cy.get('#city').type('New York');
    cy.get('#zipcode').type('10001');
    cy.get('#mobile_number').type('+12125550199');

    cy.get('button[data-qa="create-account"]').click();

    // 6. Verify 'ACCOUNT CREATED!' and click 'Continue' button
    cy.get('h2[data-qa="account-created"]')
      .should('be.visible')
      .and('contain.text', 'Account Created!');
    cy.get('a[data-qa="continue-button"]').click();

    // 7. Verify 'Logged in as username' at top
    cy.get('a').contains(`Logged in as ${userName}`).should('be.visible');

    // 8. Add products to cart
    cy.get('.features_items .col-sm-4').first().within(() => {
      cy.get('.add-to-cart').first().click();
    });

    cy.get('.modal-content').should('be.visible');
    cy.get('.modal-footer button').click();

    // 9. Click 'Cart' button
    cy.get('header#header').contains('Cart').click();

    // 10. Verify that cart page is displayed
    cy.url().should('include', '/view_cart');
    cy.get('#cart_info').should('be.visible');

    // 11. Click Proceed To Checkout
    cy.get('.check_out').click();

    // 12. Verify Address Details and Review Your Order
    cy.get('#address_delivery').should('be.visible');
    cy.get('#address_invoice').should('be.visible');
    cy.get('#cart_info').should('be.visible');

    // 13. Enter description in comment text area and click 'Place Order'
    cy.get('textarea[name="message"]').type('Por favor, entregar no período da manhã.');
    cy.get('a[href="/payment"]').click();

    // 14. Enter payment details: Name on Card, Card Number, CVC, Expiration date
    cy.get('input[data-qa="name-on-card"]').type('Alex Smith');
    cy.get('input[data-qa="card-number"]').type('4111111111111111');
    cy.get('input[data-qa="cvc"]').type('311');
    cy.get('input[data-qa="expiry-month"]').type('12');
    cy.get('input[data-qa="expiry-year"]').type('2028');

    // 15. Click 'Pay and Confirm Order' button
    cy.get('button[data-qa="pay-button"]').click();

    // 16. Aguarda e valida a mensagem final e estável de sucesso do pedido
    cy.get('h2[data-qa="order-placed"]')
      .should('be.visible')
      .and('contain.text', 'Order Placed!');

    cy.get('#form')
      .should('be.visible')
      .and('contain.text', 'Congratulations! Your order has been confirmed!');

    // 17. Click 'Delete Account' button
    cy.get('a[href="/delete_account"]').click();

    // 18. Verify 'ACCOUNT DELETED!' and click 'Continue' button
    cy.get('h2[data-qa="account-deleted"]')
      .should('be.visible')
      .and('contain.text', 'Account Deleted!');
    cy.get('a[data-qa="continue-button"]').click();
  });

  it('Should login to an existing account, add product to cart, complete checkout, and delete account', () => {
    const userEmail = 'automation-pgats@email.com';
    const userPassword = 'ZL3@jYLJGCNNQq';

    // 1. Launch browser & Navigate to url 'http://automationexercise.com'
    cy.visit('http://automationexercise.com');

    // 3. Verify that home page is visible successfully
    cy.get('img[alt="Website for automation practice"]').should('be.visible');
    cy.url().should('eq', 'https://automationexercise.com/');

    // 4. Click 'Signup / Login' button
    cy.get('a[href="/login"]').click();

    // 5. Fill email, password and click 'Login' button
    cy.get('input[data-qa="login-email"]').type(userEmail);
    cy.get('input[data-qa="login-password"]').type(userPassword);
    cy.get('button[data-qa="login-button"]').click();

    // 6. Verify 'Logged in as username' at top
    cy.get('a').contains('Logged in as').should('be.visible');

    // 7. Add products to cart
    cy.get('.features_items .col-sm-4').first().within(() => {
      cy.get('.add-to-cart').first().click();
    });

    cy.get('.modal-content').should('be.visible');
    cy.get('.modal-footer button').click();

    // 8. Click 'Cart' button
    cy.get('header#header').contains('Cart').click();

    // 9. Verify that cart page is displayed
    cy.url().should('include', '/view_cart');
    cy.get('#cart_info').should('be.visible');

    // 10. Click Proceed To Checkout
    cy.get('.check_out').click();

    // 11. Verify Address Details and Review Your Order
    cy.get('#address_delivery').should('be.visible');
    cy.get('#address_invoice').should('be.visible');
    cy.get('#cart_info').should('be.visible');

    // 12. Enter description in comment text area and click 'Place Order'
    cy.get('textarea[name="message"]').type('Entrega rápida, por favor.');
    cy.get('a[href="/payment"]').click();

    // 13. Enter payment details: Name on Card, Card Number, CVC, Expiration date
    cy.get('input[data-qa="name-on-card"]').type('Test User');
    cy.get('input[data-qa="card-number"]').type('4111111111111111');
    cy.get('input[data-qa="cvc"]').type('311');
    cy.get('input[data-qa="expiry-month"]').type('12');
    cy.get('input[data-qa="expiry-year"]').type('2028');

    // 14. Click 'Pay and Confirm Order' button
    cy.get('button[data-qa="pay-button"]').click();

    // 15. Verify success message 'Your order has been placed successfully!'
    // 16. Aguarda e valida a mensagem final e estável de sucesso do pedido
    cy.get('h2[data-qa="order-placed"]')
      .should('be.visible')
      .and('contain.text', 'Order Placed!');

    cy.get('#form')
      .should('be.visible')
      .and('contain.text', 'Congratulations! Your order has been confirmed!');

    // ⚠️ ATENÇÃO: Como este teste usa uma conta fixa existente, 
    // se o comando 'Delete Account' for executado no final dele, 
    // a conta será deletada e as próximas execuções falharão. 
    // Caso queira preservar a conta para futuras execuções, comente as duas linhas abaixo:
    cy.get('a[href="/delete_account"]').click();
    cy.get('h2[data-qa="account-deleted"]').should('be.visible').and('contain.text', 'Account Deleted!');
    cy.get('a[data-qa="continue-button"]').click();
  });
});