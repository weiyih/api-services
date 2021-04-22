// Note: Casing matches mongoDB case in ElectionDB
export class Election {
    election_id: string;
    election_name: string;
    election_start_date: string;
    election_end_date: string;
    advanced_polling: boolean;
    advanced_start_date: string;
    advanced_end_date: string;
    channel_name: string;
    contract_name: string;
    created_at: string;
    updated_at: string;
    locked: boolean; // 0 - unlocked(editable), 1 - locked(not running/in progress/completed)
    progress: number; // 0 - not running, 1 - in progress, 2 - completed
    disabled: boolean; // 0 - deleted election, 1 - valid election
}


