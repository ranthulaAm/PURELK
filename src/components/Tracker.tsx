import React, { useEffect } from 'react';
import { useSite } from '../context/SiteContext';

interface TrackerProps {
  currentPath: string;
}

export const Tracker: React.FC<TrackerProps> = ({ currentPath }) => {
  const { trackView } = useSite();

  useEffect(() => {
    trackView(currentPath);
  }, [currentPath]);

  return null;
};
