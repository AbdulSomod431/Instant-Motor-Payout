
export interface PartEstimation {
  partName: string;
  damageType: 'Scratch' | 'Dent' | 'Crack' | 'Shattered' | 'Puncture' | 'Structural';
  severity: number; // 1 to 10
  action: 'Repair' | 'Replace';
  estimatedCost: number;
  laborHours: number;
}

export interface DamageReport {
  vehicleType: string;
  totalEstimatedCost: number;
  currency: string;
  parts: PartEstimation[];
  summary: string;
  confidenceScore: number;
  payoutEligibility: 'Eligible' | 'Needs Manual Review' | 'Denied';
}

export interface ClaimState {
  image: string | null;
  status: 'idle' | 'analyzing' | 'completed' | 'error';
  report: DamageReport | null;
  error?: string;
}
