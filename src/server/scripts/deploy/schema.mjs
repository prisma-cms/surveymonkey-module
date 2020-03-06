
import prismaGenerateSchema from "@prisma-cms/prisma-schema";
import UserModule from "@prisma-cms/user-module";

import CoreModule, {
  modules,
} from "../../../";


import path from 'path';
import chalk from "chalk";


export class CoreModuleCustom extends CoreModule {

  constructor(options) {

    super(options);

    this.mergeModules([
      UserModule,
    ].concat(modules));

  }

}

export const generateSchema = function (schemaType) {

  let result;

  try {

    const moduleURL = new URL(import.meta.url);
    const basedir = path.join(path.dirname(moduleURL.pathname), "/../../../", "schema/")


    result = prismaGenerateSchema(schemaType, new CoreModuleCustom(), basedir);
  }
  catch (error) {

    console.error(chalk.red("generateSchema Error"), error);
  }

  return result;

}

export default generateSchema;