import { useState, useEffect } from "react";
import Router from "next/router";
import useRequest from "../hooks/use-request";
import styled from "styled-components";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const StyledCreateSet = styled.div`
  padding-top: 1.5rem;

  > div.header {
    max-width: 81.25em;
    padding: 0 2.5rem;
  }
  > div.header div.top {
    display: flex;
    height: 6.875rem;
    justify-content: space-between;
    align-items: center;
  }
  > div.header div.top div.text h3 {
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0.25rem 0;
  }
  > div.header div.text h4 {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.285714285714286;
  }
  > div.header button {
    all: unset;
    border-radius: 0.25rem;
    cursor: pointer;
    display: inline-block;
    font: inherit;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.285714285714286;
    max-width: 100%;
    padding: 0.75rem 1.5rem;
    width: auto;
    background-color: #3ccfcf;
  }
  > div.header button:hover {
    background-color: #7dd;
  }
  > div.header div.inputs input {
    border: none;
    outline: none;
    margin: 1rem 0 0;
    padding: 0.25rem 1rem;
    background-color: ${({ theme }) => theme.folderInputBg};
    color: ${({ theme }) => theme.folderHeader};
    width: 100%;
    border-radius: 0.125rem;
    height: 3rem;
  }
  > div.header div.inputs input::placeholder {
    color: ${({ theme }) => theme.folderPlaceholder};
    font-weight: normal;
  }
  > div.header div.inputs input::focus {
    border-bottom: 0.125rem solid ${({ theme }) => theme.folderInputBorder};
  }
  > div.header div.inputs div.settings button {
    all: unset;
  }
  > div.body {
    max-width: 81.25em;
    padding: 0 2.5rem;
  }
`;

