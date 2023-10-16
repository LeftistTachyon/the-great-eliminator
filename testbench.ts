import { exists } from "nhentai-js";

(async () => {
  const test = await exists("477779");
  console.log(test);
})();
