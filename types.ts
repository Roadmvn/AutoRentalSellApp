export interface Ad {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  is_visible: boolean;
  created_at: string;
  // Ajoutez d'autres propriétés selon vos besoins
}