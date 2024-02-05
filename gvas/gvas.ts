import type { Serializer } from "./serializer";
import { PropertyFactory } from "./property-factory";
import { Tuple } from "./properties";

export class GvasHeader {
  save_game_version?: number;
  package_file_version_ue4?: number;
  package_file_version_ue5?: number;
  engine_version_major?: number;
  engine_version_minor?: number;
  engine_version_patch?: number;
  engine_version_changelist?: number;
  engine_version_branch?: string;
  custom_version_format?: number;
  custom_format_data: {
    count: number;
    entries: Array<{ a: number; b: number; c: number; d: number }>;
  } = {
    count: 0,
    entries: [],
  };
  custom_versions?: Array<[string, number]>;
  save_game_class_name?: string;
  Format = "GVAS";

  deserialize(reader: Serializer) {
    // SaveGameFileVersion
    this.save_game_version = reader.i32();
    if (this.save_game_version != 3) {
      throw new Error(
        `expected save game version 3, got ${this.save_game_version}`
      );
    }
    // PackageFileUEVersion
    this.package_file_version_ue4 = reader.i32();
    this.package_file_version_ue5 = reader.i32();
    // SavedEngineVersion
    this.engine_version_major = reader.u16();
    this.engine_version_minor = reader.u16();
    this.engine_version_patch = reader.u16();
    this.engine_version_changelist = reader.u32();
    this.engine_version_branch = reader.fstring();
    // CustomVersionFormat
    this.custom_version_format = reader.i32();
    if (this.custom_version_format != 3) {
      throw new Error(
        `expected custom version format 3, got ${this.custom_version_format}`
      );
    }
    this.custom_format_data.count = reader.i32();

    for (let i = 0; i < this.custom_format_data.count; i++) {
      let guid = PropertyFactory.create({ Type: "Guid" });
      this.custom_format_data.entries.push(guid.deserialize(reader));
    }

    this.save_game_class_name = reader.fstring();
  }
}

export class Gvas {
  Header: GvasHeader;
  Properties = new Tuple();

  constructor() {
    this.Header = new GvasHeader();
  }

  deserialize(serial: Serializer) {
    let format = serial.read(4);
    if (Buffer.compare(Buffer.from("GVAS"), format) !== 0) {
      throw Error(`Unexpected header, expected 'GVAS`);
    }

    this.Header.deserialize(serial);
    this.Properties.Name = this.Header.save_game_class_name!;
    console.log(this.Properties.Name);
    this.Properties.deserialize(serial);
    return this;
  }
}
