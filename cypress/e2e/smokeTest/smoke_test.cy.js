describe("smoke test", () => {
  it("checks the presence of fields and connection button", () => {
    cy.visit("http://localhost:8080/#/");
    cy.getBySel("nav-link-login").click();
    cy.getBySel("login-input-username").should("exist");
    cy.getBySel("login-input-password").should("exist");
    cy.getBySel("login-submit").should("exist");
  });

  it("checks the presence of 'add to cart' and product availability", () => {
    //Connecting first to access the cart section
    cy.visit("http://localhost:8080/#/");
    cy.getBySel("nav-link-login").click();
    cy.getBySel("login-input-username").type("test2@test.fr");
    cy.getBySel("login-input-password").type("testtest");
    cy.getBySel("login-submit").click();
    cy.contains("Mon panier").should("be.visible");

    //Selecting a product from the page "Produits"
    cy.getBySel("nav-link-products").click();
    cy.get("button").eq(0).should("contain", "Consulter").click();

    //Checking for the "add to cart" button and "product-stock" text
    cy.getBySel("detail-product-add").should("exist");
    cy.getBySel("detail-product-stock").should("exist");
  });
});
