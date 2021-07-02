/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { getFormatConfig } from '../config';
import { Buildifier } from './buildifier';
import { ClangFormat } from './clang-format';
import { Prettier } from './prettier';
/**
 * Get all defined formatters which are active based on the current loaded config.
 */
export function getActiveFormatters() {
    const config = getFormatConfig().format;
    return [
        new Prettier(config),
        new Buildifier(config),
        new ClangFormat(config),
    ].filter((formatter) => formatter.isEnabled());
}
// Rexport symbols used for types elsewhere.
export { Formatter } from './base-formatter';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9kZXYtaW5mcmEvZm9ybWF0L2Zvcm1hdHRlcnMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUUxQyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRXBDOztHQUVHO0FBQ0gsTUFBTSxVQUFVLG1CQUFtQjtJQUNqQyxNQUFNLE1BQU0sR0FBRyxlQUFlLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDeEMsT0FBTztRQUNMLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUNwQixJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDdEIsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDO0tBQ3hCLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBRUQsNENBQTRDO0FBQzVDLE9BQU8sRUFBQyxTQUFTLEVBQWtCLE1BQU0sa0JBQWtCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtnZXRGb3JtYXRDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5cbmltcG9ydCB7QnVpbGRpZmllcn0gZnJvbSAnLi9idWlsZGlmaWVyJztcbmltcG9ydCB7Q2xhbmdGb3JtYXR9IGZyb20gJy4vY2xhbmctZm9ybWF0JztcbmltcG9ydCB7UHJldHRpZXJ9IGZyb20gJy4vcHJldHRpZXInO1xuXG4vKipcbiAqIEdldCBhbGwgZGVmaW5lZCBmb3JtYXR0ZXJzIHdoaWNoIGFyZSBhY3RpdmUgYmFzZWQgb24gdGhlIGN1cnJlbnQgbG9hZGVkIGNvbmZpZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdGl2ZUZvcm1hdHRlcnMoKSB7XG4gIGNvbnN0IGNvbmZpZyA9IGdldEZvcm1hdENvbmZpZygpLmZvcm1hdDtcbiAgcmV0dXJuIFtcbiAgICBuZXcgUHJldHRpZXIoY29uZmlnKSxcbiAgICBuZXcgQnVpbGRpZmllcihjb25maWcpLFxuICAgIG5ldyBDbGFuZ0Zvcm1hdChjb25maWcpLFxuICBdLmZpbHRlcigoZm9ybWF0dGVyKSA9PiBmb3JtYXR0ZXIuaXNFbmFibGVkKCkpO1xufVxuXG4vLyBSZXhwb3J0IHN5bWJvbHMgdXNlZCBmb3IgdHlwZXMgZWxzZXdoZXJlLlxuZXhwb3J0IHtGb3JtYXR0ZXIsIEZvcm1hdHRlckFjdGlvbn0gZnJvbSAnLi9iYXNlLWZvcm1hdHRlcic7XG4iXX0=