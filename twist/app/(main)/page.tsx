export default function Home() {
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <h1 className="text-7xl font-bold">
        Welcome to TwIST: Where Innovation Meets Opportunity
      </h1>
      <div className="max-w-1/2 mt-4">
        <p className="text-3xl">
          Unlock your future in tech with the next generation of job
          matchmaking. At TwIST, we don&apos;t just find you jobs—we engineer
          your success. Powered by cutting-edge AI, our platform seamlessly
          pairs your unique skills, ambitions, and experiences with exclusive IT
          opportunities that align with your career aspirations.
        </p>
        <h3 className="text-5xl font-bold mt-20">Why TwIST?</h3>
        <ul className="list-disc list-inside mt-4 flex flex-col gap-1.5 text-2xl">
          <li>
            <b>Precision Matching:</b> Our advanced algorithms dive deep into
            your profile, mapping your expertise to positions at leading global
            companies.
          </li>
          <li>
            <b>Tailored Opportunities:</b> Forget sifting through countless
            listings. We bring curated opportunities directly to you, saving you
            time and effort.
          </li>
          <li>
            <b>Real-Time Insights:</b> Stay ahead of the curve with instant
            alerts for positions that perfectly match your evolving career
            goals.
          </li>
          <li>
            <b>High-Level Connections:</b> From startups to Fortune 500s, access
            roles that aren&apos;t on the traditional job boards—positions
            designed for innovators like you.
          </li>
        </ul>
      </div>
    </div>
  );
}
