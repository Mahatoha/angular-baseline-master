export default {
    displayName: "shared-common-authentication",
    preset: "../../../../jest.preset.js",
    setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
    coverageDirectory: "../../../../coverage/libs/shared/common/authentication",
    transform: {
        "^.+\\.(ts|mjs|js|html)$": [
            "jest-preset-angular",
            {
                tsconfig: "<rootDir>/tsconfig.spec.json",
                stringifyContentPathRegex: "\\.(html|svg)$",
            },
        ],
    },
    transformIgnorePatterns: [
        // There is an issue with akita, it must be ignored : https://github.com/salesforce/akita/issues/781#issuecomment-1018856090
        // "node_modules/(?!.*\\.mjs$)"
        "node_modules/(?!.*\\.mjs$|.pnpm|@datorama/akita)",
    ],
    snapshotSerializers: [
        "jest-preset-angular/build/serializers/no-ng-attributes",
        "jest-preset-angular/build/serializers/ng-snapshot",
        "jest-preset-angular/build/serializers/html-comment",
    ],
};
