export interface Subject {
  slug: string
  name: string
  shortDescription: string
  description: string
  categories: string[]
  exampleTopics: string[]
}

export const subjects: Subject[] = [
  {
    slug: 'mathematics',
    name: 'Mathematics',
    shortDescription: 'From number sense to calculus — core mathematical thinking and problem solving.',
    description:
      'Mathematics covers fundamental topics in arithmetic, algebra, geometry and analysis. Our structured lessons emphasise understanding, worked examples, and problem solving across school and introductory university level.',
    categories: ['Number', 'Algebra', 'Geometry', 'Trigonometry', 'Functions', 'Calculus', 'Statistics', 'Probability'],
    exampleTopics: ['Solving linear equations', 'Derivatives basics', 'Trigonometric identities', 'Mean & standard deviation'],
  },
  {
    slug: 'additional-mathematics',
    name: 'Additional Mathematics',
    shortDescription: 'Advanced mathematical methods for students preparing for higher-level study.',
    description:
      'Additional Mathematics builds on core topics with more abstract algebra, advanced geometry and calculus topics. It’s ideal for learners preparing for competitive exams or university-level maths study.',
    categories: ['Advanced Algebra', 'Functions', 'Trigonometry', 'Coordinate Geometry', 'Calculus', 'Vectors', 'Advanced Statistics & Probability'],
    exampleTopics: ['Binomial theorem', 'Advanced integration techniques', 'Vector geometry'],
  },
  {
    slug: 'physics',
    name: 'Physics',
    shortDescription: 'Understanding the physical world — mechanics, waves, electricity and more.',
    description:
      'Physics explains how the universe behaves: forces, energy, waves and fields. Lessons combine conceptual explanation with worked examples and mathematical problem solving.',
    categories: ['Mechanics', 'Waves', 'Electricity', 'Magnetism', 'Thermal Physics', 'Modern Physics', 'Fields'],
    exampleTopics: ['Newton’s laws', 'Wave superposition', 'Ohm’s law', 'Photoelectric effect'],
  },
  {
    slug: 'chemistry',
    name: 'Chemistry',
    shortDescription: 'From atoms to reactions — the central science of matter and change.',
    description:
      'Chemistry explores atomic structure, bonding, reactions and energetics. Content balances factual knowledge with problem-solving and laboratory interpretation skills.',
    categories: ['Atomic Structure', 'Periodic Trends', 'Bonding', 'Stoichiometry', 'Energetics', 'Equilibrium', 'Acids & Bases', 'Organic Chemistry'],
    exampleTopics: ['Balancing chemical equations', 'Molecular bonding models', 'Le Chatelier’s principle'],
  },
  {
    slug: 'design-technology',
    name: 'Design & Technology',
    shortDescription: 'Practical design, materials, and systems thinking for real-world projects.',
    description:
      'Design & Technology introduces the design process, materials, manufacturing and electronics. Students learn to plan, prototype and evaluate designs with technical drawing and problem solving.',
    categories: ['Design Process', 'Materials', 'Structures', 'Mechanisms', 'Manufacturing', 'Technical Drawing', 'Electronics', 'Product Development'],
    exampleTopics: ['Sketching technical drawings', 'Basic circuits', 'Material selection'],
  },
]

export default subjects
