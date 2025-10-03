/**
 * Preston Cole Whitaker III Dashboard Data
 * High-risk familial use case - gambling, narcissistic behavior, hidden lifestyle
 */

import type { TimelineEvent, USLocation } from './robertDashboardData'

export const getPrestonProfile = () => {
  return {
    name: 'Preston Cole Whitaker III',
    age: 22,
    location: 'Austin, TX',
    status: 'Dating Sarah Schmidt',
    occupation: 'Student & Social Club Leader',
    education: 'University of Texas at Austin',
    financialInfo: {
      trust: '$2.5M Family Trust',
      spending: '$8,000/month',
      debts: 'Undisclosed gambling debts'
    },
    social: {
      instagram: '@prestonwhitaker',
      followers: '3,200+ followers',
      activity: 'Highly active, narcissistic posts'
    },
    family: {
      father: 'Preston Cole Whitaker Jr. (Oil & Gas Executive)',
      mother: 'Victoria Whitaker (Philanthropist)',
      uncle: 'Judge Harrison Whitaker (Texas Supreme Court)',
      connections: 'VP Office political ties'
    }
  }
}

export const getPrestonLifeEvents = (): TimelineEvent[] => {
  return [
    {
      year: 2002,
      label: 'Born Dallas',
      category: 'personal',
      description: 'Born into prominent Whitaker family in Dallas, TX'
    },
    {
      year: 2016,
      label: 'First Gambling',
      category: 'personal',
      description: 'First documented sports betting activity at age 14'
    },
    {
      year: 2020,
      label: 'UT Austin',
      category: 'education',
      description: 'Enrolled at University of Texas at Austin'
    },
    {
      year: 2021,
      label: 'Social Club Leader',
      category: 'work',
      description: 'Elected to leadership role in university social club'
    },
    {
      year: 2022,
      label: 'Vegas Pattern',
      category: 'location',
      description: 'Began regular undisclosed trips to Las Vegas'
    },
    {
      year: 2023,
      label: 'Met Sarah',
      category: 'relationship',
      description: 'Started dating Sarah Schmidt through mutual friends'
    },
    {
      year: 2023,
      label: 'Gambling Escalation',
      category: 'personal',
      description: 'Sports betting increased to $2-5k per week'
    },
    {
      year: 2024,
      label: 'Finals Vegas Trip',
      category: 'location',
      description:
        'Traveled to Vegas during UT finals week, undisclosed to Sarah'
    },
    {
      year: 2024,
      label: 'Viral Outburst',
      category: 'personal',
      description:
        'Public Instagram attack on UT football players after losing bet'
    },
    {
      year: 2024,
      label: 'Family Investigation',
      category: 'personal',
      description:
        "Robert Schmidt initiates SOVRA investigation on daughter's boyfriend"
    }
  ]
}

export const getPrestonLocations = (): USLocation[] => {
  return [
    {
      city: 'Dallas',
      state: 'TX',
      lat: 32.7767,
      lon: -96.797,
      years: '2002-2020',
      description: 'Birthplace and family home'
    },
    {
      city: 'Austin',
      state: 'TX',
      lat: 30.2672,
      lon: -97.7431,
      years: '2020-Present',
      description: 'University of Texas student'
    },
    {
      city: 'Las Vegas',
      state: 'NV',
      lat: 36.1699,
      lon: -115.1398,
      years: '2022-2024',
      description: 'Frequent undisclosed gambling trips (12+ visits)'
    },
    {
      city: 'Houston',
      state: 'TX',
      lat: 29.7604,
      lon: -95.3698,
      years: '2023',
      description: 'Visit to Schmidt family estate'
    },
    {
      city: 'South Padre Island',
      state: 'TX',
      lat: 26.1118,
      lon: -97.1681,
      years: '2024',
      description: 'Spring break with social club'
    }
  ]
}

