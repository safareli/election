import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import Form from "@rjsf/core";
import ReactMarkdown from "react-markdown";

import { solve, Vote } from "./election";

const schema = {
  type: "array",
  title: "Election simulator",
  description: "Fill simulation voters and there detauls",
  minItems: 1,
  items: {
    title: "Voter",
    description: "Fill voter details here",
    type: "object",
    required: ["voter", "weight", "order"],
    properties: {
      voter: {
        type: "string",
        title: "Name",
        default: "Alisa",
      },
      weight: {
        type: "number",
        title: "Weight",
        default: 100,
      },
      order: {
        type: "array",
        title: "Candidates order",
        minItems: 1,
        items: {
          default: ["A"],
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            properties: {
              candidate: {
                type: "string",
                title: "Candidate",
                default: "A",
              },
              percent: {
                type: "number",
                title: "Percent",
                default: 100,
                minimum: 0,
                maximum: 100,
              },
            },
          },
        },
      },
    },
  },
};

const uiSchema = {
  classNames: "VoterArray",
  "ui:options": {
    orderable: false,
  },
  items: {
    classNames: "Voters",
    order: {
      items: {
        "ui:options": {
          orderable: false,
        },
        items: {
          candidate: {
            classNames: "Candidate",
          },
          percent: {
            classNames: "CandidatePercent",
          },
        },
      },
    },
  },
};

function App() {
  const [result, setResult] = useState("");
  const [formData, setFormData] = useState([]);
  useEffect(() => {
    const jsonStr = localStorage.getItem("electionInput");
    if (jsonStr == null) return;
    setFormData(JSON.parse(jsonStr));
  }, []);
  return (
    <div className="App">
      <Form
        schema={schema as any}
        uiSchema={uiSchema}
        formData={formData}
        onSubmit={(res) => {
          setFormData(res.formData);
          localStorage.setItem("electionInput", JSON.stringify(res.formData));
          console.log(res.formData);
          setResult(
            Array.from(solve((res.formData as any) as Array<Vote>)).join("\n")
          );
        }}
      />
      <ReactMarkdown source={result} />
    </div>
  );
}
export default App;

// solve([
//   {
//     voter: "Alisa",
//     order: [
//       //
//       // ["I"],
//       ["A", "B"],
//       ["A", "B"],
//       ["C"],
//     ],
//     weight: 100,
//   },
//   {
//     voter: "Bob",
//     order: [
//       //
//       // ["I"],
//       ["A"],
//       ["B", "C"],
//       ["Z"],
//     ],
//     weight: 10,
//   },
//   {
//     voter: "John",
//     order: [
//       //
//       // ["I"],
//       ["C"],
//       ["B", "K"],
//       ["A", "Y"],
//     ],
//     weight: 70,
//   },
// ]);
