import { BarChart3, FileText, Target, Users, Database, LineChart } from 'lucide-react';

export const services = [
  {
    id: 1,
    title: "Strategy & Advisory",
    description: "Develop comprehensive strategies aligned with your business goals and stakeholder expectations.",
    icon: Target,
    href: "/esg-services",
  },
  {
    id: 2,
    title: "Annual Reporting",
    description: "Expert guidance on integrated and sustainability reporting frameworks, compliance requirements, and best practices.",
    icon: FileText,
    href: "/sustainable-reporting",
  },
  {
    id: 3,
    title: "Data & Analytics",
    description: "Transform your data into actionable insights with our data collection, analytics, and visualization solutions.",
    icon: Database,
    href: "/data-kpis",
  },
  {
    id: 4,
    title: "KPI Development",
    description: "Establish meaningful metrics and KPIs that drive holistic performance and demonstrate impact.",
    icon: BarChart3,
    href: "/data-kpis",
  },
  {
    id: 5,
    title: "Stakeholder Engagement",
    description: "Build trust through transparent communication and stakeholder-focused initiatives.",
    icon: Users,
    href: "/esg-services",
  },
  {
    id: 6,
    title: "Performance Tracking",
    description: "Monitor and track your performance against targets with our comprehensive tracking solutions.",
    icon: LineChart,
    href: "/data-kpis",
  },
];

export const coreServices = [
  {
    id: 1,
    title: "Reporting & Disclosure",
    image: "/assets/images/library.jpg",
    description: "We help organizations prepare comprehensive integrated reports that meet regulatory requirements and stakeholder expectations. Our team ensures accurate data collection, materiality assessments, and clear communication of financial and sustainability performance.",
    features: [
      "Framework alignment (ISSB - IFRS S1 & S2, GRI, SASB, TCFD)",
      "Materiality assessment",
      "Data quality assurance",
      "Report preparation and review",
    ],
  },
  {
    id: 2,
    title: "Data Management & Analytics",
    image: "/assets/images/generic_dashboard.png",
    description: "Transform scattered data into centralized, actionable insights. We implement robust data governance practices and build custom dashboards that make complex information accessible and meaningful.",
    features: [
      "Data centralization",
      "Custom dashboard development",
      "Target setting and tracking",
      "Scenario modeling",
    ],
  },
  {
    id: 3,
    title: "Strategic Advisory",
    image: "/assets/images/forest_path.jpg",
    description: "Integrate sustainability into your core business strategy. We help identify opportunities, mitigate risks, and develop roadmaps that align financial and sustainability goals with long-term business success.",
    features: [
      "Integrated strategy development",
      "Risk assessment",
      "Opportunity identification",
      "Implementation roadmaps",
    ],
  },
];

export default services;
