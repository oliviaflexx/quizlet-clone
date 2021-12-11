import { useEffect, useState } from "react";
import useRequest from "../../../hooks/use-request";
import EditIcon from "@mui/icons-material/Edit";
import FilterNoneTwoToneIcon from "@mui/icons-material/FilterNoneTwoTone";
import StarIcon from "@mui/icons-material/Star";
import { useMediaQuery } from "react-responsive";
import ProgressBar from "react-bootstrap/ProgressBar";
import StyledFlashcards from "../../../styles/set-flashcards";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import TuneIcon from "@mui/icons-material/Tune";
import Link from "next/link";
import OptionsModal from "../../../components/options-modal";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Flashcards = ({ set, currentUser }) => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 750px)" });
  const [terms, setTerms] = useState(set.user_terms);
  const [flip, setFlip] = useState(0);
  const [swipe, setSwipe] = useState(0);
  const [fontSize, setFontSize] = useState("30px");

  const [flashcardIndex, setFlashcardIndex] = useState(
    set.flashcards.current_index
  );
  const [flipSide, setFlipSide] = useState("back");
  const [star, setStar] = useState("");
  const [mounted, setMounted] = useState(false);
  const [shuffled, setShuffled] = useState("");
  const [playing, setPlaying] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [answerWith, setAnswerWith] = useState("terms");
  const [starredTerms, setStarredTerms] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (starredTerms) {
      const starredTerms = terms.filter((term) => term.starred === true);

      if (starredTerms.length) {
        setFlashcardIndex(0);
        setTerms(starredTerms);
      } else {
        setStarredTerms(false);
      }
    } else {
      setTerms(set.user_terms);
    }
  }, [starredTerms]);

  useEffect(() => {
    let wordLength = 0;
    const term = terms[flashcardIndex].term_id;
    if (flipSide === "front") {
      wordLength = term.term.length;
    } else {
      wordLength = term.definition.length;
    }

    if (isBigScreen) {
      if (wordLength < 140) {
        setFontSize("42px");
      } else if (wordLength <= 300) {
        setFontSize("30px");
      } else if (wordLength <= 500) {
        setFontSize("25px");
      } else {
        setFontSize("20px");
      }
    } else {
      if (wordLength < 140) {
        setFontSize("35px");
      } else if (wordLength <= 300) {
        setFontSize("30px");
      } else if (wordLength <= 500) {
        setFontSize("25px");
      } else {
        setFontSize("20px");
      }
    }

    // console.log(wordLength);
  }, [flashcardIndex, flipSide]);

  const { doRequest: doStarRequest, errors: starErrors } = useRequest({
    url: `/api/study/term/${star}/star`,
    method: "put",
    body: {},
    onSuccess: (Term) => {
      setStar("");
      let newTerms = [...terms];
      newTerms[flashcardIndex].starred = Term.starred;
      setTerms(newTerms);
    },
  });

  useEffect(() => {
    async function starTerm() {
      await doStarRequest();
    }

    if (star) {
      starTerm();
    }
  }, [star]);

  const { doRequest: doGetIndexRequest, errors: getIndexErrors } = useRequest({
    url: `/api/study/flashcards/${set.set_id}`,
    method: "put",
    body: {
      current_index: flashcardIndex,
    },
    onSuccess: (Flashcard) => {
      // console.log(Flashcard);
    },
  });

  useEffect(() => {
    async function changeIndex() {
      await doGetIndexRequest();
    }

    if (!shuffled) {
      changeIndex();
    }
  }, [flashcardIndex]);

  const { doRequest: doStudyTermRequest, errors: studyTermErrors } = useRequest(
    {
      url: `/api/study/term/${terms[flashcardIndex].id}`,
      method: "put",
      body: {
        flashcards: true,
        correct: true,
      },
      onSuccess: (Response) => {
        // console.log(Response);
      },
    }
  );

  useEffect(() => {
    async function studyTerm() {
      await doStudyTermRequest();
    }

    studyTerm();
  }, [flipSide]);

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  useEffect(() => {
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    let isItPlaying = "";
    async function playIt() {
      if (!isItPlaying) {
        return;
      }
      setFlip(1);
      if (flipSide === "front") {
        setFlipSide("back");
      } else {
        setFlipSide("front");
      }

      await sleep(3000);
      if (!isItPlaying) {
        return;
      }

      setFlashcardIndex((currentIndex) => {
        if (currentIndex === terms.length - 1) {
          console.log("LAST ONE ");
          return 0;
        } else {
          return currentIndex + 1;
        }
      });

      // setFlipSide("front");
      if (answerWith === "terms") {
        setFlipSide("back");
      } else {
        setFlipSide("front");
      }
      await sleep(3000);
      if (!isItPlaying) {
        return;
      }
    }

    async function doIt() {
      if (isItPlaying === true) {
        await playIt();
        doIt();
      } else {
        return;
      }
    }

    if (playing) {
      isItPlaying = true;
      doIt();
    } else {
      isItPlaying = false;
    }

    return () => (isItPlaying = false);
  }, [playing]);

  return (
    mounted && (
      <StyledFlashcards fontSize={fontSize}>
        {showOptionsModal && (
          <OptionsModal
            setShowOptionsModal={setShowOptionsModal}
            setAnswerWith={setAnswerWith}
            setStarredTerms={setStarredTerms}
            starredTerms={starredTerms}
            answerWith={answerWith}
          />
        )}
        {isBigScreen ? (
          <div className="big-screen">
            <div className="side-controls">
              <div className="top">
                <Link href="/set/[setId]" as={`/set/${set.set_id}`}>
                  <a>
                    <ArrowBackIosIcon /> Back
                  </a>
                </Link>
                <div className="flashcards">
                  <FilterNoneTwoToneIcon />
                  Flashcards
                </div>
                <div className="progress-container">
                  <ProgressBar
                    now={((flashcardIndex + 1) / terms.length) * 100}
                  />
                  <div className="progress-text">
                    <span>PROGRESS</span>
                    <span>{`${flashcardIndex + 1}/${terms.length}`}</span>
                  </div>
                </div>
              </div>
              <div className="bottom">
                <button
                  onClick={() => setPlaying(() => !playing)}
                  className={playing ? "choices clicked" : "choices"}
                >
                  <PlayArrowIcon /> Play
                </button>
                <button
                  className={shuffled ? "choices clicked" : "choices"}
                  onClick={async () => {
                    if (shuffled) {
                      setFlashcardIndex(0);
                      setShuffled(false);
                      setTerms(set.user_terms);
                    } else {
                      setShuffled(true);
                      setTerms(shuffle(terms));
                      setFlashcardIndex(0);
                    }
                  }}
                >
                  <ShuffleIcon /> Shuffle
                </button>
                <button
                  onClick={() => setShowOptionsModal(true)}
                  className="choices"
                >
                  <TuneIcon /> Options
                </button>
              </div>
            </div>
            <div className="card-container">
              <div
                className={
                  terms[flashcardIndex].starred
                    ? "flashcard starred"
                    : "flashcard"
                }
                flip={flip}
                swipe={swipe}
                onAnimationEnd={() => {
                  setFlip(0);
                  setSwipe(0);
                }}
              >
                <div className="top-right">
                  {currentUser.name === set.creatorName && (
                    <button>
                      <EditIcon />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setStar(terms[flashcardIndex].id);
                    }}
                  >
                    {terms[flashcardIndex].starred ? (
                      <StarIcon sx={{ color: "#ffcd1f" }} />
                    ) : (
                      <StarIcon />
                    )}
                  </button>
                </div>
                {flipSide === "front" ? (
                  <div
                    onClick={() => {
                      setFlip(1);
                      setTimeout(() => setFlipSide("back"), 500);
                    }}
                    className="front"
                  >
                    {terms[flashcardIndex].term_id.term}
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setFlip(1);
                      setTimeout(() => setFlipSide("front"), 500);
                    }}
                    className="back"
                  >
                    {terms[flashcardIndex].term_id.definition}
                  </div>
                )}
              </div>
              <div className="controls">
                <button
                  disabled={flashcardIndex === 0}
                  onClick={() => {
                    if (flashcardIndex !== 0) {
                      setFlashcardIndex(flashcardIndex - 1);
                      if (answerWith === "terms") {
                        setFlipSide("back");
                      } else {
                        setFlipSide("front");
                      }

                      // setSwipe(1);
                      // console.log(flashcardPreview);
                    }
                  }}
                >
                  <ArrowBackIosIcon />
                </button>
                <button
                  disabled={flashcardIndex === terms.length - 1}
                  onClick={() => {
                    if (flashcardIndex !== terms.length - 1) {
                      setFlashcardIndex(flashcardIndex + 1);
                      if (answerWith === "terms") {
                        setFlipSide("back");
                      } else {
                        setFlipSide("front");
                      }
                      // setSwipe(2);
                    }
                  }}
                >
                  <ArrowForwardIosIcon />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="small-screen">
            <div className="header">
              <Link href="/set/[setId]" as={`/set/${set.set_id}`}>
                <ArrowBackIcon />
              </Link>
              <button
                onClick={() => setShowOptionsModal(true)}
                className="choices"
              >
                <TuneIcon />
              </button>
            </div>
            <div className="progress-container">
              <ProgressBar now={((flashcardIndex + 1) / terms.length) * 100} />
              <span>{`${flashcardIndex + 1}/${terms.length}`}</span>
            </div>
            <div className="card-container">
              <div
                className={
                  terms[flashcardIndex].starred
                    ? "flashcard starred"
                    : "flashcard"
                }
                flip={flip}
                swipe={swipe}
                onAnimationEnd={() => {
                  setFlip(0);
                  setSwipe(0);
                }}
              >
                <div className="top-right">
                  {currentUser.name === set.creatorName && (
                    <button>
                      <EditIcon />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setStar(terms[flashcardIndex].id);
                    }}
                  >
                    {terms[flashcardIndex].starred ? (
                      <StarIcon sx={{ color: "#ffcd1f" }} />
                    ) : (
                      <StarIcon />
                    )}
                  </button>
                </div>
                {flipSide === "front" ? (
                  <div
                    onClick={() => {
                      setFlip(1);
                      setTimeout(() => setFlipSide("back"), 500);
                    }}
                    className="front"
                  >
                    {terms[flashcardIndex].term_id.term}
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setFlip(1);
                      setTimeout(() => setFlipSide("front"), 500);
                    }}
                    className="back"
                  >
                    {terms[flashcardIndex].term_id.definition}
                  </div>
                )}
              </div>
              <div className="controls">
                <button
                  disabled={flashcardIndex === 0}
                  onClick={() => {
                    if (flashcardIndex !== 0) {
                      setFlashcardIndex(flashcardIndex - 1);
                      if (answerWith === "terms") {
                        setFlipSide("back");
                      } else {
                        setFlipSide("front");
                      }

                      // setSwipe(1);
                      // console.log(flashcardPreview);
                    }
                  }}
                >
                  <ArrowBackIosIcon />
                </button>
                <button
                  disabled={flashcardIndex === terms.length - 1}
                  onClick={() => {
                    if (flashcardIndex !== terms.length - 1) {
                      setFlashcardIndex(flashcardIndex + 1);
                      if (answerWith === "terms") {
                        setFlipSide("back");
                      } else {
                        setFlipSide("front");
                      }
                      // setSwipe(2);
                    }
                  }}
                >
                  <ArrowForwardIosIcon />
                </button>
              </div>
            </div>
          </div>
        )}
      </StyledFlashcards>
    )
  );
};

Flashcards.getInitialProps = async (context, client) => {
  const { setId } = context.query;

  const { data: set } = await client.put(`/api/study/flashcards/${setId}`, {
    current_index: 0,
  });

  console.log(set);
  return { set };
};

export default Flashcards;
