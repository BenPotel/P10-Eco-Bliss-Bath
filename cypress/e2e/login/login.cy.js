describe("login attempts", () => {
  it("enter an incorrect password", () => {
    cy.visit("");
    cy.getBySel("nav-link-login").click();
    cy.getBySel("login-input-username").type("test2@test.fr");
    cy.getBySel("login-input-password").type("1234");
    cy.getBySel("login-submit").click();
    cy.contains("Identifiants incorrects").should("be.visible");
  });

  it("does not fill in the empty fields", () => {
    cy.visit("");
    cy.getBySel("nav-link-login").click();
    cy.getBySel("login-submit").click();
    cy.contains("Merci de remplir correctement tous les champs").should(
      "be.visible"
    );
  });

  it("enters correct username and password", () => {
    cy.login();
  });
});
