class AutomationPage {
  visitHome() {
    cy.visit('http://automationexercise.com');
    cy.get('img[alt="Website for automation practice"]').should('be.visible');
    cy.url().should('eq', 'https://automationexercise.com/');
  }

  goToLogin() {
    cy.get('a[href="/login"]').click();
  }

  goToProducts() {
    cy.get('a[href="/products"]').click();
  }

  verifyHomeVisible() {
    cy.get('img[alt="Website for automation practice"]').should('be.visible');
    cy.url().should('eq', 'https://automationexercise.com/');
  }

  fillSignupInitial(name, email) {
    cy.get('.signup-form h2').should('have.text', 'New User Signup!');
    cy.get('input[data-qa="signup-name"]').type(name);
    cy.get('input[data-qa="signup-email"]').type(email);
    cy.get('button[data-qa="signup-button"]').click();
  }

  fillAccountDetails(userData) {
    cy.get('.login-form h2.title').should('contain.text', 'Enter Account Information');
    cy.get('#id_gender1').check();
    cy.get('#password').type(userData.password);
    cy.get('#days').select(userData.day);
    cy.get('#months').select(userData.month);
    cy.get('#years').select(userData.year);

    cy.get('#newsletter').check();
    cy.get('#optin').check();

    cy.get('#first_name').type(userData.firstName);
    cy.get('#last_name').type(userData.lastName);
    cy.get('#company').type(userData.company);
    cy.get('#address1').type(userData.address1);
    cy.get('#address2').type(userData.address2);
    cy.get('#country').select(userData.country);
    cy.get('#state').type(userData.state);
    cy.get('#city').type(userData.city);
    cy.get('#zipcode').type(userData.zipcode);
    cy.get('#mobile_number').type(userData.mobileNumber);

    cy.get('button[data-qa="create-account"]').click();
  }

  verifyAccountCreated() {
    cy.get('h2[data-qa="account-created"]').should('be.visible').and('contain.text', 'Account Created!');
    cy.get('a[data-qa="continue-button"]').click();
  }

  verifyLoggedInAs(username) {
    cy.get('a').contains(`Logged in as ${username}`).should('be.visible');
  }

  deleteAccount() {
    cy.get('a[href="/delete_account"]').click();
    cy.get('h2[data-qa="account-deleted"]').should('be.visible').and('contain.text', 'Account Deleted!');
    cy.get('a[data-qa="continue-button"]').click();
  }

  login(email, password) {
    cy.get('.login-form h2').should('have.text', 'Login to your account');
    cy.get('input[data-qa="login-email"]').type(email);
    cy.get('input[data-qa="login-password"]').type(password);
    cy.get('button[data-qa="login-button"]').click();
  }

  searchProduct(term) {
    cy.get('#search_product').type(term);
    cy.get('#submit_search').click();
  }

  subscribeToNewsletter(email) {
    cy.get('#footer').scrollIntoView();
    cy.get('.single-widget h2').should('be.visible').and('have.text', 'Subscription');
    cy.get('#susbscribe_email').type(email);
    cy.get('#subscribe').click();
  }

  completeCheckoutAndPayment(comment, paymentData) {
    cy.get('.features_items .col-sm-4').first().within(() => {
      cy.get('.add-to-cart').first().click();
    });
    cy.get('.modal-content').should('be.visible');
    cy.get('.modal-footer button').click();

    cy.get('header#header').contains('Cart').click();
    cy.url().should('include', '/view_cart');
    cy.get('#cart_info').should('be.visible');

    cy.get('.check_out').click();
    cy.get('#address_delivery').should('be.visible');
    cy.get('#address_invoice').should('be.visible');
    cy.get('#cart_info').should('be.visible');

    cy.get('textarea[name="message"]').type(comment);
    cy.get('a[href="/payment"]').click();

    cy.get('input[data-qa="name-on-card"]').type(paymentData.name);
    cy.get('input[data-qa="card-number"]').type(paymentData.cardNumber);
    cy.get('input[data-qa="cvc"]').type(paymentData.cvc);
    cy.get('input[data-qa="expiry-month"]').type(paymentData.expiryMonth);
    cy.get('input[data-qa="expiry-year"]').type(paymentData.expiryYear);
    cy.get('button[data-qa="pay-button"]').click();

    cy.get('h2[data-qa="order-placed"]').should('be.visible').and('contain.text', 'Order Placed!');
    cy.get('#form').should('be.visible').and('contain.text', 'Congratulations! Your order has been confirmed!');
  }
}

export default new AutomationPage();