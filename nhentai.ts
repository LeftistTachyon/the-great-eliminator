export async function exists(identifier: number): Promise<boolean> {
  try {
    const resp1 = await fetch(`https://nhentai.net/g/${identifier}/`);
    const text1 = await resp1.text();
    const arr = /"(\\\/g\\\/\d+.+?)"/i.exec(text1);
    const res = arr?.[1].replace(/\\\//gi, "/");
    console.log({ arr, res });
    if (!res) return false;
    const resp2 = await fetch(`https://nhentai.net${res}`);
    console.log({ status: resp2.status, text: await resp2.text() });
    return resp2.ok;
  } catch (e) {
    return false;
  }
}
