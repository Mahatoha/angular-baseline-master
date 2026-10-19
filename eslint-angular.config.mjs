import nx from "@nx/eslint-plugin";
import baseConfig from "./eslint.config.mjs";

export default [
    ...nx.configs["flat/angular"],
    ...nx.configs["flat/angular-template"],
    ...baseConfig,
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parserOptions: {
                project: "./tsconfig.base.json",
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@angular-eslint/directive-class-suffix": "error",
            "@angular-eslint/directive-selector": [
                "error",
                {
                    type: "attribute",
                    prefix: "abm",
                    style: "camelCase",
                },
            ],
            "@angular-eslint/component-selector": [
                "error",
                {
                    type: "element",
                    prefix: "abm",
                    style: "kebab-case",
                },
            ],
            "@angular-eslint/component-class-suffix": "error",
            "@angular-eslint/contextual-lifecycle": "error",
            "@angular-eslint/no-input-rename": "off",
            "@angular-eslint/no-inputs-metadata-property": "error",
            "@angular-eslint/no-output-native": "error",
            "@angular-eslint/no-output-on-prefix": "error",
            "@angular-eslint/no-output-rename": "error",
            "@angular-eslint/no-outputs-metadata-property": "error",
            "@angular-eslint/prefer-on-push-component-change-detection": "error",
            "@angular-eslint/use-lifecycle-interface": "warn",
            "@angular-eslint/use-pipe-transform-interface": "error",
        },
    },
];
