export interface SamplePreset {
  id: string;
  title: string;
  description: string;
  iconName: string;
  totalRows: number;
  csvContent: string;
}

const generateSampleCSV = (
  activeCount: number,
  atRiskCount: number,
  inactiveCount: number,
  industryName: string
): string => {
  const headers = ['Email', 'First Name', 'Last Name', 'Signup Date', 'Last Opened Date', 'Last Clicked Date', 'Open Count', 'Click Count', 'Total Sent'];
  const rows: string[] = [headers.join(',')];

  const now = new Date();
  
  const formatDate = (daysAgo: number) => {
    const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return d.toISOString().split('T')[0];
  };

  const firstNames = ['Alex', 'Sarah', 'Michael', 'Emma', 'David', 'Jessica', 'James', 'Emily', 'Daniel', 'Olivia', 'Chris', 'Sophia', 'Liam', 'Ava', 'Noah', 'Mia', 'Lucas', 'Isabella', 'Ethan', 'Charlotte'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'company.io', 'techcorp.com', 'domain.net'];

  let idCounter = 1;

  // Active Subscribers (1 to 80 days ago)
  for (let i = 0; i < activeCount; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${idCounter}@${domains[i % domains.length]}`;
    const daysAgo = Math.floor(Math.random() * 80) + 1;
    const signupDaysAgo = daysAgo + Math.floor(Math.random() * 300) + 90;
    const opens = Math.floor(Math.random() * 25) + 5;
    const clicks = Math.floor(Math.random() * 10) + 1;
    const sent = opens + Math.floor(Math.random() * 15);
    
    rows.push([
      email,
      fn,
      ln,
      formatDate(signupDaysAgo),
      formatDate(daysAgo),
      formatDate(daysAgo + Math.floor(Math.random() * 5)),
      opens.toString(),
      clicks.toString(),
      sent.toString()
    ].join(','));
    idCounter++;
  }

  // At-Risk Subscribers (95 to 175 days ago)
  for (let i = 0; i < atRiskCount; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${idCounter}@${domains[i % domains.length]}`;
    const daysAgo = Math.floor(Math.random() * 80) + 95;
    const signupDaysAgo = daysAgo + Math.floor(Math.random() * 200) + 60;
    const opens = Math.floor(Math.random() * 6) + 1;
    const clicks = Math.random() > 0.5 ? 1 : 0;
    const sent = Math.floor(Math.random() * 20) + 15;

    rows.push([
      email,
      fn,
      ln,
      formatDate(signupDaysAgo),
      formatDate(daysAgo),
      clicks > 0 ? formatDate(daysAgo + 10) : '',
      opens.toString(),
      clicks.toString(),
      sent.toString()
    ].join(','));
    idCounter++;
  }

  // Inactive Subscribers (185 to 400 days ago, or never engaged)
  for (let i = 0; i < inactiveCount; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${idCounter}@${domains[i % domains.length]}`;
    const neverEngaged = Math.random() > 0.4;
    const daysAgo = neverEngaged ? 0 : Math.floor(Math.random() * 200) + 185;
    const signupDaysAgo = Math.floor(Math.random() * 300) + 200;

    rows.push([
      email,
      fn,
      ln,
      formatDate(signupDaysAgo),
      neverEngaged ? '' : formatDate(daysAgo),
      '',
      neverEngaged ? '0' : '1',
      '0',
      (Math.floor(Math.random() * 25) + 10).toString()
    ].join(','));
    idCounter++;
  }

  return rows.join('\n');
};

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'ecommerce',
    title: 'E-Commerce Store List',
    description: '1,200 promotional contacts with high decay risk & abandoned cart subscribers.',
    iconName: 'ShoppingBag',
    totalRows: 1200,
    csvContent: generateSampleCSV(620, 280, 300, 'E-Commerce'),
  },
  {
    id: 'saas',
    title: 'B2B SaaS Newsletter',
    description: '850 product update subscribers with 35% inactive enterprise contacts.',
    iconName: 'Building2',
    totalRows: 850,
    csvContent: generateSampleCSV(450, 160, 240, 'SaaS'),
  },
  {
    id: 'creator',
    title: 'Creator Community',
    description: '500 newsletter readers needing urgent engagement cleanup.',
    iconName: 'Sparkles',
    totalRows: 500,
    csvContent: generateSampleCSV(280, 90, 130, 'Creator'),
  },
];
