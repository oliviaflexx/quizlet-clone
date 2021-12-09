import { useEffect, useState } from "react";
import Router from "next/router";
import useRequest from "../../../hooks/use-request";
import StyledSet from "../../../styles/set-index";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FilterNoneTwoToneIcon from "@mui/icons-material/FilterNoneTwoTone";
import QuizTwoToneIcon from "@mui/icons-material/QuizTwoTone";
import ModeTwoToneIcon from "@mui/icons-material/ModeTwoTone";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import StarIcon from "@mui/icons-material/Star";

const SetShow = ({ set, currentUser }) => {
    // console.log(set);
    const [flashcardPreview, setFlashcardPreview] = useState(0);
    const [terms, setTerms] = useState(set.terms);
    const [flipSide, setFlipSide] = useState("front");
    const isBigScreen = useMediaQuery({ query: "(min-width: 1000px)" });
    const [flip, setFlip] = useState(0);
    const [fontSize, setFontSize] = useState('30px');
    const [studySet, setStudySet] = useState(false);
    const [star, setStar] = useState("");

    useEffect(() => {
      let wordLength = 0;

      let term = '';
      if (studySet) {
        term = terms[flashcardPreview].term_id;
      } else {
        term = terms[flashcardPreview];
      }
      if (flipSide === "front") {
        wordLength = term.term.length;
      } else {
        wordLength = term.definition.length;
      }

      if (wordLength < 140) {
        setFontSize('30px');
      } else if (wordLength <= 300) {
        setFontSize('25px');
      } else if (wordLength <= 500) {
        setFontSize("20px");
      } else {
        setFontSize("15px");
      }
      
      // console.log(wordLength);

    }, [flashcardPreview, flipSide]);


    const { doRequest: doGetStudyRequest, errors: getStudyErrors } = useRequest({
      url: `/api/study/${set.id}`,
      method: "get",
      body: {},
      onSuccess: (Terms) => {
        setTerms(Terms.user_terms);
        setStudySet(true);
        // console.log(terms);
      }
    });

    useEffect(() => {
      async function getSet() {
        await doGetStudyRequest();
      }
      
      getSet();
    }, []);

    const { doRequest: doStarRequest, errors: starErrors } = useRequest({
      url: `/api/study/term/${star}/star`,
      method: "put",
      body: {},
      onSuccess: (Term) => {
        console.log(Term);
        async function getSet() {
          await doGetStudyRequest();
        }
        getSet();
      },
    });

    useEffect(() => {
      async function starTerm() {
        await doStarRequest();
      }

      starTerm();
    }, [star]);

    return (
      <StyledSet fontSize={fontSize} size={isBigScreen ? "big" : "small"}>
        <div className="container-top">
          {!isBigScreen && <h1>{set.title}</h1>}
          {isBigScreen && (
            <div className="side">
              <h1>{set.title}</h1>
              <div className="study-links">
                <p>STUDY</p>
                <Link
                  href="/set/[setId]/flashcards"
                  as={`/set/${set.id}/flashcards`}
                >
                  <a>
                    <FilterNoneTwoToneIcon
                      sx={{ color: "#4257b2", height: "2rem", width: "2rem" }}
                    />
                    Flashcards
                  </a>
                </Link>
                <Link href="/set/[setId]/write" as={`/set/${set.id}/write`}>
                  <a>
                    <ModeTwoToneIcon
                      sx={{ color: "#4257b2", height: "2rem", width: "2rem" }}
                    />
                    Write
                  </a>
                </Link>
                <Link href="/set/[setId]/test" as={`/set/${set.id}/test`}>
                  <a>
                    <QuizTwoToneIcon
                      sx={{ color: "#4257b2", height: "2rem", width: "2rem" }}
                    />
                    Test
                  </a>
                </Link>
              </div>
            </div>
          )}

          <div className="card-container">
            <div
              className="flashcard-preview"
              flip={flip}
              onAnimationEnd={() => setFlip(0)}
            >
              {flipSide === "front" ? (
                <div
                  onClick={() => {
                    setFlip(1);
                    setTimeout(() => setFlipSide("back"), 500);
                  }}
                  className="front"
                >
                  {studySet
                    ? terms[flashcardPreview].term_id.term
                    : terms[flashcardPreview].term}
                </div>
              ) : (
                <div
                  onClick={() => {
                    setFlip(1);
                    setTimeout(() => setFlipSide("front"), 500);
                  }}
                  className="back"
                >
                  {studySet
                    ? terms[flashcardPreview].term_id.definition
                    : terms[flashcardPreview].definition}
                </div>
              )}
            </div>
            <div className="icons">
              <div className="middle">
                <button
                  onClick={() => {
                    if (flashcardPreview !== 0) {
                      setFlashcardPreview(flashcardPreview - 1);
                      setFlipSide("front");
                      // console.log(flashcardPreview);
                    }
                  }}
                >
                  <ArrowBackIcon />
                </button>
                <span>{`${flashcardPreview + 1}/${terms.length}`}</span>
                <button
                  onClick={() => {
                    if (flashcardPreview !== terms.length - 1) {
                      setFlashcardPreview(flashcardPreview + 1);
                      setFlipSide("front");
                    }
                  }}
                >
                  <ArrowForwardIcon />
                </button>
              </div>

              <button
                onClick={() => {
                  Router.push(
                    "/set/[setId]/flashcards",
                    `/set/${set.id}/flashcards`
                  );
                }}
              >
                <FullscreenIcon
                  sx={{
                    height: "2rem",
                    width: "2rem",
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {!isBigScreen && (
          <div className="side">
            <div className="study-links">
              <p>STUDY</p>
              <Link
                href="/set/[setId]/flashcards"
                as={`/set/${set.id}/flashcards`}
              >
                <a>
                  <FilterNoneTwoToneIcon
                    sx={{ color: "#4257b2", height: "2rem", width: "2rem" }}
                  />
                  Flashcards
                </a>
              </Link>
              <Link href="/set/[setId]/write" as={`/set/${set.id}/write`}>
                <a>
                  <ModeTwoToneIcon
                    sx={{ color: "#4257b2", height: "2rem", width: "2rem" }}
                  />
                  Write
                </a>
              </Link>
              <Link href="/set/[setId]/test" as={`/set/${set.id}/test`}>
                <a>
                  <QuizTwoToneIcon
                    sx={{ color: "#4257b2", height: "2rem", width: "2rem" }}
                  />
                  Test
                </a>
              </Link>
            </div>
          </div>
        )}
        <div className="details-bar">
          <div className="creator">
            <AccountCircleIcon />
            <span>Created by</span>

            <Link href={`/user/${set.creatorName}`}>{set.creatorName}</Link>
          </div>
          <div className="editing">
            <button>
              <AddIcon />
            </button>
            <button
              onClick={() =>
                Router.push("/set/[setId]/edit", `/set/${set.id}/edit`)
              }
            >
              <EditIcon />
            </button>
            <button id="i">i</button>
          </div>
        </div>
        <div className="bottom-container">
          <div className="term-container">
            <div className="top">
              <h4>Terms in this set ({terms.length})</h4>
              {/* <select>
                <option value="original">Original</option>
                <option value="alphabetical">Alphabetical</option>
              </select> */}
            </div>
            <div className="terms">
              {studySet ? (
                <div className="study">
                  {terms.find((term) => term.status === "Still Learning") && (
                    <div className="status">
                      <h4 className="learning" sx={{ color: "#f08700" }}>
                        Still Learning
                      </h4>
                      <p>You've started learning these terms. Keep it up!</p>
                      {terms.map((term) => {
                        if (term.status === "Still Learning") {
                          return (
                            <div className="term" key={term.id}>
                              <div className="left">{term.term_id.term}</div>
                              <div className="middle">
                                {term.term_id.definition}
                              </div>
                              <div className="right">
                                <div className="buttons">
                                  <button
                                    onClick={() => {
                                      setStar(term.id);
                                    }}
                                  >
                                    {term.starred ? (
                                      <StarIcon sx={{ color: "#ffcd1f" }} />
                                    ) : (
                                      <StarIcon />
                                    )}
                                  </button>
                                  
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  )}
                  {terms.find((term) => term.status === "Mastered") && (
                    <div className="status">
                      <h4 className="mastered" sx={{ color: "#23b26d" }}>
                        Mastered
                      </h4>
                      <p>You've been getting these terms right!</p>
                      {terms.map((term) => {
                        if (term.status === "Mastered") {
                          return (
                            <div className="term" key={term.id}>
                              <div className="left">{term.term_id.term}</div>
                              <div className="middle">
                                {term.term_id.definition}
                              </div>
                              <div className="right">
                                <div className="buttons">
                                  <button
                                    onClick={() => {
                                      setStar(term.id);
                                    }}
                                  >
                                    {term.starred ? (
                                      <StarIcon sx={{ color: "#ffcd1f" }} />
                                    ) : (
                                      <StarIcon />
                                    )}
                                  </button>
                                 
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  )}
                  {terms.find((term) => term.status === "Not studied") && (
                    <div className="status">
                      <h4 className="not-studied" sx={{ color: "#7b89c9" }}>
                        Not studied
                      </h4>
                      <p>You haven't studied these terms yet!</p>
                      {terms.map((term) => {
                        if (term.status === "Not studied") {
                          return (
                            <div className="term" key={term.id}>
                              <div className="left">{term.term_id.term}</div>
                              <div className="middle">
                                {term.term_id.definition}
                                <p>{term.starred}</p>
                              </div>
                              <div className="right">
                                <div className="buttons">
                                  <button
                                    onClick={() => {
                                      setStar(term.id);
                                    }}
                                  >
                                    {term.starred ? (
                                      <StarIcon sx={{ color: "#ffcd1f" }} />
                                    ) : (
                                      <StarIcon />
                                    )}
                                  </button>
                                  
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  )}
                </div>
              ) : (
                terms.map((term) => {
                  return (
                    <div className="term" key={term.id}>
                      <div className="left">{term.term}</div>
                      <div className="middle">{term.definition}</div>
                      <div className="right">
                        <div className="buttons">
                          <button
                            onClick={() => {
                              setStar(term.id);
                            }}
                          >
                            <StarIcon />
                          </button>
                          {/* {set.creatorId === currentUser.id && (
                            <button>
                              <EditIcon />
                            </button>
                          )} */}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {set.creatorId === currentUser.id && (
              <Link href="set/[setId]/edit" as={`set/${set.id}/edit`}>
                Add or Remove Terms
              </Link>
            )}
          </div>
        </div>
      </StyledSet>
    );
}

SetShow.getInitialProps = async (context, client ) => {
    const { setId } = context.query;
    const { data: set } = await client.get(`/api/sets/set/${setId}`);

    console.log(set);
    return { set };
}

export default SetShow;