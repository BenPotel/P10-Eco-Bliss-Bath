describe("Retrieving a specific product", () => {
  it("should return the product details when a valid product ID is provided", () => {
    const productId = "7"; //
    cy.request(`${Cypress.env("apiUrl")}/products/${productId}`).then(
      (response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("id", Number(productId));
        const productDetails = response.body;
        expect(productDetails.name).to.eq("Extrait de nature");
        expect(productDetails.skin).to.eq("Peau sensible");
        expect(productDetails.aromas).to.eq("Eucalyptuse, Menthe poivrée");
      }
    );
  });

  it("should return an error when an invalid product ID is provided", () => {
    const invalidProductId = "1"; // Provide an invalid product ID

    cy.request({
      method: "GET",
      url: `${Cypress.env("apiUrl")}/products/${invalidProductId}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});
