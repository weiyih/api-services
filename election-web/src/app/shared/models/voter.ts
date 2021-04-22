import { VoteStatus } from './vote-status';
import { Verified } from './voter-verified';


export class Voter {
    voter_id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    date_birth: string;
    street_number: string;
    street_name: string;
    street_suffix: string;
    town: string;
    zip_code: string;
    vote_status: VoteStatus[];
    vote_online: number;
    verified: Verified;
}