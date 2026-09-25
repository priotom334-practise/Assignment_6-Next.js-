import Image from "next/image";
import BannerLogo from "../public/banner.png";

const Banner = () => {
  return (
    <div className="container mx-auto my-8 flex flex-col gap-6 rounded-2xl bg-gray-800 px-4 py-5 sm:px-6 sm:py-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-8">
      <div className="flex flex-col justify-center gap-6 px-4 py-6 md:px-4 md:py-8">
        <p className="font-bold text-amber-300">WORKOUT LIBRARY</p>

        <h1 className="text-3xl font-bold sm:text-5xl">
          TRAIN WITH INTENT. LOG
          <br />
          EVERY SET.
        </h1>

        <p className="text-sm text-gray-200 sm:text-base">
          FitLog is a dark, no-nonsense gym companion: pick a fit, lock it
          <br className="hidden sm:block" />
          into today's plan, and watch the week's work add up.
        </p>

        <a
          href="/workouts"
          className="inline-flex w-fit items-center justify-center rounded-full bg-yellow-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-black transition hover:bg-yellow-500 md:text-sm"
        >
          BROWSE WORKOUTS
        </a>
      </div>

      <div>
        <Image src={BannerLogo} alt="Workout banner" />
      </div>
    </div>
  );
};

export default Banner;
