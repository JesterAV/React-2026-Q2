import '../../styles/reset.css';
import '../../styles/variables.css';
import '../../styles/globals.css';

import { ClientOnly } from './client';

export function generateStaticParams() {
  return [{ slug: [''] }]
}
 
export default function Page() {
  return <ClientOnly />
}