// Copyright 2021 denosaurs. All rights reserved. MIT license.

export type IndexTuple = [number, number | undefined, number | undefined];

export type SimplePolygon = IndexTuple[];

export type ObjMaterial = {
  ref: string;
} | {
  mtl: MtlData;
};

export interface MtlData {
  name: string;

  ka?: [number, number, number];
  kd?: [number, number, number];
  ks?: [number, number, number];
  ke?: [number, number, number];
  km?: number;
  tf?: [number, number, number];
  ns?: number;
  ni?: number;
  tr?: number;
  d?: number;
  illum?: number;

  mapKa?: string;
  mapKd?: string;
  mapKs?: string;
  mapKe?: string;
  mapNs?: string;
  mapD?: string;
  mapBump?: string;
  mapRefl?: string;
  mapDisp?: string;
}

export interface Group {
  name: string;
  index: number;
  material?: ObjMaterial;
  polys: SimplePolygon[];
}

export interface ObjData {
  position: [number, number, number][];
  texture: [number, number][];
  normal: [number, number, number][];
  objects: {
    name: string;
    groups: Group[];
  }[];
  materialLibs: Mtl[];
}

export interface ParseOptions {
  strict: boolean;
  unhandled?: (keyword: string, parts: string[]) => void;
}

export class Obj implements ObjData {
  position: [number, number, number][] = [];
  texture: [number, number][] = [];
  normal: [number, number, number][] = [];
  objects: {
    name: string;
    groups: Group[];
  }[] = [];
  materialLibs: Mtl[] = [];

  static parse(text: string, options: ParseOptions = {
    strict: false,
  }) {
    const dat = new Obj();
    let obj: {
      name: string;
      groups: Group[];
    } = {
      name: "default",
      groups: [],
    };
    let group: undefined | Group;

    for (const line of text.split("\n")) {
      if (line.length === 0 || line.startsWith("#")) {
        continue;
      }

      const parts = line.split(/\s+/);
      const keyword = parts.shift()!;

      switch (keyword) {
        case "v":
          dat.position.push([
            otherwise(parts.shift(), parseFloat, () => {
              throw IncorrectArguments;
            }),
            otherwise(parts.shift(), parseFloat, () => {
              throw IncorrectArguments;
            }),
            otherwise(parts.shift(), parseFloat, () => {
              throw IncorrectArguments;
            }),
          ]);
          break;
        case "vt":
          dat.texture.push([
            otherwise(parts.shift(), parseFloat, () => {
              throw IncorrectArguments;
            }),
            otherwise(parts.shift(), parseFloat, () => {
              throw IncorrectArguments;
            }),
          ]);
          break;
        case "vn":
          dat.normal.push([
            otherwise(parts.shift(), parseFloat, () => {
              throw IncorrectArguments;
            }),
            otherwise(parts.shift(), parseFloat, () => {
              throw IncorrectArguments;
            }),
            otherwise(parts.shift(), parseFloat, () => {
              throw IncorrectArguments;
            }),
          ]);
          break;
        case "f":
          {
            const poly = dat.parseFace(parts);
            if (group === undefined) {
              group = {
                name: "default",
                index: 0,
                polys: [poly],
              };
            } else {
              group.polys.push(poly);
            }
          }
          break;
        case "o":
          if (group !== undefined) {
            obj.groups.push({ ...group });
            dat.objects.push({ ...obj });
            group = undefined;
          }

          obj = line.length > 2
            ? { name: line.slice(keyword.length).trim(), groups: [] }
            : { name: "default", groups: [] };
          break;
        case "g":
          if (group !== undefined) {
            obj.groups.push({ ...group });
          }

          if (line.length > 2) {
            group = {
              name: line.slice(keyword.length).trim(),
              index: 0,
              polys: [],
            };
          }
          break;
        case "mtllib":
          dat.materialLibs.push(new Mtl(line.slice(keyword.length).trim()));
          break;
        case "usemtl":
          {
            const g: Group = group ?? { name: "default", index: 0, polys: [] };
            if (g.material !== undefined) {
              obj.groups.push({ ...g });
              g.index += 1;
              g.polys = [];
            }
            g.material = otherwise(parts.shift(), (ref) => ({ ref }), () => {
              throw IncorrectArguments;
            });
            group = { ...g };
          }
          break;
        case "s":
          break;
        case "l":
          break;
        default:
          if (options.unhandled) {
            options.unhandled(keyword, parts);
          }
          if (options.strict) {
            throw new SyntaxError(
              `Unhandled keyword ${keyword} on line ${line + 1}`,
            );
          }
          break;
      }
    }

    if (group !== undefined) {
      obj.groups.push({ ...group });
    }

    dat.objects.push({ ...obj });

    return dat;
  }

  protected parseFace(items: string[]): SimplePolygon {
    const ret = [];

    if (items.length < 3) {
      throw new RangeError("Face command has less than 3 vertices");
    }

    for (const item of items) {
      ret.push(this.parseGroup(item));
    }

    return ret;
  }

