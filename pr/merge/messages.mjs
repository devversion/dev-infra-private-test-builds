/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { red } from '../../utils/console';
export function getCaretakerNotePromptMessage(pullRequest) {
    return red('Pull request has a caretaker note applied. Please make sure you read it.') +
        ("\nQuick link to PR: " + pullRequest.url + "\nDo you want to proceed merging?");
}
export function getTargettedBranchesConfirmationPromptMessage(pullRequest) {
    var targetBranchListAsString = pullRequest.targetBranches.map(function (b) { return " - " + b + "\n"; }).join('');
    return "Pull request #" + pullRequest.prNumber + " will merge into:\n" + targetBranchListAsString + "\nDo you want to proceed merging?";
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9kZXYtaW5mcmEvcHIvbWVyZ2UvbWVzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBSXhDLE1BQU0sVUFBVSw2QkFBNkIsQ0FBQyxXQUF3QjtJQUNwRSxPQUFPLEdBQUcsQ0FBQywwRUFBMEUsQ0FBQztTQUNsRix5QkFBdUIsV0FBVyxDQUFDLEdBQUcsc0NBQW1DLENBQUEsQ0FBQztBQUNoRixDQUFDO0FBRUQsTUFBTSxVQUFVLDZDQUE2QyxDQUFDLFdBQXdCO0lBQ3BGLElBQU0sd0JBQXdCLEdBQUcsV0FBVyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxRQUFNLENBQUMsT0FBSSxFQUFYLENBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMzRixPQUFPLG1CQUFpQixXQUFXLENBQUMsUUFBUSwyQkFDeEMsd0JBQXdCLHNDQUFtQyxDQUFDO0FBQ2xFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7cmVkfSBmcm9tICcuLi8uLi91dGlscy9jb25zb2xlJztcblxuaW1wb3J0IHtQdWxsUmVxdWVzdH0gZnJvbSAnLi9wdWxsLXJlcXVlc3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FyZXRha2VyTm90ZVByb21wdE1lc3NhZ2UocHVsbFJlcXVlc3Q6IFB1bGxSZXF1ZXN0KTogc3RyaW5nIHtcbiAgcmV0dXJuIHJlZCgnUHVsbCByZXF1ZXN0IGhhcyBhIGNhcmV0YWtlciBub3RlIGFwcGxpZWQuIFBsZWFzZSBtYWtlIHN1cmUgeW91IHJlYWQgaXQuJykgK1xuICAgICAgYFxcblF1aWNrIGxpbmsgdG8gUFI6ICR7cHVsbFJlcXVlc3QudXJsfVxcbkRvIHlvdSB3YW50IHRvIHByb2NlZWQgbWVyZ2luZz9gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGFyZ2V0dGVkQnJhbmNoZXNDb25maXJtYXRpb25Qcm9tcHRNZXNzYWdlKHB1bGxSZXF1ZXN0OiBQdWxsUmVxdWVzdCk6IHN0cmluZyB7XG4gIGNvbnN0IHRhcmdldEJyYW5jaExpc3RBc1N0cmluZyA9IHB1bGxSZXF1ZXN0LnRhcmdldEJyYW5jaGVzLm1hcChiID0+IGAgLSAke2J9XFxuYCkuam9pbignJyk7XG4gIHJldHVybiBgUHVsbCByZXF1ZXN0ICMke3B1bGxSZXF1ZXN0LnByTnVtYmVyfSB3aWxsIG1lcmdlIGludG86XFxuJHtcbiAgICAgIHRhcmdldEJyYW5jaExpc3RBc1N0cmluZ31cXG5EbyB5b3Ugd2FudCB0byBwcm9jZWVkIG1lcmdpbmc/YDtcbn1cbiJdfQ==