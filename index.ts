import { inflateSync } from "zlib";
import { GvasHeader, Serializer } from "./gvas";
import fs from "fs";

function uint8ArrayToNum(arr: Uint8Array) {
  let num = 0;

  for (let i = 0; i < arr.length; i++) {
    num += Math.pow(256, i) * arr[i];
  }

  return num;
}

fs.readFile("./Level.sav", (err, buffer) => {
  if (err) throw err;

  const uncompressed_len = uint8ArrayToNum(buffer.subarray(0, 4));
  const compressed_len = uint8ArrayToNum(buffer.subarray(4, 8));
  const magic_bytes = new TextDecoder().decode(buffer.subarray(8, 11));
  const save_type = buffer.at(11);

  console.log({
    uncompressed_len,
    compressed_len,
    magic_bytes,
    save_type,
  });

  let decompressed = inflateSync(buffer.subarray(12));
  console.log(decompressed.length);
  decompressed = inflateSync(decompressed);
  console.log(decompressed.length);

  console.log(new TextDecoder().decode(decompressed.subarray(0, 4)));

  const gvas = new GvasHeader();
  const serial = new Serializer(decompressed);
  gvas.deserialize(serial);

  fs.writeFile("./Level.json", JSON.stringify(gvas), (err) => {
    if (err) throw err;
  });
});
