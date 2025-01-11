export interface Petition {
    id: string;
    title: string;
    content: string;
    status: 'open' | 'closed';
    response: string | null;
    creator_id: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface CreatePetitionRequest {
    title: string;
    content: string;
  }
  
  export interface CreatePetitionResponse {
    message: string;
    petition: Petition;
  }