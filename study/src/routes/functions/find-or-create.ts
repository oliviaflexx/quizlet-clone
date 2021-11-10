import { UserSet, UserSetDoc } from "../../models/user-set";
import { Term } from "../../models/term";
import { UserTerm, UserTermDoc } from "../../models/user-term";

export async function findOrCreate(set_id: string, owner_id: string): Promise<UserSetDoc> {
    const set = await UserSet.findOne({
      set_id,
      owner_id,
    }).populate([
      {
        path: "user_terms",
        model: "UserTerm",
        populate: {
          path: "term_id",
          model: "Term",
        },
      },
    ]);

    if (set) {
        return set;
    }
    else {

        const terms = await Term.find({set_id});

        if (!terms.length) {
            throw Error("Invalid set id");
        }
        
        let user_terms: UserTermDoc[] = [];

        for (let term of terms) {

            let user_term = UserTerm.build({
                term_id: term.id
            });
            await user_term.save();

            user_terms.push(user_term);

        }

        const buildSet = UserSet.build({ set_id, owner_id, user_terms });

        await buildSet.save();

        const newSet = await UserSet.findById(buildSet.id).populate([
          {
            path: "user_terms",
            model: "UserTerm",
            populate: {
              path: "term_id",
              model: "Term",
            },
          },
        ]);

        return newSet!;

    }
}