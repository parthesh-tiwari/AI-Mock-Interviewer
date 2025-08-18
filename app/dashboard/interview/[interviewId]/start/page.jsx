import { use } from 'react';
import StartInterview from './StartInterview';

export default function Page({ params }) {
  const { interviewId } = use(params);
  return <StartInterview interviewId={interviewId} />;
}
