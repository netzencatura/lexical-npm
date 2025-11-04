import { createCommand, type LexicalCommand } from "lexical";
import type { ImagePayload } from "../../nodes";

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand("INSERT_IMAGE_COMMAND");

export const DELETE_IMAGE_COMMAND: LexicalCommand<{ key: string }> =
  createCommand("DELETE_IMAGE_COMMAND");
