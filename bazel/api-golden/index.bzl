load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary", "nodejs_test")

nodejs_test_args = [
    # Needed so that node doesn't walk back to the source directory.
    # From there, the relative imports would point to .ts files.
    "--node_options=--preserve-symlinks",
    # TODO(josephperrott): update dependency usages to no longer need bazel patch module resolver
    # See: https://github.com/bazelbuild/rules_nodejs/wiki#--bazel_patch_module_resolver-now-defaults-to-false-2324
    "--bazel_patch_module_resolver",
]

default_strip_export_pattern = "^ɵ(?!ɵdefineInjectable|ɵinject|ɵInjectableDef)"

"""Escapes a Regular expression so that it can be passed as process argument."""

def _escape_regex_for_arg(value):
    return "\"%s\"" % value

"""
  Builds an API report for the specified entry-point and compares it against the
  specified golden
"""

def api_golden_test(
        name,
        golden,
        entry_point,
        data = [],
        strip_export_pattern = default_strip_export_pattern,
        **kwargs):
    quoted_export_pattern = _escape_regex_for_arg(strip_export_pattern)

    kwargs["tags"] = kwargs.get("tags", []) + ["api_guard"]

    nodejs_test(
        name = name,
        data = ["@npm//@angular/dev-infra-private/bazel/api-golden", "//:package.json"] + data,
        entry_point = "@npm//@angular/dev-infra-private/bazel/api-golden:index.ts",
        templated_args = nodejs_test_args + [golden, entry_point, "false", quoted_export_pattern],
        **kwargs
    )

    nodejs_binary(
        name = name + ".accept",
        testonly = True,
        data = ["@npm//@angular/dev-infra-private/bazel/api-golden", "//:package.json"] + data,
        entry_point = "@npm//@angular/dev-infra-private/bazel/api-golden:index.ts",
        templated_args = nodejs_test_args + [golden, entry_point, "true", quoted_export_pattern],
        **kwargs
    )

"""
  Builds an API report for all entrypoints within the given NPM package and compares it
  against goldens within the specified directory.
"""

def api_golden_test_npm_package(
        name,
        golden_dir,
        npm_package,
        data = [],
        strip_export_pattern = default_strip_export_pattern,
        **kwargs):
    quoted_export_pattern = _escape_regex_for_arg(strip_export_pattern)

    kwargs["tags"] = kwargs.get("tags", []) + ["api_guard"]

    nodejs_test(
        name = name,
        data = ["@npm//@angular/dev-infra-private/bazel/api-golden"] + data,
        entry_point = "@npm//@angular/dev-infra-private/bazel/api-golden:index_npm_packages.ts",
        templated_args = nodejs_test_args + [golden_dir, npm_package, "false", quoted_export_pattern],
        **kwargs
    )

    nodejs_binary(
        name = name + ".accept",
        testonly = True,
        data = ["@npm//@angular/dev-infra-private/bazel/api-golden"] + data,
        entry_point = "@npm//@angular/dev-infra-private/bazel/api-golden:index_npm_packages.ts",
        templated_args = nodejs_test_args + [golden_dir, npm_package, "true", quoted_export_pattern],
        **kwargs
    )
