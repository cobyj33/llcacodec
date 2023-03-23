import {Config} from 'jest';
import "jest-expect-message"

const config: Config = {
  verbose: true,
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  setupFilesAfterEnv: ["jest-expect-message"]
};

export default config;