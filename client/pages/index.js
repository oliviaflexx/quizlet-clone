import buildClient from "../api/build-client";
import StyledLanding from "../styles/landing";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

const LandingPage = ({ currentUser }) => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 500px)" });

  return (
    <StyledLanding size={isSmallScreen ? "small" : "big"}>
      <header>
        <div className="header-container">
          <img srcSet="https://images.prismic.io/quizlet-prod/eca927aa-4f86-4e40-9565-8dd2fefb2cde_hero+image+shaded.png?auto=compress,format"></img>
          <div className="text-container">
            <div className="text">
              <h1>Learn it. Own it. Quizlet</h1>
              <p>
                With new expert explanations, an AI Learning Assistant and our
                ever-effective flashcards, get a suite of science-backed study
                tools at your fingertips.
              </p>
            </div>
            <div className="button-container">
              <Link href="/auth/signup">Get Started</Link>
            </div>
          </div>
        </div>
      </header>
      <section className="highlight-text">
        <p>
          <em>90% </em>
          of students who use Quizlet report higher grades.
        </p>
      </section>
      <section className="text-pic">
        <div className="text">
          <h2>Explanations you can trust.</h2>
          <p>
            Quizlet explanations show you step-by-step approaches to solve tough
            problems. Find solutions in 64 subjects, all written and verified by
            experts.
          </p>
        </div>
        <div className="image right">
          <img srcSet="https://images.prismic.io/quizlet-prod/99cd5988-f3a3-4432-aa3c-1e8941f59cb9_20210814_QZ_Home_Explanations.png?auto=compress,format&rect=0,2,3072,2395&w=1026&h=800 1x, https://images.prismic.io/quizlet-prod/99cd5988-f3a3-4432-aa3c-1e8941f59cb9_20210814_QZ_Home_Explanations.png?auto=compress,format&rect=0,2,3072,2395&w=1026&h=800 2x"></img>
        </div>
      </section>
      <section className="text-pic">
        <div className="image left">
          <img srcSet="https://images.prismic.io/quizlet-prod/d4052d90-f71e-466a-86f5-080cf02de2da_20210814_QZ_Home_Flashcards.png?auto=compress,format&rect=0,2,3072,2395&w=1026&h=800 1x, https://images.prismic.io/quizlet-prod/d4052d90-f71e-466a-86f5-080cf02de2da_20210814_QZ_Home_Flashcards.png?auto=compress,format&rect=0,2,3072,2395&w=1026&h=800 2x"></img>
        </div>
        <div className="text">
          <h2>Flashcards on repeat. Study modes on shuffle.</h2>
          <p>
            Mixed with smart study tools, our flashcards have been helping
            students ace their toughest exams since 2005.
          </p>
        </div>
      </section>
      <section className="text-pic">
        <div className="text">
          <h2>Whether you plan or cram, find your study jam.</h2>
          <p>
            Early morning? All-nighter? With teaching methods backed by learning
            science, Quizlet is designed to save you time.
          </p>
        </div>
        <div className="image right">
          <img srcSet="https://images.prismic.io/quizlet-prod/3a92729c-f212-4ac0-8dad-b2c875c57358_20210814_QZ_Home_StudyJam.png?auto=compress,format&rect=0,2,3072,2395&w=1026&h=800 1x, https://images.prismic.io/quizlet-prod/3a92729c-f212-4ac0-8dad-b2c875c57358_20210814_QZ_Home_StudyJam.png?auto=compress,format&rect=0,2,3072,2395&w=1026&h=800 2x"></img>
        </div>
      </section>
      <section className="text-pic">
        <div className="image left">
          <img srcSet="https://images.prismic.io/quizlet-prod/6b2ff704-ccbf-441e-9b49-dbd3b7d7d530_20210814_QZ_Home_MobileApp.png?auto=compress,format&rect=0,0,3072,2395&w=1026&h=800 1x, https://images.prismic.io/quizlet-prod/6b2ff704-ccbf-441e-9b49-dbd3b7d7d530_20210814_QZ_Home_MobileApp.png?auto=compress,format&rect=0,2,3072,2395&w=1026&h=800 2x"></img>
        </div>
        <div className="text">
          <h2>Millions of study sets.</h2>
          <p>
            Find, study or create sets anywhere life takes you with the mobile
            app.
          </p>
        </div>
      </section>
      <section className="testimonial">
        <Carousel
          autoPlay={true}
          interval={3000}
          infiniteLoop={true}
          showArrows={false}
          showStatus={false}
          showThumbs={false}
          showIndicators={false}
          // dynamicHeight={true}
          // centerMode={true}
          // centerSlidePercentage={100}
          // width={'100%'}
        >
          <div className="text">
            <h3>
              Quizlet is a great way to study. I introduced it to my friends and
              we are all improving. Whenever I think of Quizlet, I think of the
              pure joy of studying in a few minutes instead of hours.
            </h3>
            <p>- Nicoleb18, AGE 19</p>
          </div>
          <div className="text">
            <h3>
              When it came to studying I was a mess. Now I am at this new school
              and they introduced me to Quizlet. I am no longer stressed when it
              comes to studying for assignments. Thank you Quizlet!
            </h3>
            <p>- Agentdolly, AGE 29</p>
          </div>
          <div className="text">
            <h3>
              Quizlet has helped me to understand just how fun and important and
              fun studying can be! This school year, in chemistry class I put my
              terms on Quizlet and I already feel better about my upcoming test.
            </h3>
            <p>- Sierrafr, AGE 20</p>
          </div>
          <div className="text">
            <h3>
              Quizlet helped my grades sooooo much. Thank you for making
              studying fun and productive!
            </h3>
            <p>- LittleButtercup, AGE 17</p>
          </div>
        </Carousel>
        
      </section>
      <section className="ready">
        <h2>Ready to start getting better grades?</h2>
        <Link href="/auth/signup">Get started</Link>
      </section>
    </StyledLanding>
  );
};

LandingPage.getInitialProps = async (context) => {
  console.log("LANDING PAGE!");
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser");

  return data;
};

export default LandingPage;
