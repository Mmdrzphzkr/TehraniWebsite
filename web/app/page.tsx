import { getHomepageData } from '../features/homepage/data';
import { Hero } from '../components/home/Hero';
import { IntroSection } from '../components/home/IntroSection';
import { CoursesSection } from '../components/home/CoursesSection';
import { EventsSection } from '../components/home/EventsSection';
import { InstructorsSection } from '../components/home/InstructorsSection';
import { FounderSection } from '../components/home/FounderSection';
import { ArticlesSection } from '../components/home/ArticlesSection';
import { MediaSection } from '../components/home/MediaSection';
import { RentalSection } from '../components/home/RentalSection';
import { ContactCta } from '../components/home/ContactCta';

export default async function Page() {
  const content = await getHomepageData();
  // console.log(`Homepage content: ${JSON.stringify(content)}`);
  return (
    <main>
      <Hero content={content.hero} />
      <IntroSection content={content.introduction} />
      <CoursesSection courses={content.courses} />
      <EventsSection events={content.events} />
      <InstructorsSection instructors={content.instructors} />
      <FounderSection founder={content.founder} />
      <ArticlesSection articles={content.articles} />
      <MediaSection mediaItems={content.mediaItems} />
      <RentalSection rental={content.rental} />
      <ContactCta contact={content.contact} />
    </main>
  );
}
export const dynamic = 'force-dynamic';