export const getPrestonPersonalityProfile = () => {
  return {
    summary:
      'Preston Cole Whitaker III presents a carefully curated exterior: charming, ambitious, and socially skilled with strong family connections. However, beneath this polished surface lies a pattern of narcissistic behavior, impulsivity, and deception. His Dark Triad personality traits—narcissism, Machiavellianism, and impulsivity—create substantial risk vectors for manipulation, financial recklessness, and reputational damage to anyone associated with him.',
    traits: [
      {
        label: 'Narcissistic Tendencies',
        description:
          'Self-promotional social media presence with posts like "Surround yourself with winners, not whiners." Constant need for external validation and admiration.',
        icon: 'SparklesIcon',
        colorClass: 'bg-red-100'
      },
      {
        label: 'Financial Impulsivity',
        description:
          'Chronic sports gambling with Venmo transactions labeled "lock," "parlay," "UT spread." Escalating bets from hundreds to thousands per week.',
        icon: 'CurrencyDollarIcon',
        colorClass: 'bg-red-100'
      },
      {
        label: 'Volatility Under Stress',
        description:
          'Public outbursts when bets fail. Posted "Y\'all cost me rent money" targeting UT football players. Anger management issues.',
        icon: 'FireIcon',
        colorClass: 'bg-red-100'
      },
      {
        label: 'Deceptive Behavior',
        description:
          'Conceals Vegas trips from girlfriend. Double life between polished family image and hidden gambling lifestyle.',
        icon: 'EyeSlashIcon',
        colorClass: 'bg-orange-100'
      },
      {
        label: 'Social Manipulation',
        description:
          'Uses family connections and charm to gain trust. Adapts persona based on audience—family, girlfriend, or gambling friends.',
        icon: 'UserGroupIcon',
        colorClass: 'bg-orange-100'
      },
      {
        label: 'Entitlement',
        description:
          'Leverages family name and political connections. Expects special treatment. Trust fund mentality with $2.5M family backing.',
        icon: 'ShieldExclamationIcon',
        colorClass: 'bg-orange-100'
      }
    ]
  }
}

export const getPrestonTrackingSources = () => {
  return [
    {
      name: 'Instagram',
      description: 'Narcissistic posts, gambling references, Vegas photos',
      count: 1847,
      status: 'Critical Exposure',
      iconName: 'CameraIcon',
      colorClass: 'bg-red-500',
      statusClass: 'bg-red-100 text-red-800'
    },
    {
      name: 'Venmo Transactions',
      description: 'Sports betting payments, gambling terminology',
      count: 342,
      status: 'High Risk',
      iconName: 'CurrencyDollarIcon',
      colorClass: 'bg-red-600',
      statusClass: 'bg-red-100 text-red-800'
    },
    {
      name: 'Location Data',
      description: 'Austin-Vegas travel patterns, hidden trips',
      count: 156,
      status: 'Deception Indicator',
      iconName: 'MapPinIcon',
      colorClass: 'bg-orange-500',
      statusClass: 'bg-orange-100 text-orange-800'
    },
    {
      name: 'UT Austin Records',
      description: 'Academic standing, disciplinary issues',
      count: 23,
      status: 'Monitored',
      iconName: 'AcademicCapIcon',
      colorClass: 'bg-blue-600',
      statusClass: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Family Network',
      description: 'Whitaker family connections, political ties',
      count: 89,
      status: 'Reputational Leverage',
      iconName: 'UsersIcon',
      colorClass: 'bg-purple-600',
      statusClass: 'bg-purple-100 text-purple-800'
    },
    {
      name: 'Sports Betting Sites',
      description: 'Online gambling activity, debt patterns',
      count: 267,
      status: 'Critical',
      iconName: 'ChartBarIcon',
      colorClass: 'bg-red-700',
      statusClass: 'bg-red-100 text-red-800'
    },
    {
      name: 'Social Media Comments',
      description: 'Volatile posts, attacking athletes',
      count: 534,
      status: 'Behavioral Red Flags',
      iconName: 'ChatBubbleLeftRightIcon',
      colorClass: 'bg-red-500',
      statusClass: 'bg-red-100 text-red-800'
    },
    {
      name: 'Financial Records',
      description: 'Trust fund access, spending patterns',
      count: 78,
      status: 'Elevated Risk',
      iconName: 'BanknotesIcon',
      colorClass: 'bg-orange-600',
      statusClass: 'bg-orange-100 text-orange-800'
    }
  ]
}

