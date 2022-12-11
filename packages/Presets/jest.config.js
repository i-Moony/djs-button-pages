const config = 
{
    verbose: true,
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverage: true,
    transform: 
    {
        '\\.ts$': ["ts-jest", {
            isolatedModules: true,
        }]
    },
    coverageReporters: ["text"],
};

module.exports = config;