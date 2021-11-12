import { UserSet, UserSetDoc } from "../../models/user-set";
import { Term } from "../../models/term";
import { UserTerm, UserTermDoc } from "../../models/user-term";

interface Test {
  trueOrFalse: [
    {
      definition: {
        id: string;
        text: string;
      };
      term: string;
      corAns: boolean;
    }
  ];
  multipleChoice: [
    {
      definition: {
        id: string;
        text: string;
      };
      terms: [
        {
          id: string;
          text: string;
        }
      ];
    }
  ];
  written: [
    {
      definition: {
        id: string;
        text: string;
      };
      corAns: string;
    }
  ];
  matching:
    {
      definitions: [
        {
          id: string;
          text: string;
        }
      ];
      terms: [
        {
          id: string;
          text: string;
        }
      ];
    };
};

export async function buildTest(user_terms: UserTermDoc[]): Promise<Test> {
    const test: any = {
      trueOrFalse: [],
      multipleChoice: [],
      written: [],
      matching: {
          definitions: [],
          terms: []
      }
    };

    let counter = 0;

    function shuffle(array: UserTermDoc[]) {
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

    user_terms = shuffle(user_terms);
    for (let user_term of user_terms) {
        
        // true or false
        if (counter / user_terms.length <= 0.25 || counter === 0) {
            
            const num = Math.random() < 0.5;
            if (num === true) {
                let random_index = Math.floor(Math.random() * user_terms.length);
                let term = user_terms[random_index];
                do {
                    random_index = Math.floor(
                      Math.random() * user_terms.length
                    );
                    term = user_terms[random_index];
                } while (term === user_term);

                test.trueOrFalse.push({
                    definition: {
                        id: user_term.id,
                        text: user_term.term_id.definition
                    },
                    term: term.term_id.term,
                    corAns: false
                });
               
            }
            else {
                test.trueOrFalse.push({
                  definition: {
                    id: user_term.id,
                    text: user_term.term_id.definition,
                  },
                  term: user_term.term_id.term,
                  corAns: true,
                });
            }
            
        // written
        } else if (counter / user_terms.length <= 0.5) {
            test.written.push({
                definition: {
                    id: user_term.id,
                    text: user_term.term_id.definition
                },
                corAns: user_term.term_id.term
            })
            
        // multiple choice
        } else if (counter / user_terms.length <= 0.75 || user_terms.length < 10) {
            let terms: any = [];
            for (let i = 0; i < 3; i++) {
                let random_index = Math.floor(
                  Math.random() * user_terms.length
                );
                let term = user_terms[random_index];
                let already_included = undefined;
                do {
                  random_index = Math.floor(Math.random() * user_terms.length);
                  term = user_terms[random_index];
                  already_included = terms.find(
                    (oldTerm: any) => oldTerm.id === term.id
                  );
    
                } while (term === user_term || already_included);
        

                terms.push({
                    id: term.id,
                    text: term.term_id.term
                })
            }
            terms.push({
                id: user_term.id,
                text: user_term.term_id.term
            })
            test.multipleChoice.push({
                definition: {
                    id: user_term.id,
                    text: user_term.term_id.definition
                },
                terms: terms
            });
            

        // matching
        } else {

            test.matching.definitions.push({
                id: user_term.id,
                text: user_term.term_id.definition,
            });
            test.matching.terms.push({
                id: user_term.id,
                text: user_term.term_id.term
            })
            
        }

        counter++;
    }

    return test;

}
