/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { sync as globSync } from 'glob';
import { isAbsolute, relative, resolve } from 'path';
import { error, green, info, red, yellow } from '../utils/console';
import { Analyzer } from './analyzer';
import { loadTestConfig } from './config';
import { convertPathToForwardSlash } from './file_system';
import { compareGoldens, convertReferenceChainToGolden } from './golden';
export function tsCircularDependenciesBuilder(localYargs) {
    return localYargs.help()
        .strict()
        .demandCommand()
        .option('config', { type: 'string', demandOption: true, description: 'Path to the configuration file.' })
        .option('warnings', { type: 'boolean', description: 'Prints all warnings.' })
        .command('check', 'Checks if the circular dependencies have changed.', args => args, argv => {
        const { config: configArg, warnings } = argv;
        const configPath = isAbsolute(configArg) ? configArg : resolve(configArg);
        const config = loadTestConfig(configPath);
        process.exit(main(false, config, !!warnings));
    })
        .command('approve', 'Approves the current circular dependencies.', args => args, argv => {
        const { config: configArg, warnings } = argv;
        const configPath = isAbsolute(configArg) ? configArg : resolve(configArg);
        const config = loadTestConfig(configPath);
        process.exit(main(true, config, !!warnings));
    });
}
/**
 * Runs the ts-circular-dependencies tool.
 * @param approve Whether the detected circular dependencies should be approved.
 * @param config Configuration for the current circular dependencies test.
 * @param printWarnings Whether warnings should be printed out.
 * @returns Status code.
 */
