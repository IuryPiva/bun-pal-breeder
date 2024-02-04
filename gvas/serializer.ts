export class Serializer {
  _data: Buffer;
  _offset: number;

  constructor(buf: Buffer) {
    this._data = buf;
    this._offset = 0;
  }
  get Data() {
    return this._data;
  }
  get tell() {
    return this._offset;
  }

  seek(count: number) {
    if (this._offset >= this._data.length) {
      throw new Error(
        `Reached end of Buffer at offset 0x${this.tell.toString(16)}`,
      );
    }
    return (this._offset += count);
  }
  read(count: number) {
    return this.Data.slice(this.tell, this.seek(count));
  }
  i32() {
    let int = this.Data.readInt32LE(this.tell);
    this.seek(4);
    return int;
  }
  readInt32() {
    return this.i32();
  }
  readInt16() {
    let int = this.Data.readInt16LE(this.tell);
    this.seek(2);
    return int;
  }
  readUInt8() {
    let int = this.Data.readUInt8(this.tell);
    this.seek(1);
    return int;
  }
  u16() {
    let int = this.Data.readUInt16LE(this.tell);
    this.seek(2);
    return int;
  }
  u32() {
    let int = this.Data.readUInt32LE(this.tell);
    this.seek(4);
    return int;
  }
  readFloat() {
    let float = this.Data.readFloatLE(this.tell);
    this.seek(4);
    return float;
  }
  fstring() {
    let length = this.i32();
    return this.read(length).toString("utf8");
  }
  write(buf: { copy: (arg0: Buffer, arg1: number) => number }) {
    this._offset += buf.copy(this.Data, this.tell);
  }
  writeInt32(num: number) {
    this._offset = this.Data.writeInt32LE(num, this.tell);
  }
  writeInt16(num: number) {
    this._offset = this.Data.writeInt16LE(num, this.tell);
  }
  writeUInt8(byte: number) {
    this._offset = this.Data.writeUInt8(byte, this.tell);
  }
  writeFloat(num: number) {
    this._offset = this.Data.writeFloatLE(num, this.tell);
  }
  writeString(str: string) {
    this._offset = this.Data.writeInt32LE(str.length, this.tell);
    this._offset += this.Data.write(str, this.tell);
  }
  append(buf: Uint8Array) {
    this._data = Buffer.concat([this.Data, buf]);
    this._offset += buf.length;
  }
  static alloc(size: number) {
    return new Serializer(Buffer.alloc(size));
  }
}