// Preston's network - showing gambling connections and family ties
export const getPrestonNetwork = () => {
  const nodes = [
    {
      id: 'preston',
      name: 'Preston Whitaker',
      type: 'primary' as const,
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'sarah',
      name: 'Sarah Schmidt',
      type: 'family' as const,
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'judge',
      name: 'Judge Harrison Whitaker',
      type: 'family' as const,
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'bookie',
      name: 'Marcus "Lucky" Chen',
      type: 'associate' as const,
      image:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'gambler1',
      name: 'Tyler Dawson',
      type: 'associate' as const,
      image:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'gambler2',
      name: 'Jake Morrison',
      type: 'associate' as const,
      image:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'clubmate',
      name: 'Brandon Lee',
      type: 'associate' as const,
      image:
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'father',
      name: 'Preston Whitaker Jr.',
      type: 'family' as const,
      image:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'dealer',
      name: 'Anthony Russo',
      type: 'associate' as const,
      image:
        'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=faces'
    }
  ]

  const links = [
    { source: 'preston', target: 'sarah', relationship: 'dating' },
    { source: 'preston', target: 'judge', relationship: 'family-uncle' },
    { source: 'preston', target: 'father', relationship: 'family-father' },
    { source: 'preston', target: 'bookie', relationship: 'gambling-debt' },
    { source: 'preston', target: 'gambler1', relationship: 'gambling-partner' },
    { source: 'preston', target: 'gambler2', relationship: 'gambling-partner' },
    { source: 'preston', target: 'clubmate', relationship: 'social-club' },
    { source: 'preston', target: 'dealer', relationship: 'vegas-contact' },
    { source: 'bookie', target: 'gambler1', relationship: 'client' },
    { source: 'bookie', target: 'gambler2', relationship: 'client' },
    { source: 'dealer', target: 'bookie', relationship: 'business' }
  ]

  return { nodes, links }
}

// Gambling transaction timeline data for visualization
export const getPrestonGamblingTransactions = () => {
  return [
    {
      date: '2024-01-15',
      amount: -450,
      description: 'UT vs Alabama spread',
      category: 'loss'
    },
    {
      date: '2024-01-20',
      amount: 300,
      description: 'NFL parlay',
      category: 'win'
    },
    {
      date: '2024-02-03',
      amount: -1200,
      description: 'Super Bowl bets',
      category: 'loss'
    },
    {
      date: '2024-02-14',
      amount: -800,
      description: 'NBA spread',
      category: 'loss'
    },
    {
      date: '2024-03-01',
      amount: 500,
      description: 'March Madness',
      category: 'win'
    },
    {
      date: '2024-03-10',
      amount: -2500,
      description: 'March Madness finals',
      category: 'loss'
    },
    {
      date: '2024-03-22',
      amount: -1800,
      description: 'Spring break Vegas',
      category: 'loss'
    },
    {
      date: '2024-04-05',
      amount: 200,
      description: 'MLB opening',
      category: 'win'
    },
    {
      date: '2024-04-18',
      amount: -950,
      description: 'UT spring game',
      category: 'loss'
    },
    {
      date: '2024-05-01',
      amount: -3200,
      description: 'Finals week Vegas trip',
      category: 'loss'
    },
    {
      date: '2024-05-15',
      amount: -1500,
      description: 'NBA playoffs',
      category: 'loss'
    },
    {
      date: '2024-06-01',
      amount: 800,
      description: 'MLB parlay',
      category: 'win'
    },
    {
      date: '2024-06-20',
      amount: -2100,
      description: 'Summer Vegas trip',
      category: 'loss'
    },
    {
      date: '2024-07-04',
      amount: -900,
      description: '4th of July bets',
      category: 'loss'
    },
    {
      date: '2024-07-15',
      amount: -1600,
      description: 'UFC event',
      category: 'loss'
    },
    {
      date: '2024-08-01',
      amount: -2800,
      description: 'NFL preseason',
      category: 'loss'
    },
    {
      date: '2024-09-07',
      amount: -3500,
      description: 'UT season opener (viral outburst)',
      category: 'loss'
    },
    {
      date: '2024-09-14',
      amount: -1200,
      description: 'NFL Week 2',
      category: 'loss'
    },
    {
      date: '2024-09-28',
      amount: 1500,
      description: 'College football parlay',
      category: 'win'
    },
    {
      date: '2024-10-01',
      amount: -4200,
      description: 'October Vegas trip',
      category: 'loss'
    }
  ]
}

