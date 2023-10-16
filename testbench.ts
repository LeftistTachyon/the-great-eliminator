(async () => {
  const test = await fetch("https://nhentai.net/api/gallery/100");
  // console.log(await test.json());
  console.log(await test.text());
})();
