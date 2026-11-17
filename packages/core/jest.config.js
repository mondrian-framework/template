export default {
  preset: 'ts-jest',
  rootDir: './',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@templatetitle/(.*)$': '<rootDir>/../../packages/$1/src/index.ts'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
    }],
  },
  testEnvironment: 'node',
}
