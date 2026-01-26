export interface Mockup {
  id: string;
  type: 'mobile' | 'desktop' | 'frame';
  src: string;
  alt: string;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  mockups: Mockup[];
}

export interface Project {
  id: string;
  name: string;
  icon?: string;
  sections: Section[];
}

export interface PresentationMeta {
  title: string;
  downloadUrl: string;
}

export interface PresentationData {
  meta: PresentationMeta;
  projects: Project[];
}
