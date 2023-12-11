import { EmptyFileSystem, startLanguageServer } from "langium";
import {
  BrowserMessageReader,
  BrowserMessageWriter,
  createConnection,
} from "vscode-languageserver/browser";
import { createPseudanimServices } from "./pseudanim-module";

declare const self: DedicatedWorkerGlobalScope;

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

const { shared } = createPseudanimServices({ connection, ...EmptyFileSystem });

startLanguageServer(shared);
