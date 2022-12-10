const config = 
{
    verbose: true,
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverage: true,
    transform: 
    {
        '\\.ts$': "ts-jest"
    },
    coverageReporters: ["text"],
};

module.exports = config;