const CreateSet = () => {
  const [title, setTitle] = useState("");
  const [viewableBy, setViewableBy] = useState("Just Me");
  const [editableBy, setEditableBy] = useState("Just Me");
  const [created, setCreated] = useState(false);
  const [saved, setSaved] = useState("");
  const [terms, setTerms] = useState([{ id: "", term: "", definition: "" }]);
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [emptyTerm, setEmptyTerm] = useState(true);
  const [makeTermRequest, setTermMakeRequest] = useState(false);
  const { doRequest: doCreateSetRequest, errors: createSetErrors } = useRequest(
    {
      url: "/api/sets/set",
      method: "post",
      body: {
        title,
        viewableBy,
        editableBy,
      },
      onSuccess: (Set) => setCreated(Set),
    }
  );

  const { doRequest: doEditSetTitleRequest, errors: editSetTitleErrors } =
    useRequest({
      url: `/api/sets/set/${created.id}`,
      method: "put",
      body: {
        title,
      },
      onSuccess: (Set) => setCreated(Set),
    });

  const { doRequest: doEditSetViewRequest, errors: editSetViewErrors } =
    useRequest({
      url: `/api/sets/set/${created.id}/view`,
      method: "put",
      body: {
        viewableBy,
      },
      onSuccess: (Set) => setCreated(Set),
    });

  const { doRequest: doEditSetEditableRequest, errors: editSetEditableErrors } =
    useRequest({
      url: `/api/sets/set/${created.id}/view`,
      method: "put",
      body: {
        editableBy,
      },
      onSuccess: (Set) => setCreated(Set),
    });

  useEffect(() => {
    // console.log(title);
    async function editSet() {
      if (!created && !title) {
        return;
      } else if (!created) {
        
        await doCreateSetRequest();
        
      } else {
        if (title) {
          await doEditSetTitleRequest();
          
        } else {
          
          return;
        }
      }
    }
    editSet();
  }, [title]);

  useEffect(() => {
    async function editSet() {
      if (created) {
        await doEditSetViewRequest();
      }
    }
    editSet();
  }, [viewableBy]);

  useEffect(() => {
    async function editSet() {
      if (created) {
        await doEditSetEditableRequest();
      }
    }
    editSet();
  }, [editableBy]);

  const { doRequest: termCreate, errors: termCreateErrors } = useRequest({
    url: `/api/sets/term/`,
    method: "post",
    body: {
      setId: created.id,
      term: terms[currentTermIndex].term,
      definition: terms[currentTermIndex].definition,
    },
    onSuccess: (Term) => {
      let newTerms = [...terms];
      newTerms[currentTermIndex].id = Term.id;
      setTerms(newTerms);
    },
  });

    const { doRequest: termEdit, errors: termEditErrors } = useRequest({
      url: `/api/sets/term/${terms[currentTermIndex].id}`,
      method: "put",
      body: {
        setId: created.id,
        term: terms[currentTermIndex].term,
        definition: terms[currentTermIndex].definition,
      },
      onSuccess: (Term) => {
          console.log(Term)
      },
    });

  useEffect(() => {
    async function editTerm() {
      if (!created) {
        return
      }
      else if (
        terms[currentTermIndex].id
      ) {
        if (terms[currentTermIndex].term && terms[currentTermIndex].definition) {
          await termEdit();
        } else {

        return;
        }
        
      } else {
        if (
          terms[currentTermIndex].term &&
          terms[currentTermIndex].definition
        ) {
          await termCreate();

        } else {
   
          return;
        }
      }

    }
    editTerm();
    for (let term of terms) {
      if (!term.definition || !term.term) {
        setEmptyTerm(true);
        return;
      }
    }
    setEmptyTerm(false);
  }, [makeTermRequest]);

  return (
    <StyledCreateSet>
      <div className="header">
        <div className="top">
          <div className="text">
            <h3>Create a new study set</h3>
            <h4>{saved}</h4>
          </div>
          <button>Create</button>
        </div>
        <div className="inputs">
          <input
            type="text"
            placeholder="Enter a title, like Biology -Chapter 22: Evolution"
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          {!title && <p>Title is required</p>}
          <div className="settings">
            <p>Visible to {viewableBy}</p>
            {title ? <button disabled>Change</button> : <button>Change</button>}
          </div>
          <div className="settings">
            <p>Editable by {editableBy}</p>
            {title ? <button disabled>Change</button> : <button>Change</button>}
          </div>
        </div>
      </div>
      <div className="body">
        <div className="terms-list">
          {terms.map((term, index) => {
            return (
              <div className="term-container" key={term.id}>
                <div className="toolbar">
                  <span>{index + 1}</span>
                  <button className="delete">
                    <DeleteOutlinedIcon />
                  </button>
                </div>
                <div className="inner">
                  <div className="left">
                    <input
                      placeholder="Enter term"
                      type="text"
                      value={term.term}
                      onChange={(e) => {
                        setCurrentTermIndex(index);
                        let newTerms = [...terms];
                        const newTerm = newTerms[index];
                        newTerm.term = e.target.value;
                        setTerms(newTerms);
                      }}
                      onBlur={() => {
                        setTermMakeRequest(!makeTermRequest);
                      }}
                      disabled={title ? false : true}
                    ></input>
                    {!term.term && <p>Term cannot be empty</p>}
                    <span>TERM</span>
                  </div>
                  <div className="right">
                    <input
                      placeholder="Enter definition"
                      type="text"
                      value={term.definition}
                      onChange={(e) => {
                        setCurrentTermIndex(index);
                        let newTerms = [...terms];
                        const newTerm = newTerms[index];
                        newTerm.definition = e.target.value;
                        setTerms(newTerms);
                      }}
                      onBlur={() => setTermMakeRequest(!makeTermRequest)}
                      disabled={title ? false : true}
                    ></input>
                    {!term.definition && <p>Definition cannot be empty</p>}

                    <span>DEFINITION</span>
                  </div>
                </div>
              </div>
            );
          })}
          {!emptyTerm ? (
            <button
              className="add-term"
              onClick={() => {
                setTerms((terms) => [
                  ...terms,
                  { id: "", term: "", definition: "" },
                ]);
                setCurrentTermIndex(terms.length - 1);
              }}
            >
              + ADD CARD
            </button>
          ) : (
            <button
              className="add-term"
              onClick={() => {
                setTerms((terms) => [
                  ...terms,
                  { id: "", term: "", definition: "" },
                ]);
              }}
              disabled
            >
              + ADD CARD
            </button>
          )}
        </div>
      </div>
    </StyledCreateSet>
  );
};

export default CreateSet;
