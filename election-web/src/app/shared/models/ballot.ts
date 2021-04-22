import { Candidate } from './candidate';

class Districts {
    district_id: number;
    candidates: Candidate[];
}

export class Ballot {
    election_id: string;
    district: Districts[];
}
