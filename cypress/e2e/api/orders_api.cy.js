describe("checking cart with api", () => {
  let userToken;
  let orderList;

  it("should log in as Test user", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("apiUrl") + "/login",
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

  it("tries to access cart while logged out, should get 403", () => {
    cy.request({
      method: "GET",
      url: Cypress.env("apiUrl") + "/orders",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(403);
    });
  });

  it("tries to access cart while logged in", () => {
    cy.request({
      method: "GET",
      url: Cypress.env("apiUrl") + "/orders",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  describe("Cart manipulation tests", () => {
    beforeEach(() => {
      // Retrieve the current order details to get the order ID
      cy.request({
        method: "GET",
        url: Cypress.env("apiUrl") + "/orders",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        orderList = response.body.orderLines;
        orderList.forEach((item) => {
          cy.request({
            method: "DELETE",
            url: "http://localhost:8081/orders/" + item.id + "/delete",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
        });
      });
    });

    it("should add a product with stock to cart and check order list length", () => {
      cy.request({
        method: "PUT",
        url: Cypress.env("apiUrl") + "/orders/add",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: {
          product: "7",
          quantity: "1",
        },
      }).then((response) => {
        // Check if adding product to cart was successful
        expect(response.status).to.eq(200);

        // Retrieve the order list via API and check the length of the response
        cy.request({
          method: "GET",
          url: Cypress.env("apiUrl") + "/orders",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
          const orderList = response.body.orderLines;
          expect(orderList.length).to.be.greaterThan(0);
        });
      });
    });

    it("should not add an out-of-stock product to cart and check order list length", () => {
      // Attempt to add an out-of-stock product to the cart via API
      cy.request({
        method: "PUT",
        url: Cypress.env("apiUrl") + "/orders/add",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: {
          product: "1", // '1' being the ID of the out-of-stock product in this case
          quantity: "1",
        },
        failOnStatusCode: false, // Prevent the test from failing on non-2xx status codes
      }).then((response) => {
        // Check if adding the out-of-stock product to cart fails
        if (response.status !== 200) {
          // If the status code is not 200, the test continues
          cy.log(
            "Failed to add out-of-stock product to cart. Status code:",
            response.status
          );
        } else {
          // If the status code is 200, fail the test
          cy.fail("Unexpected success adding out-of-stock product to cart");
        }

        // Retrieve the order list via API and check the length of the response
        cy.request({
          method: "GET",
          url: Cypress.env("apiUrl") + "/orders",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
          const orderList = response.body.orderLines;
          expect(orderList.length).to.eq(0); // Ensure that no order lines are added due to the out-of-stock product
        });
      });
    });
  });
});
