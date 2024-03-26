describe("posting a review", () => {
  let userToken;

  it("should successfully log in", () => {
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

  it("should add a review", () => {
    cy.request({
      method: "POST",
      url: Cypress.env("apiUrl") + "/reviews",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      body: {
        title: "Exemple de titre d'avis",
        comment: "Exemple de commentaire",
        rating: "5",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("should add a review - XSS test", () => {
    // Attempt to inject a malicious script
    const maliciousScript = "<script>alert('XSS attack via API!')</script>";

    cy.request({
      method: "POST",
      url: Cypress.env("apiUrl") + "/reviews",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      body: {
        title: maliciousScript, // Inject malicious script into the title
        comment: maliciousScript, // Inject malicious script into the comment
        rating: "5",
      },
    }).then((response) => {
      // Check if the response status is 200, which means the request was successful
      expect(response.status).to.eq(200);

      // Convert the response body to a string
      const responseBodyString = JSON.stringify(response.body);

      // Check if the response body contains the injected script
      if (responseBodyString.includes(maliciousScript)) {
        // The injected script is present in the response body
        // This indicates that the application may be vulnerable to XSS attacks
        cy.log(
          "XSS vulnerability detected: Malicious script found in the response body."
        );
      } else {
        // The injected script is not present in the response body
        // This could indicate that the application properly sanitized or encoded the input
        cy.log(
          "XSS vulnerability not detected: Malicious script not found in the response body."
        );
      }
    });
  });
});
