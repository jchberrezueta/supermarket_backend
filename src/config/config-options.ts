import { configLoader } from "./config-app";

export const configOptions = {
  isGlobal: true,
  envFilePath: ['.env'],
  load: [configLoader]
};