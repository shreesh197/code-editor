import "./App.css";
import Editor from "@monaco-editor/react";
import { useCallback, useEffect, useState } from "react";
import {
  getBoilerPlateCode,
  getLanguages,
  getSingleLanguage,
  postSubmission,
} from "./service/ApiExecutors";
import { decode as base64_decode, encode as base64_encode } from "base-64";

function App() {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [srcCode, setSrcCode] = useState("");
  const [compiledOutput, setCompiledOutput] = useState("");
  const [compilationError, setCompilationError] = useState(false);

  const fetchLanguages = useCallback(async () => {
    const response = await getLanguages();
    setLanguages(response);
  }, []);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  const fetchSingleLanguage = useCallback(async () => {
    const response = await getSingleLanguage(selectedLanguageId);
    // console.log(response);
    let refactoredLanguageName = response?.name
      ?.split("(")[0]
      .toLocaleLowerCase()
      ?.split(" ")[0];
    setSelectedLanguage(refactoredLanguageName);
    console.log(refactoredLanguageName);

    const res = await getBoilerPlateCode(refactoredLanguageName);
    console.log(res);
    setSrcCode(res);
  }, [selectedLanguageId]);

  useEffect(() => {
    if (selectedLanguageId) {
      fetchSingleLanguage();
    }
  }, [fetchSingleLanguage, selectedLanguageId]);

  const compileHandler = async () => {
    //convert src to base64
    const base64Src = base64_encode(srcCode);
    // console.log(`base64 src code **** ${base64Src}`);
    let body = {
      language_id: selectedLanguageId,
      source_code: base64Src,
    };
    const response = await postSubmission(body);
    let decodedBase64;
    if (response.compile_output !== null) {
      decodedBase64 = base64_decode(response.compile_output);
      setCompilationError(true);
      setCompiledOutput(decodedBase64);
    } else if (response.stderr !== null) {
      decodedBase64 = base64_decode(response.stderr);
      setCompilationError(true);
      setCompiledOutput(decodedBase64);
    } else {
      decodedBase64 = base64_decode(response.stdout);
      setCompilationError(false);
      setCompiledOutput(decodedBase64);
    }
  };

  console.log(`selectedLanguage ====> ${srcCode}`);

  return (
    <div className="App">
      <div className="position-relative height-100-percent width-100-percent">
        <div className="container-fluid main m-0 p-0">
          <div className="row Login-area1 m-0 p-0">
            <div className="col-12 Login-main-area1 m-0">
              <div className={`row customRow`}>
                <div className="row">
                  <div className="col-6 text-start">
                    <p className="">Select Language</p>
                    <select
                      onChange={(e: any) => {
                        setSelectedLanguageId(e.target.value);
                      }}
                    >
                      {languages.map((language: any) => (
                        <option key={language?.id} value={language?.id}>
                          {language?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 text-start">
                    <button onClick={compileHandler}>Compile</button>
                  </div>
                </div>

                <div className="col-7 p-0">
                  <Editor
                    height="90vh"
                    onChange={(value: any) => setSrcCode(value)}
                    defaultLanguage={selectedLanguage}
                    defaultValue={""}
                    value={srcCode}
                    theme="vs-dark"
                    options={{
                      quickSuggestions: {
                        other: false,
                        comments: false,
                        strings: false,
                      },
                      parameterHints: {
                        enabled: false,
                      },
                      suggestOnTriggerCharacters: false,
                      acceptSuggestionOnEnter: "off",
                      tabCompletion: "off",
                      wordBasedSuggestions: false,
                    }}
                  />
                </div>
                <div className="col-5 p-0">
                  <p className="mb-0 ps-2 text-start">Compiler</p>
                  <textarea
                    // type={"text"}
                    value={compiledOutput}
                    style={{
                      height: "50%",
                      width: "100%",
                      background: "beige",
                      border: "none",
                      color: compilationError ? "red" : "darkgreen",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
