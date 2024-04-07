describe("XSS vulnerability in review form as website user", () => {
  it("should not successfully inject malicious script into the review form fields", () => {
    cy.login();

    cy.wait(1000);

    cy.getBySel("nav-link-reviews").click();
    cy.get('[data-cy="review-input-rating-images"] img').last().click();

    // Inject malicious script into the review form fields
    const maliciousScript = "<script>alert('XSS attack!')</script>";
    cy.getBySel("review-input-title").type("Ceci est un test");
    cy.getBySel("review-input-comment").type(maliciousScript);

    // Submit the review
    cy.getBySel("review-submit").click();
    // Check that the malicious script is not present in the review content
    cy.getBySel("review-comment").should("not.contain", maliciousScript);
  });
});
