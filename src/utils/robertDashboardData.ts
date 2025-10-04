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
  category:
    | 'education'
    | 'work'
    | 'relationship'
    | 'marriage'
    | 'children'
    | 'location'
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
  return []
}

export interface PersonalityTrait {
  label: string
  description: string
  iconName: string
  colorClass: string
}

export interface TrackingSource {
  name: string
  description: string
  count: number
  status: string
  iconName: string
  colorClass: string
  statusClass: string
}

export const getRobertTrackingSources = () => {
  return [
    {
      name: 'Google News',
      description: 'News articles and press mentions',
      count: 847,
      status: 'High Exposure',
      iconName: 'NewspaperIcon',
      colorClass: 'bg-red-500',
      statusClass: 'bg-red-100 text-red-700'
    },
    {
      name: 'LinkedIn',
      description: 'Professional profile and connections',
      count: 2400,
      status: 'Active',
      iconName: 'BriefcaseIcon',
      colorClass: 'bg-blue-600',
      statusClass: 'bg-blue-100 text-blue-700'
    },
    {
      name: 'Twitter/X',
      description: 'Social media posts and mentions',
      count: 1256,
      status: 'Monitored',
      iconName: 'AtSymbolIcon',
      colorClass: 'bg-sky-500',
      statusClass: 'bg-sky-100 text-sky-700'
    },
    {
      name: 'Facebook',
      description: 'Social connections and public posts',
      count: 432,
      status: 'Limited',
      iconName: 'UsersIcon',
      colorClass: 'bg-blue-700',
      statusClass: 'bg-gray-100 text-gray-700'
    },
    {
      name: 'Reddit',
      description: 'Forum discussions and threads',
      count: 89,
      status: 'Flagged',
      iconName: 'ChatBubbleLeftRightIcon',
      colorClass: 'bg-orange-600',
      statusClass: 'bg-orange-100 text-orange-700'
    },
    {
      name: 'Public Records',
      description: 'Court filings, business registrations',
      count: 234,
      status: 'Public',
      iconName: 'DocumentTextIcon',
      colorClass: 'bg-purple-600',
      statusClass: 'bg-purple-100 text-purple-700'
    },
    {
      name: 'Data Breaches',
      description: 'Exposed credentials and personal data',
      count: 12,
      status: 'Critical',
      iconName: 'ShieldExclamationIcon',
      colorClass: 'bg-red-700',
      statusClass: 'bg-red-100 text-red-800'
    },
    {
      name: 'Glassdoor',
      description: 'Company reviews and employee feedback',
      count: 156,
      status: 'Mixed',
      iconName: 'BuildingOfficeIcon',
      colorClass: 'bg-green-600',
      statusClass: 'bg-yellow-100 text-yellow-700'
    }
  ]
}