export function main(approve, config, printWarnings) {
    const { baseDir, goldenFile, glob, resolveModule, approveCommand } = config;
    const analyzer = new Analyzer(resolveModule);
    const cycles = [];
    const checkedNodes = new WeakSet();
    globSync(glob, { absolute: true, ignore: ['**/node_modules/**'] }).forEach(filePath => {
        const sourceFile = analyzer.getSourceFile(filePath);
        cycles.push(...analyzer.findCycles(sourceFile, checkedNodes));
    });
    const actual = convertReferenceChainToGolden(cycles, baseDir);
    info(green(`   Current number of cycles: ${yellow(cycles.length.toString())}`));
    if (approve) {
        writeFileSync(goldenFile, JSON.stringify(actual, null, 2));
        info(green('???  Updated golden file.'));
        return 0;
    }
    else if (!existsSync(goldenFile)) {
        error(red(`???  Could not find golden file: ${goldenFile}`));
        return 1;
    }
    const warningsCount = analyzer.unresolvedFiles.size + analyzer.unresolvedModules.size;
    // By default, warnings for unresolved files or modules are not printed. This is because
    // it's common that third-party modules are not resolved/visited. Also generated files
    // from the View Engine compiler (i.e. factories, summaries) cannot be resolved.
    if (printWarnings && warningsCount !== 0) {
        info(yellow('???  The following imports could not be resolved:'));
        Array.from(analyzer.unresolvedModules).sort().forEach(specifier => info(`  ??? ${specifier}`));
        analyzer.unresolvedFiles.forEach((value, key) => {
            info(`  ??? ${getRelativePath(baseDir, key)}`);
            value.sort().forEach(specifier => info(`      ${specifier}`));
        });
    }
    else {
        info(yellow(`???  ${warningsCount} imports could not be resolved.`));
        info(yellow(`   Please rerun with "--warnings" to inspect unresolved imports.`));
    }
    const expected = JSON.parse(readFileSync(goldenFile, 'utf8'));
    const { fixedCircularDeps, newCircularDeps } = compareGoldens(actual, expected);
    const isMatching = fixedCircularDeps.length === 0 && newCircularDeps.length === 0;
    if (isMatching) {
        info(green('???  Golden matches current circular dependencies.'));
        return 0;
    }
    error(red('???  Golden does not match current circular dependencies.'));
    if (newCircularDeps.length !== 0) {
        error(yellow(`   New circular dependencies which are not allowed:`));
        newCircularDeps.forEach(c => error(`     ??? ${convertReferenceChainToString(c)}`));
        error();
    }
    if (fixedCircularDeps.length !== 0) {
        error(yellow(`   Fixed circular dependencies that need to be removed from the golden:`));
        fixedCircularDeps.forEach(c => error(`     ??? ${convertReferenceChainToString(c)}`));
        info(yellow(`\n   Total: ${newCircularDeps.length} new cycle(s), ${fixedCircularDeps.length} fixed cycle(s). \n`));
        if (approveCommand) {
            info(yellow(`   Please approve the new golden with: ${approveCommand}`));
        }
        else {
            info(yellow(`   Please update the golden. The following command can be ` +
                `run: yarn ts-circular-deps approve ${getRelativePath(process.cwd(), goldenFile)}.`));
        }
    }
    return 1;
}
/** Gets the specified path relative to the base directory. */
function getRelativePath(baseDir, path) {
    return convertPathToForwardSlash(relative(baseDir, path));
}
/** Converts the given reference chain to its string representation. */
function convertReferenceChainToString(chain) {
    return chain.join(' ??? ');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9kZXYtaW5mcmEvdHMtY2lyY3VsYXItZGVwZW5kZW5jaWVzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBQyxNQUFNLElBQUksQ0FBQztBQUMzRCxPQUFPLEVBQUMsSUFBSSxJQUFJLFFBQVEsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN0QyxPQUFPLEVBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFJbkQsT0FBTyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUVqRSxPQUFPLEVBQUMsUUFBUSxFQUFpQixNQUFNLFlBQVksQ0FBQztBQUNwRCxPQUFPLEVBQWlDLGNBQWMsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUN4RSxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDeEQsT0FBTyxFQUFDLGNBQWMsRUFBRSw2QkFBNkIsRUFBUyxNQUFNLFVBQVUsQ0FBQztBQUcvRSxNQUFNLFVBQVUsNkJBQTZCLENBQUMsVUFBc0I7SUFDbEUsT0FBTyxVQUFVLENBQUMsSUFBSSxFQUFFO1NBQ25CLE1BQU0sRUFBRTtTQUNSLGFBQWEsRUFBRTtTQUNmLE1BQU0sQ0FDSCxRQUFRLEVBQ1IsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLGlDQUFpQyxFQUFDLENBQUM7U0FDeEYsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLHNCQUFzQixFQUFDLENBQUM7U0FDMUUsT0FBTyxDQUNKLE9BQU8sRUFBRSxtREFBbUQsRUFB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LE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUVELDhEQUE4RDtBQUM5RCxTQUFTLGVBQWUsQ0FBQyxPQUFlLEVBQUUsSUFBWTtJQUNwRCxPQUFPLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM1RCxDQUFDO0FBRUQsdUVBQXVFO0FBQ3ZFLFNBQVMsNkJBQTZCLENBQUMsS0FBNkI7SUFDbEUsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtleGlzdHNTeW5jLCByZWFkRmlsZVN5bmMsIHdyaXRlRmlsZVN5bmN9IGZyb20gJ2ZzJztcbmltcG9ydCB7c3luYyBhcyBnbG9iU3luY30gZnJvbSAnZ2xvYic7XG5pbXBvcnQge2lzQWJzb2x1dGUsIHJlbGF0aXZlLCByZXNvbHZlfSBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuXG5pbXBvcnQge2Vycm9yLCBncmVlbiwgaW5mbywgcmVkLCB5ZWxsb3d9IGZyb20gJy4uL3V0aWxzL2NvbnNvbGUnO1xuXG5pbXBvcnQge0FuYWx5emVyLCBSZWZlcmVuY2VDaGFpbn0gZnJvbSAnLi9hbmFseXplcic7XG5pbXBvcnQge0NpcmN1bGFyRGVwZW5kZW5jaWVzVGVzdENvbmZpZywgbG9hZFRlc3RDb25maWd9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7Y29udmVydFBhdGhUb0ZvcndhcmRTbGFzaH0gZnJvbSAnLi9maWxlX3N5c3RlbSc7XG5pbXBvcnQge2NvbXBhcmVHb2xkZW5zLCBjb252ZXJ0UmVmZXJlbmNlQ2hhaW5Ub0dvbGRlbiwgR29sZGVufSBmcm9tICcuL2dvbGRlbic7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHRzQ2lyY3VsYXJEZXBlbmRlbmNpZXNCdWlsZGVyKGxvY2FsWWFyZ3M6IHlhcmdzLkFyZ3YpIHtcbiAgcmV0dXJuIGxvY2FsWWFyZ3MuaGVscCgpXG4gICAgICAuc3RyaWN0KClcbiAgICAgIC5kZW1hbmRDb21tYW5kKClcbiAgICAgIC5vcHRpb24oXG4gICAgICAgICAgJ2NvbmZpZycsXG4gICAgICAgICAge3R5cGU6ICdzdHJpbmcnLCBkZW1hbmRPcHRpb246IHRydWUsIGRlc2NyaXB0aW9uOiAnUGF0aCB0byB0aGUgY29uZmlndXJhdGlvbiBmaWxlLid9KVxuICAgICAgLm9wdGlvbignd2FybmluZ3MnLCB7dHlwZTogJ2Jvb2xlYW4nLCBkZXNjcmlwdGlvbjogJ1ByaW50cyBhbGwgd2FybmluZ3MuJ30pXG4gICAgICAuY29tbWFuZChcbiAgICAgICAgICAnY2hlY2snLCAnQ2hlY2tzIGlmIHRoZSBjaXJjdWxhciBkZXBlbmRlbmNpZXMgaGF2ZSBjaGFuZ2VkLicsIGFyZ3MgPT4gYXJncyxcbiAgICAgICAgICBhcmd2ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHtjb25maWc6IGNvbmZpZ0FyZywgd2FybmluZ3N9ID0gYXJndjtcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZ1BhdGggPSBpc0Fic29sdXRlKGNvbmZpZ0FyZykgPyBjb25maWdBcmcgOiByZXNvbHZlKGNvbmZpZ0FyZyk7XG4gICAgICAgICAgICBjb25zdCBjb25maWcgPSBsb2FkVGVzdENvbmZpZyhjb25maWdQYXRoKTtcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdChtYWluKGZhbHNlLCBjb25maWcsICEhd2FybmluZ3MpKTtcbiAgICAgICAgICB9KVxuICAgICAgLmNvbW1hbmQoJ2FwcHJvdmUnLCAnQXBwcm92ZXMgdGhlIGN1cnJlbnQgY2lyY3VsYXIgZGVwZW5kZW5jaWVzLicsIGFyZ3MgPT4gYXJncywgYXJndiA9PiB7XG4gICAgICAgIGNvbnN0IHtjb25maWc6IGNvbmZpZ0FyZywgd2FybmluZ3N9ID0gYXJndjtcbiAgICAgICAgY29uc3QgY29uZmlnUGF0aCA9IGlzQWJzb2x1dGUoY29uZmlnQXJnKSA/IGNvbmZpZ0FyZyA6IHJlc29sdmUoY29uZmlnQXJnKTtcbiAgICAgICAgY29uc3QgY29uZmlnID0gbG9hZFRlc3RDb25maWcoY29uZmlnUGF0aCk7XG4gICAgICAgIHByb2Nlc3MuZXhpdChtYWluKHRydWUsIGNvbmZpZywgISF3YXJuaW5ncykpO1xuICAgICAgfSk7XG59XG5cbi8qKlxuICogUnVucyB0aGUgdHMtY2lyY3VsYXItZGVwZW5kZW5jaWVzIHRvb2wuXG4gKiBAcGFyYW0gYXBwcm92ZSBXaGV0aGVyIHRoZSBkZXRlY3RlZCBjaXJjdWxhciBkZXBlbmRlbmNpZXMgc2hvdWxkIGJlIGFwcHJvdmVkLlxuICogQHBhcmFtIGNvbmZpZyBDb25maWd1cmF0aW9uIGZvciB0aGUgY3VycmVudCBjaXJjdWxhciBkZXBlbmRlbmNpZXMgdGVzdC5cbiAqIEBwYXJhbSBwcmludFdhcm5pbmdzIFdoZXRoZXIgd2FybmluZ3Mgc2hvdWxkIGJlIHByaW50ZWQgb3V0LlxuICogQHJldHVybnMgU3RhdHVzIGNvZGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWluKFxuICAgIGFwcHJvdmU6IGJvb2xlYW4sIGNvbmZpZzogQ2lyY3VsYXJEZXBlbmRlbmNpZXNUZXN0Q29uZmlnLCBwcmludFdhcm5pbmdzOiBib29sZWFuKTogbnVtYmVyIHtcbiAgY29uc3Qge2Jhc2VEaXIsIGdvbGRlbkZpbGUsIGdsb2IsIHJlc29sdmVNb2R1bGUsIGFwcHJvdmVDb21tYW5kfSA9IGNvbmZpZztcbiAgY29uc3QgYW5hbHl6ZXIgPSBuZXcgQW5hbHl6ZXIocmVzb2x2ZU1vZHVsZSk7XG4gIGNvbnN0IGN5Y2xlczogUmVmZXJlbmNlQ2hhaW5bXSA9IFtdO1xuICBjb25zdCBjaGVja2VkTm9kZXMgPSBuZXcgV2Vha1NldDx0cy5Tb3VyY2VGaWxlPigpO1xuXG4gIGdsb2JTeW5jKGdsb2IsIHthYnNvbHV0ZTogdHJ1ZSwgaWdub3JlOiBbJyoqL25vZGVfbW9kdWxlcy8qKiddfSkuZm9yRWFjaChmaWxlUGF0aCA9PiB7XG4gICAgY29uc3Qgc291cmNlRmlsZSA9IGFuYWx5emVyLmdldFNvdXJjZUZpbGUoZmlsZVBhdGgpO1xuICAgIGN5Y2xlcy5wdXNoKC4uLmFuYWx5emVyLmZpbmRDeWNsZXMoc291cmNlRmlsZSwgY2hlY2tlZE5vZGVzKSk7XG4gIH0pO1xuXG4gIGNvbnN0IGFjdHVhbCA9IGNvbnZlcnRSZWZlcmVuY2VDaGFpblRvR29sZGVuKGN5Y2xlcywgYmFzZURpcik7XG5cbiAgaW5mbyhncmVlbihgICAgQ3VycmVudCBudW1iZXIgb2YgY3ljbGVzOiAke3llbGxvdyhjeWNsZXMubGVuZ3RoLnRvU3RyaW5nKCkpfWApKTtcblxuICBpZiAoYXBwcm92ZSkge1xuICAgIHdyaXRlRmlsZVN5bmMoZ29sZGVuRmlsZSwgSlNPTi5zdHJpbmdpZnkoYWN0dWFsLCBudWxsLCAyKSk7XG4gICAgaW5mbyhncmVlbign4pyFICBVcGRhdGVkIGdvbGRlbiBmaWxlLicpKTtcbiAgICByZXR1cm4gMDtcbiAgfSBlbHNlIGlmICghZXhpc3RzU3luYyhnb2xkZW5GaWxlKSkge1xuICAgIGVycm9yKHJlZChg4p2MICBDb3VsZCBub3QgZmluZCBnb2xkZW4gZmlsZTogJHtnb2xkZW5GaWxlfWApKTtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIGNvbnN0IHdhcm5pbmdzQ291bnQgPSBhbmFseXplci51bnJlc29sdmVkRmlsZXMuc2l6ZSArIGFuYWx5emVyLnVucmVzb2x2ZWRNb2R1bGVzLnNpemU7XG5cbiAgLy8gQnkgZGVmYXVsdCwgd2FybmluZ3MgZm9yIHVucmVzb2x2ZWQgZmlsZXMgb3IgbW9kdWxlcyBhcmUgbm90IHByaW50ZWQuIFRoaXMgaXMgYmVjYXVzZVxuICAvLyBpdCdzIGNvbW1vbiB0aGF0IHRoaXJkLXBhcnR5IG1vZHVsZXMgYXJlIG5vdCByZXNvbHZlZC92aXNpdGVkLiBBbHNvIGdlbmVyYXRlZCBmaWxlc1xuICAvLyBmcm9tIHRoZSBWaWV3IEVuZ2luZSBjb21waWxlciAoaS5lLiBmYWN0b3JpZXMsIHN1bW1hcmllcykgY2Fubm90IGJlIHJlc29sdmVkLlxuICBpZiAocHJpbnRXYXJuaW5ncyAmJiB3YXJuaW5nc0NvdW50ICE9PSAwKSB7XG4gICAgaW5mbyh5ZWxsb3coJ+KaoCAgVGhlIGZvbGxvd2luZyBpbXBvcnRzIGNvdWxkIG5vdCBiZSByZXNvbHZlZDonKSk7XG4gICAgQXJyYXkuZnJvbShhbmFseXplci51bnJlc29sdmVkTW9kdWxlcykuc29ydCgpLmZvckVhY2goc3BlY2lmaWVyID0+IGluZm8oYCAg4oCiICR7c3BlY2lmaWVyfWApKTtcbiAgICBhbmFseXplci51bnJlc29sdmVkRmlsZXMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgaW5mbyhgICDigKIgJHtnZXRSZWxhdGl2ZVBhdGgoYmFzZURpciwga2V5KX1gKTtcbiAgICAgIHZhbHVlLnNvcnQoKS5mb3JFYWNoKHNwZWNpZmllciA9PiBpbmZvKGAgICAgICAke3NwZWNpZmllcn1gKSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgaW5mbyh5ZWxsb3coYOKaoCAgJHt3YXJuaW5nc0NvdW50fSBpbXBvcnRzIGNvdWxkIG5vdCBiZSByZXNvbHZlZC5gKSk7XG4gICAgaW5mbyh5ZWxsb3coYCAgIFBsZWFzZSByZXJ1biB3aXRoIFwiLS13YXJuaW5nc1wiIHRvIGluc3BlY3QgdW5yZXNvbHZlZCBpbXBvcnRzLmApKTtcbiAgfVxuXG4gIGNvbnN0IGV4cGVjdGVkID0gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMoZ29sZGVuRmlsZSwgJ3V0ZjgnKSkgYXMgR29sZGVuO1xuICBjb25zdCB7Zml4ZWRDaXJjdWxhckRlcHMsIG5ld0NpcmN1bGFyRGVwc30gPSBjb21wYXJlR29sZGVucyhhY3R1YWwsIGV4cGVjdGVkKTtcbiAgY29uc3QgaXNNYXRjaGluZyA9IGZpeGVkQ2lyY3VsYXJEZXBzLmxlbmd0aCA9PT0gMCAmJiBuZXdDaXJjdWxhckRlcHMubGVuZ3RoID09PSAwO1xuXG4gIGlmIChpc01hdGNoaW5nKSB7XG4gICAgaW5mbyhncmVlbign4pyFICBHb2xkZW4gbWF0Y2hlcyBjdXJyZW50IGNpcmN1bGFyIGRlcGVuZGVuY2llcy4nKSk7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBlcnJvcihyZWQoJ+KdjCAgR29sZGVuIGRvZXMgbm90IG1hdGNoIGN1cnJlbnQgY2lyY3VsYXIgZGVwZW5kZW5jaWVzLicpKTtcbiAgaWYgKG5ld0NpcmN1bGFyRGVwcy5sZW5ndGggIT09IDApIHtcbiAgICBlcnJvcih5ZWxsb3coYCAgIE5ldyBjaXJjdWxhciBkZXBlbmRlbmNpZXMgd2hpY2ggYXJlIG5vdCBhbGxvd2VkOmApKTtcbiAgICBuZXdDaXJjdWxhckRlcHMuZm9yRWFjaChjID0+IGVycm9yKGAgICAgIOKAoiAke2NvbnZlcnRSZWZlcmVuY2VDaGFpblRvU3RyaW5nKGMpfWApKTtcbiAgICBlcnJvcigpO1xuICB9XG4gIGlmIChmaXhlZENpcmN1bGFyRGVwcy5sZW5ndGggIT09IDApIHtcbiAgICBlcnJvcih5ZWxsb3coYCAgIEZpeGVkIGNpcmN1bGFyIGRlcGVuZGVuY2llcyB0aGF0IG5lZWQgdG8gYmUgcmVtb3ZlZCBmcm9tIHRoZSBnb2xkZW46YCkpO1xuICAgIGZpeGVkQ2lyY3VsYXJEZXBzLmZvckVhY2goYyA9PiBlcnJvcihgICAgICDigKIgJHtjb252ZXJ0UmVmZXJlbmNlQ2hhaW5Ub1N0cmluZyhjKX1gKSk7XG4gICAgaW5mbyh5ZWxsb3coYFxcbiAgIFRvdGFsOiAke25ld0NpcmN1bGFyRGVwcy5sZW5ndGh9IG5ldyBjeWNsZShzKSwgJHtcbiAgICAgICAgZml4ZWRDaXJjdWxhckRlcHMubGVuZ3RofSBmaXhlZCBjeWNsZShzKS4gXFxuYCkpO1xuICAgIGlmIChhcHByb3ZlQ29tbWFuZCkge1xuICAgICAgaW5mbyh5ZWxsb3coYCAgIFBsZWFzZSBhcHByb3ZlIHRoZSBuZXcgZ29sZGVuIHdpdGg6ICR7YXBwcm92ZUNvbW1hbmR9YCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbmZvKHllbGxvdyhcbiAgICAgICAgICBgICAgUGxlYXNlIHVwZGF0ZSB0aGUgZ29sZGVuLiBUaGUgZm9sbG93aW5nIGNvbW1hbmQgY2FuIGJlIGAgK1xuICAgICAgICAgIGBydW46IHlhcm4gdHMtY2lyY3VsYXItZGVwcyBhcHByb3ZlICR7Z2V0UmVsYXRpdmVQYXRoKHByb2Nlc3MuY3dkKCksIGdvbGRlbkZpbGUpfS5gKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiAxO1xufVxuXG4vKiogR2V0cyB0aGUgc3BlY2lmaWVkIHBhdGggcmVsYXRpdmUgdG8gdGhlIGJhc2UgZGlyZWN0b3J5LiAqL1xuZnVuY3Rpb24gZ2V0UmVsYXRpdmVQYXRoKGJhc2VEaXI6IHN0cmluZywgcGF0aDogc3RyaW5nKSB7XG4gIHJldHVybiBjb252ZXJ0UGF0aFRvRm9yd2FyZFNsYXNoKHJlbGF0aXZlKGJhc2VEaXIsIHBhdGgpKTtcbn1cblxuLyoqIENvbnZlcnRzIHRoZSBnaXZlbiByZWZlcmVuY2UgY2hhaW4gdG8gaXRzIHN0cmluZyByZXByZXNlbnRhdGlvbi4gKi9cbmZ1bmN0aW9uIGNvbnZlcnRSZWZlcmVuY2VDaGFpblRvU3RyaW5nKGNoYWluOiBSZWZlcmVuY2VDaGFpbjxzdHJpbmc+KSB7XG4gIHJldHVybiBjaGFpbi5qb2luKCcg4oaSICcpO1xufVxuIl19