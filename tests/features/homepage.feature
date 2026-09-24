Feature: INEIGHT API developer portal home page

    Background:
        Given I am on the INEIGHT API developer portal home page

    Scenario: Display the portal welcome content
        Then the portal title should be "Home - INEIGHT - QA Portal"
        And the welcome heading "Let's Build Together" should be visible
        And the "SIGN IN" and "SIGN UP" links should be visible

    Scenario: Display the getting started resource
        When I view the portal resources
        Then the "GETTING STARTED" resource should be visible