export const getRobertSummaryRecommendations = () => {
  return {
    summary:
      'Robert Schmidt presents a high-risk profile across multiple domains, with critical vulnerabilities in reputation management and interpersonal relationships. While demonstrating strong business acumen and professional success ($250M+ net worth, extensive network), significant exposure through online sources (5,600+ data points), contentious personal history, and questionable professional associations create substantial risk. The combination of high ambition, limited empathy, and pattern of ethical flexibility requires immediate intervention to prevent reputational collapse and protect personal and professional interests.',
    keyFindings: [
      {
        category: 'Reputation',
        text: '847+ negative news mentions across 7+ publications',
        iconName: 'ExclamationTriangleIcon',
        colorClass: 'bg-red-50 text-red-700'
      },
      {
        category: 'Personal',
        text: 'Divorce narrative + extramarital affair allegations widespread',
        iconName: 'HeartIcon',
        colorClass: 'bg-red-50 text-red-700'
      },
      {
        category: 'Security',
        text: '12 data breaches exposing family credentials',
        iconName: 'ShieldExclamationIcon',
        colorClass: 'bg-orange-50 text-orange-700'
      },
      {
        category: 'Network',
        text: 'SEC-investigated associates actively surfacing online',
        iconName: 'UsersIcon',
        colorClass: 'bg-orange-50 text-orange-700'
      },
      {
        category: 'Digital',
        text: '5,600+ tracking data points across 8 major platforms',
        iconName: 'GlobeAltIcon',
        colorClass: 'bg-yellow-50 text-yellow-700'
      },
      {
        category: 'Leadership',
        text: 'High turnover, "draining" culture per Glassdoor (156 reviews)',
        iconName: 'BuildingOfficeIcon',
        colorClass: 'bg-yellow-50 text-yellow-700'
      }
    ],
    recommendations: [
      {
        priority: 'CRITICAL',
        title: 'Immediate Reputation Intervention',
        description:
          'Deploy comprehensive reputation management to address divorce narrative, affair allegations, and SEC association stories before they become permanent search results.',
        actions: [
          'Content removal services',
          'SEO suppression',
          'Counter-narrative PR',
          'Legal cease & desist where applicable'
        ],
        iconName: 'FireIcon',
        priorityClass: 'bg-red-600 text-white',
        borderClass: 'border-red-500',
        bgClass: 'bg-red-50',
        iconBgClass: 'bg-red-600'
      },
      {
        priority: 'HIGH',
        title: 'Cybersecurity & Data Breach Response',
        description:
          'Reset all compromised credentials, deploy dark web monitoring, and secure family members exposed in data breaches.',
        actions: [
          'Password reset + 2FA',
          'Dark web monitoring',
          'Credit freeze',
          'VPN & encrypted comms'
        ],
        iconName: 'LockClosedIcon',
        priorityClass: 'bg-orange-600 text-white',
        borderClass: 'border-orange-500',
        bgClass: 'bg-orange-50',
        iconBgClass: 'bg-orange-600'
      },
      {
        priority: 'HIGH',
        title: 'Interpersonal & Leadership Coaching',
        description:
          'Address empathy limitations and leadership style creating turnover and cultural issues. Executive coaching focused on sustainable leadership.',
        actions: [
          'Executive coaching',
          'Empathy development',
          'Culture assessment',
          '360 feedback'
        ],
        iconName: 'AcademicCapIcon',
        priorityClass: 'bg-orange-600 text-white',
        borderClass: 'border-orange-500',
        bgClass: 'bg-orange-50',
        iconBgClass: 'bg-orange-600'
      },
      {
        priority: 'MEDIUM',
        title: 'Network Vetting & Distance Protocol',
        description:
          'Audit professional relationships, create distance from SEC-flagged associates, and implement vetting process for new connections.',
        actions: [
          'Relationship audit',
          'Public distancing',
          'Vetting protocols',
          'Board review'
        ],
        iconName: 'UserGroupIcon',
        priorityClass: 'bg-yellow-600 text-white',
        borderClass: 'border-yellow-500',
        bgClass: 'bg-yellow-50',
        iconBgClass: 'bg-yellow-600'
      },
      {
        priority: 'MEDIUM',
        title: 'Family Communication & Relationship Repair',
        description:
          'Address family tensions, ex-wife negative commentary, and improve relationships with children to reduce personal risk.',
        actions: [
          'Family therapy',
          'Mediation with ex-spouse',
          'Communication rebuild',
          'Boundary setting'
        ],
        iconName: 'HomeIcon',
        priorityClass: 'bg-yellow-600 text-white',
        borderClass: 'border-yellow-500',
        bgClass: 'bg-yellow-50',
        iconBgClass: 'bg-yellow-600'
      }
    ],
    nextSteps: [
      'Activate SOVRA Continuous Monitoring for real-time threat detection and alerts',
      'Deploy SOVRA Reputation Management Suite to remove harmful content and reshape narrative',
      'Implement SOVRA Cybersecurity Plan with credential reset and breach monitoring',
      'Enable SOVRA Network Intelligence to vet associations and flag high-risk contacts',
      'Utilize SOVRA Family Protection Services for wealth security and online monitoring',
      'Schedule regular reviews with SOVRA dashboard for ongoing risk assessment and updates'
    ]
  }
}

export const getRobertPersonalityProfile = () => {
  return {
    summary:
      'Your executive presents a complex leadership profile characterized by high ambition and charismatic influence coupled with significant interpersonal and ethical risks. While demonstrating strong resilience, technical competence, and visionary capabilities that have driven career success, your pattern of rule-bending behavior, multiple relationship failures, and associations with questionable figures create substantial vulnerabilities across personal and professional domains.',
    traits: [
      {
        label: 'High Ambition & Drive',
        description:
          'Exceptionally high ambition marked by strong competitive drive and relentless orientation toward achievement. Values a sense of urgency in yourself and others.',
        iconName: 'BoltIcon',
        colorClass: 'bg-yellow-500'
      },
      {
        label: 'Charismatic Influence',
        description:
          'Softens a dominant presentation with intuitive understanding of others and sociability. High effectiveness in roles requiring visibility, networking, and influence. Comfortable engaging publicly and building connections.',
        iconName: 'UserGroupIcon',
        colorClass: 'bg-blue-500'
      },
      {
        label: 'Resilience Under Pressure',
        description:
          'Strong resilience under stress and adversity. Tends to power through adversity and naysayers, though this may at times outpace others and create conflicts.',
        iconName: 'ShieldCheckIcon',
        colorClass: 'bg-green-500'
      },
      {
        label: 'Visionary Thinking',
        description:
          'Strong inquisitive nature supports visionary thinking, openness to novel ideas, and adaptability in uncertain environments.',
        iconName: 'LightBulbIcon',
        colorClass: 'bg-purple-500'
      },
      {
        label: 'Business Trustworthiness',
        description:
          'Trustworthy in business relationships. Follows through with commitments and maintains professional integrity.',
        iconName: 'HandThumbUpIcon',
        colorClass: 'bg-teal-500'
      },
      {
        label: 'Empathy Limitations',
        description:
          'Empathy for others is not quite as strong. At times, efforts towards connecting with others may feel forced - to you and them. May decrease leadership impact.',
        iconName: 'ExclamationTriangleIcon',
        colorClass: 'bg-orange-500'
      }
    ]
  }
}
