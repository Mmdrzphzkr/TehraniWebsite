'use client';

import { redirect } from 'next/navigation';

// Events are combined with courses in the My Courses & Events page
// Redirect to that page
export default function EventsPage() {
  redirect('/dashboard/courses');
}
