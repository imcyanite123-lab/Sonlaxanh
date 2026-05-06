export interface CollectionPoint {
  id: string;
  name: string;
  address: string;
  type: string;
  lat: number;
  lng: number;
  description?: string;
}

export interface TrashReport {
  id: string;
  title: string;
  type: string;
  description: string;
  imageUrl?: string;
  lat: number;
  lng: number;
  reporterId: string;
  status: 'pending' | 'verified' | 'cleaned';
  createdAt: number;
}

export interface Activity {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  location: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}
