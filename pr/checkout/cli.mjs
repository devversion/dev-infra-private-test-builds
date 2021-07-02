/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { addGithubTokenOption } from '../../utils/git/github-yargs';
import { checkOutPullRequestLocally } from '../common/checkout-pr';
/** Builds the checkout pull request command. */
function builder(yargs) {
    return addGithubTokenOption(yargs).positional('prNumber', { type: 'number', demandOption: true });
}
/** Handles the checkout pull request command. */
function handler({ prNumber, githubToken }) {
    return __awaiter(this, void 0, void 0, function* () {
        const prCheckoutOptions = { allowIfMaintainerCannotModify: true, branchName: `pr-${prNumber}` };
        yield checkOutPullRequestLocally(prNumber, githubToken, prCheckoutOptions);
    });
}
/** yargs command module for checking out a PR  */
export const CheckoutCommandModule = {
    handler,
    builder,
    command: 'checkout <pr-number>',
    describe: 'Checkout a PR from the upstream repo',
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vZGV2LWluZnJhL3ByL2NoZWNrb3V0L2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBSUgsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDbEUsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFPakUsZ0RBQWdEO0FBQ2hELFNBQVMsT0FBTyxDQUFDLEtBQVc7SUFDMUIsT0FBTyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztBQUNsRyxDQUFDO0FBRUQsaURBQWlEO0FBQ2pELFNBQWUsT0FBTyxDQUFDLEVBQUMsUUFBUSxFQUFFLFdBQVcsRUFBNkI7O1FBQ3hFLE1BQU0saUJBQWlCLEdBQUcsRUFBQyw2QkFBNkIsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sUUFBUSxFQUFFLEVBQUMsQ0FBQztRQUM5RixNQUFNLDBCQUEwQixDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUM3RSxDQUFDO0NBQUE7QUFFRCxrREFBa0Q7QUFDbEQsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQXVDO0lBQ3ZFLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTyxFQUFFLHNCQUFzQjtJQUMvQixRQUFRLEVBQUUsc0NBQXNDO0NBQ2pELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBcmd1bWVudHMsIEFyZ3YsIENvbW1hbmRNb2R1bGV9IGZyb20gJ3lhcmdzJztcblxuaW1wb3J0IHthZGRHaXRodWJUb2tlbk9wdGlvbn0gZnJvbSAnLi4vLi4vdXRpbHMvZ2l0L2dpdGh1Yi15YXJncyc7XG5pbXBvcnQge2NoZWNrT3V0UHVsbFJlcXVlc3RMb2NhbGx5fSBmcm9tICcuLi9jb21tb24vY2hlY2tvdXQtcHInO1xuXG5leHBvcnQgaW50ZXJmYWNlIENoZWNrb3V0T3B0aW9ucyB7XG4gIHByTnVtYmVyOiBudW1iZXI7XG4gIGdpdGh1YlRva2VuOiBzdHJpbmc7XG59XG5cbi8qKiBCdWlsZHMgdGhlIGNoZWNrb3V0IHB1bGwgcmVxdWVzdCBjb21tYW5kLiAqL1xuZnVuY3Rpb24gYnVpbGRlcih5YXJnczogQXJndikge1xuICByZXR1cm4gYWRkR2l0aHViVG9rZW5PcHRpb24oeWFyZ3MpLnBvc2l0aW9uYWwoJ3ByTnVtYmVyJywge3R5cGU6ICdudW1iZXInLCBkZW1hbmRPcHRpb246IHRydWV9KTtcbn1cblxuLyoqIEhhbmRsZXMgdGhlIGNoZWNrb3V0IHB1bGwgcmVxdWVzdCBjb21tYW5kLiAqL1xuYXN5bmMgZnVuY3Rpb24gaGFuZGxlcih7cHJOdW1iZXIsIGdpdGh1YlRva2VufTogQXJndW1lbnRzPENoZWNrb3V0T3B0aW9ucz4pIHtcbiAgY29uc3QgcHJDaGVja291dE9wdGlvbnMgPSB7YWxsb3dJZk1haW50YWluZXJDYW5ub3RNb2RpZnk6IHRydWUsIGJyYW5jaE5hbWU6IGBwci0ke3ByTnVtYmVyfWB9O1xuICBhd2FpdCBjaGVja091dFB1bGxSZXF1ZXN0TG9jYWxseShwck51bWJlciwgZ2l0aHViVG9rZW4sIHByQ2hlY2tvdXRPcHRpb25zKTtcbn1cblxuLyoqIHlhcmdzIGNvbW1hbmQgbW9kdWxlIGZvciBjaGVja2luZyBvdXQgYSBQUiAgKi9cbmV4cG9ydCBjb25zdCBDaGVja291dENvbW1hbmRNb2R1bGU6IENvbW1hbmRNb2R1bGU8e30sIENoZWNrb3V0T3B0aW9ucz4gPSB7XG4gIGhhbmRsZXIsXG4gIGJ1aWxkZXIsXG4gIGNvbW1hbmQ6ICdjaGVja291dCA8cHItbnVtYmVyPicsXG4gIGRlc2NyaWJlOiAnQ2hlY2tvdXQgYSBQUiBmcm9tIHRoZSB1cHN0cmVhbSByZXBvJyxcbn07XG4iXX0=