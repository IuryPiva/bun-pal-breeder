import { Property } from "./index.ts";
import { PropertyFactory } from "../property-factory";
import { Serializer } from "../serializer";

export class StructProperty extends Property {
  constructor() {
    super();
    this.StoredPropertyType = "";
    this.Properties = [];
  }
  get Size() {
    let size = this.Name.length + 4;
    size += this.Type.length + 4;
    size += 8; // 4 byte size + 4 byte padding
    size += this.StoredPropertyType.length + 4;
    size += 17; // 17 byte padding
    for (let i = 0; i < this.Properties.length; i++) {
      size += this.Properties[i].Size;
    }
    return size;
  }
  get HeaderSize() {
    let size = this.Name.length + 4;
    size += this.Type.length + 4;
    size += 8;
    size += this.StoredPropertyType.length + 4;
    size += 17;
    return size;
  }
  get Count() {
    return this.Properties.length;
  }
  structValue(struct_type: string, serial: Serializer) {
    if (struct_type == "Vector") {
      return serial.vector_dict();
    } else if (struct_type == "DateTime") {
      return serial.u64();
    } else if (struct_type == "Guid") {
      return serial.guid();
    } else if (struct_type == "Quat") {
      return serial.quat_dict();
    } else if (struct_type == "LinearColor") {
      return {
        r: serial.float(),
        g: serial.float(),
        b: serial.float(),
        a: serial.float(),
      };
    } else {
      console.log(`Assuming struct type: ${struct_type}`);
    }
  }
  deserialize(serial: Serializer, size: number) {
    console.log(`Deserializing ${this.Name} Size: ${size}`);
    const struct_type = serial.fstring();
    const struct_id = serial.read(16);
    const _id = serial.read(1);
    const value = serial.u64();
    console.log({ struct_type, struct_id, _id, value });

    // const value = serial.struct_value(struct_type, path)
    // serial.seek(4);
    // this.StoredPropertyType = serial.fstring();
    // serial.seek(17);
    // let end = serial.tell + size;
    // let i = 0;
    // while (serial.tell < end) {
    //   let Name = this.StoredPropertyType;
    //   let Type = "Tuple";
    //   let prop = PropertyFactory.create({ Name, Type });
    //   prop.deserialize(serial);
    //   this.Properties.push(prop);
    //   i++;
    // }
    // console.log(`Done Deserializing ${this.Name} Offset: ${serial.tell}`)
    return this;
  }
  serialize() {
    let serial = Serializer.alloc(this.Size);
    serial.writeString(this.Name);
    serial.writeString(this.Type);
    serial.writeInt32(this.Size - this.HeaderSize);
    serial.seek(4);
    serial.writeString(this.StoredPropertyType);
    serial.seek(17);
    for (let i = 0; i < this.Properties.length; i++) {
      serial.write(this.Properties[i].serialize());
    }
    if (serial.tell !== this.Size) {
      throw new SerializationError(this);
    }
    return serial.Data;
  }
  static from(obj) {
    let struct = new StructProperty();
    struct.Name = obj.Name;
    struct.Type = obj.Type;
    struct.StoredPropertyType = obj.StoredPropertyType;
    struct.Properties = [];
    if (obj.Properties !== undefined) {
      obj.Properties.forEach((prop) =>
        struct.Properties.push(PropertyFactory.create(prop))
      );
    }
    return struct;
  }
}