// Social media sentiment analysis data
export const getPrestonSocialMediaSentiment = () => {
  return [
    { month: 'Jan 2024', narcissistic: 45, volatile: 20, positive: 35 },
    { month: 'Feb 2024', narcissistic: 52, volatile: 28, positive: 20 },
    { month: 'Mar 2024', narcissistic: 60, volatile: 35, positive: 15 },
    { month: 'Apr 2024', narcissistic: 55, volatile: 30, positive: 25 },
    { month: 'May 2024', narcissistic: 65, volatile: 45, positive: 10 },
    { month: 'Jun 2024', narcissistic: 58, volatile: 38, positive: 18 },
    { month: 'Jul 2024', narcissistic: 70, volatile: 50, positive: 8 },
    { month: 'Aug 2024', narcissistic: 68, volatile: 55, positive: 5 },
    { month: 'Sep 2024', narcissistic: 75, volatile: 72, positive: 3 },
    { month: 'Oct 2024', narcissistic: 80, volatile: 68, positive: 2 }
  ]
}

export const getPrestonSummaryRecommendations = () => {
  return {
    summary:
      'Preston Cole Whitaker III represents a severe familial risk vector with multiple critical exposure points. While presenting as a polished, well-connected young man from a respected Texas family, deeper analysis reveals a dangerous pattern of narcissistic behavior, gambling addiction, financial recklessness, and systematic deception. His relationship with Sarah Schmidt creates direct reputational and security risks for the Schmidt family, their business interests, and philanthropic networks. The combination of Dark Triad personality traits, escalating gambling debts, and political family connections makes Preston a high-priority threat requiring immediate intervention and protective measures.',
    keyFindings: [
      {
        category: 'Gambling Addiction',
        text: '342 sports betting transactions, $2-5k weekly, escalating debts with volatile public reactions',
        iconName: 'FireIcon',
        colorClass: 'bg-red-50 text-red-700'
      },
      {
        category: 'Deceptive Lifestyle',
        text: '12+ undisclosed Vegas trips during relationship, double life hidden from Sarah Schmidt',
        iconName: 'EyeSlashIcon',
        colorClass: 'bg-red-50 text-red-700'
      },
      {
        category: 'Dark Triad Traits',
        text: 'Narcissism, manipulation, impulsivity - 1,847 social media posts showing self-promotion',
        iconName: 'ExclamationTriangleIcon',
        colorClass: 'bg-red-50 text-red-700'
      },
      {
        category: 'Family Exposure',
        text: 'Schmidt family reputation at risk through association with gambling addict',
        iconName: 'HomeIcon',
        colorClass: 'bg-orange-50 text-orange-700'
      },
      {
        category: 'Political Leverage',
        text: 'Whitaker family ties to Texas judiciary and VP office amplify any scandal',
        iconName: 'BuildingLibraryIcon',
        colorClass: 'bg-orange-50 text-orange-700'
      },
      {
        category: 'Behavioral Volatility',
        text: '534 aggressive posts including public attacks on UT athletes after losing bets',
        iconName: 'BoltIcon',
        colorClass: 'bg-red-50 text-red-700'
      }
    ],
    recommendations: [
      {
        priority: 'CRITICAL',
        title: 'Immediate Relationship Intervention',
        description:
          'Present comprehensive SOVRA findings to Sarah Schmidt. The hidden gambling addiction, Vegas trips during finals, and narcissistic manipulation patterns require immediate disclosure to protect her wellbeing.',
        actions: [
          'Family meeting with Sarah',
          'Present evidence timeline',
          'Psychological assessment',
          'Support resources'
        ],
        iconName: 'ShieldExclamationIcon',
        priorityClass: 'bg-red-600 text-white',
        borderClass: 'border-red-500',
        bgClass: 'bg-red-50',
        iconBgClass: 'bg-red-600'
      },
      {
        priority: 'CRITICAL',
        title: 'Financial Exposure Protection',
        description:
          "Preston's gambling debts ($50k+ estimated) create coercion vulnerability. Implement family financial firewalls to prevent any Schmidt assets from becoming entangled.",
        actions: [
          'Legal counsel engagement',
          'Asset protection review',
          'Trust fund safeguards',
          'Credit monitoring'
        ],
        iconName: 'LockClosedIcon',
        priorityClass: 'bg-red-600 text-white',
        borderClass: 'border-red-500',
        bgClass: 'bg-red-50',
        iconBgClass: 'bg-red-600'
      },
      {
        priority: 'HIGH',
        title: 'Reputational Damage Control',
        description:
          "Prepare for potential public fallout if Preston's gambling and volatile behavior becomes public. His political family connections amplify any scandal.",
        actions: [
          'PR crisis plan',
          'Media monitoring',
          'Legal distancing',
          'Narrative control'
        ],
        iconName: 'NewspaperIcon',
        priorityClass: 'bg-orange-600 text-white',
        borderClass: 'border-orange-500',
        bgClass: 'bg-orange-50',
        iconBgClass: 'bg-orange-600'
      },
      {
        priority: 'HIGH',
        title: 'Security Threat Assessment',
        description:
          'Gambling debts create blackmail and coercion risks. Preston may attempt to leverage Schmidt family resources or connections to pay debts.',
        actions: [
          'Background check Whitaker family',
          'Debt exposure analysis',
          'Security protocols',
          'Threat modeling'
        ],
        iconName: 'ShieldCheckIcon',
        priorityClass: 'bg-orange-600 text-white',
        borderClass: 'border-orange-500',
        bgClass: 'bg-orange-50',
        iconBgClass: 'bg-orange-600'
      },
      {
        priority: 'MEDIUM',
        title: 'Legal Documentation & Evidence Preservation',
        description:
          'Preserve all SOVRA findings, social media evidence, and financial transaction records for potential future legal proceedings or protective orders.',
        actions: [
          'Evidence archival',
          'Legal documentation',
          'Restraining order prep',
          'Witness statements'
        ],
        iconName: 'DocumentTextIcon',
        priorityClass: 'bg-yellow-600 text-white',
        borderClass: 'border-yellow-500',
        bgClass: 'bg-yellow-50',
        iconBgClass: 'bg-yellow-600'
      }
    ],
    nextSteps: [
      'Activate SOVRA Continuous Monitoring on Preston Whitaker for real-time gambling and behavioral tracking',
      'Deploy SOVRA Family Protection Suite to safeguard Sarah Schmidt and prevent financial exploitation',
      'Implement SOVRA Relationship Risk Assessment for ongoing behavioral pattern analysis',
      'Enable SOVRA Reputation Shield to monitor and suppress any emerging scandal involving Whitaker family',
      'Utilize SOVRA Legal Intelligence for protective documentation and evidence preservation',
      'Schedule crisis intervention session with family therapist and SOVRA risk counselor'
    ]
  }
}
