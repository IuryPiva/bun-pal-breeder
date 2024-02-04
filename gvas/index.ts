import { PropertyFactory } from "./property-factory";
import {
  ArrayProperty,
  BoolProperty,
  EnumProperty,
  FloatProperty,
  Guid,
  IntProperty,
  ObjectProperty,
  SoftObjectProperty,
  StrProperty,
  StructProperty,
  Tuple,
} from "./properties/index.ts";

import { IntArray, SoftObjectArray, StructArray } from "./arrays/index.ts";

PropertyFactory.Properties["ArrayProperty"] = ArrayProperty;
PropertyFactory.Properties["BoolProperty"] = BoolProperty;
PropertyFactory.Properties["EnumProperty"] = EnumProperty;
PropertyFactory.Properties["FloatProperty"] = FloatProperty;
PropertyFactory.Properties["IntProperty"] = IntProperty;
PropertyFactory.Properties["ObjectProperty"] = ObjectProperty;
PropertyFactory.Properties["SoftObjectProperty"] = SoftObjectProperty;
PropertyFactory.Properties["StrProperty"] = StrProperty;
PropertyFactory.Properties["StructProperty"] = StructProperty;
PropertyFactory.Properties["Tuple"] = Tuple;
PropertyFactory.Properties["Guid"] = Guid;
PropertyFactory.Arrays["IntArray"] = IntArray;
PropertyFactory.Arrays["SoftObjectArray"] = SoftObjectArray;
PropertyFactory.Arrays["StructProperty"] = StructArray;
PropertyFactory.Arrays["IntProperty"] = IntArray;
PropertyFactory.Arrays["SoftObjectProperty"] = SoftObjectArray;

export { PropertyFactory };
export { Gvas, GvasHeader } from "./gvas.ts";
export { Serializer } from "./serializer.ts";
export * from "./property-errors.ts";
export * from "./properties/index.ts";
export * from "./arrays/index.ts";
