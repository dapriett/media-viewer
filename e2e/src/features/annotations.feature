@MediaViewer @Annotations
Feature:  Media Viewer Annotations

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "Media Viewer Demo"
    When I click Annotate button
    Then I expect Annotate button must be enabled

  @CreateAnnotation
  Scenario: Create Annotations
    When I select a text on pdf doc
    Then I expect text highlight popup should appear
    And I add a comment to the selected PDF text
    Then I check whether the comment has been created
#
#
#  @PDFTextHighlight_Comment
#  Scenario: Add a comment to PDF Text highlight
#    When I select a text on pdf
#    Then I expect text highlight popup should appear
#    And I add a comment to the selected PDF text
#    Then I verify whether the comment has been saved


  @PDF_Add_Annotation
  Scenario: Highlight text and add comment
    When I highlight text on a PDF document
    Then I should be able to add comment for the highlight
