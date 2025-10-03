/**
 * Mock conversation data for Robert's dashboard
 */
import type { RiskItem } from '@/components/dashboard/RiskCard.vue'

export interface DashboardCard {
  id: string
  type: 'risk-assessment' | 'action-plan' | 'monitoring'
  title: string
  subtitle?: string
  riskLevel?: 'High Risk' | 'Medium Risk' | 'Low Risk'
  riskItems?: RiskItem[]
  content?: string
  details?: string
  actions?: string[]
}

export interface RobertProfile {
  name: string
  title: string
  profileImage: string
  membershipLevel: string
  age: string
  location: string
  maritalStatus: string
  netWorth: string
  occupation: string
  education: string
  familyInfo: {
    previousMarriages: number
    children: Array<{
      age: number
      status: string
      location?: string
      relationship: string
      notes?: string
    }>
    currentSpouse: {
      activities: string
      causes: string[]
    }
  }
  background: {
    network: string
    connections: string
    family: string
  }
}

export const getRobertProfile = (): RobertProfile => {
  return {
    name: 'Robert Schmidt',
    title: 'Investment Banker & Business Owner',
    profileImage:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces',
    membershipLevel: 'Platinum Plus',
    age: '56',
    location: 'New York, NY',
    maritalStatus: 'Married (2nd)',
    netWorth: '$250M+ USD',
    occupation: 'Investment Banking & Multiple Business Ventures',
    education: 'MBA, Wharton School of Business',
    familyInfo: {
      previousMarriages: 1,
      children: [
        {
          age: 33,
          status: 'Eldest daughter (from previous marriage)',
          location: 'Dallas, TX',
          relationship: 'Professional',
          notes: 'Manages subsidiary in Dallas'
        },
        {
          age: 22,
          status: 'Middle child',
          location: 'College, Northeast',
          relationship: 'Distant'
        },
        {
          age: 20,
          status: 'Youngest',
          location: 'College, Northeast',
          relationship: 'Close'
        }
      ],
      currentSpouse: {
        activities: 'Active in philanthropic activities',
        causes: [
          'Education initiatives',
          'Healthcare access',
          'Arts & culture',
          'Environmental conservation'
        ]
      }
    },
    background: {
      network:
        'Large, high-value network spanning finance, politics, and industry',
      connections:
        'Politically and financially connected multigenerational family',
      family: 'UHNW (Ultra High Net Worth) family with established legacy'
    }
  }
}

export interface TimelineEvent {
  year: number
  label: string
  category: 'education' | 'work' | 'relationship' | 'marriage' | 'children' | 'location'
  description?: string
}

export interface USLocation {
  city: string
  state: string
  lat: number
  lon: number
  years?: string
  description?: string
}

export const getRobertLocations = (): USLocation[] => {
  return [
    {
      city: 'New York',
      state: 'NY',
      lat: 40.7128,
      lon: -74.006,
      years: '1969-1987, 1993-Present',
      description: 'Born here, current residence and business headquarters'
    },
    {
      city: 'Boston',
      state: 'MA',
      lat: 42.3601,
      lon: -71.0589,
      years: '1987-1991',
      description: 'Harvard University undergraduate'
    },
    {
      city: 'Philadelphia',
      state: 'PA',
      lat: 39.9526,
      lon: -75.1652,
      years: '1991-1993',
      description: 'Wharton School of Business MBA'
    },
    {
      city: 'Dallas',
      state: 'TX',
      lat: 32.7767,
      lon: -96.797,
      years: '2010-2015',
      description:
        'Expanded business operations, daughter Sarah manages subsidiary'
    },
    {
      city: 'Chicago',
      state: 'IL',
      lat: 41.8781,
      lon: -87.6298,
      years: '2005-2008',
      description: 'Regional office operations'
    },
    {
      city: 'San Francisco',
      state: 'CA',
      lat: 37.7749,
      lon: -122.4194,
      years: '2015-2017',
      description: 'Tech investment ventures'
    },
    {
      city: 'Miami',
      state: 'FL',
      lat: 25.7617,
      lon: -80.1918,
      years: '2018-Present',
      description: 'Vacation home and offshore investments'
    }
  ]
}

