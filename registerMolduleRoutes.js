import {registerModules} from './register-modules'
import productModule from "./src/modules/product/index";

registerModules({
    product: productModule,
  });