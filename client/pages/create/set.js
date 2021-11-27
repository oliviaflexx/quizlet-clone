import { useState, useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import TextareaAutosize from "react-textarea-autosize";
import { useMediaQuery } from "react-responsive";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import CloseIcon from "@mui/icons-material/Close";
import StyledCreateSet from "../../styles/create-set";


const CreateSet = ({ currentUser }) => {
  const [title, setTitle] = useState("");
  const [viewableBy, setViewableBy] = useState("Just Me");
  const [editableBy, setEditableBy] = useState("Just Me");
  const [created, setCreated] = useState(false);
  const [saved, setSaved] = useState("");
  const [timeSinceSaved, setTimeSinceSaved] = useState("");
  const [terms, setTerms] = useState([{ id: "", term: "", definition: "" }]);
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [emptyTerm, setEmptyTerm] = useState(true);
  const [makeTermRequest, setTermMakeRequest] = useState(false);
  const isSmallScreen = useMediaQuery({ query: "(max-width: 600px)" });
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      console.log(currentUser);
      Router.push("/auth/signup");
    }
    console.log(showSettingsModal);
  }, []);

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
      url: `/api/sets/set/view/${created.id}`,
      method: "put",
      body: {
        viewableBy,
      },
      onSuccess: (Set) => setCreated(Set),
    });

  const { doRequest: doEditSetEditableRequest, errors: editSetEditableErrors } =
    useRequest({
      url: `/api/sets/set/edit/${created.id}`,
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
    console.log(viewableBy);
    async function editSet() {
      if (created) {
        await doEditSetViewRequest();
      }
    }
    editSet();
  }, [viewableBy]);

  useEffect(() => {
    console.log(editableBy);
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
      setSaved(new Date());
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
      setSaved(new Date());
    },
  });

  useEffect(() => {
    async function editTerm() {
      if (!created) {
        return;
      } else if (terms[currentTermIndex].id) {
        if (
          terms[currentTermIndex].term &&
          terms[currentTermIndex].definition
        ) {
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

  useEffect(() => {
    const findTimeSince = () => {
      const msSince = new Date() - saved;
      if (!saved) {
        return
      }
      if (msSince < 60000) {
        if (terms.length === 1) {
          setTimeSinceSaved(`Saved ${terms.length} term just now`);
        } else {
          setTimeSinceSaved(`Saved ${terms.length} terms just now`);
        }
      } else {
        if (terms.length === 1) {
          if (Math.round(msSince / 60000) <= 1) {
            setTimeSinceSaved(
              `Saved ${terms.length} term ${Math.round(
                msSince / 60000
              )} min ago`
            );
          } else {
            setTimeSinceSaved(
              `Saved ${terms.length} term ${Math.round(
                msSince / 60000
              )} mins ago`
            );
          }
        } else {
          if (Math.round(msSince / 60000) <= 1) {
            setTimeSinceSaved(
              `Saved ${terms.length} terms ${Math.round(
                msSince / 60000
              )} min ago`
            );
          } else {
            setTimeSinceSaved(
              `Saved ${terms.length} terms ${Math.round(
                msSince / 60000
              )} mins ago`
            );
          }
          
        }
      }
    };

    findTimeSince();
    const timerId = setInterval(findTimeSince, 60000);

    return () => {
      clearInterval(timerId);
    };
  }, [saved]);

  return (
    <StyledCreateSet size={isSmallScreen ? "small" : "big"}>
      {showSettingsModal && (
        <div className="modal-overlay">
          <div className="setting-modal">
            <div className="header">
              <h1>Options</h1>
              <button onClick={() => setShowSettingsModal(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="body">
              <div className="setting-container">
                <p>VISIBLE TO</p>
                <select onChange={(e) => setViewableBy(e.target.value)}>
                  <option value="Everyone">Everyone</option>
                  <option value="Certain Classes">Certain Classes</option>
                  <option value="People with a password">
                    People with a password
                  </option>
                  <option value="Just Me">Just Me</option>
                </select>
              </div>
              <div className="setting-container">
                <p>EDITABLE BY</p>
                <select onChange={(e) => setEditableBy(e.target.value)}>
                  <option value="Certain Classes">Certain Classes</option>
                  <option value="People with a password">
                    People with a password
                  </option>
                  <option value="Just Me">Just Me</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="header">
        <div className="top">
          <div className="text">
            <h3>Create a new study set</h3>
            <h4>{timeSinceSaved}</h4>
          </div>

          {isSmallScreen ? (
            <div
              onClick={() => setShowSettingsModal(true)}
              className="small-create"
            >
              <TuneOutlinedIcon
                sx={{
                  height: "1rem",
                  width: "1rem",
                }}
              />
            </div>
          ) : created ? (
            <button
              className="create"
              onClick={() => {
                Router.push("/set/[setId]", `/set/${created.id}`);
              }}
            >
              Create
            </button>
          ) : (
            <button className="create" disabled>
              Create
            </button>
          )}
        </div>
        <div className="inputs">
          <input
            type="text"
            placeholder="Enter a title, like Biology -Chapter 22: Evolution"
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          {/* {!title && <p className="error">Title is required</p>} */}
          {!isSmallScreen && (
            <div className="settings">
              <div className="setting">
                <p>Visible to {viewableBy}</p>
                {title ? (
                  <button onClick={() => setShowSettingsModal(true)}>
                    Change
                  </button>
                ) : (
                  <button disabled>Change</button>
                )}
              </div>
              <div className="setting">
                <p>Editable by {editableBy}</p>
                {title ? (
                  <button onClick={() => setShowSettingsModal(true)}>
                    Change
                  </button>
                ) : (
                  <button disabled>Change</button>
                )}
              </div>
            </div>
          )}
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
                    <TextareaAutosize
                      minRows={1}
                      placeholder="Enter term"
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
                    />
                    {/* {!term.term && <p>Term cannot be empty</p>} */}
                    <span>TERM</span>
                  </div>
                  <div className="right">
                    <TextareaAutosize
                      minRows={1}
                      placeholder="Enter definition"
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
                    />
                    {/* {!term.definition && <p>Definition cannot be empty</p>} */}

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
              <div className="button-text">+ ADD CARD</div>
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
              <div className="button-text">+ ADD CARD</div>
            </button>
          )}
          {created ? (
            <button
              className="create"
              onClick={() => {
                Router.push("/set/[setId]", `/set/${created.id}`);
              }}
            >
              Create
            </button>
          ) : (
            <button className="create" disabled>
              Create
            </button>
          )}
        </div>
      </div>
    </StyledCreateSet>
  );
};

export default CreateSet;
