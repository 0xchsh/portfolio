'use client';

import { useState, useCallback } from 'react';
import type { PresentationData } from '@/types/presentation';

type NavigationDirection = 'left' | 'right' | null;

export function usePresentation(data: PresentationData) {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [direction, setDirection] = useState<NavigationDirection>(null);

  const currentProject = data.projects[currentProjectIndex];
  const currentSection = currentProject?.sections[currentSectionIndex];

  const goToProject = useCallback(
    (index: number) => {
      if (index === currentProjectIndex) return;
      setDirection(index > currentProjectIndex ? 'right' : 'left');
      setCurrentProjectIndex(index);
      setCurrentSectionIndex(0);
    },
    [currentProjectIndex]
  );

  const nextProject = useCallback(() => {
    const nextIndex = (currentProjectIndex + 1) % data.projects.length;
    goToProject(nextIndex);
  }, [currentProjectIndex, data.projects.length, goToProject]);

  const prevProject = useCallback(() => {
    const prevIndex = (currentProjectIndex - 1 + data.projects.length) % data.projects.length;
    goToProject(prevIndex);
  }, [currentProjectIndex, data.projects.length, goToProject]);

  const goToSection = useCallback((index: number) => {
    setCurrentSectionIndex(index);
  }, []);

  const nextSection = useCallback(() => {
    if (currentProject && currentSectionIndex < currentProject.sections.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
    } else {
      const nextProjectIndex = (currentProjectIndex + 1) % data.projects.length;
      setDirection('right');
      setCurrentProjectIndex(nextProjectIndex);
      setCurrentSectionIndex(0);
    }
  }, [currentProject, currentSectionIndex, currentProjectIndex, data.projects.length]);

  const prevSection = useCallback(() => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
    } else {
      const prevProjectIndex =
        (currentProjectIndex - 1 + data.projects.length) % data.projects.length;
      const prevProjectSections = data.projects[prevProjectIndex].sections.length;
      setDirection('left');
      setCurrentProjectIndex(prevProjectIndex);
      setCurrentSectionIndex(prevProjectSections - 1);
    }
  }, [currentSectionIndex, currentProjectIndex, data.projects]);

  return {
    currentProjectIndex,
    currentSectionIndex,
    currentProject,
    currentSection,
    direction,
    goToProject,
    nextProject,
    prevProject,
    goToSection,
    nextSection,
    prevSection,
  };
}
