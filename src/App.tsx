import type { PGlite } from "@electric-sql/pglite";
import { useEffect, useState } from "react";
import {
  clearEmbeddingDB,
  doVectorSearch,
  getDB,
  insertEmbedding,
} from "./utils/db";
import { convertTextToVector, loadModel } from "./worker";

function App() {
  const [tempDB, setTempDB] = useState<PGlite | undefined>(undefined);
  const [vectorTexts, setVectorTexts] = useState<string[]>();
  const [value, setValue] = useState<string>("");
  const [modelLoading, setModelLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!tempDB) getDb();
    if (tempDB) getAllEmbeddings();
  }, [tempDB]);

  async function getDb() {
    await loadModel();
    setModelLoading(false);
    await clearEmbeddingDB();
    const localDb = await getDB();
    setTempDB(localDb);
  }
  async function getAllEmbeddings() {
    const result = await tempDB?.query(`SELECT text FROM embeddings`);
    console.log(result?.rows);
    setVectorTexts((result?.rows as never) ?? []);
  }

  async function addText() {
    if (tempDB && !modelLoading) {
      const vector = await convertTextToVector(value);
      console.log(vector);
      await insertEmbedding(tempDB, value, vector as never);
      await getAllEmbeddings();
      setValue("");
    }
  }
  async function search() {
    if (tempDB) {
      const vector = await convertTextToVector(value);
      const result = await doVectorSearch(tempDB, vector as never);
      console.log(result);
    }
  }

  return (
    <div className="flex items-center w-full justify-center h-[100vh]">
      <div className="flex gap-5 flex-col  items-center">
        {modelLoading && <label>Model Loading ....</label>}
        <input
          className="w-[20vw] border outline-none px-2 rounded py-2"
          value={value}
          placeholder="Enter text"
          onChange={(e) => {
            const value = e?.target?.value;
            setValue(value);
          }}
        />
        <div className="flex items-center gap-5">
          <button
            onClick={addText}
            className="rounded border px-5 py-1 text-white border-black flex text-center bg-green-500"
          >
            Add
          </button>
          <div className="mx-2">OR </div>
          <button
            onClick={search}
            className="rounded  bg-blue-600 text-white border px-5 py-1 border-black flex text-center "
          >
            Search
          </button>
        </div>
        {vectorTexts?.length > 0 && (
          <div className="border px-10 py-2 max-w-[20vw] flex gap-2 rounded">
            {vectorTexts?.map((item, index) => {
              return <div key={index}>{item.text},</div>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
