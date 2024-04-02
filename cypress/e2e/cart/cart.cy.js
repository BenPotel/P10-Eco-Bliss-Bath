let userToken;

describe("Cart functionality tests", () => {
  beforeEach(() => {
    it("login test true", () => {
      cy.request({
        method: "POST",
        url: "http://localhost:8081/login",
        body: {
          username: "test2@test.fr",
          password: "testtest",
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("token");

        userToken = response.body.token;
      });
    });

    //On vérifie si il y a des produits dans le panier et si oui, on les supprime
    it("verify order lines", () => {
      cy.request({
        method: "GET",
        url: "http://localhost:8081/orders",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        orderLines = response.body.orderLines;
        orderLines.forEach((line) => {
          cy.request({
            method: "DELETE",
            url: "http://localhost:8081/orders/" + line.id + "/delete",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
        });
      });
    });

    // Visit the login page and manually log in before each test
    cy.visit("http://localhost:8080/#/");
    cy.getBySel("nav-link-login").click();
    cy.getBySel("login-input-username").type("test2@test.fr");
    cy.getBySel("login-input-password").type("testtest");
    cy.getBySel("login-submit").click();
    cy.contains("Mon panier").should("be.visible");
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

  it("should not allow adding negative or zero quantity to cart", () => {
    // Navigate to product page and try adding negative quantity
    cy.getBySel("nav-link-products").should("be.visible").click();
    cy.getBySel("nav-link-products").click();
    cy.getBySel("product").eq(0).contains("Consulter").click();
    cy.getBySel("detail-product-quantity").clear().focus().type("-3");
    cy.getBySel("detail-product-add").click();
    cy.url().should("not.contain", "cart");

    // Try adding zero quantity
    cy.getBySel("detail-product-quantity").clear().focus().type("0");
    cy.getBySel("detail-product-add").click();
    // Check if the product is added to the cart or not
    cy.getBySel("nav-link-cart").click();
    cy.url().should("contain", "cart");
    cy.getBySel("cart-line").should("not.exist");
  });

  it("should not add out-of-stock product to cart", () => {
    // Navigate to product page and try adding out-of-stock product
    cy.getBySel("nav-link-products").click();
    cy.getBySel("product").eq(0).contains("Consulter").click();
    cy.getBySel("detail-product-quantity").clear().focus().type("1");
    cy.getBySel("detail-product-add").click();
    cy.getBySel("nav-link-cart").click();
    cy.url().should("contain", "cart");
    cy.getBySel("cart-line").should("not.exist");
  });

  /* it("should add multiple products to cart and update stock", () => {
    let initialStock;
    let finalStock;
    // Navigate to product page and check initial stock
    cy.getBySel("nav-link-products").click();
    cy.getBySel("product").eq(1).contains("Consulter").click();
    cy.getBySel("detail-product-stock")
      .invoke("text")
      .then((text) => {
        initialStock = parseInt(text.trim().split(" ")[0]);
      });

    // Add multiple products to cart
    cy.getBySel("detail-product-quantity").clear().type("20");
    cy.getBySel("detail-product-add").click();
    cy.contains("Mon panier").click();

    // Check cart
    cy.getBySel("cart-line").should("exist");

    // Go back to product page and check updated stock
    cy.go("back");

    // Wrap the following commands to ensure they execute after navigating back
    cy.wrap(null).then(() => {
      cy.getBySel("product").eq(1).contains("Consulter").click();
      cy.getBySel("detail-product-stock")
        .invoke("text")
        .then((text) => {
          finalStock = parseInt(text.trim().split(" ")[0]);

          // Ensure stock is updated correctly
          const quantityAddedToCart = 20;
          expect(finalStock).to.eq(initialStock - quantityAddedToCart);
        });
    });
  }); */
});
