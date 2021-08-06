export interface StructureRecommendations {
  type: 'block' | 'row-card' | 'row-image';
  show: boolean;
  label?: string;
}

export interface StructureProducts {
  type: 'list' | 'block';
  label: string;
}
