export type ProjectTheme = 'ocean' | 'security' | 'attendance' | 'health' | 'vault';

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  category: string;
  description: string;
  status: string;
  stack: string[];
  theme: ProjectTheme;
  repo?: string;
  question: string;
  problem: string;
  approach: string;
  stages: { title: string; detail: string }[];
  challenge: string;
  evidence: string;
  future: string;
};

export const projects: Project[] = [
  {
    slug: 'aavarta',
    title: 'AAVARTA',
    kicker: 'Reading currents. Planning a survey.',
    category: 'Geospatial',
    description: 'A design for combining satellite observations, ocean drift and field surveys to choose where to look for marine plastic.',
    status: 'Design concept',
    stack: ['Geospatial concepts', 'Ocean intelligence', 'AI exploration'],
    theme: 'ocean',
    question: 'Where should a survey crew look next?',
    problem: 'A patch of floating debris can move between a satellite pass and a boat arriving on site. A useful survey plan has to account for that movement and give the crew a way to report what it actually finds.',
    approach: 'The proposed workflow brings observations, current patterns and field notes into one decision. Each module answers a different part of the survey question.',
    stages: [
      { title: 'CONVERGE', detail: 'Estimate where currents could concentrate floating debris.' },
      { title: 'SEE', detail: 'Look for candidate patches in satellite observations.' },
      { title: 'LOOP', detail: 'Record what crews observe at a survey location.' },
      { title: 'TRACE', detail: 'Explore plausible source regions using drift scenarios.' },
      { title: 'DISPATCH', detail: 'Use the available evidence to rank survey and cleanup locations.' },
    ],
    challenge: 'A bright patch in an image can also be foam or glint. Field observations would give a detection model examples to check and a way to measure false alarms.',
    evidence: 'AAVARTA is documented here as a proposed architecture. The map is a synthetic illustration. Public implementation, data sources and model performance are unverified.',
    future: 'Choose one survey area, pair dated imagery with field observations, and test how often a suggested site contains debris.',
  },
  {
    slug: 'kavacha',
    title: 'Kavacha',
    kicker: 'A reversible response to a suspicious session.',
    category: 'Security',
    description: 'A Python security engine and Next.js cockpit for approving short-lived containment actions on Linux.',
    status: 'Implemented prototype',
    stack: ['Python', 'Next.js', 'SQLite', 'TypeScript'],
    theme: 'security',
    repo: 'Kavacha',
    question: 'How little can a system block and still contain an incident?',
    problem: 'A suspicious request may come from one session on a busy server. Blocking the whole service would interrupt everyone else. The operator needs to see the evidence, understand the scope and know when the action will expire.',
    approach: 'Kavacha separates detection, approval, enforcement and verification. Its Python engine handles the response, while the web cockpit lets a person inspect and approve the proposed action.',
    stages: [
      { title: 'Detect', detail: 'Collect evidence for a suspicious session and evaluate policy.' },
      { title: 'Approve', detail: 'Present the proposed scope for review through the web or CLI.' },
      { title: 'Contain', detail: 'Apply a time-limited mitigation and check the result with verification probes.' },
      { title: 'Record and roll back', detail: 'Record events in a SHA-256 chained SQLite ledger and release the temporary action.' },
    ],
    challenge: 'Rollback matters most when a response is interrupted. A useful test is to restart the engine during containment and check both the resulting rule and the audit trail.',
    evidence: 'The public repository contains engine modules, a Next.js cockpit and test files. This review covered the source. Runtime behavior and production effectiveness have not been independently measured.',
    future: 'Exercise the full approval, enforcement and expiry sequence in an isolated Linux environment, including an interrupted response.',
  },
  {
    slug: 'attendance',
    title: 'Presence',
    kicker: 'Geofenced facial recognition for attendance.',
    category: 'Computer Vision',
    description: 'A Flask attendance prototype that pairs an identity match with a location check before recording a visit.',
    status: 'Prototype outline',
    stack: ['Python', 'Flask', 'SQLite', 'HTML/CSS'],
    theme: 'attendance',
    question: 'Do identity and location agree?',
    problem: 'Recognizing a face answers one attendance question. It still leaves a second question about whether the person is inside the authorized area.',
    approach: 'The described application combines facial recognition with a Haversine distance check in a Flask web workflow. A successful attendance decision needs both conditions to pass.',
    stages: [
      { title: 'Identity', detail: 'Compare the supplied face input with an enrolled identity.' },
      { title: 'Distance', detail: 'Use the reported coordinates and site center to calculate great-circle distance.' },
      { title: 'Decision', detail: 'Compare the distance with the allowed radius and check the identity result.' },
      { title: 'Attendance history', detail: 'Use SQLite and CSV records to retain attendance entries.' },
    ],
    challenge: 'A location reading can shift across the edge of a geofence while the person stands still. The boundary rule and the handling of an uncertain face match both need explicit tests.',
    evidence: 'The stack and workflow come from the project description. A matching public repository has yet to be verified. The interactive example uses generated coordinates and a simulated identity match.',
    future: 'Test boundary cases and false matches with consented inputs, and document how enrollment data is retained.',
  },
  {
    slug: 'healthgrid',
    title: 'HealthGrid',
    kicker: 'An interface for inspecting synthetic cohorts.',
    category: 'Frontend',
    description: 'A React workspace for building synthetic cohort requests and exploring validation, privacy-risk and export screens.',
    status: 'Frontend prototype',
    stack: ['React', 'TypeScript', 'Vite', 'Recharts'],
    theme: 'health',
    repo: 'HealthGrid',
    question: 'What does a researcher need to know about a synthetic cohort?',
    problem: 'A generated table can look plausible even when its distributions are a poor fit for the research question. The interface needs to keep the cohort request, its provenance and its evaluation together.',
    approach: 'HealthGrid has a typed service layer between the React screens and their data. It starts with demonstration fixtures and can probe a separately configured API through its health endpoint.',
    stages: [
      { title: 'Build a cohort request', detail: 'Describe a target population in the cohort builder.' },
      { title: 'Inspect the cohort', detail: 'Explore the validation and privacy-risk views alongside the cohort passport.' },
      { title: 'Connect the data source', detail: 'Use fixture data in demo mode or connect a compatible API through service adapters.' },
      { title: 'Review the export', detail: 'Inspect the export workflow together with the cohort context.' },
    ],
    challenge: 'A chart generated from fixtures can look exactly like a chart backed by a scientific evaluation. The data source needs to stay visible throughout the workflow.',
    evidence: 'The public repository contains a React and TypeScript frontend, synthetic fixtures, service adapters and an API client. The generation backend and its scientific validation are outside the verified scope.',
    future: 'Connect a reproducible backend run and carry its dataset version and evaluation results through the passport and export.',
  },
  {
    slug: 'brokenvault',
    title: 'BrokenVault',
    kicker: 'Back up the changes. Reuse the rest.',
    category: 'Systems',
    description: 'A Rust team project that splits files into reusable chunks for resumable backups and integrity-checked restores.',
    status: 'Implemented team project',
    stack: ['Rust', 'SQLite', 'FastCDC', 'Axum'],
    theme: 'vault',
    repo: 'BrokenVault',
    question: 'Why upload the same bytes twice?',
    problem: 'Most of a directory can stay the same between backups. Sending a complete copy each time wastes storage and makes an interrupted upload expensive to repeat.',
    approach: 'The client splits content into chunks with FastCDC and identifies each chunk by its SHA-256 digest. Snapshots can refer to chunks already stored on the server.',
    stages: [
      { title: 'Split and identify', detail: 'Choose chunk boundaries from the file content and compute a digest for each chunk.' },
      { title: 'Transfer missing chunks', detail: 'Reuse stored chunks and resume an interrupted upload.' },
      { title: 'Commit the snapshot', detail: 'Publish a snapshot only after its required content is available.' },
      { title: 'Restore and verify', detail: 'Reconstruct files from the snapshot and check their integrity.' },
    ],
    challenge: 'Partially uploaded chunks are useful for resuming a backup, but an incomplete snapshot must not become visible as a successful backup.',
    evidence: 'The public README credits me as a team member alongside Krishna Koushik Kasarla and Siddartha Kailasa. The repository includes the Rust client and server. This source review did not include a runtime benchmark.',
    future: 'Test interrupted uploads and full restores on a reproducible dataset. The documented prototype also leaves authentication and encryption open.',
  },
];
