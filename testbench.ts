import { exists } from "./nhentai";

(async () => {
  const test = await exists(477779);
  console.log(test);
})();
