import { BarChart3, FileText, Target, Users, Database, LineChart } from 'lucide-react';

export const services = [
  {
    id: 1,
    title: "ESG Strategy & Advisory",
    description: "Develop comprehensive ESG strategies aligned with your business goals and stakeholder expectations.",
    icon: Target,
    href: "/esg-services",
  },
  {
    id: 2,
    title: "Sustainability Reporting",
    description: "Expert guidance on sustainability reporting frameworks, compliance requirements, and best practices.",
    icon: FileText,
    href: "/sustainable-reporting",
  },
  {
    id: 3,
    title: "Data & Analytics",
    description: "Transform your ESG data into actionable insights with our data collection, analytics, and visualization solutions.",
    icon: Database,
    href: "/data-kpis",
  },
  {
    id: 4,
    title: "KPI Development",
    description: "Establish meaningful ESG metrics and KPIs that drive performance and demonstrate impact.",
    icon: BarChart3,
    href: "/data-kpis",
  },
  {
    id: 5,
    title: "Stakeholder Engagement",
    description: "Build trust through transparent communication and stakeholder-focused ESG initiatives.",
    icon: Users,
    href: "/esg-services",
  },
  {
    id: 6,
    title: "Performance Tracking",
    description: "Monitor and track your ESG performance against targets with our comprehensive tracking solutions.",
    icon: LineChart,
    href: "/data-kpis",
  },
];

export const coreServices = [
  {
    id: 1,
    title: "Reporting & Disclosure",
    image: "/assets/images/library.jpg",
    description: "We help organizations prepare comprehensive ESG reports that meet regulatory requirements and stakeholder expectations. Our team ensures accurate data collection, materiality assessment, and clear communication of sustainability performance.",
    features: [
      "Framework alignment (GRI, SASB, TCFD, ISSB)",
      "Materiality assessment",
      "Data quality assurance",
      "Report preparation and review",
    ],
  },
  {
    id: 2,
    title: "Data Management & Analytics",
    image: "/assets/images/generic_dashboard.png",
    description: "Transform scattered ESG data into centralized, actionable insights. We implement robust data governance practices and build custom dashboards that make complex information accessible and meaningful.",
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
    description: "Integrate sustainability into your core business strategy. We help identify opportunities, mitigate risks, and develop roadmaps that align ESG goals with long-term business success.",
    features: [
      "ESG strategy development",
      "Risk assessment",
      "Opportunity identification",
      "Implementation roadmaps",
    ],
  },
];

export default services;
