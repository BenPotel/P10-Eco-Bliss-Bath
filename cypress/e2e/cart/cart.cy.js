describe("Cart functionality tests", () => {
  let userToken;
  let orderLines;

  beforeEach(() => {
    cy.login();
    cy.getToken().then((token) => {
      // Set userToken variable after getToken resolves
      userToken = token;

      // Delete products from the cart before each test
      cy.request({
        method: "GET",
        url: Cypress.env("apiUrl") + "/orders",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        orderLines = response.body.orderLines;
        orderLines.forEach((line) => {
          cy.request({
            method: "DELETE",
            url: Cypress.env("apiUrl") + "/orders/" + line.id + "/delete",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
        });
      });
    });
  });
  it("should add a product to cart and delete it", () => {
    // Navigate to product page and add product
    cy.getBySel("nav-link-products").should("be.visible").click();
    cy.getBySel("nav-link-products").click();
    cy.getBySel("product").eq(1).contains("Consulter").click();
    cy.getBySel("detail-product-quantity").clear().type("1");
    cy.getBySel("detail-product-add").click();
    cy.contains("Mon panier").click();

    // Check cart
    cy.getBySel("cart-line").should("exist");

    // Delete product from cart
    cy.getBySel("cart-line-delete").click({ multiple: true });
    cy.getBySel("cart-empty").should("exist");
  });

  it("should not allow adding negative quantity to cart", () => {
    // Navigate to product page and try adding negative quantity
    cy.getBySel("nav-link-products").should("be.visible").click();
    cy.getBySel("nav-link-products").click();
    cy.getBySel("product").eq(0).contains("Consulter").click();
    cy.getBySel("detail-product-quantity").clear().focus().type("-3");
    cy.getBySel("detail-product-add").click();
    cy.url().should("not.contain", "cart");
  });
  it("should not allow adding a zero quantity to cart", () => {
    cy.getBySel("nav-link-products").should("be.visible").click();
    cy.getBySel("nav-link-products").click();
    cy.getBySel("product").eq(1).contains("Consulter").click();
    // Try adding zero quantity
    cy.getBySel("detail-product-quantity").clear().focus().type("0");
    cy.getBySel("detail-product-add").click();
    // Check if the product is added to the cart or not
    cy.url().should("not.contain", "cart");

    cy.getBySel("nav-link-cart").click();

    // Verify that the product isn't present in the cart and the cart is empty
    cy.get("[data-cy=cart-empty]")
      .should("exist")
      .and("contain", "Votre panier est vide");
  });

  it("should not add out-of-stock product to cart", () => {
    // Navigate to product page and try adding out-of-stock product
    cy.getBySel("nav-link-products").click();
    cy.getBySel("product").eq(0).contains("Consulter").click();

    // Clear the quantity input field and try adding the product
    cy.getBySel("detail-product-quantity").clear().type("1");
    cy.getBySel("detail-product-add").click();

    // Verify that the user is not redirected to the cart
    cy.url().should("not.contain", "cart");
  });
});
