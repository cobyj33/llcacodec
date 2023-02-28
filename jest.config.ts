import {Config} from 'jest';

const config: Config = {
  verbose: true,
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  }
};

export default config;