export const getRobertLifeEvents = (): TimelineEvent[] => {
  return [
    {
      year: 1969,
      label: 'Born NYC',
      category: 'location',
      description: 'Robert Schmidt born in New York'
    },
    {
      year: 1987,
      label: 'Boston',
      category: 'location',
      description: 'Moved to Boston for Harvard'
    },
    {
      year: 1987,
      label: 'Harvard',
      category: 'education',
      description: 'Started undergraduate at Harvard'
    },
    {
      year: 1991,
      label: 'Graduated',
      category: 'education',
      description: 'BA Economics, Harvard'
    },
    {
      year: 1991,
      label: 'Philadelphia',
      category: 'location',
      description: 'Moved to Philadelphia for Wharton'
    },
    {
      year: 1993,
      label: 'Wharton MBA',
      category: 'education',
      description: 'MBA from Wharton School of Business'
    },
    {
      year: 1993,
      label: 'Returned NYC',
      category: 'location',
      description: 'Moved back to New York'
    },
    {
      year: 1994,
      label: 'First Marriage',
      category: 'marriage',
      description: 'Married Jennifer'
    },
    {
      year: 1995,
      label: 'Investment Banking',
      category: 'work',
      description: 'Started at Goldman Sachs'
    },
    {
      year: 1992,
      label: 'Daughter Born',
      category: 'children',
      description: 'First child, Sarah'
    },
    {
      year: 2003,
      label: 'Son Born',
      category: 'children',
      description: 'Second child, Michael'
    },
    {
      year: 2005,
      label: 'Chicago',
      category: 'location',
      description: 'Regional office operations'
    },
    {
      year: 2005,
      label: 'Son Born',
      category: 'children',
      description: 'Third child, James'
    },
    {
      year: 2010,
      label: 'Dallas',
      category: 'location',
      description: 'Expanded business operations'
    },
    {
      year: 2010,
      label: 'Founded Firm',
      category: 'work',
      description: 'Started Schmidt Capital Partners'
    },
    {
      year: 2015,
      label: 'San Francisco',
      category: 'location',
      description: 'Tech investment ventures'
    },
    {
      year: 2015,
      label: 'Divorce',
      category: 'relationship',
      description: 'Divorced from Jennifer'
    },
    {
      year: 2017,
      label: 'Second Marriage',
      category: 'marriage',
      description: 'Married Christine'
    },
    {
      year: 2018,
      label: 'Miami',
      category: 'location',
      description: 'Vacation home and offshore investments'
    },
    {
      year: 2020,
      label: 'Expanded Business',
      category: 'work',
      description: 'Multiple ventures launched'
    }
  ]
}

