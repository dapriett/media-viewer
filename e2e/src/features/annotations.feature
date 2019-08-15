@MediaViewer @Annotations
Feature:  Media Viewer Annotations

  Background:
    Given I am on Media Viewer Page
    Then I expect the page header to be "Media Viewer Demo"
    When I click Annotate button
    Then I expect Annotate button must be enabled

  @PDFTextHighlight @EM-1711
  Scenario: PDF Text highlight
    When I highlight text on a PDF document
    Then I expect text highlight popup should appear

#  @PDF_Add_Annotation
#  Scenario: Highlight text and add comment
#    When I highlight text on a PDF document
#    Then I should be able to add comment for the highlight
