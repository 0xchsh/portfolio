'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import type { PresentationData } from '@/types/presentation';

type NavigationDirection = 'left' | 'right' | null;

interface UsePresentationReturn {
  currentProjectIndex: number;
  currentSectionIndex: number;
  currentProject: PresentationData['projects'][number] | undefined;
  currentSection: PresentationData['projects'][number]['sections'][number] | undefined;
  setProject: (index: number) => void;
  setSection: (index: number) => void;
  nextSection: () => void;
  prevSection: () => void;
  nextProject: () => void;
  prevProject: () => void;
  totalProjects: number;
  totalSections: number;
  navigationDirection: NavigationDirection;
}

export function usePresentation(data: PresentationData): UsePresentationReturn {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [navigationDirection, setNavigationDirection] = useState<NavigationDirection>(null);

  // Store remembered section indices for each project
  const sectionMemory = useRef<Record<number, number>>({});

  const currentProject = useMemo(() =>
    data.projects[currentProjectIndex],
    [data.projects, currentProjectIndex]
  );

  const currentSection = useMemo(() =>
    currentProject?.sections[currentSectionIndex],
    [currentProject?.sections, currentSectionIndex]
  );

  const totalProjects = data.projects.length;
  const totalSections = currentProject?.sections.length ?? 0;

  // Helper to switch projects while remembering/restoring section
  const switchToProject = useCallback((newProjectIndex: number, direction?: NavigationDirection) => {
    // Save current section for current project
    sectionMemory.current[currentProjectIndex] = currentSectionIndex;

    // Get remembered section for target project (default to 0)
    const rememberedSection = sectionMemory.current[newProjectIndex] ?? 0;

    // Set direction based on index change if not provided
    const navDirection = direction ?? (newProjectIndex > currentProjectIndex ? 'right' : 'left');
    setNavigationDirection(navDirection);

    setCurrentProjectIndex(newProjectIndex);
    setCurrentSectionIndex(rememberedSection);
  }, [currentProjectIndex, currentSectionIndex]);

  const setProject = useCallback((index: number) => {
    if (index >= 0 && index < totalProjects && index !== currentProjectIndex) {
      switchToProject(index);
    }
  }, [totalProjects, currentProjectIndex, switchToProject]);

  const setSection = useCallback((index: number) => {
    if (index >= 0 && index < totalSections) {
      setCurrentSectionIndex(index);
    }
  }, [totalSections]);

  const nextSection = useCallback(() => {
    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    } else if (currentProjectIndex < totalProjects - 1) {
      // Save current section before switching
      sectionMemory.current[currentProjectIndex] = currentSectionIndex;
      setCurrentProjectIndex(prev => prev + 1);
      setCurrentSectionIndex(0);
    } else {
      // Loop back to first section of first project
      sectionMemory.current[currentProjectIndex] = currentSectionIndex;
      setCurrentProjectIndex(0);
      setCurrentSectionIndex(0);
    }
  }, [currentSectionIndex, totalSections, currentProjectIndex, totalProjects]);

  const prevSection = useCallback(() => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    } else if (currentProjectIndex > 0) {
      // Save current section before switching
      sectionMemory.current[currentProjectIndex] = currentSectionIndex;
      const prevProjectSections = data.projects[currentProjectIndex - 1].sections.length;
      setCurrentProjectIndex(prev => prev - 1);
      setCurrentSectionIndex(prevProjectSections - 1);
    } else {
      // Loop back to last section of last project
      sectionMemory.current[currentProjectIndex] = currentSectionIndex;
      const lastProjectIndex = totalProjects - 1;
      const lastProjectSections = data.projects[lastProjectIndex].sections.length;
      setCurrentProjectIndex(lastProjectIndex);
      setCurrentSectionIndex(lastProjectSections - 1);
    }
  }, [currentSectionIndex, currentProjectIndex, data.projects, totalProjects]);

  const nextProject = useCallback(() => {
    if (currentProjectIndex < totalProjects - 1) {
      switchToProject(currentProjectIndex + 1);
    }
  }, [currentProjectIndex, totalProjects, switchToProject]);

  const prevProject = useCallback(() => {
    if (currentProjectIndex > 0) {
      switchToProject(currentProjectIndex - 1);
    }
  }, [currentProjectIndex, switchToProject]);

  return {
    currentProjectIndex,
    currentSectionIndex,
    currentProject,
    currentSection,
    setProject,
    setSection,
    nextSection,
    prevSection,
    nextProject,
    prevProject,
    totalProjects,
    totalSections,
    navigationDirection,
  };
}
