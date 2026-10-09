/**
 * Corridor lanes referenced by the commodity cards.
 *
 * Placeholder lanes — confirm with dispatch before Ch6 builds its route
 * map from this file. Kept here so Ch4 and Ch6 read one record instead
 * of inventing the same origin/destination twice.
 */

export type CorridorId =
  | "mpumalanga-durban"
  | "durban-gauteng"
  | "durban-freestate"
  | "durban-kasumbalesa";

export type CorridorRecord = {
  id: CorridorId;
  from: string;
  to: string;
};

export const corridors: Record<CorridorId, CorridorRecord> = {
  "mpumalanga-durban": {
    id: "mpumalanga-durban",
    from: "Mpumalanga",
    to: "Durban",
  },
  "durban-gauteng": {
    id: "durban-gauteng",
    from: "Durban",
    to: "Gauteng",
  },
  "durban-freestate": {
    id: "durban-freestate",
    from: "Durban",
    to: "Free State",
  },
  "durban-kasumbalesa": {
    id: "durban-kasumbalesa",
    from: "Durban",
    to: "Kasumbalesa",
  },
};
