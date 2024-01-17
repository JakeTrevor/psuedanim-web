"use client";
import { MonacoEditorReactComp } from "@typefox/monaco-editor-react";
import { type UserConfig } from "monaco-editor-wrapper";
import { useEffect, useMemo, useState } from "react";
import { buildWorkerDefinition } from "monaco-editor-workers";

import monarchGrammar from "~/language/generated/syntaxes/pseudanim.monarch";

function createUserConfig(worker: Worker): UserConfig {
  const languageId = "pseudanim";
  return {
    wrapperConfig: {
      editorAppConfig: {
        $type: "classic",
        languageId,
        useDiffEditor: false,
        code: "",
        theme: "vs-dark",
        languageDef: monarchGrammar,
      },
      serviceConfig: {
        debugLogging: false,
      },
    },
    languageClientConfig: {
      options: {
        $type: "WorkerDirect",
        name: `${languageId}-language-server-worker`,
        worker,
      },
    },
  };
}

const InnerEditor = ({ worker }: { worker: Worker }) => {
  const config: UserConfig = useMemo(() => createUserConfig(worker), [worker]);

  return (
    <MonacoEditorReactComp
      userConfig={config}
      style={{
        paddingTop: "5px",
        height: "80vh",
      }}
    />
  );
};

export const Editor = () => {
  const [worker, setWorker] = useState<Worker>();

  useEffect(() => {
    buildWorkerDefinition(
      "~/../node_modules/monaco-editor-workers/dist/workers",
      import.meta.url,
      false,
    );

    const wrk = new Worker(new URL("~/language/worker.ts", import.meta.url));
    setWorker(wrk);
    return () => wrk.terminate();
  }, []);

  if (worker === undefined) return <>loading</>;

  return <InnerEditor worker={worker} />;
};