  private parseGroup(
    group: string,
  ): IndexTuple {
    const groupSplit = group.split("/");
    const p = then(groupSplit.shift(), parseFloat);
    const t = then(groupSplit.shift(), (idx) => {
      if (idx !== "") {
        return parseFloat(idx);
      }
    });
    const n = then(groupSplit.shift(), parseFloat);

    if (p !== undefined) {
      const normalized = normalize(p, this.position.length);

      if (normalized === undefined) {
        throw new SyntaxError("Zero vertex numbers are invalid");
      }

      return [
        normalized,
        then(t, (t) => normalize(t, this.texture.length)),
        then(n, (n) => normalize(n, this.normal.length)),
      ];
    }

    throw new SyntaxError("Malformed face group");
  }
}

export class Mtl {
  name: string;
  materials: MtlData[];

  constructor(name: string) {
    this.name = name;
    this.materials = [];
  }

  static parse(name: string, text: string, options: ParseOptions = {
    strict: false,
  }) {
    const mtl = new Mtl(name);
    let material: MtlData | undefined = undefined;

    for (const line of text.split("\n")) {
      if (line.length === 0 || line.startsWith("#")) {
        continue;
      }

      const parts = line.split(/\s+/);
      const keyword = parts.shift()!;

      switch (keyword) {
        case "newmtl":
          if (material !== undefined) {
            mtl.materials.push(material);
          }

          material = {
            name: otherwise(parts.shift(), (n) => n, () => {
              throw new SyntaxError("Missing material name");
            }),
          };
          break;
        case "Ka":
          if (material !== undefined) {
            material.ka = mtl.parseVec(parts);
          }
          break;
        case "Kd":
          if (material !== undefined) {
            material.kd = mtl.parseVec(parts);
          }
          break;
        case "Ks":
          if (material !== undefined) {
            material.ks = mtl.parseVec(parts);
          }
          break;
        case "Ke":
          if (material !== undefined) {
            material.ke = mtl.parseVec(parts);
          }
          break;
        case "Ns":
          if (material !== undefined) {
            material.ns = otherwise(parts.shift(), parseFloat, () => {
              throw IncorrectArguments;
            });
          }
          break;
        case "Ni":
          if (material !== undefined) {
            material.ni = otherwise(parts.shift(), parseFloat, () => {
              throw IncorrectArguments;
            });
          }
          break;
        case "Km":
          if (material !== undefined) {
            material.km = otherwise(parts.shift(), parseFloat, () => {
              throw IncorrectArguments;
            });
          }
          break;
        case "d":
          if (material !== undefined) {
            material.d = otherwise(parts.shift(), parseFloat, () => {
              throw IncorrectArguments;
            });
          }
          break;
        case "Tr":
          if (material !== undefined) {
            material.tr = otherwise(parts.shift(), parseFloat, () => {
              throw IncorrectArguments;
            });
          }
          break;
        case "Tf":
          if (material !== undefined) {
            material.tf = mtl.parseVec(parts);
          }
          break;
        case "illum":
          if (material !== undefined) {
            material.illum = otherwise(parts.shift(), parseInt, () => {
              throw IncorrectArguments;
            });
          }
          break;
        case "map_Ka":
          if (material !== undefined) {
            material.mapKa = line.slice(keyword.length).trim();
          }
          break;
        case "map_Kd":
          if (material !== undefined) {
            material.mapKd = line.slice(keyword.length).trim();
          }
          break;
        case "map_Ks":
          if (material !== undefined) {
            material.mapKs = line.slice(keyword.length).trim();
          }
          break;
        case "map_Ns":
          if (material !== undefined) {
            material.mapNs = line.slice(keyword.length).trim();
          }
          break;
        case "map_d":
          if (material !== undefined) {
            material.mapD = line.slice(keyword.length).trim();
          }
          break;
        case "map_refl":
        case "refl":
          if (material !== undefined) {
            material.mapD = line.slice(keyword.length).trim();
          }
          break;
        case "map_bump":
        case "map_Bump":
        case "bump":
          if (material !== undefined) {
            material.mapBump = line.slice(keyword.length).trim();
          }
          break;
        case "map_disp":
        case "map_Disp":
        case "dip":
          if (material !== undefined) {
            material.mapDisp = line.slice(keyword.length).trim();
          }
          break;
        default:
          if (options.unhandled) {
            options.unhandled(keyword, parts);
          }
          if (options.strict) {
            throw new SyntaxError(
              `Unhandled keyword ${keyword} on line ${line + 1}`,
            );
          }
          break;
      }
    }

    return mtl;
  }

  private parseVec(parts: string[]): [number, number, number] {
    return [
      otherwise(parts.shift(), parseFloat, () => {
        throw IncorrectArguments;
      }),
      otherwise(parts.shift(), parseFloat, () => {
        throw IncorrectArguments;
      }),
      otherwise(parts.shift(), parseFloat, () => {
        throw IncorrectArguments;
      }),
    ];
  }
}

const IncorrectArguments = new SyntaxError(
  "An argument list either has unparsable arguments or is missing arguments",
);

function then<T, R>(v: T | undefined, f: ((v: T) => R)): R | undefined {
  if (v !== undefined) {
    return f(v);
  }
}

function otherwise<T, R, O>(
  v: T | undefined,
  f: ((v: T) => R),
  o: () => O,
): R | O {
  if (v !== undefined) {
    return f(v);
  }

  return o();
}

function normalize(idx: number, len: number): number | undefined {
  if (idx < 0) {
    return len + idx;
  }

  if (idx > 0) {
    return idx - 1;
  }
}