export const getRobertDashboardCards = (): DashboardCard[] => {
  return [
    {
      id: 'card-1',
      type: 'risk-assessment',
      title: 'Cyber Profile Risk Assessment',
      subtitle: 'Multi-domain risk analysis',
      riskItems: [
        {
          domain: 'Reputation',
          risk: 'High',
          exposure: 'SEC investigations + indicted contacts found online'
        },
        {
          domain: 'Interpersonal Risk',
          risk: 'High',
          exposure: 'Extramarital rumors + leadership criticism online'
        },
        {
          domain: 'Cyber Security',
          risk: 'Medium',
          exposure: 'Family data exposed in 5+ breach datasets'
        },
        {
          domain: 'Corporate Integrity',
          risk: 'Medium',
          exposure: 'Associate on SEC watchlist flagged this week'
        },
        {
          domain: 'Family Risk',
          risk: 'Medium',
          exposure: 'Ex-wife posted negative comments recently'
        },
        {
          domain: 'Physical Risk',
          risk: 'Low',
          exposure: 'Movement patterns documented, no direct threats'
        }
      ],
      details: `
        <div class="space-y-4">
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">Financial Risk: Low Risk</h4>
            <p>You have a high net worth and are rarely questioned as to your financial bona fides. Furthermore, you invest your liquidity in areas that are meaningful or have a high potential for substantial gains. You take risks, but these are generally judicious.</p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">Physical Security Risk</h4>
            <p>While your physical security risk is minimal, I have mapped your pattern of life and found multiple points of tracking data almost continually mapping your movements. Historical patterns of movement are typically predictable and may alert nefarious actors to your current and future locations.</p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">Interpersonal Risk: High Risk</h4>
            <p>You have a highly controversial and disputed divorce that was cited several times in online sources. Additionally, you are remarried, but many of these same sources have noted that you are involved in extramarital affairs. Expectations for family members often match those of employees and may have created much of a similar cycle of turnover and burnout. At times others may perceive you as entitled to relationships that meet your needs over serving others.</p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">Family Risk: Medium Risk</h4>
            <p>The increase in your family complexity with the divorce and the perception of extra marital relationships can impact the cohesion of your family structure and well being. Additionally, having high wealth may make you a target for familial exploitation. It will be important to monitor family contacts for relationship.</p>
          </div>
        </div>
      `
    },
    {
      id: 'card-2',
      type: 'risk-assessment',
      title: 'Data Breach & Credential Exposure',
      subtitle: 'Cyber security vulnerabilities identified',
      riskLevel: 'Medium Risk',
      content: `
        <div class="space-y-3">
          <p><strong>Critical Exposures Found:</strong></p>
          <ul class="list-disc pl-5 space-y-1">
            <li>Two personal logins reused across travel/event platforms</li>
            <li>Metadata exposing your children's educational affiliations</li>
            <li>Legal documents from prior divorce with partial financials</li>
          </ul>
        </div>
      `,
      actions: [
        'Reset credentials',
        'Deploy monitoring',
        'Check family exposure',
        'Use encrypted platforms'
      ]
    },
    {
      id: 'card-3',
      type: 'risk-assessment',
      title: 'Reputational Risk Analysis',
      subtitle: 'Public visibility and narrative assessment',
      riskLevel: 'High Risk',
      content: `
        <div class="space-y-4">
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">1. Divorce and Remarriage</h4>
            <ul class="list-disc pl-5 space-y-1 text-sm">
              <li>Your contentious divorce is cited across seven digital publications, three Reddit threads, and a long-form blog post.</li>
              <li>A persistent "double life" narrative is being reinforced by AI summarization bots scraping metadata.</li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">2. Current Marriage, Affairs Allegation, and Spouse Reputation</h4>
            <ul class="list-disc pl-5 space-y-1 text-sm">
              <li>Your spouse's philanthropic presence links her name with yours across major databases—her credibility becomes a proxy for your own.</li>
              <li>Alleged extramarital affairs appear in social commentary, AI-generated dossiers, and social listening feeds.</li>
              <li>She also provides funds to a non-profit that may have links with nefarious personalities.</li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">3. SEC & Network Affiliations</h4>
            <ul class="list-disc pl-5 space-y-1 text-sm">
              <li>Legacy SEC investigations remain indexed and interlinked via knowledge graphs.</li>
              <li>A college roommate's pyramid scheme case is currently rising in visibility, with your name attached by association.</li>
              <li>A new associate was indicted last week—this is surfacing through online network analysis.</li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">4. Leadership Turnover & Culture</h4>
            <p class="text-sm">Glassdoor and insider commentary describe your leadership as "charismatic but draining," with high turnover and intense expectations.</p>
          </div>
        </div>
      `,
      actions: [
        'Clean up online content',
        'Shift media narrative',
        'Monitor key journalists',
        'Plan legacy restoration'
      ]
    },
    {
      id: 'card-4',
      type: 'action-plan',
      title: 'Reputation Restoration Plan',
      subtitle: 'Execution in progress',
      riskLevel: 'High Risk',
      content: `
        <div class="space-y-3">
          <p class="font-semibold text-gray-900">Your SOVRA account will automatically link and provide updates on progress.</p>
          <p class="text-sm">Executing comprehensive reputation management strategy including:</p>
          <ul class="list-disc pl-5 space-y-1 text-sm">
            <li>Content removal and obfuscation services</li>
            <li>Journalist and media monitoring</li>
            <li>Narrative reshaping through strategic press</li>
            <li>Legacy and stability focused messaging</li>
          </ul>
        </div>
      `,
      actions: [
        'Engage reputation partners',
        'Deploy monitoring tools',
        'Build media relationships',
        'Track progress & adjust'
      ]
    }
  ]
}
