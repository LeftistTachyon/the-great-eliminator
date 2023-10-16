import { getDoujin } from "nhentai-js";

(async () => {
  const test = await getDoujin("100");
  console.log(test);
})();
