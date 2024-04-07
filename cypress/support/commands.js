Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args);
});

Cypress.Commands.add("login", () => {
  const username = Cypress.env("username");
  const password = Cypress.env("password");
  cy.visit("");
  cy.getBySel("nav-link-login").click();
  cy.getBySel("login-input-username").type(username);
  cy.getBySel("login-input-password").type(password);
  cy.getBySel("login-submit").click();
  cy.contains("Mon panier").should("be.visible");
});

Cypress.Commands.add("getToken", () => {
  return cy
    .request({
      method: "POST",
      url: Cypress.env("apiUrl") + "/login",
      body: {
        username: Cypress.env("username"),
        password: Cypress.env("password"),
      },
      failOnStatusCode: false, // Prevent Cypress from treating non-2xx responses as failures
    })
    .then((response) => {
      if (response.status === 200 && response.body && response.body.token) {
        // If response is successful and contains token, return the token
        return response.body.token;
      } else {
        // If response is not successful or token is not found, log an error and return null
        Cypress.log({
          name: "Token Retrieval",
          message: "Failed to retrieve token",
          consoleProps: () => {
            return {
              Status: response.status,
              Body: response.body,
            };
          },
        });
        return null;
      }
    });
});
