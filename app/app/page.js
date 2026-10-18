import Link from 'next/link';
import styles from './page.module.css';
import Banner from './components/home/Banner';
import Category from './components/home/category';
import BestsellingWrapper from './components/home/BestsellingWrapper';
import About from './components/home/About';
import MilestoneBar from './components/home/milestone';
import Menu from './components/home/Menu';
import Team from './components/home/Team';
import Social from './components/home/Social';
import FeaturedCakeCTA from './components/home/cta';
export const metadata = {
  // Led with "Cake Shop" on the strength of the Business Profile data (Mar-Oct
  // 2026): the top discovery term is "cake shop near me" (71), then "bakery near
  // me" (48) and "bakery" (35). Not one branded search appears in the top five, so
  // front-loading the category people actually type beats leading with the brand
  // name nobody is searching for yet.
  //
  // Caveat worth remembering: those are Business Profile impressions, won in the
  // local pack by proximity and prominence, which a page title does not influence.
  // This aligns the site's vocabulary with real demand for classic organic results
  // and for relevance; it is not what wins "near me".
  //
  // 52 chars, inside the ~60 Google shows.
  title: "Cake Shop in Tenkasi | Homemade Cakes – Serle’s Bake",
  description: "Looking for a cake shop near me? Serle’s Bake delivers fresh homemade cakes, brownies, and custom designs across Tenkasi with free personalization.",
  keywords: "cake shop near me, bakery near me, cake shop tenkasi, bakery tenkasi, custom cakes, birthday cakes, homemade cakes, eggless cakes tenkasi",
};
  export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Category />
        <Banner />
        <About />
        <MilestoneBar />
        <Menu />
        <BestsellingWrapper /> 
        <Team />
        <FeaturedCakeCTA />
        <Social />
      </main>
    </div>
  );
}
